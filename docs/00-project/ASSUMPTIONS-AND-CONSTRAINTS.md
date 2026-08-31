# ASSUMPTIONS-AND-CONSTRAINTS.md

## Assumptions
- O evento será único (aniversário do Martin) e não haverá múltiplos eventos simultâneos.
- Todos os convidados terão acesso a um smartphone com navegador moderno e câmera.
- O QR Code será impresso ou compartilhado digitalmente com antecedência.
- Não haverá necessidade de login; a identidade do convidado não será rastreada.
- O armazenamento de imagens será provisionado no Supabase Storage nas fases posteriores.
- O domínio `meninequine.cloud` já está registrado e será usado para o sub‑domínio do evento.
- O projeto será hospedado em Vercel (configurado nas fases posteriores).

## Constraints
- **Sem código funcional nesta fase** – apenas documentação.
- **Mobile‑first** – design responsivo, foco em telas pequenas.
- **Privacidade** – nenhuma coleta de dados pessoais, remoção de EXIF, RLS para administradores.
- **Tecnologias definidas** – Next.js, React, TypeScript, Supabase, Vercel.
- **Não hard‑code** de nomes, datas ou cores; tudo será configurável via um arquivo de configuração (`event-config.json`).
- **Escopo limitado** – funcionalidades como likes, comentários, gamificação, IA, multi‑tenant, cobrança estão fora do escopo.
- **Performance** – LCP < 2 s, tamanho máximo de upload 5 MB, compressão automática.
- **Acessibilidade** – conformidade mínima WCAG AA para navegação mobile.

---
*Este documento captura as premissas e restrições consideradas para o projeto.*
