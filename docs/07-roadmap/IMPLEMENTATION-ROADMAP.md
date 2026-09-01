# IMPLEMENTATION-ROADMAP.md

Este documento consolida o cronograma das fases mapeadas no projeto, partindo do encerramento da fase de documentação (F0.0). O roadmap segue uma abordagem iterativa e incremental.

## Etapa 1: Preparação e Fundação (Semanas 1-2)
- **F0 – Fundação Técnica:** 
  - Inicialização do Next.js (ou Vite).
  - Configuração de Lint, Prettier, Tailwind CSS (se aplicável), e estrutura de pastas (`src/`).
  - Configuração do repositório no GitHub, incluindo pipelines de CI básicos e Vercel.
- **F1 – Infra-estrutura (Supabase):**
  - Setup do projeto Supabase (Banco, Auth, Storage).
  - Criação das tabelas SQL, Buckets e regras de segurança RLS iniciais.

## Etapa 2: Base Visual e MVP de Captura (Semanas 3-4)
- **F2 – Design System & Identidade Visual:**
  - Implementação de variáveis globais (cores, tipografia, espaçamentos) focados no tema "Fazendinha".
  - Componentes base: Botões grandes, Loading states, Cards.
- **F3 & F4 – Frontend Básico & Câmera:**
  - Página de recepção/início e estrutura do App.
  - Implementação da lógica de captura via web (câmera e upload manual).

## Etapa 3: Lógica Core e Storage (Semanas 5-6)
- **F5 – Motor de Molduras:**
  - Lógica do Canvas para sobreposição e "merge" de foto com o template PNG transparente.
  - Geração da imagem final tratada, compactada e sem metadados.
- **F6 – Upload & Backend Connection:**
  - Integração do front-end ao Supabase Storage.
  - Envio do arquivo gerado, registro no banco de dados, e tratamento visual de loaders e erros no cliente.

## Etapa 4: Exibição, Refino e Lançamento (Semanas 7-8)
- **F7 – Galeria e Compartilhamento:**
  - Grid público exibindo todas as fotos em tempo real (ou com refresh).
  - Implementação da tela de Sucesso (Download e Share).
- **F8 a F12 – Moderação, Testes Manuais e Deploy Final:**
  - Criação da área admin (simples) para deletar e moderar envios indesejados.
  - Hardening (auditoria de regras do bucket/RLS e restrição de domínios via CORS).
  - Testes pesados no iOS, Android e In-App Browsers.
  - DNS, configuração do domínio final e geração do QR Code impresso para a festa.
