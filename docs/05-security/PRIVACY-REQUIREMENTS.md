# PRIVACY-REQUIREMENTS.md

## 1. Minimalismo de Dados Pessoais
- A aplicação é **completamente anônima** para os convidados.
- Nenhuma informação de Identificação Pessoal (PII) direta (nome, e-mail, telefone) será coletada dos usuários no fluxo padrão de upload.

## 2. Tratamento de Metadados de Imagem (EXIF)
- **Risco:** Fotos tiradas e enviadas podem conter dados sensíveis (modelo do aparelho, e mais perigoso: coordenadas de GPS).
- **Ação Obrigatória:** O processamento feito via `Canvas API` no lado do cliente na hora de aplicar a moldura já descartará nativamente a maioria dos metadados EXIF ao exportar a nova imagem (via `toDataURL` ou `toBlob`). Deve-se garantir em testes que as imagens enviadas ao Storage não possuam metadados sensíveis.

## 3. Exclusão e Moderação
- Sendo um evento fechado, a galeria será pública (através do link), o que significa que o compartilhamento inadvertido do link expõe as fotos dos convidados.
- Deve haver um mecanismo imediato (através do administrador) para apagar qualquer foto indesejada da base de dados e do bucket de armazenamento (Hard Delete).

## 4. Retenção de Dados
- As fotos não deverão ficar online permanentemente. A aplicação deve ter um ciclo de vida planejado (ex: 30 dias após o evento).
- Após a festa e download do `.zip` pelos pais, os dados do Supabase Storage deverão ser expurgados para evitar vazamento futuro, reduzindo a superfície de ataque e custos.
