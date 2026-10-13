"use server";

import { sunriseClient } from "@/lib/api/sunriseClient";
import {
  DocumentType,
  GenderType,
  PolicyExpiresCode,
  SunriseCreateQuoteRequest,
  SunriseSelectQuoteRequest,
  VehicleType,
} from "@/lib/types/sunrise";

export interface IniciarCotizacionParams {
  vehiculo: {
    tipoVehiculo?: VehicleType;
    placa?: string;
    esCeroKm?: boolean;
    fasecoldaCode?: string;
    brand?: string;
    line?: string;
    modelo?: string | number;
    commercialPrice?: number | string;
    referencePrice?: number | string;
    useType?: string;
  };
  personales: {
    nombre?: string;
    apellido?: string;
    nombreCompleto?: string;
    firstname?: string;
    lastname?: string;
    tipoDocumento?: DocumentType;
    numeroDocumento?: string;
    telefono?: string;
    backupPhone?: string;
    email?: string;
    genero?: "M" | "F" | "masculino" | "femenino";
    fechaNacimiento?: string;
    cityCode?: string;
    cityName?: string;
    policyExpires?: PolicyExpiresCode;
    hasCurrentPolicy?: boolean;
    bankEndorsement?: boolean;
    vencimientoPoliza?: string;
    endosoBanco?: string | boolean;
    esMismoAsegurado?: boolean;
    aseguradoNombre?: string;
    aseguradoEmail?: string;
  };
}

export async function iniciarCotizacionAction(datos: IniciarCotizacionParams) {
  try {
    const { vehiculo, personales } = datos;

    if (!personales || !vehiculo) {
      return {
        success: false,
        error: "Datos de vehículo o conductor incompletos.",
      };
    }

    // Normalizar nombres
    let firstName = (personales.firstname || personales.nombre || "").trim();
    let lastName = (personales.lastname || personales.apellido || "").trim();

    if (!firstName && personales.nombreCompleto) {
      const parts = personales.nombreCompleto.trim().split(" ");
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ") || parts[0] || "";
    }

    // Normalizar género
    const genderMapped: GenderType =
      personales.genero === "F" || personales.genero === "femenino"
        ? "femenino"
        : "masculino";

    // Normalizar teléfono
    const cleanPhone = (personales.telefono || "").replace(/\D/g, "");

    // Normalizar vigencia y endoso
    const policyExpires = (personales.policyExpires ||
      (personales.vencimientoPoliza as PolicyExpiresCode) ||
      "now") as PolicyExpiresCode;

    const hasCurrentPolicy =
      personales.hasCurrentPolicy !== undefined
        ? personales.hasCurrentPolicy
        : policyExpires !== "none";

    const bankEndorsement =
      personales.bankEndorsement !== undefined
        ? Boolean(personales.bankEndorsement)
        : typeof personales.endosoBanco === "boolean"
          ? personales.endosoBanco
          : personales.endosoBanco === "true" ||
          personales.endosoBanco === "Sí, tiene endoso a favor de un banco";

    const payload: SunriseCreateQuoteRequest = {
      vehicle_type: vehiculo.tipoVehiculo || "carro",
      consent: true,
      plate: vehiculo.esCeroKm ? "" : (vehiculo.placa || "").trim().toUpperCase(),
      is_0km: Boolean(vehiculo.esCeroKm),
      fasecolda_code: vehiculo.fasecoldaCode || undefined,
      brand: vehiculo.brand || undefined,
      line: vehiculo.line || undefined,
      model: vehiculo.modelo ? Number(vehiculo.modelo) : undefined,
      commercial_value: Number(
        vehiculo.commercialPrice || vehiculo.referencePrice || 0,
      ) || undefined,
      first_name: firstName,
      last_name: lastName,
      document_id: String(personales.numeroDocumento || "").trim(),
      document_type: (personales.tipoDocumento as DocumentType) || "CC",
      phone: cleanPhone,
      backup_phone: personales.backupPhone || cleanPhone,
      email: personales.email?.trim() || undefined,
      birthday: personales.fechaNacimiento || "1990-01-01",
      gender: genderMapped,
      city: personales.cityName || "Bogotá",
      city_code: personales.cityCode || undefined,
      policy_expires: policyExpires,
      has_current_policy: hasCurrentPolicy,
      bank_endorsement: bankEndorsement,
    };

    console.log("---<Payload de cotizacion>---", payload)

    const res = await sunriseClient.createQuote(payload);

    console.log("---<Respuesta al iniciar cotizacion>---", res)

    return {
      success: true,
      ticketId: res.ticket_id,
      clientId: res.client_id,
      vehicleId: res.vehicle_id,
      status: res.status,
      quoted: res.quoted,
      pollAfterSeconds: res.poll_after_seconds || 5,
      message: res.message,
    };
  } catch (error: any) {
    console.error("Error en iniciarCotizacionAction:", error);
    return {
      success: false,
      error:
        error.message ||
        "No se pudo iniciar la cotización con el servicio de seguros.",
    };
  }
}

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".webp"];

