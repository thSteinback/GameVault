const Avaliacao = require('../models/avaliacaoModel');
const Usuario   = require('../models/usuarioModel');

async function resolver(nome) {
  if (!nome) return null;
  const [u] = await Usuario.codPorNome(nome);
  return u.length ? u[0].USU_COD : null;
}

/* GET /jogos/:id/avaliacoes  (?nome= opcional -> traz a nota do próprio usuário) */
exports.resumo = async (req, res) => {
  try {
    const [[m]] = await Avaliacao.mediaPorJogo(req.params.id);
    let minhaNota = null;
    const usuCod = await resolver(req.query.nome);
    if (usuCod) {
      const [r] = await Avaliacao.doUsuario(usuCod, req.params.id);
      if (r.length) minhaNota = r[0].AVL_NOTA;
    }
    res.json({ media: m.media ? Number(m.media) : 0, total: m.total, minhaNota });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao obter avaliações' }); }
};

/* POST /jogos/:id/avaliacoes  { nome, nota, texto? } */
exports.avaliar = async (req, res) => {
  const { nome, nota, texto } = req.body;
  const n = parseInt(nota, 10);
  if (!Number.isInteger(n) || n < 1 || n > 5)
    return res.status(400).json({ erro: 'Nota deve ser de 1 a 5' });
  try {
    const usuCod = await resolver(nome);
    if (!usuCod) return res.status(401).json({ erro: 'Faça login para avaliar' });

    const [permRows] = await Usuario.getPermissoes(usuCod);
    const perm = permRows[0];
    if (perm && (perm.PERM_BANIDO === 1 || perm.PERM_AVALIAR === 0))
      return res.status(403).json({ erro: 'Você está impedido de avaliar.' });

    await Avaliacao.upsert(usuCod, req.params.id, n, texto);
    const [[m]] = await Avaliacao.mediaPorJogo(req.params.id);
    res.status(201).json({ msg: 'Avaliação registrada', media: m.media ? Number(m.media) : 0, total: m.total, minhaNota: n });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao avaliar' }); }
};
