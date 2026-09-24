'use server';

import { z } from 'zod';
import { sunriseClient } from '@/lib/api/sunriseClient';
import { VehicleType } from '@/lib/types/sunrise';

// Validación con Zod
const Paso1Schema = z.object({
    placa: z.string().trim().toUpperCase().optional().default(''),
    tipoVehiculo: z.enum(['carro', 'moto', 'pesado']),
    useType: z.string().optional().default('particular'),
    esCeroKm: z.enum(['true', 'false']),
});

export type ActionState = {
    success?: boolean;
    error?: string;
    requiresInvoice?: boolean;
    data?: any;
};

export interface MunicipioDIVIPOLA {
    city_code: string;
    city_name: string;
    state_name: string;
}

/**
 * Consulta información de vehículo mediante la nueva API de Sunrise CRM.
 */
export async function consultarVehiculoAction(
    prevState: ActionState | null,
    formData: FormData
): Promise<ActionState> {
    const rawPlaca = (formData.get('placa')?.toString() || '').trim().toUpperCase();
    const tipoVehiculo = formData.get('tipoVehiculo')?.toString() || 'carro';
    const useType = formData.get('useType')?.toString() || 'particular';
    const esCeroKm = formData.get('esCeroKm')?.toString() || 'false';

    const validatedFields = Paso1Schema.safeParse({
        placa: rawPlaca,
        tipoVehiculo,
        useType,
        esCeroKm,
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.issues[0]?.message || 'Datos del vehículo inválidos',
        };
    }

    const is0Km = esCeroKm === 'true';

    // Si es 0km no requiere consulta de placa obligatoria
    if (is0Km) {
        return {
            success: true,
            data: {
                placa: '',
                tipoVehiculo: tipoVehiculo as VehicleType,
                useType,
                esCeroKm: true,
                fasecoldaCode: formData.get('fasecoldaCode')?.toString() || '',
                modelo: formData.get('modelo')?.toString() || new Date().getFullYear().toString(),
                brand: formData.get('brand')?.toString() || '',
                line: formData.get('line')?.toString() || '',
                commercialPrice: Number(formData.get('commercialPrice') || 0),
                referencePrice: Number(formData.get('commercialPrice') || 0),
            },
        };
    }

    if (!rawPlaca || rawPlaca.length < 5 || rawPlaca.length > 6) {
        return { error: 'Ingresa una placa válida (5 a 6 caracteres).' };
    }

    try {
        const lookup = await sunriseClient.lookupVehicle(rawPlaca);

        console.log("resultados de buscar vehiculo", lookup)

        if (lookup.code === 'public_vehicle') {
            return {
                error: 'No se cotizan vehículos de servicio público.',
            };
        }



        if (lookup.found) {
            return {
                success: true,
                data: {
                    placa: lookup.plate || rawPlaca,
                    tipoVehiculo: tipoVehiculo as VehicleType,
                    useType,
                    esCeroKm: false,
                    fasecoldaCode: lookup.fasecolda_code || '',
                    brand: lookup.brand || '',
                    line: lookup.line || '',
                    modelo: lookup.model || '',
                    commercialPrice: lookup.commercial_value || 0,
                    referencePrice: lookup.commercial_value || 0,
                    requiresInvoice: lookup.requires_invoice,
                    rawLookup: lookup,
                },
            };
        }

        // Si found=false -> requires_invoice=true
        return {
            success: false,
            requiresInvoice: true,
            error: lookup.message || 'Vehículo no encontrado en Fasecolda. Puedes adjuntar la factura para cotizar.',
        };
    } catch (error: any) {
        console.error('Error en consultarVehiculoAction:', error);

        if (error.code === 'public_vehicle') {
            return { error: 'No se cotizan vehículos de servicio público.' };
        }

        return {
            error: error.message || 'No fue posible consultar el vehículo. Intenta nuevamente.',
            requiresInvoice: error.data?.requires_invoice || false,
        };
    }
}

/**
 * Busca municipios DIVIPOLA en Sunrise CRM.
 */
export async function buscarCiudadesAction(query: string) {
    if (!query) return { success: true, ciudades: [] };

    const textoLimpio = query
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split(/[,(]/)[0]
        .trim();

    if (textoLimpio.length < 2) return { success: true, ciudades: [] };

    try {
        const data = await sunriseClient.searchCities(textoLimpio, 30);
        const ciudades: MunicipioDIVIPOLA[] = (data.results || []).map((c) => ({
            city_code: c.city_code,
            city_name: c.city,
            state_name: c.department,
        }));

        return { success: true, ciudades };
    } catch (error: any) {
        console.error('Error en buscarCiudadesAction:', error);
        return { error: error.message || 'No se pudieron cargar las ciudades' };
    }
}

// Server Actions para Catálogo 0 km (Sunrise CRM)
export async function obtenerMarcasAction() {
    try {
        const res = await sunriseClient.getVehicleBrands();
        return {
            success: true,
            marcas: res.results || [],
        };
    } catch (error: any) {
        console.error('Error en obtenerMarcasAction:', error);
        return {
            success: false,
            error: error.message || 'No se pudieron cargar las marcas del catálogo.',
            marcas: [],
        };
    }
}

export async function obtenerReferenciasAction(marca: string, modelo: number | string) {
    if (!marca || !modelo) {
        return { success: true, referencias: [] };
    }

    try {
        const res = await sunriseClient.getVehicleReferences(marca, modelo);
        return {
            success: true,
            referencias: res.results || [],
        };
    } catch (error: any) {
        console.error('Error en obtenerReferenciasAction:', error);
        return {
            success: false,
            error: error.message || 'No se pudieron cargar las referencias para la marca seleccionada.',
            referencias: [],
        };
    }
}

export async function obtenerVersionesAction(
    marca: string,
    modelo: number | string,
    ref: string
) {
    if (!marca || !modelo || !ref) {
        return { success: true, versiones: [] };
    }

    try {
        const res = await sunriseClient.getVehicleByFeatures({
            brand: marca,
            model: modelo,
            reference: ref,
            is_0km: true,
        });
        return {
            success: true,
            versiones: res.results || [],
        };
    } catch (error: any) {
        console.error('Error en obtenerVersionesAction:', error);
        return {
            success: false,
            error: error.message || 'No se pudieron cargar las versiones del vehículo.',
            versiones: [],
        };
    }
}