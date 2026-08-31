# TECHNICAL-DECISIONS-PENDING.md

## Decisões Técnicas Pendentes
| ID | Decisão | Impacto | Severidade | Opções | Recomendação |
|----|---------|---------|------------|--------|--------------|
| TD-001 | Nomeação do bucket de storage no Supabase | Definir caminho de URL das fotos | **CRITICAL** | - `event-{slug}` (ex.: `event-fazendinha-martin`)<br>- `global-gallery` (multi‑event) | **event‑{slug}** – garante isolamento por evento e facilita limpeza de dados.
| TD-002 | Algoritmo de compressão de imagens client‑side | Qualidade vs. tamanho do upload | **HIGH** | - `browser-image-compression` (quality 0.8)<br>- `canvas.toBlob` com qualidade ajustável | **browser-image-compression** por simplicidade e controle de qualidade.
| TD-003 | Estratégia de Rate‑Limiting | Prevenir abuso de uploads | **HIGH** | - Supabase Edge Functions (RLS + rate limiter)<br>- Cloudflare Workers<br>- Vercel middleware | **Supabase Edge Functions** (já na stack) para centralizar lógica.
| TD-004 | Formato de configuração do evento | Flexibilidade vs. complexidade | **MEDIUM** | - JSON (`event-config.json`)<br>- YAML (`event-config.yml`)<br>- Typescript constants | **JSON** – fácil de consumir no frontend e backend.
| TD-005 | Estratégia de backup de fotos | Recuperação de dados | **MEDIUM** | - Supabase scheduled backups (daily)<br>- Exportação manual para bucket externo | **Supabase scheduled backups** (nativo) com retenção de 30 dias.
| TD-006 | Cache de imagens na CDN | Performance de carregamento da galeria | **LOW** | - Vercel Edge Cache<br>- Cloudflare CDN | **Vercel Edge Cache** já integrado ao deploy.

---
*Estas decisões serão revisadas nas fases F1‑F2.*
