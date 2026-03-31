export interface LeadSearchPayload {
  type: string;
  location: string;
  limit: number;
  radius_km: number;
  request_id: string;
}

export interface Lead {
  name?: string;
  nome?: string;
  formatted_address?: string;
  address?: string;
  endereco?: string;
  phone?: string;
  telefone?: string;
  website?: string;
  maps_url?: string;
  lat?: number;
  lng?: number;
  request_id?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface LeadSearchResponse {
  message?: string;
  found?: number;
  request_id?: string;
  leads?: Lead[];
  error?: string;
}

export interface SearchState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  found: number;
  leads: Lead[];
  requestId: string;
  error?: string;
  debugInfo?: DebugInfo;
}

export interface DebugInfo {
  payload: LeadSearchPayload | null;
  response: unknown;
  executionTime: number;
  timestamp: string;
}

export interface FormValues {
  type: string;
  location: string;
  radius: number;
  limit: number;
}
