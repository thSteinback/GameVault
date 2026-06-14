-- ============================================================
-- migracao_moderacao.sql
-- Passo 1 do roadmap: suporte ao agente moderador.
-- Aditivo e seguro: não apaga nada. Rode uma vez no banco gamevault.
--   mysql -u root gamevault < migracao_moderacao.sql
-- ============================================================

USE `gamevault`;

-- 1) Contador de strikes (comentários tóxicos acumulados).
--    PERM_BANIDO e PERM_COMENTAR já existem na tabela permissoesusuarios.
ALTER TABLE `permissoesusuarios`
  ADD COLUMN IF NOT EXISTS `PERM_STRIKES` INT NOT NULL DEFAULT 0 AFTER `PERM_BANIDO`;

-- 2) Garante uma linha de permissões para TODO usuário já cadastrado.
--    (Sem isso, usuários antigos não teriam onde acumular strikes.)
INSERT IGNORE INTO `permissoesusuarios` (`USU_COD`, `PERM_BANIDO`, `PERM_STRIKES`, `PERM_COMENTAR`)
SELECT `USU_COD`, 0, 0, 1 FROM `usuarios`;
