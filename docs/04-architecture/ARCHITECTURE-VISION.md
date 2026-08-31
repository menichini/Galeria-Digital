# ARCHITECTURE-VISION.md

## Visão de Arquitetura
A solução será um **site estático/micro‑frontend** hospedado no Vercel, desenvolvido com **Next.js** (React + SSR/SSG) e **TypeScript**. O frontend será totalmente client‑side para captura e manipulação de imagens usando a **Canvas API**.

### Camadas
1. **Camada de Apresentação (Frontend)**
   - Next.js páginas estáticas e rotas dinâmicas para eventos.
   - UI mobile‑first, responsiva, sem dependência de framework UI externo.
2. **Camada de Serviços (Supabase)**
   - **Supabase Auth** para administradores (login protegido).
   - **Supabase Storage** para armazenar fotos processadas.
   - **PostgreSQL** para metadados (Evento, Foto, Moldura, Usuário Admin).
   - **Row‑Level Security (RLS)** para garantir que apenas administradores acessem dados sensíveis.
3. **Camada de Infraestrutura**
   - Deploy automático no **Vercel** a partir do repositório Git.
   - Domínio/sub‑domínio configurado via DNS (fase F12).

### Comunicação
- O frontend se comunica com Supabase via **REST/GraphQL** (client SDK). Todas as chamadas são autenticadas por token JWT (admin) ou anônimas (convidado) com regras RLS.
- A **Canvas API** processa a foto no navegador antes de enviá‑la ao storage, garantindo que metadados EXIF sejam removidos.

### Principais Decisões Técnicas (pendentes)
- Nomeação de buckets de storage (pelo evento).
- Algoritmo de compressão (ex: `browser-image-compression`).
- Estratégia de rate‑limiting (Supabase edge functions vs. Cloudflare).
- Formato de configuração do evento (`event-config.json`).

---
*Este documento descreve a visão geral da arquitetura planejada.*
