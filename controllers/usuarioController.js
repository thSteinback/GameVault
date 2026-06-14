const Usuario = require('../models/usuarioModel');

exports.uploadAvatar = async (req, res) => {
  try {
    const caminho = req.file.filename;
    await Usuario.setAvatar(caminho, req.body.nomeUsuario);
    res.json({ success: true, avatarPath: `/uploads/${caminho}` });
  } catch (e) {
    console.error('Erro ao atualizar avatar:', e);
    res.status(500).json({ success: false, message: 'Erro ao atualizar avatar' });
  }
};

exports.getAvatar = async (req, res) => {
  try {
    const [r] = await Usuario.getAvatar(req.query.nome);
    if (!r.length) return res.json({ success: false });
    const caminho = r[0].USU_AVATAR ? `/uploads/${r[0].USU_AVATAR}` : 'imagens/oMimico.png';
    res.json({ success: true, avatar: caminho });
  } catch { res.json({ success: false }); }
};

exports.uploadBanner = async (req, res) => {
  try {
    const caminho = req.file.filename;
    await Usuario.setBanner(caminho, req.body.nomeUsuario);
    res.json({ success: true, bannerPath: `/uploads/${caminho}` });
  } catch (e) {
    console.error('Erro ao atualizar banner:', e);
    res.status(500).json({ success: false, message: 'Erro ao atualizar banner' });
  }
};

exports.getBanner = async (req, res) => {
  try {
    const [r] = await Usuario.getBanner(req.query.nome);
    if (!r.length) return res.json({ success: false });
    const caminho = r[0].USU_BANNER ? `/uploads/${r[0].USU_BANNER}` : '';
    res.json({ success: true, banner: caminho });
  } catch { res.json({ success: false }); }
};

exports.getInfo = async (req, res) => {
  try {
    const [r] = await Usuario.getInfo(req.query.nome);
    if (!r.length) return res.json({ success: false });
    res.json({ success: true, nome: r[0].USU_NOME, membroDesde: r[0].USU_DATA_CRIACAO });
  } catch { res.json({ success: false }); }
};
