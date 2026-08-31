# Fazendinha do Martin — Galeria Digital

## Objetivo
Criar uma galeria digital mobile‑first para o aniversário de 2 anos do Martin, acessível via QR Code sem necessidade de login ou instalação de aplicativo.

## Estrutura da documentação
```
README.md                ← este documento
PROJECT_STATUS.md        ← status atual do projeto

docs/
├── 00-project/
│   ├── PROJECT-VISION.md
│   ├── PROJECT-SCOPE.md
│   ├── GLOSSARY.md
│   └── ASSUMPTIONS-AND-CONSTRAINTS.md
├── 01-requirements/
│   ├── FUNCTIONAL-REQUIREMENTS.md
│   ├── NON-FUNCTIONAL-REQUIREMENTS.md
│   ├── BUSINESS-RULES.md
│   └── TRACEABILITY-MATRIX.md
├── 02-product/
│   ├── MVP.md
│   ├── FUTURE-FEATURES.md
│   └── USER-JOURNEYS.md
├── 03-ux/
│   ├── UX-PRINCIPLES.md
│   ├── USER-FLOWS.md
│   └── MOBILE-FIRST.md
├── 04-architecture/
│   ├── ARCHITECTURE-VISION.md
│   ├── CONCEPTUAL-DATA-MODEL.md
│   └── TECHNICAL-DECISIONS-PENDING.md
├── 05-security/
│   ├── SECURITY-REQUIREMENTS.md
│   └── PRIVACY-REQUIREMENTS.md
├── 06-quality/
│   ├── ACCEPTANCE-CRITERIA.md
│   └── TEST-STRATEGY.md
└── 07-roadmap/
    └── IMPLEMENTATION-ROADMAP.md
```

## Fases do projeto
| Fase | Descrição | Status |
|------|-----------|--------|
| **F0.0** – Descoberta & Documentação | Definição de visão, escopo, requisitos, arquitetura e roadmap. | **EM PROGRESSO** |
| F0 – Fundação Técnica | Configuração inicial de repositório, CI, etc. |
| F1 – Infra‑estrutura (Supabase, RLS, Storage) |
| F2 – Design System & identidade visual |
| F3 – Página pública & QR Code |
| F4 – Captura/Seleção de fotos |
| F5 – Motor de molduras (Canvas) |
| F6 – Upload & Storage |
| F7 – Galeria pública |
| F8 – Administração & moderação |
| F9 – Download & compartilhamento |
| F10 – Hardening de segurança |
| F11 – Testes E2E em dispositivos |
| F12 – Deploy (Vercel, DNS) |

## Como navegar
- Cada diretório dentro de `docs/` agrupa um tipo de documento.
- Os arquivos são auto‑explicativos e referenciam IDs de requisitos, regras de negócio e critérios de aceitação.
- Consulte **PROJECT_STATUS.md** para o status corrente.

## Situação atual
Esta documentação está na fase **F0.0 – Documentação**. Nenhum código funcional foi criado.

---
*Este README foi gerado a partir do plano aprovado.*
