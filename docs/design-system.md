# Design System

O design system é baseado em **CSS Custom Properties** (variáveis CSS) definidas em `src/index.css`, consumidas pelo **Tailwind CSS** via configuração em `tailwind.config.ts`. Os componentes visuais vêm do **shadcn/ui** (Radix UI + Tailwind).

---

## Tokens de Cor

Todas as cores são expressas em formato **HSL** (Hue Saturation Lightness) sem a função `hsl()` — o Tailwind a aplica internamente.

### Tema Claro (`:root`)

| Token | Valor HSL | Uso |
|---|---|---|
| `--background` | `220 20% 97%` | Fundo da página |
| `--foreground` | `220 20% 10%` | Texto principal |
| `--card` | `0 0% 100%` | Fundo de cards |
| `--card-foreground` | `220 20% 10%` | Texto em cards |
| `--primary` | `217 91% 60%` | Azul — ações principais, botão primário |
| `--primary-foreground` | `0 0% 100%` | Texto sobre primary |
| `--secondary` | `220 14% 96%` | Ações secundárias, fundo sutil |
| `--muted` | `220 14% 96%` | Elementos desabilitados, fundo opaco |
| `--muted-foreground` | `220 10% 46%` | Texto secundário, placeholders |
| `--accent` | `172 66% 50%` | Verde-azulado — destaques, badges |
| `--destructive` | `0 84% 60%` | Vermelho — erros, ações destrutivas |
| `--border` | `220 13% 91%` | Bordas de inputs e cards |
| `--ring` | `217 91% 60%` | Outline de foco |
| `--radius` | `0.75rem` | Border radius padrão |
| `--success` | `142 76% 36%` | Verde — status de sucesso |
| `--warning` | `38 92% 50%` | Amarelo — alertas |

### Tema Escuro (`.dark`)

Os tokens são redefinidos para uma paleta escura (tons azul-escuros de fundo `224 71% 4%`). A cor primária e accent permanecem iguais nos dois temas.

---

## Como usar as cores

```tsx
// Via classes Tailwind (forma recomendada)
<div className="bg-background text-foreground" />
<button className="bg-primary text-primary-foreground" />
<span className="text-muted-foreground" />

// Cores de status
<span className="text-success" />
<span className="text-destructive" />
<span className="text-warning" />
```

---

## Componentes shadcn/ui utilizados no projeto

Todos os componentes estão em `src/components/ui/`. São copiados para o projeto e podem ser editados livremente.

| Componente | Arquivo | Uso no projeto |
|---|---|---|
| `Button` | `button.tsx` | Ações em formulários e painéis |
| `Card` / `CardContent` / `CardHeader` | `card.tsx` | Container principal de seções |
| `Input` | `input.tsx` | Campo de busca, autocomplete |
| `Select` | `select.tsx` | Seleção de tipo de estabelecimento |
| `Badge` | `badge.tsx` | Contagem de leads em ResultsSummary |
| `Alert` / `AlertDescription` | `alert.tsx` | Erros e avisos de CORS |
| `Accordion` | `accordion.tsx` | Painel de debug recolhível |
| `Pagination` | `pagination.tsx` | Paginação da LeadsTable |
| `Toaster` / `Sonner` | `toaster.tsx` / `sonner.tsx` | Notificações toast |
| `Tooltip` | `tooltip.tsx` | Provider global no App.tsx |

---

## Tipografia

Sem fonte customizada configurada — usa a pilha padrão do sistema via Tailwind (`font-sans`). Feature settings ativados no `body`:

```css
font-feature-settings: "rlig" 1, "calt" 1;
```

(ligaduras e alternativas contextuais)

---

## Border Radius

O projeto usa `--radius: 0.75rem` como base. Os componentes shadcn/ui derivam variações:
- `rounded-lg` → `var(--radius)` → `0.75rem`
- `rounded-md` → `calc(var(--radius) - 2px)` → `0.625rem`
- `rounded-sm` → `calc(var(--radius) - 4px)` → `0.375rem`

---

## Responsividade

O layout usa breakpoints padrão do Tailwind:

| Breakpoint | Largura | Comportamento principal |
|---|---|---|
| `sm` | 640px | Header mostra subtítulo; botões mostram texto |
| `lg` | 1024px | Layout muda de 1 coluna para 2 colunas (form + status) |

Grid principal da página:
```tsx
// mobile: 1 coluna
// desktop: coluna fixa de 380px + coluna flexível para resultados
className="grid grid-cols-1 lg:grid-cols-[380px_1fr]"
```
