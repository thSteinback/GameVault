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
