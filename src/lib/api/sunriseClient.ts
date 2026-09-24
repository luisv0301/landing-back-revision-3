import {
  SunriseBrandsResponse,
  SunriseByFeaturesResponse,
  SunriseCitiesResponse,
  SunriseCreateQuoteRequest,
  SunriseCreateQuoteResponse,
  SunriseInvoiceUploadResponse,
  SunriseLeadRequest,
  SunriseLeadResponse,
  SunriseQuotePollResponse,
  SunriseReferencesResponse,
  SunriseSelectQuoteRequest,
  SunriseSelectQuoteResponse,
  SunriseVehicleLookupResponse,
} from "@/lib/types/sunrise";

const BASE_URL =
  process.env.LANDING_QUOTE_API_URL ||
  "https://migration-api.segurosintercol.com/api/landing";

function getAuthHeaders(): HeadersInit {
  const token = process.env.LANDING_QUOTE_API_TOKEN || "";
  if (!token) {
    console.warn(
      "[SunriseClient] Advertencia: LANDING_QUOTE_API_TOKEN no está definido en variables de entorno.",
    );
  }

  return {
    Authorization: `Bearer ${token}`,
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

  // Consulta listado de marcas para vehículos 0 km
  async getVehicleBrands(): Promise<SunriseBrandsResponse> {
    return requestJson<SunriseBrandsResponse>("vehicles/brands/", {
      method: "GET",
    });
  },

  // Consulta referencias para una marca y modelo (año)
  async getVehicleReferences(
    brand: string,
    model: string | number,
  ): Promise<SunriseReferencesResponse> {
    const endpoint = `vehicles/references/?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`;
    return requestJson<SunriseReferencesResponse>(endpoint, {
      method: "GET",
    });
  },

  // Consulta versiones / características de un vehículo 0 km para obtener código Fasecolda
  async getVehicleByFeatures(params: {
    brand: string;
    model: string | number;
    reference: string;
    is_0km?: boolean;
  }): Promise<SunriseByFeaturesResponse> {
    const is0kmParam = params.is_0km !== false ? "true" : "false";
    const endpoint = `vehicles/by-features/?brand=${encodeURIComponent(params.brand)}&model=${encodeURIComponent(params.model)}&reference=${encodeURIComponent(params.reference)}&is_0km=${is0kmParam}`;
    return requestJson<SunriseByFeaturesResponse>(endpoint, {
      method: "GET",
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