function validarArchivoFactura(
  file: unknown
): { valid: true; file: File } | { valid: false; error: string } {
  if (!file || !(file instanceof File) || file.size === 0) {
    return {
      valid: false,
      error: "Por favor adjunta la foto o PDF de la factura del vehículo.",
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: "El archivo adjunto supera el tamaño máximo permitido de 8 MB.",
    };
  }

  const fileName = file.name || "";
  const extension = "." + fileName.split(".").pop()?.toLowerCase();
  const mimeType = file.type?.toLowerCase();

  const isMimeValid = mimeType ? ALLOWED_MIME_TYPES.includes(mimeType) : false;
  const isExtValid = ALLOWED_EXTENSIONS.includes(extension);

  if (!isMimeValid && !isExtValid) {
    return {
      valid: false,
      error: "Formato no permitido. Solo se aceptan archivos PDF, JPG, PNG o WEBP.",
    };
  }

  return { valid: true, file };
}


// Inicia una cotización para un vehículo 0 km adjuntando la factura directamente en Sunrise CRM.

export async function iniciarCotizacion0KmAction(
  prevState: any,
  formData: FormData,
) {
  try {
    const tipoVehiculo = (formData.get("tipoVehiculo")?.toString() || "carro") as VehicleType;
    const nombre = (formData.get("nombre")?.toString() || "").trim();
    const apellido = (formData.get("apellido")?.toString() || "").trim();
    const legacyNombreCompleto = (formData.get("nombreCompleto")?.toString() || "").trim();
    const tipoDocumento = (formData.get("tipoDocumento")?.toString() || "CC") as DocumentType;
    const numeroDocumento = (formData.get("numeroDocumento")?.toString() || "").trim();
    const telefono = (formData.get("telefono")?.toString() || "").replace(/\D/g, "");
    const email = (formData.get("email")?.toString() || "").trim();
    const genero = formData.get("genero")?.toString() || "M";
    const fechaNacimiento = (formData.get("fechaNacimiento")?.toString() || "1990-01-01").trim();
    const cityCode = formData.get("cityCode")?.toString() || "";
    const cityName = formData.get("cityName")?.toString() || "Bogotá";
    const vencimientoPoliza = formData.get("vencimientoPoliza")?.toString() || "Ya mismo";
    const endosoBanco = formData.get("endosoBanco")?.toString() || "No tiene endoso";
    const esMismoAsegurado = formData.get("esMismoAsegurado")?.toString() !== "false";
    const aseguradoNombre = formData.get("aseguradoNombre")?.toString() || "";
    const aseguradoEmail = formData.get("aseguradoEmail")?.toString() || "";

    const invoiceFile = formData.get("invoice");
    const fileValidation = validarArchivoFactura(invoiceFile);

    if (!fileValidation.valid) {
      return {
        success: false,
        error: fileValidation.error,
      };
    }

    let firstName = nombre;
    let lastName = apellido;
    if (!firstName && legacyNombreCompleto) {
      const parts = legacyNombreCompleto.split(" ");
      firstName = parts[0] || "";
      lastName = parts.slice(1).join(" ") || parts[0] || "";
    }

    const nombreCompleto = `${firstName} ${lastName}`.trim();

    if (!firstName || !lastName || !numeroDocumento || !telefono) {
      return {
        success: false,
        error: "Por favor completa todos los datos obligatorios del tomador (nombre, apellido, documento y teléfono).",
      };
    }

    const genderMapped: GenderType =
      genero === "F" || genero === "femenino" ? "femenino" : "masculino";

    const sunriseFormData = new FormData();
    sunriseFormData.append("vehicle_type", tipoVehiculo);
    sunriseFormData.append("consent", "true");
    sunriseFormData.append("is_0km", "true");
    sunriseFormData.append("first_name", firstName);
    sunriseFormData.append("last_name", lastName);
    sunriseFormData.append("document_id", numeroDocumento);
    sunriseFormData.append("document_type", tipoDocumento);
    sunriseFormData.append("phone", telefono);
    sunriseFormData.append("backup_phone", telefono);
    if (email) sunriseFormData.append("email", email);
    sunriseFormData.append("birthday", fechaNacimiento);
    sunriseFormData.append("gender", genderMapped);
    sunriseFormData.append("city", cityName);
    if (cityCode) sunriseFormData.append("city_code", cityCode);
    sunriseFormData.append("invoice", fileValidation.file);

    const res = await sunriseClient.createQuote(sunriseFormData);

    console.log("Cotizacion 0km: ", res)

    return {
      success: true,
      ticketId: res.ticket_id,
      clientId: res.client_id,
      vehicleId: res.vehicle_id,
      status: res.status || "awaiting_advisor",
      quoted: res.quoted || false,
      pollAfterSeconds: res.poll_after_seconds || null,
      message: res.message || "Cotización radicada para atención por asesor.",
      personales: {
        nombre: firstName,
        apellido: lastName,
        nombreCompleto,
        firstname: firstName,
        lastname: lastName,
        tipoDocumento,
        numeroDocumento,
        telefono,
        email,
        genero: genderMapped,
        fechaNacimiento,
        cityCode,
        cityName,
        vencimientoPoliza,
        endosoBanco,
        esMismoAsegurado,
        aseguradoNombre,
        aseguradoEmail,
      },
    };
  } catch (error: any) {
    console.error("Error en iniciarCotizacion0KmAction:", error);
    return {
      success: false,
      error: error.message || "No se pudo procesar la radicación de tu vehículo 0 km.",
    };
  }
}


