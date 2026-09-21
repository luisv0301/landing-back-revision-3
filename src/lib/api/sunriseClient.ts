import {
  SunriseCitiesResponse,
  SunriseCreateQuoteRequest,
  SunriseCreateQuoteResponse,
  SunriseInvoiceUploadResponse,
  SunriseLeadRequest,
  SunriseLeadResponse,
  SunriseQuotePollResponse,
  SunriseSelectQuoteRequest,
  SunriseSelectQuoteResponse,
  SunriseVehicleLookupResponse,
} from "@/lib/types/sunrise";

const BASE_URL =
  process.env.LANDING_QUOTE_API_URL ||
  "https://migration-api.segurosintercol.com/api/landing";

function getAuthHeaders(): HeadersInit {
  const token = process.env.LANDING_QUOTE_API_TOKEN;
  if (!token) {
    console.warn(
      "[SunriseClient] Advertencia: LANDING_QUOTE_API_TOKEN no está definido en variables de entorno.",
    );
  }

  return {
    //"X-Landing-Token": token || "",
    Authorization: `Bearer ${token || ""}`,
  };
}

async function requestJson<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL.replace(/\/+$/, "")}/${endpoint.replace(/^\/+/, "")}`;
  const authHeaders = getAuthHeaders();

  const headers = new Headers(options.headers || {});
  Object.entries(authHeaders).forEach(([k, v]) => {
    if (v) headers.set(k, v);
  });

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: "no-store",
  });

  const rawText = await response.text();
  let data: any;

  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    throw new Error(
      `Respuesta inválida del servidor Sunrise (${response.status}): ${rawText.slice(0, 100)}`,
    );
  }

  if (!response.ok) {
    const errorMessage =
      data?.message ||
      data?.error ||
      `Error en Sunrise API (${response.status})`;
    const error: any = new Error(errorMessage);
    error.status = response.status;
    error.code = data?.code;
    error.data = data;
    throw error;
  }

  return data as T;
}

export const sunriseClient = {

  // Consulta datos de un vehículo por placa en Sunrise CRM / Fasecolda.

  async lookupVehicle(plate: string): Promise<SunriseVehicleLookupResponse> {
    const cleanPlate = plate.trim().toUpperCase();
    return requestJson<SunriseVehicleLookupResponse>("vehicles/lookup/", {
      method: "POST",
      body: JSON.stringify({ plate: cleanPlate }),
    });
  },

  //Busca municipios DIVIPOLA por nombre de ciudad.

  async searchCities(
    query: string,
    limit: number = 30,
  ): Promise<SunriseCitiesResponse> {
    const cleanQuery = query.trim();
    const endpoint = `cities/?q=${encodeURIComponent(cleanQuery)}&limit=${limit}`;
    return requestJson<SunriseCitiesResponse>(endpoint, {
      method: "GET",
    });
  },

  // Registra o actualiza un prospecto en el embudo (funnel stage).

  async createLead(data: SunriseLeadRequest): Promise<SunriseLeadResponse> {
    return requestJson<SunriseLeadResponse>("leads/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Crea cliente + vehículo + ticket de cotización.

  async createQuote(
    data: SunriseCreateQuoteRequest | FormData,
  ): Promise<SunriseCreateQuoteResponse> {
    const isFormData = typeof FormData !== "undefined" && data instanceof FormData;

    return requestJson<SunriseCreateQuoteResponse>("quotes/", {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
    });
  },

  // Polling del estado de cotizaciones asociadas a un ticket.

  async pollQuote(ticketId: number | string): Promise<SunriseQuotePollResponse> {
    return requestJson<SunriseQuotePollResponse>(`quotes/${ticketId}/`, {
      method: "GET",
    });
  },

  // Notifica la selección o declinación de una póliza.

  async selectQuote(
    ticketId: number | string,
    data: SunriseSelectQuoteRequest,
  ): Promise<SunriseSelectQuoteResponse> {
    return requestJson<SunriseSelectQuoteResponse>(
      `quotes/${ticketId}/select/`,
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
  },

  // Adjunta una factura (imagen o PDF) a un ticket existente.

  async uploadInvoice(
    ticketId: number | string,
    formData: FormData,
  ): Promise<SunriseInvoiceUploadResponse> {
    return requestJson<SunriseInvoiceUploadResponse>(
      `quotes/${ticketId}/invoice/`,
      {
        method: "POST",
        body: formData,
      },
    );
  },
};
