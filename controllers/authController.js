const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

/* POST /cadastrar */
exports.cadastrar = async (req, res) => {
  const { nome, email, senha } = req.body;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
  const senhaOk = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(senha || '');
  if (!nome || !nome.trim()) return res.json({ success: false, message: 'Nome de usuário obrigatório' });
  if (!emailOk)              return res.json({ success: false, message: 'E-mail inválido' });
  if (!senhaOk)              return res.json({ success: false, message: 'Senha fraca: mín. 8 caracteres, 1 maiúscula e 1 número' });

  try {
    const [existe] = await Usuario.existeNomeOuEmail(nome, email);
    if (existe.length) return res.json({ success: false, message: 'Nome ou e-mail já existe' });

    const senhaHash = await bcrypt.hash(senha, 10);
    const [result]  = await Usuario.criar(nome, email, senhaHash);
    await Usuario.criarPermissoes(result.insertId);

    res.json({ success: true, message: 'Usuário cadastrado com sucesso' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Erro ao cadastrar' });
  }
};

/* POST /login */
exports.login = async (req, res) => {
  const { nome, senha } = req.body;
  if (!nome || !senha) return res.status(400).json({ success: false, message: 'Preencha todos os campos' });

  try {
    const [rUser] = await Usuario.credenciaisPorLogin(nome);
    if (rUser.length) {
      const senhaOk = await bcrypt.compare(senha, rUser[0].senhaDB);
      if (!senhaOk) return res.json({ success: false, message: 'Credenciais Inválidas' });

      const ehAdmin = rUser[0].USU_TIPO === 'admin';
      const token = jwt.sign(
        { id: rUser[0].USU_COD, nome, admin: ehAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );
      return res.json({ success: true, isAdmin: ehAdmin, token });
    }
    return res.json({ success: false, message: 'Credenciais Inválidas' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
};

/* GET /verificar-admin */
exports.verificarAdmin = async (req, res) => {
  try {
    const [rows] = await Usuario.verificarAdmin(req.query.nome);
    res.json({ isAdmin: rows.length > 0 });
  } catch {
    res.status(500).json({ isAdmin: false });
  }
};
