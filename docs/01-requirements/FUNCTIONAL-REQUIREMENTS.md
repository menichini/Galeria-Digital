# FUNCTIONAL-REQUIREMENTS.md

## RF-001 – Acesso via QR Code
- **Nome**: Acesso ao evento por QR Code
- **Descrição**: O convidado escaneia um QR Code que redireciona para a página pública do evento.
- **Ator**: Convidado
- **Pré‑condição**: QR Code válido e ativo.
- **Comportamento esperado**: O navegador abre a URL do evento sem solicitar login.
- **Prioridade**: Alta
- **Fase prevista**: F3 — Página Pública e QR Code
- **Critério de aceite**: Ao escanear o QR Code, a página carrega em <2 s em dispositivos iOS/Android.

## RF-002 – Captura de foto
- **Nome**: Captura de foto usando câmera do dispositivo
- **Descrição**: O convidado pode tirar uma foto usando a câmera integrada.
- **Ator**: Convidado
- **Pré‑condição**: Permissão de câmera concedida.
- **Comportamento esperado**: A foto capturada aparece no preview.
- **Prioridade**: Alta
- **Fase prevista**: F4
- **Critério de aceite**: Foto capturada tem resolução mínima de 720p e tamanho ≤5 MB.

## RF-003 – Seleção de foto existente
- **Nome**: Selecionar foto da galeria do dispositivo
- **Descrição**: O convidado pode escolher uma foto já existente.
- **Ator**: Convidado
- **Pré‑condição**: Permissão de acesso a arquivos concedida.
- **Comportamento esperado**: Foto selecionada é carregada no preview.
- **Prioridade**: Alta
- **Fase prevista**: F4
- **Critério de aceite**: Foto carregada corretamente e exibida no preview.

## RF-004 – Seleção de moldura
- **Nome**: Escolher moldura temática
- **Descrição**: O convidado seleciona uma das molduras pré‑definidas da fazendinha.
- **Ator**: Convidado
- **Pré‑condição**: Lista de molduras carregada.
- **Comportamento esperado**: Moldura aplicada ao preview.
- **Prioridade**: Alta
- **Fase prevista**: F5
- **Critério de aceite**: Moldura exibida corretamente, alinhada e dimensionada.

## RF-005 – Preview e refazer
- **Nome**: Visualizar preview e refazer edição
- **Descrição**: O convidado pode visualizar o resultado final e optar por refazer a captura ou seleção.
- **Ator**: Convidado
- **Pré‑condição**: Foto e moldura selecionadas.
- **Comportamento esperado**: Tela de preview com botões "Confirmar" e "Refazer".
- **Prioridade**: Alta
- **Fase prevista**: F5
- **Critério de aceite**: Botão Refazer retorna ao fluxo de captura/seleção.

## RF-006 – Confirmação e upload
- **Nome**: Confirmar e enviar foto ao storage
- **Descrição**: Ao confirmar, a imagem final (foto + moldura) é enviada ao backend.
- **Ator**: Convidado
- **Pré‑condição**: Preview aprovado.
- **Comportamento esperado**: Upload bem‑sucedido, com resposta de sucesso.
- **Prioridade**: Alta
- **Fase prevista**: F6
- **Critério de aceite**: Upload concluído em ≤3 s, retorno HTTP 200.

## RF-007 – Mensagem de sucesso após publicação
- **Nome**: Exibir confirmação após publicação
- **Descrição**: Após upload bem‑sucedido, mostra mensagem de sucesso com navegação para opções adicionais (download, compartilhamento) tratadas pelos requisitos RF-019 e RF-020.
- **Ator**: Convidado
- **Pré‑condição**: Upload concluído.
- **Comportamento esperado**: Tela de sucesso exibida.
- **Prioridade**: Média
- **Fase prevista**: F9
- **Critério de aceite**: Mensagem exibida corretamente e botões direcionam às funcionalidades correspondentes.

