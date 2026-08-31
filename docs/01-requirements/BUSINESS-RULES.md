# BUSINESS-RULES.md

## RN-001 – Estado Operacional do Evento
- Um evento possui um **estado operacional** (ativo/inativo). Quando inativo, a página pública exibe mensagem de encerramento e desativa uploads.

## RN-002 – Políticas de Moderação
- Apenas fotografias que passaram pela **moderação** (aprovadas) podem aparecer na galeria pública.

## RN-003 – Associação de Moldura ao Evento
- Cada **moldura** pertence a um único evento e só pode ser usada no contexto desse evento.

## RN-004 – Convidado sem Conta
- Convidados **não precisam** possuir conta; a única autenticação é o acesso via QR Code.

## RN-005 – Limite de Upload por Convidado
- Cada convidado pode fazer **até 3 uploads** por evento. Excedido bloqueia novos uploads até novo QR Code ou tempo limite.

## RN-006 – Retenção de Dados
- Fotos armazenadas por no máximo **30 dias** após o evento, a menos que o administrador altere a política.

## RN-007 – Exclusão de Fotos
- Administrador pode excluir fotos a qualquer momento; a exclusão é permanente e remove o arquivo do storage.

---

## RN-008 – Configuração da página inicial do evento
- A página inicial do evento deve ser configurável via `event-config.json` ou equivalente, permitindo definição de identidade, título, aniversariante, idade, imagem/capa, mensagem e chamadas principais sem necessidade de código hard‑coded.

*Regras de negócio que regem o comportamento da aplicação.*
