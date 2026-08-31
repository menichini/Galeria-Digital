# TRACEABILITY-MATRIX.md

| Requisito (RF) | Regra de Negócio (RN) | Fase Prevista | Critério de Aceite | Teste Planejado |
|----------------|-----------------------|---------------|--------------------|-----------------|
| RF-001 | RN-001 | F3 | Página carrega <2s em dispositivos móveis | Teste de performance em iPhone/Android |
| RF-002 | RN-004 | F4 | Foto capturada tem resolução ≥720p e ≤5 MB | Verificação de dimensões e tamanho de arquivo |
| RF-003 | RN-004 | F4 | Foto selecionada exibida no preview | Teste de carregamento de arquivos |
| RF-004 | RN-003 | F5 | Moldura aplicada corretamente ao preview | Comparação visual automática |
| RF-005 | – | F5 | Botão Refazer retorna ao fluxo de captura | Teste de navegação de UI |
| RF-006 | – | F6 | Upload concluído em ≤3 s, HTTP 200 | Teste de tempo de resposta e status code |
| RF-007 | – | F9 | Mensagem de sucesso exibida após publicação | Teste de exibição da mensagem de sucesso |
| RF-008 | – | F7 | Galeria carrega em <2 s, thumbnails responsivas | Teste de carregamento e responsividade |
| RF-009 | – | F7 | Visualização ampliada sem distorção, zoom/pan funcional | Teste de visualização em tela cheia |
| RF-010 | RN-002 | F8 | Admin aprova, oculta ou exclui foto com sucesso | Teste de permissões e ações no painel admin |
| RF-011 | RN-001 | F8 | Configurações do evento persistem após atualização | Teste de persistência de configuração |
| RF-012 | – | F4‑F6 | Mensagens de erro claras e opção Retry ao falhar | Teste de tratamento de falhas e UI feedback |
| RF-016 | RN-001 | F1/F3 | Alteração de estado reflete comportamento correto na UI e APIs | Teste de mudança de estado e comportamento público |
| RF-013 | RN-008 | F3 | Página inicial personalizada exibida corretamente | Teste de UI da página inicial |
| RF-014 | RN-004 | F3 | Acesso público sem login permitido | Teste de navegação sem autenticação |
| RF-015 | RN-003 | F5 | Foto compositada com moldura apresentada | Teste de preview da imagem composta |
| RF-017 | RN-002 | F8 | Foto submetida pode ser aprovada/rejeitada | Teste de fluxo de moderação |
| RF-018 | RN-001 | F8 | Galeria pode ser ativada/desativada independentemente do estado | Teste de controle de visibilidade da galeria |
| RF-019 | – | F9 | Download da fotografia disponível | Teste de download da imagem |
| RF-020 | – | F9 | Compartilhamento da fotografia via Web Share API ou fallback | Teste de compartilhamento nas plataformas |
---
*Cada requisito funcional está rastreado a uma regra de negócio, fase, critério de aceitação e teste planejado.*
