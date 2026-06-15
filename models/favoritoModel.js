const pool = require('../config/db');

exports.adicionar = (usuCod, jogoId) =>
  pool.execute('INSERT IGNORE INTO favoritos (USU_COD, JOG_COD) VALUES (?,?)', [usuCod, jogoId]);

exports.remover = (usuCod, jogoId) =>
  pool.execute('DELETE FROM favoritos WHERE USU_COD = ? AND JOG_COD = ?', [usuCod, jogoId]);

exports.existe = (usuCod, jogoId) =>
  pool.execute('SELECT 1 FROM favoritos WHERE USU_COD = ? AND JOG_COD = ?', [usuCod, jogoId]);

exports.listarPorUsuario = (usuCod) =>
  pool.execute(
    `SELECT j.JOG_COD, j.JOG_NOME, j.JOG_IMG
       FROM favoritos f
       JOIN jogos j ON j.JOG_COD = f.JOG_COD
      WHERE f.USU_COD = ? AND j.JOG_ATIVO = 1
      ORDER BY j.JOG_NOME`,
    [usuCod]
  );

exports.contarPorUsuario = (usuCod) =>
  pool.execute('SELECT COUNT(*) AS total FROM favoritos WHERE USU_COD = ?', [usuCod]);
