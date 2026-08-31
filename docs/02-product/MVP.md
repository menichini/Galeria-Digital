# MVP.md

## Visão Geral do MVP
O **Produto Mínimo Viável** (MVP) entrega a experiência central da festa:
1. **Acesso via QR Code** – página pública sem login.
2. **Captura/seleção de foto** – usar câmera ou escolher da galeria.
3. **Aplicação de moldura temática** – escolher entre as molduras da fazendinha.
4. **Preview e confirmação** – visualizar foto final com moldura.
5. **Upload seguro** – enviar a imagem para armazenamento.
6. **Mensagem de sucesso com download/compartilhamento**.
7. **Galeria pública** – exibir todas as fotos aprovadas.

## Funcionalidades Incluídas
- UI mobile‑first, responsiva.
- Processamento de imagem via **Canvas API** (redimensionamento, aplicação de moldura, remoção de EXIF).
- Upload limitado a 5 MB, apenas JPEG/PNG.
- Rate‑Limiting (10 uploads/IP/min).
- Mensagens de erro amigáveis.
- Configuração do evento via `event-config.json` (título, descrição, URL).

## Exclusões do MVP
- Likes, comentários, redes sociais internas.
- Gamificação, IA, reconhecimento facial.
- Multi‑tenant, cobrança ou planos.
- Área administrativa completa (apenas documentada).
- Integração com analytics avançado.

---
*Este documento define o escopo do MVP.*
