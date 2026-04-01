import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/leads';

interface ResultsSummaryProps {
  message: string;
  found: number;
  leads: Lead[];
}

export const ResultsSummary = ({ message, found, leads }: ResultsSummaryProps) => {
  // Extrai nomes dos leads para prévia
  const nomesLeads = leads
    .map((lead) => lead.name || lead.nome || '')
    .filter((name) => name.trim() !== '');

  return (
    <Card className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Resultados
          </CardTitle>
          <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
            {found} encontrados
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{message}</p>

        {nomesLeads.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">Leads encontrados:</span>
            <ul className="space-y-1">
              {nomesLeads.slice(0, 5).map((name, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="truncate">{name}</span>
                </li>
              ))}
              {nomesLeads.length > 5 && (
                <li className="text-sm text-muted-foreground italic">
                  e mais {nomesLeads.length - 5} leads...
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
