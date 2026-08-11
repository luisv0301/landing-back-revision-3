'use server'

import crypto from 'crypto';

export interface CotizadorState {
    vehiculo: {
        placa?: string;
        tipoVehiculo: 'carro' | 'moto' | 'pesado';
        useType: string;
        esCeroKm: boolean;
        fasecoldaCode: string;
        modelo: string | number;
        brand?: string;
        line?: string;
        commercialPrice?: number;
    };
    personales: {
        nombreCompleto: string;
        firstname: string;
        lastname: string;
        tipoDocumento: string;
        numeroDocumento: string;
        telefono: string;
        email: string;
        genero: 'M' | 'F';
        fechaNacimiento: string;
        cityCode: string;
        cityName: string;
    };
}

export type ActionCotizacionResponse = {
    success: boolean;
    error?: string;
    channelName?: string;
    token?: string;
};

// 1. Helper interno para autenticarse en Agente Motor
async function obtenerTokenAgenteMotor(): Promise<string> {
    const authPayload = {
        username: process.env.AGENTE_MOTOR_USERNAME,
        password: process.env.AGENTE_MOTOR_PASSWORD,
        tenant: process.env.AGENTE_MOTOR_TENANT,
    };

    console.log("authPayload", authPayload)

    const res = await fetch('https://apipro.agentemotor.com/app/co/customers/authentication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authPayload),
        cache: 'no-store',
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error('Error de autenticación Agente Motor:', errText);
        throw new Error('No se pudo autenticar con la plataforma de seguros.');
    }

    const data = await res.json();
    console.log("data de auth", data)
    return data.access_token || data['access token'];
}

// 2. Server Action invocada desde la UI
export async function iniciarCotizacionAction(
    datos: CotizadorState
): Promise<ActionCotizacionResponse> {
    try {
        const tenant = process.env.AGENTE_MOTOR_TENANT;
        if (!tenant) {
            return { success: false, error: 'Falta la configuración de Tenant de Agente Motor.' };
        }

        // A. Obtener Token de Acceso
        const token = await obtenerTokenAgenteMotor();

        // B. Generar nombre de canal único para WebSocket/Pusher
        const sessionUuid = crypto.randomUUID().replaceAll('-', '');
        const channelName = `landing_${sessionUuid}@${tenant}`;

        const { vehiculo, personales } = datos;

        // C. Armar el payload que exige POST /app/co/customers/quotation
        const payloadQuotation = {
            name: 'event-create-quote',
            tenant_data: {
                name: tenant,
            },
            channel_name: channelName,
            data: {
                business_line: 'vehiculos',
                insurable_objects: [
                    {
                        type: 'vehicle',
                        vehicle: {
                            plate: vehiculo.esCeroKm ? '' : (vehiculo.placa || ''),
                            model: Number(vehiculo.modelo),
                            codification: {
                                code: vehiculo.fasecoldaCode,
                            },
                            vehicle_risk: {
                                use_type: vehiculo.useType || 'particular',
                                plate_type: 'particular',
                                protection_type: 'alarma',
                                in_agency: vehiculo.esCeroKm,
                                commercial_price: vehiculo.commercialPrice || undefined,
                            },
                        },
                    },
                ],
                parties: [
                    {
                        party_rol: 'Asegurado',
                        party_type: 'person',
                        person: {
                            identification_type: personales.tipoDocumento || 'CC',
                            identification_number: personales.numeroDocumento,
                            firstname: personales.firstname,
                            lastname: personales.lastname,
                            gender: personales.genero,
                            birht_date: personales.fechaNacimiento, // Formato AAAA-MM-DD
                            educational_level: 'professional', // Asignación por defecto
                            contact_data: [
                                {
                                    contact_tag: 'principal',
                                    contact_info: {
                                        email: personales.email,
                                        phone: personales.telefono,
                                        ubication: {
                                            place: {
                                                city_code: personales.cityCode,
                                                country_code: '170', // Colombia
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    },
                ],
                ubication: {
                    place: {
                        city_code: personales.cityCode,
                        country_code: '170',
                    },
                },
            },
        };

        // D. Enviar la solicitud de cotización
        const resQuote = await fetch('https://apipro.agentemotor.com/app/co/customers/quotation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payloadQuotation),
            cache: 'no-store',
        });

        console.log("resQuote", resQuote)

        if (!resQuote.ok) {
            const errQuote = await resQuote.text();
            console.error('Error al solicitar la cotización:', errQuote);
            return {
                success: false,
                error: 'Las aseguradoras no pudieron procesar la solicitud en este momento.',
            };
        }

        const quoteData = await resQuote.json();

        // IMPRIME ESTO EN LA CONSOLA DEL SERVIDOR
        console.log("=== RESPUESTA JSON DE COTIZACION ===");
        console.log(JSON.stringify(quoteData, null, 2));

        // E. Retornar el canal y el token al cliente para escuchar los eventos en vivo
        return {
            success: true,
            channelName,
            token,
        };
    } catch (error: any) {
        console.error('Error en iniciarCotizacionAction:', error);
        return {
            success: false,
            error: error.message || 'Ocurrió un error inesperado al iniciar la cotización.',
        };
    }
}