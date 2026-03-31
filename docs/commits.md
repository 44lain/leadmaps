# Convenção de Commits

> Arquivo criado com base no padrão Conventional Commits.
> Se você possui um arquivo de convenção próprio, substitua o conteúdo aqui.

---

## Formato

```
<type>(optional scope): <short description in English, imperative present>

[optional body — pode ser em português para contexto interno]

[optional footer]
```

> **Idioma:** mensagens de commit em **inglês**. Comentários no código e textos visíveis ao usuário permanecem em **português**.

---

## Tipos

| Tipo | Quando usar |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `refactor` | Refatoração sem mudança de comportamento |
| `style` | Formatação, espaçamento (sem mudança de lógica) |
| `docs` | Mudanças em documentação |
| `chore` | Tarefas de manutenção (deps, configs, scripts) |
| `perf` | Melhoria de performance |
| `test` | Adição ou correção de testes |
| `revert` | Reversão de commit anterior |

---

## Escopos sugeridos

| Escopo | Área |
|---|---|
| `lead-finder` | Componentes e hooks do fluxo de busca |
| `sheets` | Integração com Google Sheets / Supabase |
| `ui` | Componentes de interface genéricos |
| `n8n` | Configuração ou ajuste relacionado à automação |
| `supabase` | Edge Functions, tipos, configuração |
| `config` | vite, tsconfig, eslint, tailwind |
| `docs` | Arquivos de documentação |

---

## Exemplos

```
feat(lead-finder): add minimum rating filter

fix(sheets): handle empty row in spreadsheet parser

refactor(lead-finder): extract lead parsing logic into pure function

chore(config): remove lovable-tagger dependency

docs: add system architecture document

test(auth): add password validation unit tests
```

---

## Regras

- Descrição em **inglês**, no **imperativo presente**: "add", "fix", "remove" — não "added", "fixing"
- Máximo de **72 caracteres** na linha do título
- Não terminar o título com ponto final
- Usar o corpo do commit para explicar **o porquê** da mudança (pode ser em português)
- Breaking changes: adicionar `!` após o tipo/escopo e descrever no rodapé com `BREAKING CHANGE:`

```
feat(api)!: rename address field to location in n8n payload

BREAKING CHANGE: 'address' field renamed to 'location' in LeadSearchPayload
```
