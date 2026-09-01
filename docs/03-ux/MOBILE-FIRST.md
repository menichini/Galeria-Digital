# MOBILE-FIRST.md

## Premissa
O uso do sistema se dará **99% em dispositivos móveis**, já que a porta de entrada é escanear um QR Code em uma festa. O design e o desenvolvimento devem ser **mobile-first**. A versão desktop será apenas um fallback funcional, não o foco principal.

## Diretrizes de Interface Mobile
- **Áreas de Toque (Touch Targets):** Botões principais ("Tirar Foto", "Confirmar") devem ter no mínimo 48x48 dp.
- **Orientação (Orientation):**
  - **Portrait (Retrato):** Modo padrão, ideal para selfies e visualização da câmera.
  - **Landscape (Paisagem):** Opcional, mas a UI não deve quebrar caso o celular seja deitado. Recomenda-se travar as molduras proporcionalmente.
- **Safe Areas:** Respeitar o *notch* e as *safe areas* de iPhones e Androids modernos, evitando posicionar elementos críticos nas extremidades da tela.
- **Evitar Rolagem Desnecessária:** No fluxo de captura, toda a ação deve acontecer em uma única tela visual (*above the fold*), sem a necessidade de dar scroll.

## Tecnologias e Fallbacks
- Utilizar `min-height: 100dvh` (Dynamic Viewport Height) ao invés de `100vh` para evitar problemas com as barras de endereço do Safari mobile (iOS).
- API `navigator.mediaDevices.getUserMedia` para acesso nativo no browser, priorizando a câmera frontal ou traseira via botão de 'flip camera'.
- Suporte a `<input type="file" accept="image/*" capture>` para dispositivos mais antigos onde o acesso direto por stream JS possa apresentar instabilidade.
