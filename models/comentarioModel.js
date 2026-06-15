const pool = require('../config/db');

exports.listarPorJogo = (jogoId) =>
  pool.execute(
    `SELECT c.COM_COD, c.COM_TEXTO, c.COM_DATA, u.USU_NOME, u.USU_AVATAR
       FROM comentarios c
       JOIN usuarios u ON u.USU_COD = c.USU_COD
      WHERE c.JOG_COD = ?
      ORDER BY c.COM_DATA DESC`,
    [jogoId]
  );

exports.criar = (usuCod, jogoId, texto) =>
  pool.execute('INSERT INTO comentarios (USU_COD, JOG_COD, COM_TEXTO) VALUES (?,?,?)', [usuCod, jogoId, texto]);

exports.excluir = (id) =>
  pool.execute('DELETE FROM comentarios WHERE COM_COD = ?', [id]);

exports.listarTodosComAutor = () =>
  pool.query(
    `SELECT c.COM_COD, c.USU_COD, c.COM_TEXTO, u.USU_NOME
       FROM comentarios c
       JOIN usuarios u ON u.USU_COD = c.USU_COD`
  );

exports.excluirVarios = (ids) =>
  pool.query('DELETE FROM comentarios WHERE COM_COD IN (?)', [ids]);

exports.contarPorUsuario = (usuCod) =>
  pool.execute('SELECT COUNT(*) AS total FROM comentarios WHERE USU_COD = ?', [usuCod]);

// Comentários recentes com jogo e autor — para a home ("análises populares")
exports.recentes = (limite) =>
  pool.query(
    `SELECT c.COM_TEXTO, c.COM_DATA, u.USU_NOME, j.JOG_COD, j.JOG_NOME, j.JOG_IMG
       FROM comentarios c
       JOIN usuarios u ON u.USU_COD = c.USU_COD
       JOIN jogos    j ON j.JOG_COD = c.JOG_COD
      WHERE j.JOG_ATIVO = 1
      ORDER BY c.COM_DATA DESC
      LIMIT ` + (Number(limite) || 6)
  );