// Consulta el estado y ofertas de un ticket en Sunrise CRM (Polling).

export async function consultarEstadoCotizacionAction(
  ticketId: number | string,
) {
  try {
    if (!ticketId) {
      return { success: false, error: "ID de ticket no proporcionado." };
    }

    const res = await sunriseClient.pollQuote(ticketId);

    console.log("respuesta despues de hacer el polling", res)

    return {
      success: true,
      ticketId: res.ticket_id,
      status: res.status, // "quoting" | "ready" | "awaiting_advisor" | "failed" | "selected" | "declined"
      ticketState: res.ticket_state,
      quotesReady: Boolean(res.quotes_ready || res.status === "ready"),
      quotes: res.quotes || [],
      comparativePdfUrl: res.comparative_pdf_url || null,
      pollAfterSeconds: res.poll_after_seconds,
      message: res.message,
    };
  } catch (error: any) {
    console.error(`Error consultando ticket ${ticketId}:`, error);
    return {
      success: false,
      error: error.message || "Error al consultar las cotizaciones.",
    };
  }
}


// Notifica la selección o declinación de una póliza.

export async function seleccionarPolizaAction(
  ticketId: number | string,
  selection: SunriseSelectQuoteRequest,
) {
  try {
    if (!ticketId) {
      return { success: false, error: "ID de ticket requerido." };
    }

    const res = await sunriseClient.selectQuote(ticketId, selection);
    console.log("respuesta despues de seleccionar poliza", res)
    return { success: true, data: res };
  } catch (error: any) {
    console.error(`Error al seleccionar póliza para ticket ${ticketId}:`, error);
    return {
      success: false,
      error: error.message || "No se pudo registrar la selección de póliza.",
    };
  }
}


// Adjunta una factura a un ticket existente en Sunrise CRM.

export async function adjuntarFacturaAction(
  ticketId: number | string,
  formData: FormData,
) {
  try {
    if (!ticketId) {
      return { success: false, error: "ID de ticket requerido." };
    }

    const file = formData.get("invoice") || formData.get("file");
    if (file) {
      const fileValidation = validarArchivoFactura(file);
      if (!fileValidation.valid) {
        return {
          success: false,
          error: fileValidation.error,
        };
      }
    }

    const res = await sunriseClient.uploadInvoice(ticketId, formData);
    return { success: true, data: res };
  } catch (error: any) {
    console.error(`Error al adjuntar factura a ticket ${ticketId}:`, error);
    return {
      success: false,
      error: error.message || "No se pudo subir la factura.",
    };
  }
}
