# Boas Práticas

Convenções e padrões adotados neste projeto. Todos os contribuidores devem seguir estas diretrizes.

---

## Nomenclatura

### Arquivos e pastas
- Componentes React: `PascalCase.tsx` → `LeadCard.tsx`
- Hooks: `camelCase.ts` com prefixo `use` → `useLeadFinder.ts`
- Tipos e interfaces: `camelCase.ts` → `leads.ts`
- Utilitários: `camelCase.ts` → `utils.ts`
- Pastas de domínio: `kebab-case` → `lead-finder/`

### Código
- Variáveis e funções: `camelCase` → `fetchLeads`, `requestId`
- Constantes de módulo: `SCREAMING_SNAKE_CASE` → `TIMEOUT_MS`, `WEBHOOK_URL`
- Interfaces TypeScript: `PascalCase` → `LeadSearchPayload`, `SearchState`
- Componentes exportados: `PascalCase` e sempre nomeados (sem `export default` em componentes de domínio)

### Idioma
- Código (variáveis, funções, tipos): **português**, salvo nomes de bibliotecas e APIs
- Comentários: **português claro e direto**
- UI / strings visíveis ao usuário: **português**
- Nomes de propriedades que vêm de APIs externas: manter como a API retorna

---

## Componentes

### Regra geral
Componentes devem fazer **uma coisa só**. Se um componente tem mais de ~150 linhas ou mistura lógica de negócio com renderização, dividir.

### Estrutura preferida
```tsx
// 1. Imports externos
// 2. Imports internos
// 3. Interfaces/tipos locais
// 4. Constantes do módulo
// 5. Componente (props desestruturadas na assinatura)
// 6. Export nomeado
```

### Props
- Sempre tipar com interface dedicada
- Evitar prop drilling além de 2 níveis — usar composição ou mover lógica para hook
- Não passar objetos inteiros quando só um campo é necessário

---

## Hooks

- Um hook por responsabilidade
- Retornar objetos nomeados (não tuplas), salvo casos simples tipo `useState`
- Estado interno com `useState`; efeitos colaterais em `useEffect`; funções estáveis com `useCallback`
- Nunca fazer fetch direto em componentes — sempre via hook

---

## TypeScript

- Sem `any` — usar `unknown` e fazer narrowing explícito
- Interfaces para shapes de objetos; `type` para unions e aliases
- Exportar todos os tipos usados em mais de um arquivo via `src/types/`
- Não ignorar erros com `// @ts-ignore` — corrigir o tipo

---

## Estilização

- Usar **classes Tailwind** — não escrever CSS customizado salvo quando inevitável
- Combinar classes condicionais com a função `cn()` de `src/lib/utils.ts`
- Nunca usar `style={{}}` inline, exceto para valores dinâmicos impossíveis de fazer com Tailwind
- Preferir tokens do design system (`text-primary`, `bg-muted`) a valores hardcoded (`text-blue-500`)

---

## Comunicação com APIs

- Todo fetch externo deve ter timeout configurado
- Sempre tratar o caso de resposta não-JSON (texto puro, HTML)
- Mensagens de erro para o usuário devem ser legíveis e em português
- Logs de debug com prefixo de contexto: `[NomeDoHook] mensagem`

---

## Organização de Arquivos

- Não criar arquivo para componente usado em apenas um lugar — colocar no mesmo arquivo
- Não criar pasta nova sem pelo menos 2 arquivos relacionados
- `src/components/ui/` é reservado para componentes shadcn/ui — não criar componentes próprios aqui
- Componentes de domínio ficam em `src/components/lead-finder/` (ou subpastas de domínio que surgirem)

---

## Segurança

- Nunca commitar chaves de API, tokens ou secrets
- Variáveis de ambiente do frontend: prefixo `VITE_` apenas para valores públicos/seguros
- Segredos de servidor ficam como secrets no Supabase, nunca no `.env` do projeto
- Não expor `request_id` ou dados sensíveis em logs de produção (remover os `console.log` de debug antes do deploy final)

---

## Performance

- Usar `useMemo` e `useCallback` onde o custo de recalcular é real (listas grandes, funções passadas como prop)
- Imagens: usar `loading="lazy"` e formatos modernos (WebP) quando aplicável
- Evitar re-renders desnecessários — não recriar objetos/arrays em cada render como prop de componente filho

---

## Testes (TDD)

**Princípio:** lógica que pode ser extraída de hooks como função pura, deve ser antes testada como função pura.

### Stack
- **Vitest** — runner rápido integrado ao Vite, mesma config
- **jsdom** — ambiente DOM para testes de componentes
- **@testing-library/react** — querias semânticas em componentes
- **@testing-library/jest-dom** — matchers adicionais (`toBeInTheDocument`, etc.)

### Localização dos testes
```
src/tests/
  setup.ts           ← jest-dom bootstrapping
  parseLeads.test.ts ← testes das funções puras de parseLeads
```
Arquivo de teste: mesmo nome da unidade testada com sufixo `.test.ts`.

### Fluxo recomendado
1. **Extrair** a lógica em função pura em `src/lib/`
2. **Escrever** os testes antes de usar a função no hook
3. **Rodar** `npm run test:run` — verde antes de integrar
4. **Importar** a função no hook

### Comandos
```bash
npm run test        # modo watch
npm run test:run    # run único (CI / pré-commit)
npm run test:ui     # interface visual do Vitest
```

### O que testar
- Funções puras em `src/lib/` → **sempre**
- Transformações de dados, parsers, validadores → **sempre**
- Hooks com efeitos colaterais → quando a lógica for complexa
- Componentes UI simples → opcional (ROI baixo para projetos pessoais)

### O que não testar
- Componentes shadcn/ui (já testados pela biblioteca)
- Chamadas de rede diretamente (mockar com `vi.fn()`)
- Código gerado (tipos TypeScript, CSS)

---

## Checklist antes de fazer PR/commit

- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run test:run` — todos os testes passando
- [ ] Nenhum `console.log` de debug esquecido
- [ ] Imports não usados removidos
- [ ] Strings visíveis ao usuário em português
- [ ] Nenhuma chave de API ou secret no código
- [ ] Componente novo tem tipagem completa nas props
