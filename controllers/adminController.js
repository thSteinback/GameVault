/*  ───────────────  CRUD de Jogos  ─────────────── */
const pool   = require('../config/db');        // mysql2/promise
const path   = require('path');
const fs     = require('fs');
const upload = require('../config/multer');    // upload de imagem

/* ---------- LISTAR ---------- */
exports.listJogos = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT JOG_COD, JOG_NOME, JOG_DESC, JOG_IMG FROM jogos WHERE JOG_ATIVO = 1'
    );
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Falha ao listar jogos' });
  }
};

/* ---------- CADASTRAR ---------- */
exports.createJogo = [
  upload.single('imagem'),                     // campo <input name="imagem">
  async (req, res) => {
    try {
      const { nome, desc } = req.body;
      const img            = req.file ? req.file.filename : null;

      await pool.execute(
        'INSERT INTO jogos (JOG_NOME, JOG_DESC, JOG_IMG, JOG_ATIVO) VALUES (?,?,?,1)',
        [nome, desc || null, img]
      );
      res.status(201).json({ msg: 'Jogo inserido com sucesso' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ erro: 'Falha ao cadastrar jogo' });
    }
  }
];

/* ---------- EXCLUIR ---------- */
exports.deleteJogo = async (req, res) => {
  try {
    const { id } = req.params;

    // apaga imagem física (se houver)
    const [[jogo]] = await pool.execute(
      'SELECT JOG_IMG FROM jogos WHERE JOG_COD = ?', [id]
    );
    if (jogo?.JOG_IMG) {
      fs.unlink(path.resolve(__dirname, '..', 'uploads', jogo.JOG_IMG), () => {});
    }

    await pool.execute('DELETE FROM jogos WHERE JOG_COD = ?', [id]);
    res.json({ msg: 'Jogo removido' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: 'Falha ao excluir jogo' });
  }
};