## RF-008 – Visualizar galeria pública
- **Nome**: Exibir galeria de fotos aprovadas
- **Descrição**: Convidados podem navegar a galeria contendo todas as fotos aprovadas.
- **Ator**: Convidado
- **Pré‑condição**: Pelo menos uma foto aprovada.
- **Comportamento esperado**: Grid responsivo com thumbnails, clique abre visualização ampliada.
- **Prioridade**: Média
- **Fase prevista**: F7
- **Critério de aceite**: Galeria carrega em <2 s, funciona em dispositivos mobile.

## RF-009 – Visualização ampliada da foto
- **Nome**: Visualizar foto em tamanho completo
- **Descrição**: Ao clicar na thumbnail, a foto abre em tela cheia.
- **Ator**: Convidado
- **Pré‑condição**: Foto existente na galeria.
- **Comportamento esperado**: Tela de visualização com zoom/pan.
- **Prioridade**: Média
- **Fase prevista**: F7
- **Critério de aceite**: Foto exibida sem distorção, com controle de zoom.

## RF-010 – Administração de fotos (documentada)
- **Nome**: Gerenciar fotos no painel administrativo
- **Descrição**: Admin pode aprovar, ocultar ou excluir fotos.
- **Ator**: Administrador
- **Pré‑condição**: Autenticação de admin.
- **Comportamento esperado**: Lista de fotos com ações.
- **Prioridade**: Baixa (fase futura)
- **Fase prevista**: F8
- **Critério de aceite**: Admin consegue executar cada ação com sucesso.

## RF-011 – Configuração do evento (documentada)
- **Nome**: Configurar título, datas, ativar/desativar galeria
- **Descrição**: Admin define parâmetros do evento.
- **Ator**: Administrador
- **Pré‑condição**: Autenticação de admin.
- **Comportamento esperado**: Formulário de configuração salva.
- **Prioridade**: Baixa
- **Fase prevista**: F8
- **Critério de aceite**: Alterações refletidas na página pública.

## RF-012 – Tratamento de erros
- **Nome**: Exibir mensagens de erro amigáveis
- **Descrição**: Em falhas de captura, upload ou permissão, mostrar feedback claro.
- **Ator**: Convidado
- **Pré‑condição**: Erro detectado.
- **Comportamento esperado**: Mensagem de toast ou modal explicando o problema.
- **Prioridade**: Alta
- **Fase prevista**: F4‑F6
- **Critério de aceite**: Erro exibido com texto compreensível e opção de retry.


## RF-013 – Página inicial personalizada do evento
- **Nome**: Página inicial personalizada do evento
- **Descrição**: O convidado deverá visualizar uma página inicial personalizada para o evento, contendo identidade, título, aniversariante, idade, imagem/capa, mensagem, chamadas principais e ações disponíveis. O conteúdo vem da configuração do Event.
- **Ator**: Convidado
- **Pré‑condição**: Evento configurado com dados de página.
- **Comportamento esperado**: A página exibe as informações configuradas de forma responsiva.
- **Prioridade**: Alta
- **Fase prevista**: F3
- **Critério de aceite**: Página carrega <2 s e exibe todas as seções configuradas corretamente.

## RF-014 – Acesso do convidado sem login
- **Nome**: Acesso do convidado sem login
- **Descrição**: O convidado consegue acessar as funcionalidades públicas do evento sem criar usuário, cadastro, e‑mail ou autenticação. O acesso administrativo continua exigindo autenticação.
- **Ator**: Convidado
- **Pré‑condição**: QR Code válido.
- **Comportamento esperado**: Navegação pública disponível sem login.
- **Prioridade**: Alta
- **Fase prevista**: F3
- **Critério de aceite**: Usuário navega livremente nas telas públicas sem prompts de login.

