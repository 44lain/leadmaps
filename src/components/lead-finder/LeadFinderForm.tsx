import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RotateCcw } from 'lucide-react';
import { FormValues } from '@/types/leads';
import { LocationAutocomplete } from './LocationAutocomplete';

interface LeadFinderFormProps {
  values: FormValues;
  onValueChange: <K extends keyof FormValues>(key: K, value: FormValues[K]) => void;
  onSubmit: (values: FormValues) => void;
  onReset: () => void;
  isLoading: boolean;
}

const TIPOS_ESTABELECIMENTO = [
  { value: 'padarias', label: 'Padarias' },
  { value: 'farmacias', label: 'Farmácias' },
  { value: 'mercados', label: 'Mercados' },
  { value: 'restaurantes', label: 'Restaurantes' },
  { value: 'lojas', label: 'Lojas' },
  { value: 'oficinas', label: 'Oficinas' },
  { value: 'saloes', label: 'Salões de Beleza' },
  { value: 'pet shops', label: 'Pet Shops' },
];

export const LeadFinderForm = ({
  values,
  onValueChange,
  onSubmit,
  onReset,
  isLoading,
}: LeadFinderFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const isValid = values.type.trim() !== '' && values.location.trim() !== '';

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Buscar Leads
        </CardTitle>
        <CardDescription>
          Preencha os campos abaixo para encontrar estabelecimentos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type */}
          <div className="space-y-2">
            <Select
              value={values.type || undefined}
              onValueChange={(value) => onValueChange('type', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo..." />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {TIPOS_ESTABELECIMENTO.map((tipo) => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <LocationAutocomplete
              value={values.location}
              onChange={(value) => onValueChange('location', value)}
            />
          </div>


          {/* Buttons */}
          <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading || !isValid}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Buscar leads
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onReset}
                disabled={isLoading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpar
              </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
