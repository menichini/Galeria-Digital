# SECURITY-REQUIREMENTS.md

## 1. Segurança da Aplicação e Acesso
- **Public Uploads:** O endpoint ou a função de upload precisa permitir submissões anônimas, porém deve haver mitigação severa contra abuso.
- **Limitação de Taxa (Rate Limiting):** Implementar limites de requisição no Edge/CDN e no banco de dados (ex: máximo de 10 uploads por IP por minuto) para evitar Denial of Wallet e DoS.
- **Tamanho de Arquivo:** Impor limite rígido de tamanho de arquivo (máximo de 5 MB) no cliente e no servidor de Storage.

## 2. Row Level Security (RLS) - Supabase
- **Tabela de Fotos (`photos`):**
  - **INSERT:** Permitido para a role `anon` e `authenticated`.
  - **SELECT:** Permitido para a role `anon` (apenas registros onde `is_approved = true` caso haja moderação, ou todos inicialmente dependendo da regra de negócio da festa).
  - **UPDATE/DELETE:** Permitido estritamente apenas para a role `authenticated` (administradores).
- **Bucket de Armazenamento:**
  - Configurar políticas equivalentes: `anon` pode fazer upload e ler objetos aprovados. Modificação e exclusão apenas por `authenticated`.

## 3. Validação e Sanitização
- **Tipos de Arquivo:** Somente imagens (JPEG, PNG, WebP) devem ser aceitas. Rejeitar SVG, PDF ou arquivos executáveis tanto no front-end quanto no servidor de Storage.
- **Prevenção contra XSS e Injections:** A aplicação Next.js/Vite não renderizará conteúdo gerado pelo usuário além das imagens. Se metadados ou descrições forem adicionados no futuro, eles deverão ser fortemente sanitizados.

## 4. Autenticação Administrativa
- Proteção da rota `/admin` via Supabase Auth (e-mail/senha ou magic link), restrito às contas da família.
