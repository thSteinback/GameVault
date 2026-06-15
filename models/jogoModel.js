const pool = require('../config/db');

/* Catálogo público */
/* Catálogo público */
exports.listarAtivos = () =>
  pool.query(
    `SELECT j.JOG_COD, j.JOG_NOME, j.JOG_DESC, j.JOG_IMG,
            ROUND(AVG(a.AVL_NOTA), 1) AS media,
            COUNT(a.AVL_COD)          AS totalAval
       FROM jogos j
       LEFT JOIN avaliacoes a ON a.JOG_COD = j.JOG_COD
      WHERE j.JOG_ATIVO = 1
      GROUP BY j.JOG_COD
      ORDER BY j.JOG_DATA_CADASTRO DESC`
  );

exports.buscarAtivoPorId = (id) =>
  pool.execute('SELECT JOG_COD, JOG_NOME, JOG_DESC, JOG_IMG FROM jogos WHERE JOG_COD = ? AND JOG_ATIVO = 1', [id]);

/* Admin */
exports.listarAdmin = () =>
  pool.query('SELECT JOG_COD, JOG_NOME, JOG_DESC, JOG_IMG FROM jogos WHERE JOG_ATIVO = 1');

exports.criar = (nome, desc, img) =>
  pool.execute('INSERT INTO jogos (JOG_NOME, JOG_DESC, JOG_IMG, JOG_ATIVO) VALUES (?,?,?,1)', [nome, desc || null, img]);

exports.imagemPorId = (id) =>
  pool.execute('SELECT JOG_IMG FROM jogos WHERE JOG_COD = ?', [id]);

exports.excluir = (id) =>
  pool.execute('DELETE FROM jogos WHERE JOG_COD = ?', [id]);

// Top jogos por nº de avaliações (e média) — para a home
exports.topAvaliados = (limite) =>
  pool.query(
    `SELECT j.JOG_COD, j.JOG_NOME, j.JOG_IMG,
            ROUND(AVG(a.AVL_NOTA),1) AS media, COUNT(a.AVL_COD) AS total
       FROM jogos j
       LEFT JOIN avaliacoes a ON a.JOG_COD = j.JOG_COD
      WHERE j.JOG_ATIVO = 1
      GROUP BY j.JOG_COD
      ORDER BY total DESC, media DESC, j.JOG_DATA_CADASTRO DESC
      LIMIT ` + (Number(limite) || 12)
  );
