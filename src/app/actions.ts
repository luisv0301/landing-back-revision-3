'use server'

import { z } from 'zod';

// Validación estricta con Zod
const Paso1Schema = z.object({
    placa: z.string().min(5, "Placa inválida").max(6).toUpperCase(),
    tipoVehiculo: z.enum(['carro', 'moto', 'pesado']),
    useType: z.string(),
    esCeroKm: z.enum(['true', 'false']),
});

export type ActionState = {
    success?: boolean;
    error?: string;
    data?: any;
};


// Función auxiliar interna para autenticar y obtener el Bearer Token
async function obtenerTokenAgenteMotor(): Promise<string> {
    const authPayload = {
        username: process.env.AGENTE_MOTOR_USERNAME,
        password: process.env.AGENTE_MOTOR_PASSWORD,
        tenant: process.env.AGENTE_MOTOR_TENANT, // ej: "agencia.co.agentemotor.com"[cite: 1]
    };

    const res = await fetch('https://apipro.agentemotor.com/app/co/customers/authentication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authPayload),
        // next: { revalidate: 3600 } // Opcional: reusar token si es válido por 1 hora
    });

    if (!res.ok) {
        throw new Error('Error al autenticar con Agente Motor');
    }

    const data = await res.json();
    return data['access token']; // Retorna el Bearer token[cite: 1]
}


/*
export async function consultarVehiculoAction(
    prevState: ActionState | null,
    formData: FormData
): Promise<ActionState> {
    const validatedFields = Paso1Schema.safeParse({
        placa: formData.get('placa'),
        tipoVehiculo: formData.get('tipoVehiculo'),
        esCeroKm: formData.get('esCeroKm'),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.errors[0].message };
    }

    const { placa, tipoVehiculo, esCeroKm } = validatedFields.data;

    try {
        // 1. Aquí iría la llamada de autenticación (POST /app/co/customers/authentication)[cite: 1]
        // 2. Consulta Fasecolda por placa (POST /seguros/co/vehiculos/datos_add)[cite: 1]

        const payload = {
            placa: placa,
            consultas: ["fasecolda"] // Se pide explícitamente para evitar cobros extra por identif_vehiculo[cite: 1]
        };

        // MOCK para continuar el desarrollo
        await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulamos latencia de red

        return {
            success: true,
            data: {
                placa,
                tipoVehiculo,
                esCeroKm: esCeroKm === 'true',
                fasecolda: { brand: "KIA", model: "2020", line: "PICANTO" }
            }
        };
    } catch (error) {
        return { error: "No pudimos encontrar los datos del vehículo. Intenta de nuevo." };
    }
}

*/

export async function consultarVehiculoAction(
    prevState: ActionState | null,
    formData: FormData
): Promise<ActionState> {
    const validatedFields = Paso1Schema.safeParse({
        placa: formData.get('placa'),
        tipoVehiculo: formData.get('tipoVehiculo'),
        useType: formData.get('useType') || 'particular',
        esCeroKm: formData.get('esCeroKm'),
    });

    if (!validatedFields.success) {
        return { error: validatedFields.error.errors[0].message };
    }

    const { placa, tipoVehiculo, useType, esCeroKm } = validatedFields.data;

    try {
        // 1. Obtener Token de autenticación
        //const token = await obtenerTokenAgenteMotor();
        /* 
        const headers = {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         };
     
         
     
         // 2. Primer llamado: Consultar datos básicos por Placa para obtener Código Fasecolda y Modelo[cite: 1]
         const resPlaca = await fetch('https://apipro.agentemotor.com/seguros/co/vehiculos/datos_add', {
           method: 'POST',
           headers,
           body: JSON.stringify({
             placa: placa,
             consultas: ["fasecolda"] // Solo fasecolda para no generar cobros extra[cite: 1]
           }),
         });
     
         */

        const resPlaca = await fetch('https://apipro.agentemotor.com/seguros/co/vehiculos/datos_add', {
            method: 'POST',
            body: JSON.stringify({
                placa: placa,
                consultas: ["fasecolda"] // Solo fasecolda para no generar cobros extra[cite: 1]
            }),
        });

        if (!resPlaca.ok) {
            return { error: 'No se encontraron datos para la placa ingresada.' };
        }

        const dataPlaca = await resPlaca.json();
        const vehicleData = dataPlaca?.data?.vehicle;

        const codigoFasecolda = vehicleData?.codification?.code || vehicleData?.vehicle_codification?.code;
        const modeloVehiculo = vehicleData?.model;

        if (!codigoFasecolda || !modeloVehiculo) {
            return { error: 'No fue posible homologar el código Fasecolda para este vehículo.' };
        }

        // 3. Segundo llamado: Consultar la Ficha Técnica de Fasecolda detallada[cite: 1]
        const urlFasecolda = `https://apipro.agentemotor.com/seguros/co/vehicles/consultar/fasecolda-modelo?fasecolda=${codigoFasecolda}&modelo=${modeloVehiculo}&ceroKm=${esCeroKm}`;

        const resFasecolda = await fetch(urlFasecolda);

        if (!resFasecolda.ok) {
            return { error: 'Error al consultar la información detallada de Fasecolda.' };
        }

        const dataFasecolda = await resFasecolda.json();
        const detalleVehiculo = dataFasecolda?.data?.vehicle;

        // 4. Retornar los datos consolidados al cliente
        return {
            success: true,
            data: {
                placa,
                tipoVehiculo,
                esCeroKm: esCeroKm === 'true',
                fasecoldaCode: codigoFasecolda,
                modelo: modeloVehiculo,
                useType,
                // Datos extraídos de la respuesta de Fasecolda:
                brand: detalleVehiculo?.brand,
                line: detalleVehiculo?.line,
                referencePrice: detalleVehiculo?.vehicle_risk?.reference_price,
                imagen: detalleVehiculo?.imagen?.codigo_foto?.[0]?.nombre,
                rawFasecolda: detalleVehiculo // Guardamos todo el objeto por si se necesita en los siguientes pasos
            }
        };

    } catch (error: any) {
        console.error("Error en Server Action consultarVehiculoAction:", error);
        return { error: "Ocurrió un error de conexión al consultar el vehículo." };
    }
}


