import { Loader2, CheckCircle2, XCircle, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatusCardProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

const statusConfig = {
  idle: {
    icon: Search,
    label: 'Aguardando busca',
    className: 'text-muted-foreground border-muted',
    iconClassName: '',
  },
  loading: {
    icon: Loader2,
    label: 'Buscando...',
    className: 'text-primary border-primary/30 bg-primary/5',
    iconClassName: 'animate-spin',
  },
  success: {
    icon: CheckCircle2,
    label: 'Concluído',
    className: 'text-success border-success/30 bg-success/5',
    iconClassName: '',
  },
  error: {
    icon: XCircle,
    label: 'Erro',
    className: 'text-destructive border-destructive/30 bg-destructive/5',
    iconClassName: '',
  },
};

export const StatusCard = ({ status, message }: StatusCardProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Card className={cn('border-2 transition-colors duration-300', config.className)}>
      <CardContent className="flex items-center gap-3 py-4">
        <Icon className={cn('h-5 w-5', config.iconClassName)} />
        <div className="flex-1">
          <p className="font-medium">{config.label}</p>
          {message && (
            <p className="text-sm text-muted-foreground mt-0.5">{message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
