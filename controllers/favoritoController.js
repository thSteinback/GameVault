const Favorito = require('../models/favoritoModel');
const Usuario  = require('../models/usuarioModel');

// resolve o USU_COD a partir do nome de usuário
async function resolverUsuario(nome) {
  if (!nome) return null;
  const [u] = await Usuario.codPorNome(nome);
  return u.length ? u[0].USU_COD : null;
}

/* GET /favoritos?nome=...  -> lista os jogos favoritados do usuário */
exports.listar = async (req, res) => {
  try {
    const usuCod = await resolverUsuario(req.query.nome);
    if (!usuCod) return res.status(401).json({ erro: 'Faça login para ver seus favoritos' });
    const [rows] = await Favorito.listarPorUsuario(usuCod);
    res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao listar favoritos' }); }
};

/* GET /favoritos/status?nome=...&jogo=...  -> { favoritado: bool } */
exports.status = async (req, res) => {
  try {
    const usuCod = await resolverUsuario(req.query.nome);
    if (!usuCod) return res.json({ favoritado: false });
    const [rows] = await Favorito.existe(usuCod, req.query.jogo);
    res.json({ favoritado: rows.length > 0 });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao verificar favorito' }); }
};

/* POST /favoritos/toggle  { nome, jogo }  -> alterna e devolve o novo estado */
exports.toggle = async (req, res) => {
  const { nome, jogo } = req.body;
  if (!jogo) return res.status(400).json({ erro: 'Jogo não informado' });
  try {
    const usuCod = await resolverUsuario(nome);
    if (!usuCod) return res.status(401).json({ erro: 'Faça login para favoritar' });

    const [existe] = await Favorito.existe(usuCod, jogo);
    if (existe.length) {
      await Favorito.remover(usuCod, jogo);
      return res.json({ favoritado: false });
    }
    await Favorito.adicionar(usuCod, jogo);
    res.json({ favoritado: true });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao favoritar' }); }
};
