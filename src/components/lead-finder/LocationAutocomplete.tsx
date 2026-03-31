import { useState, useRef, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationSuggestion {
  display_name: string;
  place_id: number;
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export const LocationAutocomplete = ({ value, onChange }: LocationAutocompleteProps) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=br&limit=6&addressdetails=1`,
        { headers: { 'Accept-Language': 'pt-BR' } }
      );
      const data: LocationSuggestion[] = await res.json();
      setSuggestions(data);
      setIsOpen(data.length > 0);
      setActiveIndex(-1);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 350);
  };

  const handleSelect = (suggestion: LocationSuggestion) => {
    const parts = suggestion.display_name.split(', ');
    const short = parts.length >= 3 ? `${parts[0]}, ${parts[1]}, ${parts[2]}` : suggestion.display_name;
    setQuery(short);
    onChange(short);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder="Digite um local (bairro, cidade, estado)..."
          className="pl-9 pr-9"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md max-h-60 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li
              key={s.place_id}
              onClick={() => handleSelect(s)}
              className={cn(
                'flex items-start gap-2 rounded-sm px-2 py-2 text-sm cursor-pointer transition-colors',
                i === activeIndex
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-accent/50'
              )}
            >
              <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <span className="line-clamp-2">{s.display_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
