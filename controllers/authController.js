const pool   = require('../config/db');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha)
    return res.status(400).json({ mensagem: 'Email e senha obrigatórios' });

  try {
    // tenta em usuários
    const [[user]] = await pool.execute(
      'SELECT USU_COD AS id, USU_SENHA AS hash, "USER" AS tipo FROM usuarios WHERE USU_EMAIL = ?',
      [email]
    );

    // se não achou, procura em administradores
    let reg = user;
    if (!reg) {
      const [[adm]] = await pool.execute(
        'SELECT ADM_COD AS id, ADM_SENHA AS hash, "ADMIN" AS tipo FROM administradores WHERE ADM_EMAIL = ?',
        [email]
      );
      reg = adm;
    }

    if (!reg) return res.status(401).json({ mensagem: 'Credenciais inválidas' });

    const ok = await bcrypt.compare(senha, reg.hash);
    if (!ok)  return res.status(401).json({ mensagem: 'Credenciais inválidas' });

    const payload = { ID: reg.id, ADMIN: reg.tipo === 'ADMIN' };
    const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, isAdmin: payload.ADMIN });
  } catch (e) {
    console.error(e);
    res.status(500).json({ mensagem: 'Erro interno' });
  }
};