// Obtener lista de marcas disponibles
export async function obtenerMarcasAction() {
    try {
        // const token = await obtenerTokenAgenteMotor();
        /*
         const res = await fetch('https://apipro.agentemotor.com/seguros/co/vehicles/consultar/lista-marcas', {
             headers: { Authorization: `Bearer ${token}` }
         });
         */

        const res = await fetch('https://apipro.agentemotor.com/seguros/co/vehicles/consultar/lista-marcas');
        const marcas: string[] = await res.json();
        return { success: true, marcas };
    } catch (error) {
        return { error: 'Error cargando marcas' };
    }
}

// Obtener referencias por marca y modelo
export async function obtenerReferenciasAction(marca: string, modelo: number) {
    try {
        //const token = await obtenerTokenAgenteMotor();

        /*
 const url = `https://apipro.agentemotor.com/seguros/co/vehicles/consultar/lista-ref-abr?marca=${encodeURIComponent(marca)}&modelo=${modelo}`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        */
        const url = `https://apipro.agentemotor.com/seguros/co/vehicles/consultar/lista-ref-abr?marca=${encodeURIComponent(marca)}&modelo=${modelo}`;
        const res = await fetch(url);
        const referencias: string[] = await res.json();
        console.log("referencias", referencias);
        return { success: true, referencias };
    } catch (error) {
        return { error: 'Error cargando referencias' };
    }
}

// Obtener versiones exactas con código Fasecolda
export async function obtenerVersionesAction(marca: string, modelo: number, ref: string) {
    try {
        //const token = await obtenerTokenAgenteMotor();
        /*
 const url = `https://apipro.agentemotor.com/seguros/co/vehicles/consultar/vehiculos-por-caracteristica?marca=${encodeURIComponent(marca)}&modelo=${modelo}&ref=${encodeURIComponent(ref)}&ceroKm=true`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });    
        */
        const url = `https://apipro.agentemotor.com/seguros/co/vehicles/consultar/vehiculos-por-caracteristica?marca=${encodeURIComponent(marca)}&modelo=${modelo}&ref=${encodeURIComponent(ref)}&ceroKm=true`;
        const res = await fetch(url);
        const data = await res.json();

        console.log("la data de obtener versiones", JSON.stringify(data, null, 2));

        // Mapeamos las versiones devueltas
        const versiones = data.map((item: any) => ({
            code: item.data?.vehicle?.codification?.code,
            lineaCompleta: item.data?.vehicle?.line,
            precioReferencia: item.data?.vehicle?.vehicle_risk?.reference_price,
        }));

        return { success: true, versiones };
    } catch (error) {
        return { error: 'Error cargando versiones' };
    }
}


export interface MunicipioDIVIPOLA {
    city_code: string;
    city_name: string;
    state_name: string;
}

export async function buscarCiudadesAction(query: string) {
    if (!query || query.length < 3) return { success: true, ciudades: [] };

    try {

        /*
        const token = await obtenerTokenAgenteMotor();
        const url = `https://apipro.agentemotor.com/seguros/geozone/co/?city_name_like=${encodeURIComponent(query)}`;

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        });
*/
        const url = `https://apipro.agentemotor.com/seguros/geozone/co/?city_name_like=${encodeURIComponent(query)}`;

        const res = await fetch(url);

        if (!res.ok) throw new Error('Error consultando ciudades');

        const data = await res.json();
        const ciudades: MunicipioDIVIPOLA[] = (data.response || []).map((c: any) => ({
            city_code: c.city_code,
            city_name: c.city_name,
            state_name: c.state_name,
        }));

        return { success: true, ciudades };
    } catch (error) {
        console.error("Error en buscarCiudadesAction:", error);
        return { error: 'No se pudieron cargar las ciudades' };
    }
}