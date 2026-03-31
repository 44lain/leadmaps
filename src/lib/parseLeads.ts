import { Lead } from '@/types/leads';

/**
 * Extrai leads de qualquer estrutura retornada pelo webhook n8n.
 *
 * O n8n pode retornar diferentes formatos dependendo da configuração:
 * - Array direto: [{ name, address, ... }, ...]
 * - Wrapper com chave conhecida: { leads: [...] } ou { results: [...] }
 * - Objeto único de lead: { name, place_id, ... }
 * - Arrays aninhados (n8n às vezes envolve itens em arrays extras)
 */
export function extractLeads(input: unknown): Lead[] {
  if (!input) return [];

  if (Array.isArray(input)) {
    const result: Lead[] = [];
    for (const item of input) {
      if (Array.isArray(item)) {
        // Array aninhado — achata recursivamente
        result.push(...extractLeads(item));
      } else if (item && typeof item === 'object') {
        result.push(item as Lead);
      }
    }
    return result;
  }

  if (typeof input === 'object' && input !== null) {
    const obj = input as Record<string, unknown>;

    // Verifica chaves conhecidas que contêm arrays de leads
    for (const key of ['leads', 'results', 'data', 'items', 'records']) {
      if (Array.isArray(obj[key]) && (obj[key] as unknown[]).length > 0) {
        return extractLeads(obj[key]);
      }
    }

    // Verifica se o objeto em si parece um lead individual
    const pareceUmLead =
      'place_id' in obj ||
      'name' in obj ||
      'formatted_address' in obj ||
      'maps_url' in obj ||
      'website' in obj;

    if (pareceUmLead) {
      return [obj as unknown as Lead];
    }
  }

  return [];
}

/**
 * Extrai metadados do wrapper de resposta do n8n, se houver.
 * Retorna os valores encontrados ou undefined para cada campo ausente.
 */
export function extractResponseMeta(data: unknown): {
  requestId?: string;
  found?: number;
  message?: string;
} {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return {};
  }

  const obj = data as Record<string, unknown>;

  return {
    requestId: typeof obj.request_id === 'string' && obj.request_id ? obj.request_id : undefined,
    found: typeof obj.found === 'number' ? obj.found : undefined,
    message: typeof obj.message === 'string' && obj.message ? obj.message : undefined,
  };
}
