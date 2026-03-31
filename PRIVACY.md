# Privacidade e Proteção de Dados

Este documento descreve como o LeadMaps trata dados pessoais, em conformidade com a **Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018)** e princípios da **ISO/IEC 27001**.

---

## Dados tratados

O LeadMaps busca e exibe dados de **estabelecimentos comerciais** obtidos de fontes públicas (Google Places API, OpenStreetMap). Os dados podem incluir:

| Dado | Tipo | Fonte |
|---|---|---|
| Nome do estabelecimento | Dado de pessoa jurídica / dado pessoal de MEI | Google Places API |
| Endereço | Dado público | Google Places API / OSM |
| Telefone de contato | Dado pessoal (quando titular é PF/MEI) | Google Places API |
| Site | Dado público | Google Places API |
| Redes sociais | Dado público | Scraping do site pelo n8n |

---

## Base legal (LGPD, art. 7º)

A coleta e uso dos dados se enquadra em:

- **Legítimo interesse** (art. 7º, IX): prospecção comercial B2B com dados disponibilizados publicamente pelos próprios titulares para fins comerciais
- **Exercício regular de direitos**: uso restrito à finalidade declarada de prospecção

---

## Princípios aplicados (LGPD, art. 6º)

| Princípio | Como aplicamos |
|---|---|
| **Finalidade** | Dados usados exclusivamente para prospecção comercial |
| **Necessidade** | Coletamos apenas os campos necessários para a finalidade |
| **Livre acesso** | Operador tem acesso aos dados na planilha para exclusão manual |
| **Segurança** | Chaves de API ficam em servidores (Supabase Secrets), nunca expostas no frontend |
| **Transparência** | Este documento descreve o tratamento |

---

## Armazenamento

- Os dados **não são persistidos pelo frontend** — a SPA apenas exibe o que a planilha contém
- O armazenamento ocorre exclusivamente na **planilha Google Sheets** controlada pelo operador
- O operador é responsável por definir o período de retenção e por responder a solicitações de titulares (exclusão, retificação)

---

## Transferência internacional

O uso do Google Places API e Google Sheets implica transferência de dados para servidores nos EUA (Google LLC). O Google é certificado por frameworks de adequação. O Supabase permite escolha de região; preferir regiões brasileiras ou europeias quando disponível.

---

## Direitos dos titulares (LGPD, art. 18)

O titular cujos dados estejam na planilha pode solicitar ao **operador** (quem usa esta ferramenta):
- Confirmação da existência de tratamento
- Acesso, correção ou exclusão dos dados
- Portabilidade

O operador deve atender essas solicitações dentro dos prazos legais.

---

## Responsabilidades do operador

Ao usar o LeadMaps, o operador se compromete a:

1. Usar os dados apenas para prospecção comercial lícita — sem spam, assédio ou uso fraudulento
2. Aplicar medidas de segurança adequadas na planilha Google Sheets (restrição de acesso, 2FA na conta Google)
3. Excluir dados de titulares que solicitarem opt-out
4. Não compartilhar os dados com terceiros sem base legal

---

## Contato

Para dúvidas sobre privacidade neste projeto aberto, abra uma issue com o label `privacidade`.
Para questões relacionadas a uma **implantação específica** (dados reais de leads), entre em contato com o operador daquela instância.

---

## Referências normativas

- [LGPD — Lei nº 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [ANPD — Autoridade Nacional de Proteção de Dados](https://www.gov.br/anpd)
- [ISO/IEC 27001:2022 — Segurança da Informação](https://www.iso.org/standard/27001)
- [OWASP Top 10 Privacy Risks](https://owasp.org/www-project-top-10-privacy-risks/)
