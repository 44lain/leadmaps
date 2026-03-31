import { useEffect, useState } from 'react';
import { useSheetsLeads } from '@/hooks/useSheetsLeads';
import { LeadsTable } from './LeadsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, AlertCircle, ExternalLink, Pause, Play } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SHEETS_URL = import.meta.env.VITE_SHEETS_URL as string;
const AUTO_REFRESH_INTERVAL = 30000; // 30 segundos

export const SheetsLeadsTab = () => {
  const { leads, loading, error, total, fetchLeads } = useSheetsLeads();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    fetchLeads().then(() => setLastUpdate(new Date()));
  }, [fetchLeads]);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchLeads().then(() => setLastUpdate(new Date()));
    }, AUTO_REFRESH_INTERVAL);
    
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLeads]);

  const handleManualRefresh = () => {
    fetchLeads().then(() => setLastUpdate(new Date()));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Leads da Planilha</CardTitle>
              {lastUpdate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Última atualização: {lastUpdate.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                title={autoRefresh ? 'Pausar atualização automática' : 'Retomar atualização automática'}
              >
                {autoRefresh ? <Pause className="h-4 w-4 sm:mr-2" /> : <Play className="h-4 w-4 sm:mr-2" />}
                <span className="hidden sm:inline">{autoRefresh ? 'Pausar' : 'Retomar'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(SHEETS_URL, '_blank')}
              >
                <ExternalLink className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Abrir Planilha</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {loading && leads.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Carregando leads...</span>
            </div>
          )}

          {!loading && !error && total > 0 && (
            <p className="text-sm text-muted-foreground mb-4">
              {total} leads encontrados na planilha
              {autoRefresh && ' • Atualização automática ativa (30s)'}
            </p>
          )}
        </CardContent>
      </Card>

      {leads.length > 0 && <LeadsTable leads={leads} />}
    </div>
  );
};
