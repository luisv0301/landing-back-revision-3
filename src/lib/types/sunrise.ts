export type VehicleType = "carro" | "moto" | "pesado";

export type DocumentType = "CC" | "CE" | "PA" | "NIT" | "TI";

export type GenderType = "masculino" | "femenino" | "M" | "F";

export type FunnelStage =
  | "started"
  | "vehicle_selected"
  | "vehicle_found"
  | "vehicle_not_found"
  | "data_started"
  | "quoted"
  | "selected"
  | "declined"
  | "abandoned"
  | "invoice_pending";

export type QuoteStatus =
  | "quoting"
  | "ready"
  | "awaiting_advisor"
  | "failed"
  | "selected"
  | "declined";

// --- Endpoints Request / Response Types ---

// GET /api/landing/health/
export interface SunriseHealthResponse {
  ok: boolean;
  service: string;
  realtime: string;
}

// GET /api/landing/catalogs/
export interface SunriseCatalogsResponse {
  vehicle_types?: string[];
  document_types?: string[];
  genders?: string[];
  funnel_stages?: string[];
  quote_statuses?: string[];
}

// GET /api/landing/cities/?q={query}&limit={limit}
export interface SunriseCityItem {
  city_code: string;
  city: string;
  department: string;
}

export interface SunriseCitiesResponse {
  count: number;
  results: SunriseCityItem[];
}

// POST /api/landing/vehicles/lookup/
export interface SunriseVehicleLookupRequest {
  plate: string;
}

export interface SunriseVehicleLookupResponse {
  found: boolean;
  requires_invoice: boolean;
  plate: string;
  fasecolda_code?: string;
  brand?: string;
  line?: string;
  model?: string | number;
  commercial_value?: number;
  message?: string | null;
  code?: string;
}

// GET /api/landing/vehicles/brands/
export interface SunriseBrandsResponse {
  count: number;
  results: string[];
}

// GET /api/landing/vehicles/references/?brand={brand}&model={model}
export interface SunriseReferencesResponse {
  count: number;
  brand: string;
  model: string | number;
  results: string[];
}

// GET /api/landing/vehicles/by-features/?brand={brand}&model={model}&reference={reference}&is_0km=true
export interface SunriseVehicleFeatureItem {
  fasecolda_code: string;
  brand: string;
  line: string;
  reference: string;
  model: string | number;
  commercial_value: number;
  is_0km: boolean;
}

export interface SunriseByFeaturesResponse {
  count: number;
  brand: string;
  model: string | number;
  reference: string;
  is_0km: boolean;
  results: SunriseVehicleFeatureItem[];
}

// POST /api/landing/leads/
export interface SunriseLeadRequest {
  vehicle_type?: VehicleType;
  funnel_stage: FunnelStage;
  name?: string;
  phone?: string;
  email?: string;
  document_id?: string;
  plate?: string;
  city?: string;
}

export interface SunriseLeadResponse {
  status: string;
  funnel_stage: FunnelStage;
  client_id?: number;
  vehicle_id?: number;
  ticket_id?: number | null;
  can_quote?: boolean;
}

export type PolicyExpiresCode = "now" | "week" | "15_30" | "over_30" | "none";

// POST /api/landing/quotes/
export interface SunriseCreateQuoteRequest {
  vehicle_type: VehicleType;
  consent: boolean;
  plate?: string;
  is_0km?: boolean;
  fasecolda_code?: string;
  brand?: string;
  line?: string;
  model?: string | number;
  commercial_value?: number;
  first_name: string;
  last_name: string;
  document_id: string;
  document_type?: DocumentType;
  phone: string;
  backup_phone?: string;
  email?: string;
  birthday: string; // YYYY-MM-DD
  gender: GenderType;
  city: string;
  city_code?: string;
  policy_expires?: PolicyExpiresCode;
  has_current_policy?: boolean;
  bank_endorsement?: boolean;
}

export interface SunriseCreateQuoteResponse {
  ticket_id: number;
  client_id?: number;
  vehicle_id?: number;
  status: QuoteStatus;
  quoted: boolean;
  skip_reason?: string | null;
  poll_after_seconds?: number | null;
  invoice?: string | null;
  message?: string;
}

export interface SunriseCoverageItem {
  title: string;
  description: string;
  description_tag?: string;
  group?: string | null;
  coverage_tag?: string;
}

// GET /api/landing/quotes/{ticket_id}/
export interface SunriseQuoteItem {
  id: number;
  insurer: string;
  plan_name: string;
  premium: number;
  status: string; // ej: "Recomendada"
  logo_url?: string;
  detail_url?: string;
  pdf_url?: string;
  value_proposition?: string;
  coverages?: SunriseCoverageItem[];
  benefits?: SunriseCoverageItem[];
}

export interface SunriseQuotePollResponse {
  ticket_id: number;
  status: QuoteStatus;
  ticket_state?: string;
  quotes_ready?: boolean;
  quotes?: SunriseQuoteItem[];
  comparative_pdf_url?: string | null;
  poll_after_seconds?: number | null;
  message?: string;
}

// POST /api/landing/quotes/{ticket_id}/invoice/
export interface SunriseInvoiceUploadResponse {
  ticket_file_id: number;
  file_name: string;
  file_url: string;
}

// POST /api/landing/quotes/{ticket_id}/select/
export interface SunriseSelectQuoteRequest {
  insurer?: string;
  plan_name?: string;
  premium?: number;
  quote_id?: number;
  declined?: boolean;
}

export interface SunriseSelectQuoteResponse {
  ok?: boolean;
  status?: string;
  message?: string;
}

// Standard API Error
export interface SunriseApiErrorResponse {
  ok?: false;
  error?: string;
  message?: string;
  code?: string;
}
