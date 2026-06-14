const Comentario = require('../models/comentarioModel');
const Usuario    = require('../models/usuarioModel');

exports.listar = async (req, res) => {
  try { const [rows] = await Comentario.listarPorJogo(req.params.id); res.json(rows); }
  catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao listar comentários' }); }
};

exports.criar = async (req, res) => {
  const { nome, texto } = req.body;
  if (!nome || !texto || !texto.trim())
    return res.status(400).json({ erro: 'Informe o usuário e um texto não vazio' });
  try {
    const [u] = await Usuario.codPorNome(nome);
    if (!u.length) return res.status(401).json({ erro: 'Faça login para comentar' });
    const usuCod = u[0].USU_COD;

    const [permRows] = await Usuario.getPermissoes(usuCod);
    const perm = permRows[0];
    if (perm && (perm.PERM_BANIDO === 1 || perm.PERM_COMENTAR === 0))
      return res.status(403).json({ erro: 'Você está impedido de comentar.' });

    await Comentario.criar(usuCod, req.params.id, texto.trim());
    res.status(201).json({ msg: 'Comentário publicado' });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao publicar comentário' }); }
};

exports.excluir = async (req, res) => {
  try { await Comentario.excluir(req.params.id); res.json({ msg: 'Comentário removido' }); }
  catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao remover comentário' }); }
};
