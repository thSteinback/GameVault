module.exports = (req, res, next) =>
  req.usuario?.ADMIN
    ? next()
    : res.status(403).json({ mensagem: 'Requer privilégio de administrador' });
