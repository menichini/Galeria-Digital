# NON-FUNCTIONAL-REQUIREMENTS.md

## RNF-001 – Mobile‑First
- **Descrição**: A aplicação deve ser responsiva e otimizada para dispositivos móveis, com layout adaptativo que prioriza telas menores.
- **Critério de Aceite**: Em smartphones (iOS/Android) a página inicial carrega em ≤2 s (LCP) e todos os elementos são navegáveis sem scroll horizontal.

## RNF-002 – Facilidade de Uso
- **Descrição**: O fluxo deve exigir no máximo 3 interações (toques/clicks) para capturar, aplicar moldura e confirmar.
- **Critério de Aceite**: Usuário pode completar o processo em ≤30 s em rede 4G.

## RNF-003 – Performance de Imagem
- **Descrição**: Imagens devem ser comprimidas client‑side para ≤5 MB antes do upload.
- **Critério de Aceite**: Upload de imagem ≤5 MB completa em ≤3 s em rede 4G.

## RNF-004 – Validação Pré‑Evento
- **Descrição**: Executar validações de configuração e integridade dos serviços antes do início do evento (ex.: checagem de conexão ao storage, disponibilidade do backend).
- **Critério de Aceite**: Todas as verificações concluídas com sucesso antes de mudar o estado para ACTIVE.

## RNF-022 – Disponibilidade Durante‑Evento
- **Descrição**: Serviço deve estar disponível 99,5 % do tempo durante o período ativo do evento.
- **Critério de Aceite**: Monitoramento de uptime reportado <0,5 % downtime durante o estado ACTIVE.

## RNF-005 – Segurança – RLS
- **Descrição**: Aplicar Row‑Level Security no Supabase para que apenas administradores possam ler/modificar fotos.
- **Critério de Aceite**: Testes de tentativa de acesso de usuário não‑admin retornam 403.

## RNF-006 – Controle de Storage
- **Descrição**: Limitar o total de armazenamento por evento a 10 GB.
- **Critério de Aceite**: Sistema impede uploads quando limite atingido e exibe mensagem.

## RNF-007 – Validação de Uploads
- **Descrição**: Aceitar apenas arquivos JPEG/PNG com MIME `image/jpeg` ou `image/png`.
- **Critério de Aceite**: Upload de outro tipo retorna erro 415.

## RNF-008 – Limite de Tamanho de Arquivo
- **Descrição**: Tamanho máximo de upload de 5 MB.
- **Critério de Aceite**: Upload acima do limite retorna erro 413.

## RNF-009 – Tratamento de EXIF
- **Descrição**: Remover metadados EXIF (incluindo geolocalização) antes do upload.
- **Critério de Aceite**: Imagem armazenada não contém campos EXIF.

## RNF-010 – Rate Limiting
- **Descrição**: Limitar a 10 uploads por IP por minuto.
- **Critério de Aceite**: 11ª tentativa em 1 min retorna 429.

## RNF-011 – Proteção contra Abuso
- **Descrição**: Detectar e bloquear uploads de imagens que contenham conteúdo inadequado usando moderação manual futura.
- **Critério de Aceite**: Flag de moderação disponível para admin.

## RNF-012 – Compatibilidade Safari/iPhone
- **Descrição**: Funcionar plenamente em Safari iOS 14+.
- **Critério de Aceite**: Testes manuais confirmam fluxo sem erros.

## RNF-013 – Compatibilidade Chrome/Android
- **Descrição**: Funcionar plenamente em Chrome Android 10+.
- **Critério de Aceite**: Testes manuais confirmam fluxo sem erros.

## RNF-014 – Acessibilidade
- **Descrição**: Atender ao menos nível AA das WCAG 2.1 (texto alternativo, contraste, navegação por teclado).
- **Critério de Aceite**: Relatório de auditoria de acessibilidade aprovado.

## RNF-015 – Observabilidade
- **Descrição**: Log de eventos de upload e erros enviado ao Supabase Analytics.
- **Critério de Aceite**: Dashboard mostra métricas de sucesso/erro.

## RNF-016 – Manutenibilidade – TypeScript strict
- **Descrição**: Código (futuro) deve usar `strict` do TypeScript.
- **Critério de Aceite**: Configuração `tsconfig.json` com `strict: true`.

## RNF-017 – Configurabilidade
- **Descrição**: Todas as strings (título, textos, URLs) devem estar em `event-config.json`.
- **Critério de Aceite**: Alterar config muda conteúdo sem redeploy.

## RNF-018 – Custo Operacional
- **Descrição**: Estimar custo máximo mensal de US$5 para armazenamento e banda.
- **Critério de Aceite**: Projeção baseada em uso esperado.

## RNF-019 – Backup e Recuperação
- **Descrição**: Backups diários das fotos armazenadas.
- **Critério de Aceite**: Backup realizado e restaurável via Supabase.

## RNF-020 – Tratamento de Falha de Conexão
- **Descrição**: Exibir mensagem de retry quando upload falhar por perda de conexão.
- **Critério de Aceite**: Botão "Retry" reenviando a mesma foto.

## RNF-021 – Feedback Visual
- **Descrição**: Mostrar barra de progresso durante upload.
- **Critério de Aceite**: Progresso visual atinge 100 % ao concluir.

---
*Este documento lista requisitos não‑funcionais verificáveis para o MVP.*
