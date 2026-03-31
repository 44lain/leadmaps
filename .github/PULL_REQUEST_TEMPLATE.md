## Descrição

<!-- Descreva o *porquê* desta mudança — não apenas o quê (o diff já mostra o quê) -->

## Tipo de mudança

- [ ] `feat` — nova funcionalidade
- [ ] `fix` — correção de bug
- [ ] `refactor` — refatoração sem mudança de comportamento
- [ ] `docs` — documentação
- [ ] `chore` — manutenção (deps, configs)
- [ ] `test` — testes

## Checklist de qualidade

- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run test:run` — todos os testes passando
- [ ] `npm run lint` sem erros

## Checklist de segurança

- [ ] Nenhuma chave de API, token, secret ou URL de instância privada no código
- [ ] Inputs do usuário sanitizados antes de uso em APIs externas
- [ ] Dados pessoais tratados conforme [`PRIVACY.md`](../PRIVACY.md)
- [ ] Nenhum `console.log` com dados de usuário esquecido
- [ ] `npm audit` sem vulnerabilidades críticas ou altas introduzidas

## Testes adicionados / alterados

<!-- Descreva quais testes cobrem esta mudança, ou justifique a ausência -->
