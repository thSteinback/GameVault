const pool = require('../config/db');

// Cria ou atualiza a avaliação do usuário para o jogo (uma por par usuário+jogo)
exports.upsert = (usuCod, jogoId, nota, texto) =>
  pool.execute(
    `INSERT INTO avaliacoes (USU_COD, JOG_COD, AVL_NOTA, AVL_TEXTO)
     VALUES (?,?,?,?)
     ON DUPLICATE KEY UPDATE AVL_NOTA = VALUES(AVL_NOTA),
                             AVL_TEXTO = VALUES(AVL_TEXTO),
                             AVL_DATA  = NOW()`,
    [usuCod, jogoId, nota, texto || null]
  );

exports.mediaPorJogo = (jogoId) =>
  pool.execute('SELECT ROUND(AVG(AVL_NOTA),2) AS media, COUNT(*) AS total FROM avaliacoes WHERE JOG_COD = ?', [jogoId]);

exports.doUsuario = (usuCod, jogoId) =>
  pool.execute('SELECT AVL_NOTA, AVL_TEXTO FROM avaliacoes WHERE USU_COD = ? AND JOG_COD = ?', [usuCod, jogoId]);

exports.contarPorUsuario = (usuCod) =>
  pool.execute('SELECT COUNT(*) AS total FROM avaliacoes WHERE USU_COD = ?', [usuCod]);
