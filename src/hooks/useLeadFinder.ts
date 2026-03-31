import { useState, useCallback, useRef } from 'react';
import {
  LeadSearchPayload,
  SearchState,
  FormValues,
  Lead
} from '@/types/leads';
import { extractLeads, extractResponseMeta } from '@/lib/parseLeads';

const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string;
const RESULTS_URL = import.meta.env.VITE_N8N_RESULTS_URL as string;
const TIMEOUT_MS = 600000; // 10 minutos

// Gera um UUID v4 simples para identificar cada requisição
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const useLeadFinder = () => {
  const [state, setState] = useState<SearchState>({
    status: 'idle',
    message: '',
    found: 0,
    leads: [],
    requestId: '',
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Realiza fetch com suporte a cancelamento via AbortController e timeout configurável
  const fetchWithTimeout = async (
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // Busca resultados pelo request_id quando o webhook responde vazio (processamento assíncrono)
  const fetchResults = async (requestId: string): Promise<Lead[]> => {
    const response = await fetchWithTimeout(
      `${RESULTS_URL}?request_id=${requestId}`,
      { method: 'GET' },
      TIMEOUT_MS
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar resultados: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.leads || [];
  };

  const searchLeads = useCallback(async (values: FormValues) => {
    const startTime = Date.now();
    const requestId = generateUUID();

    const payload: LeadSearchPayload = {
      type: values.type,
      location: values.location,
      limit: values.limit,
      radius_km: values.radius,
      request_id: requestId,
    };

    setState({
      status: 'loading',
      message: 'Buscando leads...',
      found: 0,
      leads: [],
      requestId,
      debugInfo: {
        payload,
        response: null,
        executionTime: 0,
        timestamp: new Date().toISOString(),
      },
    });

    try {
      const response = await fetchWithTimeout(
        WEBHOOK_URL,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
        TIMEOUT_MS
      );

      const rawBody = await response.text();
      const executionTime = Date.now() - startTime;

      if (!response.ok) {
        const errorMessage = `Erro na requisição: ${response.status} ${response.statusText}`;

        setState({
          status: 'error',
          message: errorMessage,
          found: 0,
          leads: [],
          requestId,
          error: errorMessage,
          debugInfo: {
            payload,
            response: {
              status: response.status,
              statusText: response.statusText,
              body: rawBody,
            },
            executionTime,
            timestamp: new Date().toISOString(),
          },
        });
        return;
      }

      let data: unknown;
      let responseIsJson = true;

      if (rawBody && rawBody.trim().length > 0) {
        try {
          data = JSON.parse(rawBody);
        } catch {
          // Alguns webhooks do n8n respondem texto puro mesmo com status 200.
          // Tratamos como sucesso e guardamos o corpo bruto para debug.
          responseIsJson = false;
          data = { rawBody };
        }
      } else {
        // Body vazio — webhook apenas confirma recebimento e processa em background
        responseIsJson = false;
        data = { rawBody: '' };
      }

      let leads: Lead[] = [];
      let responseRequestId = requestId;
      let responseFound: number | undefined;
      let responseMessage: string | undefined;

      // Extrai leads e metadados da resposta usando funções puras em src/lib/parseLeads.ts
      const meta = extractResponseMeta(data);
      if (meta.requestId) responseRequestId = meta.requestId;
      responseFound = meta.found;
      responseMessage = meta.message;

      leads = extractLeads(data);

      // Se o POST não retornou leads, tenta buscá-los via endpoint de resultados (fluxo assíncrono)
      if (leads.length === 0 && responseRequestId) {
        try {
          leads = await fetchResults(responseRequestId);
        } catch {
          // Fluxo assíncrono indisponível — mantém estado atual
        }
      }

      const found = responseFound ?? leads.length;

      const mensagemFallback =
        leads.length === 0 && !responseMessage
          ? 'Automação executada; aguardando resultados...'
          : `Encontrei ${found} leads`;

      setState({
        status: 'success',
        message: responseMessage || mensagemFallback,
        found,
        leads,
        requestId: responseRequestId,
        debugInfo: {
          payload,
          response: {
            status: response.status,
            statusText: response.statusText,
            isJson: responseIsJson,
            body: data,
          },
          executionTime,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';

      const isCorsError = errorMessage.includes('Failed to fetch') ||
                          errorMessage.includes('NetworkError') ||
                          errorMessage.includes('CORS');

      setState({
        status: 'error',
        message: isCorsError
          ? 'Erro de CORS: configure o n8n para permitir requisições desta origem'
          : errorMessage,
        found: 0,
        leads: [],
        requestId,
        error: errorMessage,
        debugInfo: {
          payload,
          response: { error: errorMessage },
          executionTime,
          timestamp: new Date().toISOString(),
        },
      });
    }
  }, []);

  const cancelSearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setState(prev => ({
        ...prev,
        status: 'idle',
        message: 'Busca cancelada',
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      message: '',
      found: 0,
      leads: [],
      requestId: '',
    });
  }, []);

  return {
    state,
    searchLeads,
    cancelSearch,
    reset,
  };
};
