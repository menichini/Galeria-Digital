# TEST-STRATEGY.md

## Abordagem Principal
Dado que é um projeto de ciclo curto e MVP, a estratégia focará pesadamente em **Testes de Integração** (do front ao back) e **Testes Manuais de Dispositivo**.

## Tipos de Teste

### 1. Testes de Integração e E2E (End-to-End)
- Uso de **Playwright** ou **Cypress** para testar os fluxos críticos:
  - Navegar na galeria pública.
  - Testar o comportamento do modal/fluxo de câmera usando arquivos *mock* (upload falso) de imagem.
  - Garantir o correto roteamento e exibição de botões (download, share).

### 2. Testes de Unidade (Opcional, de Baixa Prioridade)
- Aplicados primariamente nas funções isoladas de manipulação do Canvas:
  - Função que mescla imagem base com a camada da moldura (garantir proporção e corte correto).
  - Funções de compressão e utilitários de tratamento de erro.

### 3. Testes Manuais (Device Farm / Reais)
A parte de câmera tem um grande risco associado a inconsistências entre navegadores móveis (Safari iOS vs Chrome Android). É mandatório:
- **iOS Safari (iPhone moderno)**: Testar permissão, travamento da tela, flip de câmera.
- **Android Chrome**: Idem.
- **Browser interno do Instagram / WhatsApp**: Testar se o site quebra ao ser aberto via link dentro do *in-app browser* das redes, pois suas APIs de `getUserMedia` às vezes são bloqueadas ou agem de modo não-padrão. Nesse caso, garantir fallback automático para `<input type="file">`.

## Cobertura de Segurança
- Garantir, sem autenticação, que via API chamadas de POST com arquivos executáveis (.exe, .sh) falhem ao fazer upload no Storage.
- Validar via Postman/cURL que consultas SELECT limitadas por RLS funcionam corretamente.
