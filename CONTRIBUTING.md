# Guia de Contribuição

Obrigado pelo interesse em contribuir! Este documento explica como participar do projeto de forma segura e consistente.

---

## Antes de começar

1. Leia o [`README.md`](README.md) para entender o projeto
2. Leia o [`SECURITY.md`](SECURITY.md) — especialmente o checklist de segurança
3. Leia o [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)

---

## Fluxo de trabalho

```bash
# 1. Fork e clone
git clone https://github.com/<seu-usuario>/leadmaps.git
cd leadmaps

# 2. Instalar dependências
npm install

# 3. Configurar ambiente local
cp .env.example .env
# Preencha o .env com suas próprias credenciais de desenvolvimento

# 4. Criar branch descritiva
git checkout -b feat/nome-da-feature
# ou
git checkout -b fix/descricao-do-bug

# 5. Desenvolver com TDD
#    - Extraia lógica de negócio em função pura em src/lib/
#    - Escreva os testes ANTES de integrar no hook
#    - npm run test:run deve ficar verde

# 6. Validar antes do commit
npm run test:run
npx tsc --noEmit
npm run lint

# 7. Commitar seguindo Conventional Commits (ver docs/commits.md)
git commit -m "feat(lead-finder): adicionar filtro por avaliação mínima"

# 8. Push e abrir PR
git push origin feat/nome-da-feature
```

---

## Padrões de código

| Aspecto | Regra |
|---|---|
| Idioma | Código, comentários e UI em **português** |
| Tipagem | Sem `any` — usar `unknown` com narrowing |
| Estilo | Classes Tailwind via `cn()` — sem CSS inline |
| Componentes | Uma responsabilidade por arquivo; props tipadas com interface |
| Hooks | Um hook por responsabilidade; retorno como objeto nomeado |
| Secrets | **Nunca** no código-fonte — usar `.env` local ou Supabase Secrets |

Ver [`docs/boas-praticas.md`](docs/boas-praticas.md) para o guia completo.

---

## Convenção de commits

```
<type>(scope): <short description in English, imperative present>
```

Tipos: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `test`, `perf`

Exemplos:
```
feat(lead-finder): add minimum rating filter
fix(sheets): handle empty row in spreadsheet parser
test(auth): add JWT generation unit tests
```

> Comentários no código e textos visíveis ao usuário permanecem em **português**.

Ver [`docs/commits.md`](docs/commits.md) para referência completa.

---

## Testes

O projeto adota **TDD para lógica de negócio**:

1. Extraia a lógica como função pura em `src/lib/`
2. Escreva os testes em `src/tests/<nome>.test.ts`
3. `npm run test:run` deve passar antes de qualquer commit
4. Importe a função no hook/componente

```bash
npm run test         # modo watch (desenvolvimento)
npm run test:run     # run único (pré-commit)
npm run test:ui      # interface visual do Vitest
```

### Cobertura esperada

| Camada | Expectativa |
|---|---|
| `src/lib/` — funções puras | **Obrigatório** |
| Hooks com lógica complexa | Recomendado (usar `vi.mock` para fetch) |
| Componentes simples de UI | Opcional |
| Componentes shadcn/ui | Não testar (já testados pela biblioteca) |

---

## Checklist do PR

- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run test:run` — todos os testes passando
- [ ] `npm run lint` sem erros
- [ ] Nenhuma chave de API, token ou URL de instância privada no código
- [ ] Nenhum `console.log` de debug esquecido
- [ ] Strings visíveis ao usuário em português
- [ ] Dados pessoais tratados conforme [`PRIVACY.md`](PRIVACY.md)
- [ ] PR descreve o *porquê* da mudança (não apenas o quê)

---

## Reportar bugs

Use o template de issue "Bug Report" no GitHub. Para falhas de segurança, siga o processo em [`SECURITY.md`](SECURITY.md) — **não abra issue pública**.

---

## Dúvidas

Abra uma Discussion no GitHub ou uma issue com o label `pergunta`.
