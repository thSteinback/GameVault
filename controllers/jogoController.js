const path = require('path');
const fs   = require('fs');
const Jogo = require('../models/jogoModel');

/* Público */
exports.listarPublico = async (req, res) => {
  try { const [rows] = await Jogo.listarAtivos(); res.json(rows); }
  catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao listar jogos' }); }
};

exports.detalhe = async (req, res) => {
  try {
    const [rows] = await Jogo.buscarAtivoPorId(req.params.id);
    if (!rows.length) return res.status(404).json({ erro: 'Jogo não encontrado' });
    res.json(rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao buscar jogo' }); }
};

/* Admin */
exports.listarAdmin = async (req, res) => {
  try { const [rows] = await Jogo.listarAdmin(); res.json(rows); }
  catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao listar jogos' }); }
};

exports.criar = async (req, res) => {
  const { nome, desc } = req.body;
  const img = req.file ? req.file.filename : null;
  if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });
  try { await Jogo.criar(nome, desc, img); res.status(201).json({ msg: 'Jogo inserido com sucesso' }); }
  catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao cadastrar jogo' }); }
};

exports.excluir = async (req, res) => {
  try {
    const [rows] = await Jogo.imagemPorId(req.params.id);
    if (rows.length && rows[0].JOG_IMG) {
      fs.unlink(path.resolve(__dirname, '..', 'uploads', rows[0].JOG_IMG), () => {});
    }
    await Jogo.excluir(req.params.id);
    res.json({ msg: 'Jogo removido' });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao excluir jogo' }); }
};
