// Requer que o token tenha a claim admin = true.
// Deve ser usado SEMPRE depois do middleware auth.
module.exports = (req, res, next) =>
  (req.usuario && req.usuario.admin)
    ? next()
    : res.status(403).json({ erro: 'Requer privilégio de administrador.' });
