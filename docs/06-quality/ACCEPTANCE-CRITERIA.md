# ACCEPTANCE-CRITERIA.md

## Épico 1: Captura e Composição da Foto
- **CA1.1:** O usuário acessa a página e clica em "Tirar foto", o navegador pede acesso e exibe a câmera.
- **CA1.2:** A foto é capturada em tempo real ou carregada da galeria.
- **CA1.3:** Uma moldura transparente da "Fazendinha" aparece perfeitamente sobreposta sobre a foto, ajustada ao aspecto.
- **CA1.4:** O resultado final visível é preservado exatamente igual (composição da foto base + moldura).

## Épico 2: Upload e Publicação
- **CA2.1:** Ao confirmar, o front-end compõe a imagem num arquivo único e envia para o servidor.
- **CA2.2:** O usuário não autenticado não deve conseguir enviar arquivos que não sejam imagens.
- **CA2.3:** Imagens são reduzidas e perdem o EXIF antes ou no momento do upload, pesando menos de 2MB idealmente.
- **CA2.4:** Em caso de perda de conexão, um aviso de "Tentando novamente" ou "Falha, tente de novo" deve aparecer.

## Épico 3: Galeria e Visualização
- **CA3.1:** Fotos enviadas com sucesso aparecem imediatamente na Galeria para todos os usuários (ou assim que atualizarem a página, usando subscrição realtime, se aplicável).
- **CA3.2:** A galeria deve utilizar técnicas de Lazy Loading e exibição em Grid, sem travamento do navegador mesmo com >100 fotos.

## Épico 4: Ações Pós-Captura
- **CA4.1:** Após o upload, é exibido um botão de "Salvar no dispositivo". Ao clicar, o navegador inicia o download da imagem final com a moldura.
- **CA4.2:** Opcionalmente, exibe a Web Share API (se suportado pelo device) para compartilhar direto no WhatsApp.
