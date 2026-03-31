# LeadMaps

SPA para prospecção de leads comerciais. Preencha o tipo de estabelecimento e localização, dispara uma busca automatizada via **n8n** (Google Places / OSM), e os resultados aparecem em tempo real lidos de uma planilha **Google Sheets** via proxy seguro no **Supabase**.

> **Repositório público.** Leia [`SECURITY.md`](SECURITY.md) antes de contribuir.
> Dados de produção (chaves de API, IDs de planilha, URLs de webhook) **nunca** devem ser commitados — use `.env` (ignorado pelo git) conforme documentado abaixo.

---

## Como funciona

```
Usuário → Formulário (tipo + localização + raio)
              ↓ POST webhook
            n8n → Google Places API → Google Sheets (grava)

Usuário → Tabela de leads (auto-refresh 30s)
              ↓ Supabase Edge Function (proxy seguro)
            Google Sheets API v4 (lê)
```

A chave `GOOGLE_SHEETS_API_KEY` fica como **secret no servidor Supabase**, nunca exposta no bundle do browser.
Ver [`docs/arquitetura.md`](docs/arquitetura.md) para o diagrama completo.

---

## Stack

| Camada | Tecnologia |
|---|---|
| UI | React 18 + TypeScript + Vite + SWC |
| Estilo | TailwindCSS + shadcn/ui |
| Automação | n8n (cloud ou self-hosted) |
| Backend | Supabase Edge Functions (Deno) |
| Testes | Vitest + Testing Library + jsdom |

---

## Configuração rápida

### Pré-requisitos

- Node.js ≥ 20
- Conta [Supabase](https://supabase.com) (gratuita suficiente para início)
- Instância n8n ([self-hosted](https://docs.n8n.io/hosting/) ou [cloud](https://n8n.io))
- Projeto Google Cloud com **Google Places API** e **Google Sheets API v4** habilitadas

### 1. Clonar e instalar

```bash
git clone https://github.com/<seu-usuario>/leadmaps.git
cd leadmaps
npm install
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env com suas credenciais — veja os comentários no arquivo
```

| Variável | Descrição |
|---|---|
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Chave pública (anon key) do Supabase |
| `VITE_N8N_WEBHOOK_URL` | URL do webhook n8n — disparo da busca |
| `VITE_N8N_RESULTS_URL` | URL do webhook n8n — leitura de resultados |
| `VITE_SHEETS_URL` | URL completa da planilha Google Sheets (para o botão "Abrir planilha") |

### 3. Secrets da Edge Function

```bash
# Instale o CLI do Supabase: https://supabase.com/docs/guides/cli
supabase secrets set GOOGLE_SHEETS_API_KEY=<sua-chave>
supabase secrets set SPREADSHEET_ID=<id-da-planilha>
```

### 4. Deploy da Edge Function

```bash
supabase functions deploy get-sheets-leads
```

### 5. Rodar localmente

```bash
npm run dev
```

---

## Comandos

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # build de produção
npm run test         # Vitest em modo watch
npm run test:run     # Vitest run único (pré-commit / CI)
npx tsc --noEmit     # validação TypeScript sem build
npm run lint         # ESLint

# Supabase local (requer Docker)
supabase start
supabase functions serve get-sheets-leads
```

---

## Estrutura do projeto

```
src/
├── components/lead-finder/   # Componentes do domínio principal
├── hooks/                    # Lógica de negócio (useLeadFinder, useSheetsLeads…)
├── lib/                      # Funções puras testáveis (parseLeads…)
├── pages/                    # Rotas (Index, NotFound)
├── tests/                    # Testes Vitest
└── types/                    # Interfaces TypeScript do domínio

supabase/functions/
└── get-sheets-leads/         # Edge Function Deno — proxy para Google Sheets API

docs/                         # Documentação técnica
```

---

## Testes

O projeto usa **TDD para lógica de negócio**: funções puras são extraídas de hooks e testadas antes de serem integradas.

```bash
npm run test:run     # 19 testes passando em src/tests/parseLeads.test.ts
```

Ver [`docs/boas-praticas.md`](docs/boas-praticas.md) para a filosofia de testes adotada.

---

## Segurança e privacidade

- [`SECURITY.md`](SECURITY.md) — política de segurança, OWASP Top 10 e como reportar vulnerabilidades
- [`PRIVACY.md`](PRIVACY.md) — conformidade com LGPD e tratamento de dados pessoais

---

## Contribuindo

Ver [`CONTRIBUTING.md`](CONTRIBUTING.md) para guia completo de contribuição.

Checklist mínimo antes de abrir PR:
- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run test:run` verde
- [ ] Nenhuma chave de API ou secret no código
- [ ] Nenhum `console.log` de debug esquecido

---

## Licença

[MIT](LICENSE)

npm run build        # build de produção
npm run test         # testes em modo watch
npm run test:run     # testes (run único, pré-commit)
npx tsc --noEmit     # validação TypeScript
```

---

## Documentação

- [`docs/arquitetura.md`](docs/arquitetura.md) — como os dois fluxos funcionam
- [`docs/stack.md`](docs/stack.md) — decisões de tecnologia
- [`docs/boas-praticas.md`](docs/boas-praticas.md) — convenções e TDD
- [`memory/handoff.md`](memory/handoff.md) — contexto completo para retomar o projeto
