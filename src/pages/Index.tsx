import { useLeadFinder } from '@/hooks/useLeadFinder';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { LeadFinderForm } from '@/components/lead-finder/LeadFinderForm';
import { StatusCard } from '@/components/lead-finder/StatusCard';
import { ResultsSummary } from '@/components/lead-finder/ResultsSummary';
import { SheetsLeadsTab } from '@/components/lead-finder/SheetsLeadsTab';
import { DebugPanel } from '@/components/lead-finder/DebugPanel';
import { MapPin } from 'lucide-react';

const Index = () => {
  const { state, searchLeads, reset: resetSearch } = useLeadFinder();
  const { values, updateValue, resetValues } = useFormPersistence();

  const handleReset = () => {
    resetValues();
    resetSearch();
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

        {/* Largura total — leads da planilha com auto-refresh */}
        <div className="mt-6 sm:mt-8">
          <SheetsLeadsTab />
        </div>
      </main>
    </div>
  );
};

export default Index;
