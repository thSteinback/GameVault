const pool = require('../config/db');

/* Catálogo público */
exports.listarAtivos = () =>
  pool.query('SELECT JOG_COD, JOG_NOME, JOG_DESC, JOG_IMG FROM jogos WHERE JOG_ATIVO = 1 ORDER BY JOG_DATA_CADASTRO DESC');

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
