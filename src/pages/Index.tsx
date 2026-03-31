import { useLeadFinder } from '@/hooks/useLeadFinder';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useSheetsLeads } from '@/hooks/useSheetsLeads';
import { LeadFinderForm } from '@/components/lead-finder/LeadFinderForm';
import { StatusCard } from '@/components/lead-finder/StatusCard';
import { ResultsSummary } from '@/components/lead-finder/ResultsSummary';
import { LeadsTable } from '@/components/lead-finder/LeadsTable';
import { DebugPanel } from '@/components/lead-finder/DebugPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, RefreshCw, AlertCircle, ExternalLink, Pause, Play } from 'lucide-react';
import { useEffect, useState } from 'react';

const SHEETS_URL = import.meta.env.VITE_SHEETS_URL as string;
const AUTO_REFRESH_INTERVAL = 30000;

const Index = () => {
  const { state, searchLeads, reset: resetSearch } = useLeadFinder();
  const { values, updateValue, resetValues } = useFormPersistence();
  const { leads: sheetsLeads, loading: sheetsLoading, error: sheetsError, total: sheetsTotal, fetchLeads } = useSheetsLeads();
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

  const handleReset = () => {
    resetValues();
    resetSearch();
  };

  const handleManualRefresh = () => {
    fetchLeads().then(() => setLastUpdate(new Date()));
  };

  const showCorsWarning = state.status === 'error' && state.error?.includes('CORS');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">
                Retail Leads Finder
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Encontre estabelecimentos comerciais via automação n8n
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 sm:gap-6 lg:gap-8">
          {/* Coluna esquerda — formulário de busca */}
          <div className="space-y-6">
            <LeadFinderForm
              values={values}
              onValueChange={updateValue}
              onSubmit={searchLeads}
              onReset={handleReset}
              isLoading={state.status === 'loading'}
            />
          </div>

          {/* Coluna direita — status e resultados da busca */}
          <div className="space-y-6">
            <StatusCard
              status={state.status}
              message={state.status === 'loading' ? 'Consultando n8n...' : undefined}
            />

            {state.status === 'success' && (
              <ResultsSummary
                message={state.message}
                found={state.found}
                leads={state.leads}
              />
            )}

            {(state.status === 'error' || state.debugInfo) && (
              <DebugPanel
                debugInfo={state.debugInfo}
                showCorsWarning={showCorsWarning}
              />
            )}
          </div>
        </div>

        {/* Largura total — leads da planilha */}
        <div className="mt-6 sm:mt-8 space-y-6">
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
                    disabled={sheetsLoading}
                  >
                    <RefreshCw className={`h-4 w-4 sm:mr-2 ${sheetsLoading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Atualizar</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {sheetsError && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{sheetsError}</AlertDescription>
                </Alert>
              )}

              {sheetsLoading && sheetsLeads.length === 0 && (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Carregando leads...</span>
                </div>
              )}

              {!sheetsLoading && !sheetsError && sheetsTotal > 0 && (
                <p className="text-sm text-muted-foreground">
                  {sheetsTotal} leads encontrados na planilha
                  {autoRefresh && ' • Atualização automática ativa (30s)'}
                </p>
              )}
            </CardContent>
          </Card>

          {sheetsLeads.length > 0 && <LeadsTable leads={sheetsLeads} />}
        </div>
      </main>
    </div>
  );
};

export default Index;
