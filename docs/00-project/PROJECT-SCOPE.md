# PROJECT-SCOPE.md

## Visão Geral
Este projeto entrega uma **galeria digital** para o **aniversário de 2 anos do Martin**, com temática de fazendinha. A solução será acessível via **QR Code** em dispositivos móveis, sem necessidade de login ou aplicação nativa.

## Escopo Funcional
- Página pública personalizada para o evento (URL única).
- Captura de foto usando câmera do dispositivo ou escolha de foto existente.
- Aplicação de molduras temáticas da fazendinha.
- Visualização de preview, edição (refazer) e confirmação.
- Upload da foto finalizada para armazenamento.
- Exibição de mensagem de sucesso com opções de **download** e **compartilhamento** (link ou redes sociais).
- Visualização de uma galeria pública contendo todas as fotos aprovadas.
- Área administrativa (documentada, porém **não implementada** nesta fase) para gerenciar fotos, molduras e estado do evento.

## Escopo Não‑Funcional (Fase MVP)
- Mobile‑first, responsivo, suporte a Safari/iOS e Chrome/Android.
- Performance adequada para carga rápida (LCP < 2 s na primeira visualização).
- Processamento de imagens usando **Canvas API** no navegador.
- Armazenamento seguro via Supabase Storage (configurado nas fases posteriores).
- Privacidade: remoção de metadados EXIF, limites de tamanho de upload (máx 5 MB).
- Segurança: políticas de Rate‑Limiting e RLS (apenas administradores). 

## Exclusões (fora do escopo da fase F0.0)
- Likes, comentários públicos, redes sociais internas.
- Integração com IA, reconhecimento facial.
- Multi‑tenant, cobrança ou planos de assinatura.
- Funcionalidades de gamificação ou vídeo.

---
*Este documento define o escopo de entrega para o MVP.*
