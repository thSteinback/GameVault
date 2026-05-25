const apenasAdmin = require('../middlewares/isAdmin');

// Endpoint que o frontend chama para confirmar se é admin
router.get('/verificar-admin', (req, res) => {
  const { nome } = req.query;
  if (!nome) return res.json({ isAdmin: false });

  db.query(
    'SELECT 1 FROM administradores WHERE ADM_NOME = ? OR ADM_EMAIL = ?',
    [nome, nome],
    (err, rows) => {
      if (err || rows.length === 0) return res.json({ isAdmin: false });
      res.json({ isAdmin: true });
    }
  );
});