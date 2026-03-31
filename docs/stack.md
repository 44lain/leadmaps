# Stack Tecnológica

## Frontend

| Tecnologia | Versão | Função |
|---|---|---|
| React | 18.3 | Biblioteca de UI |
| TypeScript | 5.8 | Tipagem estática |
| Vite | 5.4 | Bundler e dev server |
| React Router DOM | 6.30 | Roteamento SPA |
| TailwindCSS | 3.4 | Estilização utilitária |
| shadcn/ui | — | Biblioteca de componentes (Radix UI + Tailwind) |
| @tanstack/react-query | 5.83 | Gerenciamento de estado assíncrono (disponível, não usado ativamente ainda) |
| React Hook Form | 7.61 | Gerenciamento de formulários |
| Lucide React | 0.462 | Ícones |
| Sonner | 1.7 | Notificações toast |
| next-themes | 0.3 | Suporte a tema claro/escuro |

## Backend / Infraestrutura

| Tecnologia | Função |
|---|---|
| Supabase | Hospedagem de Edge Functions; autenticação futura |
| Deno (Supabase Edge) | Runtime das Edge Functions |
| n8n Cloud | Automação do workflow de prospecção |
| Google Places API | Fonte dos dados de estabelecimentos |
| Google Sheets API v4 | Leitura/escrita dos leads |

## Tooling

| Ferramenta | Função |
|---|---|
| ESLint | Linting com regras React Hooks e React Refresh |
| PostCSS + Autoprefixer | Processamento CSS |
| `@vitejs/plugin-react-swc` | Compilação React com SWC (mais rápido que Babel) |

---

## Decisões de Stack

### Por que Vite + SWC?
Tempo de cold start e HMR significativamente mais rápidos que CRA ou Vite com Babel.

### Por que shadcn/ui?
Componentes acessíveis (Radix UI por baixo), totalmente customizáveis via Tailwind, e os arquivos ficam no próprio projeto — sem dependência de versão de biblioteca de componentes.

### Por que Supabase como proxy da Google Sheets API?
A chave da API não pode ser exposta no bundle do frontend. A Edge Function atua como camada segura entre o browser e a API do Google.

### Por que n8n para a busca?
O enriquecimento de leads (Places → Details → scraping de site → redes sociais) é um pipeline multi-etapa com lógica complexa de retry e tratamento de erros. O n8n permite iterar o workflow visualmente sem necessidade de redeploy do frontend.

### Por que Google Sheets como banco de dados?
Decisão de simplicidade operacional — a planilha serve tanto de storage quanto de interface de visualização/edição manual para o usuário final.
