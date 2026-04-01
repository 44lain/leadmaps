import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Lead } from '@/types/leads';

interface EstadoLeads {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  total: number;
}

export const useSheetsLeads = () => {
  const [state, setState] = useState<EstadoLeads>({
    leads: [],
    loading: false, // inicia false — o carregamento é disparado pelo useEffect no componente
    error: null,
    total: 0,
  });

  const fetchLeads = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.functions.invoke('get-sheets-leads');

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const leads: Lead[] = data.leads && data.leads.length > 0 ? data.leads : [];
      setState({
        leads,
        loading: false,
        error: null,
        total: data.total || leads.length,
      });
    } catch (err) {
      const mensagem = err instanceof Error
        ? err.message
        : 'Erro desconhecido ao carregar leads da planilha';

      setState(prev => ({
        ...prev,
        loading: false,
        error: mensagem,
      }));
    }
  }, []);

  return {
    ...state,
    fetchLeads,
  };
};
