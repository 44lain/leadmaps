import { ChevronDown, Clock, FileJson, AlertTriangle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { DebugInfo } from '@/types/leads';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface DebugPanelProps {
  debugInfo: DebugInfo | undefined;
  showCorsWarning?: boolean;
}

export const DebugPanel = ({ debugInfo, showCorsWarning }: DebugPanelProps) => {
  if (!debugInfo) return null;

  return (
    <div className="space-y-4">
      {showCorsWarning && (
        <Alert variant="destructive" className="border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro de CORS detectado</AlertTitle>
          <AlertDescription className="mt-2 space-y-2">
            <p>Para resolver, configure o n8n para permitir requisições CORS:</p>
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>Acesse as configurações do n8n</li>
              <li>Adicione <code className="bg-background px-1 rounded">N8N_CORS_ORIGIN=*</code> às variáveis de ambiente</li>
              <li>Ou configure um domínio específico para mais segurança</li>
            </ol>
          </AlertDescription>
        </Alert>
      )}

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="debug" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="flex items-center gap-2 text-sm font-medium">
              <FileJson className="h-4 w-4" />
              Detalhes técnicos
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              {/* Execution Time */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Tempo de execução: {debugInfo.executionTime}ms</span>
                <span className="text-xs">({debugInfo.timestamp})</span>
              </div>

              {/* Payload Sent */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Payload enviado:</h4>
                <Card className="bg-muted/50">
                  <CardContent className="p-3">
                    <pre className="text-xs overflow-x-auto">
                      {JSON.stringify(debugInfo.payload, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>

              {/* Response */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Resposta do n8n:</h4>
                <Card className="bg-muted/50">
                  <CardContent className="p-3">
                    <pre className="text-xs overflow-x-auto max-h-64">
                      {JSON.stringify(debugInfo.response, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
