# Política de Segurança

## Reportar uma Vulnerabilidade

**Não abra uma issue pública** para reportar falhas de segurança.

Envie um e-mail descrevendo o problema para o mantenedor do repositório. Inclua:
- Descrição do impacto potencial
- Passos para reproduzir
- Versão afetada (hash do commit ou tag)

O mantenedor responderá em até **72 horas** e publicará um patch assim que o problema for corrigido, creditando o relato (com sua permissão).

---

## Versões suportadas

| Versão | Suporte |
|---|---|
| `main` (HEAD) | Sim — patches aplicados imediatamente |
| Tags anteriores | Não — atualizar para o HEAD |

---

## Modelo de ameaças e controles aplicados

### Gerenciamento de Secrets (OWASP A02 — Falha Criptográfica)

| Dado sensível | Onde fica | Nunca deve ir para |
|---|---|---|
| `GOOGLE_SHEETS_API_KEY` | Supabase Secrets (server-side, Deno) | Código-fonte, `.env` commitado, bundle frontend |
| `SPREADSHEET_ID` | Supabase Secrets | Código-fonte |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env` local (anon key — pública por design) | — |
| Tokens n8n / Google Places API | Configuração interna do n8n | Código-fonte do frontend |

**Regra de ouro:** Se começa com `VITE_`, é exposto no bundle. Use apenas para valores públicos por design.

### Injeção (OWASP A03)

- Entradas do formulário (tipo de estabelecimento, localização) são enviadas como JSON para o webhook n8n — o n8n é responsável pela sanitização antes de chamar APIs externas
- A Edge Function não executa queries SQL — lê uma planilha via API oficial do Google
- Inputs no frontend são controlados (React controlled components + React Hook Form)

### Controle de Acesso (OWASP A01)

- **Estado atual:** sem autenticação — acesso irrestrito por design (uso interno)
- **Planejado:** Supabase Auth com JWT + Row Level Security (RLS)
- A Edge Function só é acessível via SDK Supabase autenticado com a anon key do projeto

### Exposição de Dados Sensíveis (OWASP A02 / LGPD)

- Dados de leads (nome, telefone, endereço, redes sociais) **não são persistidos** pelo frontend
- O armazenamento ocorre exclusivamente na planilha Google Sheets, controlada pelo operador
- Ver [`PRIVACY.md`](PRIVACY.md) para detalhes sobre tratamento de dados pessoais

### Configuração Insegura (OWASP A05)

- CORS da Edge Function: atualmente `Access-Control-Allow-Origin: *`
  - Aceitável enquanto a Edge Function só retorna dados públicos da planilha
  - **Deve ser restringido** ao domínio de produção ao implementar autenticação
- n8n deve ter `CORS_ORIGIN` configurado para o domínio do frontend em produção

### Dependências (OWASP A06)

```bash
# Verificar vulnerabilidades conhecidas
npm audit

# Atualizar dependências
npm update
```

Recomendado executar `npm audit` antes de cada release.

---

## Checklist de segurança para contribuições

Antes de abrir um PR, verifique:

- [ ] Nenhuma chave de API, token ou secret no código ou nos commits
- [ ] Nenhuma URL de instância privada (n8n cloud, Supabase project ID) nos arquivos rastreados
- [ ] `npm audit` sem vulnerabilidades críticas ou altas
- [ ] Entradas do usuário não são concatenadas em strings de query ou URLs sem sanitização
- [ ] Dados pessoais (telefone, e-mail, endereço) tratados conforme [`PRIVACY.md`](PRIVACY.md)
- [ ] `console.log` com dados de usuário removidos antes do merge

---

## Roadmap de segurança

### Autenticação (próxima implementação)

A implementação planejada usará:
- **Supabase Auth** (servidor) — gerenciamento de sessão via JWT
- **Argon2id** para hash de senhas (padrão recomendado por OWASP e pela RFC 9106)
- **JWT** com expiração curta (≤ 1 hora) + refresh token rotativo
- **Rate limiting** no endpoint de login (via Supabase ou n8n)

Testes automatizados da camada de autenticação ficarão em `src/tests/auth/`.

### Row Level Security (Supabase)

Ao adicionar autenticação, habilitar RLS em todas as tabelas Supabase para que cada usuário só acesse seus próprios dados.
