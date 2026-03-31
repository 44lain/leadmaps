import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Lead } from '@/types/leads';
import { LeadCard } from './LeadCard';
import { cn } from '@/lib/utils';

interface LeadsTableProps {
  leads: Lead[];
}

const ITEMS_PER_PAGE = 10;

export const LeadsTable = ({ leads }: LeadsTableProps) => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLeads = useMemo(() => {
    if (!search.trim()) return leads;
    const searchLower = search.toLowerCase();
    return leads.filter(lead =>
      Object.values(lead).some(val =>
        val !== undefined && val !== null && String(val).toLowerCase().includes(searchLower)
      )
    );
  }, [leads, search]);

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedLeads = filteredLeads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (leads.length === 0) {
    return (
      <Card className="border-2">
        <CardContent className="py-6">
          <p className="text-center text-muted-foreground">Nenhum lead encontrado</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-lg font-semibold">
              Leads ({filteredLeads.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-3">
        {paginatedLeads.map((lead, index) => (
          <LeadCard key={index} lead={lead} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className={cn(currentPage === 1 && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink onClick={() => setCurrentPage(pageNum)} isActive={currentPage === pageNum}>
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className={cn(currentPage === totalPages && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};
