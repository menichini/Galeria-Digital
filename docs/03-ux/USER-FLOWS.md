# USER-FLOWS.md

## Fluxo Principal de Captura (Happy Path)

```mermaid
graph TD
    A[Scan QR Code] --> B[Landing Page / Galeria]
    B --> C[Click 'Tirar Foto']
    C --> D{Permissão Câmera?}
    D -- Sim --> E[Camera Viewfinder]
    D -- Não/Bloqueado --> F[Fallback: Upload de Arquivo]
    E --> G[Take Photo]
    F --> G
    G --> H[Preview com Moldura]
    H --> I{Aprovou?}
    I -- Não (Tentar Novamente) --> E
    I -- Sim (Enviar) --> J[Processamento / Uploading]
    J --> K[Tela de Sucesso]
    K --> L[Baixar Imagem]
    K --> M[Compartilhar]
    K --> N[Voltar à Galeria Pública]
```

## Tratamento de Erros no Fluxo

- **Falha de Upload:** Caso a internet esteja lenta ou caia durante o upload, manter a imagem no estado local, mostrar "Erro ao enviar. Tentar de novo" sem perder a foto.
- **Tamanho Excessivo:** Se a imagem (no caso de fallback de upload) for muito grande, comprimir via Canvas antes do upload para evitar rejeição do servidor.