## RF-015 – Composição foto + moldura
- **Nome**: Composição foto + moldura
- **Descrição**: O sistema compõe a fotografia escolhida/capturada com a moldura selecionada, gerando uma imagem final independente da original. Implementação técnica: Canvas API no navegador (não parte do requisito funcional).
- **Ator**: Convidado
- **Pré‑condição**: Foto e moldura selecionadas.
- **Comportamento esperado**: Imagem final criada e pronta para upload.
- **Prioridade**: Alta
- **Fase prevista**: F5
- **Critério de aceite**: Imagem composta visualizada no preview sem artefatos.

## RF-017 – Publicação e moderação da fotografia
- **Nome**: Publicação e moderação da fotografia
- **Descrição**: O administrador decide se uma fotografia recebida ficará disponível na galeria, seguindo regras de moderação.
- **Ator**: Administrador
- **Pré‑condição**: Foto submetida pendente de aprovação.
-**Comportamento esperado**: Administrador aprova ou rejeita foto; aprovação torna‑a visível na galeria.
- **Prioridade**: Média
- **Fase prevista**: F8
- **Critério de aceite**: Foto aprovada aparece na galeria pública; foto rejeitada não aparece.

## RF-018 – Ativação/desativação da galeria
- **Nome**: Ativação/desativação da galeria
- **Descrição**: Administrador pode controlar se a galeria pode ser visualizada pelos convidados independentemente da existência das fotografias, respeitando o estado operacional do evento.
- **Ator**: Administrador
- **Pré‑condição**: Evento ativo.
- **Comportamento esperado**: Galeria visível ou oculta de acordo com controle.
- **Prioridade**: Média
- **Fase prevista**: F8
- **Critério de aceite**: Troca de ativação reflete imediatamente na página pública.

## RF-019 – Download da fotografia
- **Nome**: Download da fotografia
- **Descrição**: O convidado pode baixar a fotografia final disponível para ele.
- **Ator**: Convidado
- **Pré‑condição**: Foto finalizada e disponível.
- **Comportamento esperado**: Botão “Download” salva imagem correta no dispositivo.
- **Prioridade**: Média
- **Fase prevista**: F9
- **Critério de aceite**: Arquivo baixado tem tamanho e qualidade idênticos à exibida.

## RF-020 – Compartilhamento da fotografia
- **Nome**: Compartilhamento da fotografia
- **Descrição**: O convidado pode acionar compartilhamento via Web Share API; se indisponível, oferece fallback adequado.
- **Ator**: Convidado
- **Pré‑condição**: Foto finalizada.
- **Comportamento esperado**: Aciona share dialog ou fallback.
- **Prioridade**: Média
- **Fase prevista**: F9
- **Critério de aceite**: Share executa com sucesso nos dispositivos suportados; fallback funciona nos demais.

## RF-016 – Gerenciamento de Estado do Evento
- **Nome**: Gerenciar estados do evento (DRAFT, ACTIVE, ENDED)
- **Descrição**: Modelar e persistir o status do evento; comportamento público varia conforme o estado.
- **Ator**: Sistema (admin para mudança de estado; convidados leem estado)
- **Pré‑condição**: Evento criado com estado inicial DRAFT.
- **Comportamento esperado**:
  - **Fase F1 (Modelagem/Persistência)**: Definir enum `EventStatus` com valores `DRAFT`, `ACTIVE`, `ENDED`; armazenar no banco.
  - **Fase F3 (Comportamento Público)**:
    - **DRAFT**: Página exibe mensagem "Evento ainda não começou"; nenhuma foto pode ser enviada.
    - **ACTIVE**: Funcionalidades de captura, upload e visualização habilitadas.
    - **ENDED**: Galeria permanece visível, mas novas submissões são desabilitadas; página indica que o evento terminou.
- **Prioridade**: Média
- **Fase prevista**: Modelagem – F1; Comportamento – F3
- **Critério de aceite**: Alteração de estado reflete comportamento correto na UI pública e nas APIs.

---
*Este documento lista todos os requisitos funcionais de nível MVP, com IDs, atores, prioridades e critérios de aceite.*
