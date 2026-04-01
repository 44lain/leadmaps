import { Lead } from '@/types/leads';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Globe, Phone, Instagram, MessageCircle, Facebook, Youtube,
  MapPin, Star, Tag, CheckCircle,
} from 'lucide-react';

// Chaves possíveis para cada campo do lead — o webhook pode retornar nomes variados
const NAME_KEYS = ['name', 'Name', 'lead_name', 'nome', 'Nome'];
const ADDRESS_KEYS = ['address', 'Address', 'lead_address', 'formatted_address', 'endereco', 'Endereço'];
const MAPS_KEYS = ['maps_link', 'maps_url', 'loc', 'google_maps', 'googleMaps', 'Maps', 'maps', 'localização', 'localizacao', 'Localização'];
const RATING_KEYS = ['rating', 'Rating', 'Avaliação', 'avaliacao'];
const TYPE_KEYS = ['type', 'Type', 'types', 'Types', 'category', 'Category', 'tipo', 'Tipo', 'lead_category'];
const STATUS_KEYS = ['status', 'Status'];

const WEBSITE_KEYS = ['website', 'Website', 'lead_website', 'site', 'Site'];
const PHONE_KEYS = ['number', 'Number', 'phone', 'Phone', 'lead_phone', 'telefone', 'Telefone'];
const INSTAGRAM_KEYS = ['instagram', 'Instagram'];
const WHATSAPP_KEYS = ['whatsapp', 'Whatsapp', 'WhatsApp', 'whatssap', 'Whatssap', 'whats', 'Whats'];
const FACEBOOK_KEYS = ['facebook', 'Facebook'];
const YOUTUBE_KEYS = ['youtube', 'Youtube', 'YouTube'];
const TIKTOK_KEYS = ['tiktok', 'Tiktok', 'TikTok', 'tik_tok', 'tik tok', 'Tik Tok', 'Tik tok'];

function resolve(lead: Lead, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = lead[k];
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v);
  }
  return undefined;
}

interface SocialButton {
  label: string;
  icon: React.ReactNode;
  keys: string[];
  activeClass: string;
  buildUrl?: (val: string) => string;
}

const SOCIAL_BUTTONS: SocialButton[] = [
  {
    label: 'Website',
    icon: <Globe className="h-4 w-4" />,
    keys: WEBSITE_KEYS,
    activeClass: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  {
    label: 'Telefone',
    icon: <Phone className="h-4 w-4" />,
    keys: PHONE_KEYS,
    activeClass: 'bg-green-600 hover:bg-green-700 text-white',
    buildUrl: (val) => `tel:${val.split(';')[0].trim()}`,
  },
  {
    label: 'Instagram',
    icon: <Instagram className="h-4 w-4" />,
    keys: INSTAGRAM_KEYS,
    activeClass: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:from-purple-700 hover:via-pink-600 hover:to-orange-500 text-white',
    buildUrl: (val) => val.startsWith('http') ? val : `https://instagram.com/${val.replace(/^@/, '')}`,
  },
  {
    label: 'WhatsApp',
    icon: <MessageCircle className="h-4 w-4" />,
    keys: WHATSAPP_KEYS,
    activeClass: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    buildUrl: (val) => val.startsWith('http') ? val : `https://wa.me/${val.replace(/\D/g, '')}`,
  },
  {
    label: 'Facebook',
    icon: <Facebook className="h-4 w-4" />,
    keys: FACEBOOK_KEYS,
    activeClass: 'bg-blue-700 hover:bg-blue-800 text-white',
    buildUrl: (val) => val.startsWith('http') ? val : `https://facebook.com/${val.replace(/^@/, '')}`,
  },
  {
    label: 'YouTube',
    icon: <Youtube className="h-4 w-4" />,
    keys: YOUTUBE_KEYS,
    activeClass: 'bg-red-600 hover:bg-red-700 text-white',
    buildUrl: (val) => val.startsWith('http') ? val : `https://youtube.com/${val.startsWith('@') ? val : '@' + val}`,
  },
  {
    label: 'TikTok',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.83 4.83 0 0 1-1-.15z" />
      </svg>
    ),
    keys: TIKTOK_KEYS,
    activeClass: 'bg-black hover:bg-gray-900 text-white',
    buildUrl: (val) => val.startsWith('http') ? val : `https://tiktok.com/@${val.replace(/^@/, '')}`,
  },
];

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard = ({ lead }: LeadCardProps) => {
  const { toast } = useToast();

  const handleClick = (val: string, label: string, buildUrl?: (v: string) => string) => {
    if (label === 'Telefone') {
      navigator.clipboard.writeText(val).then(() => {
        toast({ title: 'Número copiado!', description: val });
      });
      return;
    }
    const url = buildUrl ? buildUrl(val) : (val.startsWith('http') ? val : `https://${val}`);
    window.open(url, '_blank');
  };
  const name = resolve(lead, NAME_KEYS);
  const address = resolve(lead, ADDRESS_KEYS);
  const mapsLink = resolve(lead, MAPS_KEYS);
  const rating = resolve(lead, RATING_KEYS);
  const type = resolve(lead, TYPE_KEYS);
  const status = resolve(lead, STATUS_KEYS);

  return (
    <Card className="border hover:shadow-md transition-shadow overflow-hidden">
      <CardContent className="p-3 sm:p-4 space-y-3 overflow-hidden">
        {/* Linha 1: informações principais */}
        <div className="space-y-1.5 min-w-0">
          {name && (
            <h3 className="font-semibold text-sm sm:text-base text-foreground break-words">{name}</h3>
          )}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-x-4 sm:gap-y-1 text-xs sm:text-sm text-muted-foreground">
            {address && (
              <a
                href={mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 break-words min-w-0 hover:text-primary transition-colors"
              >
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="break-words underline">{address}</span>
              </a>
            )}
            {rating && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 shrink-0 text-yellow-500" />
                {rating}
              </span>
            )}
            {type && (
              <span className="flex items-center gap-1 break-words min-w-0">
                <Tag className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="break-words">{type}</span>
              </span>
            )}
            {status && (
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                {status}
              </span>
            )}
          </div>
        </div>

        {/* Linha 2: botões de contato e redes sociais */}
        <div className="flex flex-wrap gap-2">
          {SOCIAL_BUTTONS.map(({ label, icon, keys, activeClass, buildUrl }) => {
            const val = resolve(lead, keys);
            const hasData = !!val;

            return (
              <Button
                key={label}
                variant="secondary"
                size="sm"
                disabled={!hasData}
                className={
                 hasData
                    ? `${activeClass} h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs font-medium`
                    : 'bg-muted text-muted-foreground h-7 sm:h-8 px-2 sm:px-3 text-[10px] sm:text-xs font-medium opacity-50 cursor-not-allowed'
                }
                onClick={() => hasData && handleClick(val, label, buildUrl)}
              >
                {icon}
                {label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
