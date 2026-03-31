# Arquitetura do Sistema

## Visão Geral

O LeadMaps é uma SPA (Single Page Application) que orquestra dois fluxos independentes para busca e exibição de leads comerciais. O frontend nunca acessa APIs externas diretamente — todo acesso sensível passa por intermediários (n8n ou Supabase Edge Functions).

---

## Diagrama de Fluxo

```
┌─────────────────────────────────────────────────────────────┐
│                         BROWSER (React)                     │
│                                                             │
│   ┌───────────────┐          ┌──────────────────────────┐   │
│   │ LeadFinderForm│          │      LeadsTable           │   │
│   └──────┬────────┘          └────────────┬─────────────┘   │
│          │ submit                          │ render          │
│   ┌──────▼────────┐          ┌────────────▼─────────────┐   │
│   │ useLeadFinder │          │      useSheetsLeads       │   │
│   └──────┬────────┘          └────────────┬─────────────┘   │
└──────────┼──────────────────────────────  ┼  ───────────────┘
           │                                │
           │ POST /webhook/lead-finder-osm  │ invoke('get-sheets-leads')
           │                                │
    ┌──────▼──────┐                 ┌───────▼────────┐
    │  n8n Cloud  │                 │ Supabase Edge  │
    │  (Workflow) │                 │   Function     │
    └──────┬──────┘                 └───────┬────────┘
           │                                │
           │ busca + enriquece              │ GET
           │                                │
    ┌──────▼──────┐                 ┌───────▼────────┐
    │Google Places│                 │ Google Sheets  │
    │     API     │                 │    API v4      │
    └──────┬──────┘                 └───────▼────────┘
           │ grava resultados              leads
           │                                │
    ┌──────▼──────────────────────────────▼─┤
    │           Google Sheets               │
    │    (planilha compartilhada)           │
    └───────────────────────────────────────┘
```

---

## Fluxo 1 — Disparo de Nova Busca (via n8n)

**Responsável no frontend:** `useLeadFinder.ts`

1. Usuário preenche tipo de estabelecimento + localização e clica em "Buscar leads"
2. O frontend gera um `request_id` (UUID v4) e faz POST direto ao webhook do n8n
3. O workflow n8n executa:
   - Busca no Google Places Text Search API
   - Para cada resultado, chama Google Places Details API (telefone, site)
   - Faz scraping do site (se existir) para extrair redes sociais
   - Grava todos os dados na planilha Google Sheets
4. O frontend trata dois modos de resposta do n8n:
   - **Síncrono**: leads chegam no body do POST → exibe imediatamente
   - **Assíncrono**: body vazio/ack → tenta buscar pelo `request_id` no endpoint de resultados

**URLs do n8n** (configuradas via variáveis de ambiente — ver `.env.example`):
- Disparo: `VITE_N8N_WEBHOOK_URL` → ex.: `http://localhost:5678/webhook/lead-finder`
- Resultados: `VITE_N8N_RESULTS_URL` → ex.: `http://localhost:5678/webhook/lead-finder-results`

---

## Fluxo 2 — Leitura de Leads Salvos (via Supabase)

**Responsável no frontend:** `useSheetsLeads.ts`

1. Ao carregar a página, e a cada 30 segundos (quando auto-refresh ativo), o hook é acionado
2. Chama a Edge Function `get-sheets-leads` via SDK do Supabase
3. A Edge Function roda em Deno no servidor do Supabase e:
   - Lê a planilha usando Google Sheets API v4 com chave de API segura
   - Converte as linhas em array de objetos usando o cabeçalho da primeira linha
   - Retorna `{ leads, total, message }`
4. Os leads são exibidos na `LeadsTable` com busca e paginação

**Por que usar Supabase como proxy?**
A chave da Google Sheets API nunca é exposta ao browser — fica como secret no Supabase (`GOOGLE_SHEETS_API_KEY`).

---

## Estrutura de Pastas

```
src/
├── components/
│   ├── lead-finder/        # Componentes específicos do domínio
│   │   ├── LeadCard.tsx        — card de um lead individual
│   │   ├── LeadFinderForm.tsx  — formulário de busca
│   │   ├── LeadsTable.tsx      — tabela com busca e paginação
│   │   ├── LocationAutocomplete.tsx — input com autocomplete via Nominatim
│   │   ├── ResultsSummary.tsx  — resumo pós-busca
│   │   ├── StatusCard.tsx      — indicador de estado da busca
│   │   └── DebugPanel.tsx      — painel técnico de debug
│   └── ui/                 # Componentes shadcn/ui (não editar manualmente)
├── hooks/
│   ├── useLeadFinder.ts    — fluxo de busca via n8n
│   ├── useSheetsLeads.ts   — leitura de leads da planilha
│   └── useFormPersistence.ts — persistência do formulário no localStorage
├── integrations/
│   └── supabase/
│       ├── client.ts       — instância do cliente Supabase
│       └── types.ts        — tipos gerados do schema do banco
├── pages/
│   ├── Index.tsx           — página principal (única rota real)
│   └── NotFound.tsx        — página 404
├── types/
│   └── leads.ts            — interfaces e types do domínio
└── lib/
    └── utils.ts            — utilitário cn() para classes Tailwind

supabase/
└── functions/
    └── get-sheets-leads/
        └── index.ts        — Edge Function (Deno) que lê a planilha

docs/                       — documentação do projeto
memory/                     — contexto e decisões do projeto
```

---

## Dependências Externas

| Serviço | Função | Onde é usado |
|---|---|---|
| n8n Cloud | Automação de busca e enriquecimento de leads | `useLeadFinder.ts` |
| Google Places API | Busca de estabelecimentos por texto/localização | Dentro do n8n |
| Google Sheets | Armazenamento compartilhado dos leads | n8n grava; Edge Function lê |
| Google Sheets API v4 | Leitura da planilha pelo backend | `get-sheets-leads/index.ts` |
| Supabase | Hospedagem da Edge Function; auth futura | `useSheetsLeads.ts` |
| Nominatim (OSM) | Autocomplete de localização no formulário | `LocationAutocomplete.tsx` |

---

## Variáveis de Ambiente

### Frontend (`.env`)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

### Supabase Edge Function (secrets)
```
GOOGLE_SHEETS_API_KEY=
```
