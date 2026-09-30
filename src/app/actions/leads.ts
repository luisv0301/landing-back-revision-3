"use server";

import nodemailer from "nodemailer";
import { sunriseClient } from "@/lib/api/sunriseClient";
import { FunnelStage, SunriseLeadRequest } from "@/lib/types/sunrise";

export interface FormState {
    success: boolean;
    message: string | null;
    errors?: Record<string, string[]>;
}

/**
 * Registra o actualiza un prospecto en Sunrise CRM en una etapa específica del embudo.
 */
export async function registrarLeadAction(leadData: SunriseLeadRequest) {
    try {
        const res = await sunriseClient.createLead(leadData);
        console.log("respuesta de registro de lead", res);
        return { success: true, data: res };
    } catch (error: any) {
        // Los leads no deben romper el flujo del usuario si fallan
        console.warn("[registrarLeadAction] Error registrando lead en Sunrise CRM:", error.message);
        return { success: false, error: error.message };
    }
}

