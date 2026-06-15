const moderacao  = require('../moderacao');
const Usuario    = require('../models/usuarioModel');
const Comentario = require('../models/comentarioModel');

exports.listarUsuarios = async (req, res) => {
  try { const [rows] = await Usuario.listarTodosComAdmins(); res.json(rows); }
  catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao listar usuários' }); }
};

exports.excluirUsuario = async (req, res) => {
  try { await Usuario.excluir(req.params.id); res.json({ msg: 'Usuário removido' }); }
  catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao excluir usuário' }); }
};

/* Agente moderador — varredura em lote */
exports.moderar = async (req, res) => {
  try {
    const [comentarios] = await Comentario.listarTodosComAutor();

    const aRemover   = [];
    const porUsuario = {};
    const detalhes   = [];

    for (const c of comentarios) {
      const r = moderacao.analisar(c.COM_TEXTO || '');
      if (!r.toxico) continue;
      aRemover.push(c.COM_COD);
      if (!porUsuario[c.USU_COD])
        porUsuario[c.USU_COD] = { nome: c.USU_NOME, qtd: 0, termos: new Set(), grave: false };
      porUsuario[c.USU_COD].qtd++;
      porUsuario[c.USU_COD].grave = porUsuario[c.USU_COD].grave || r.grave;
      r.termos.forEach(t => porUsuario[c.USU_COD].termos.add(t));
      detalhes.push({ usuario: c.USU_NOME, texto: c.COM_TEXTO, grave: r.grave, termos: r.termos });
    }

    if (aRemover.length) await Comentario.excluirVarios(aRemover);

    const banidos = [];
    for (const usuCod of Object.keys(porUsuario)) {
      const info = porUsuario[usuCod];
      await Usuario.somarStrikes(usuCod, info.qtd);
      const [permRows] = await Usuario.getPermissoes(usuCod);
      const perm = permRows[0];
      if (perm.PERM_STRIKES >= moderacao.LIMITE_STRIKES && perm.PERM_BANIDO !== 1) {
        await Usuario.banir(usuCod);
        await Usuario.registrarLog(usuCod, `Banimento automático do moderador (${perm.PERM_STRIKES} strikes)`);
        banidos.push({ usuario: info.nome, strikes: perm.PERM_STRIKES });
      }
    }

    res.json({
      analisados: comentarios.length,
      removidos: aRemover.length,
      usuariosAfetados: Object.keys(porUsuario).length,
      banidos, detalhes,
      limiteStrikes: moderacao.LIMITE_STRIKES
    });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Falha na moderação' }); }
};

exports.desbanir = async (req, res) => {
  try {
    await Usuario.desbanir(req.params.id);
    await Usuario.registrarLog(req.params.id, 'Desbanido manualmente pelo admin');
    res.json({ msg: 'Usuário desbanido' });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao desbanir' }); }
};

exports.promover = async (req, res) => {
  try {
    await Usuario.promover(req.params.id);
    await Usuario.registrarLog(req.params.id, 'Promovido a administrador pelo admin');
    res.json({ msg: 'Usuário promovido a administrador' });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao promover' }); }
};

exports.rebaixar = async (req, res) => {
  try {
    await Usuario.rebaixar(req.params.id);
    await Usuario.registrarLog(req.params.id, 'Rebaixado para usuário comum pelo admin');
    res.json({ msg: 'Usuário rebaixado' });
  } catch (e) { console.error(e); res.status(500).json({ erro: 'Falha ao rebaixar' }); }
};
