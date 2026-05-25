const express         = require('express');
const router          = express.Router();
const adminController = require('../controllers/adminController');

/* ───── Rotas de Jogos ───── */
const apenasAdmin = require('../middlewares/isAdmin');

// Protege TODAS as rotas deste arquivo
router.use(apenasAdmin);

// etc.
router.get   ('/jogos'     , adminController.listJogos);
router.post  ('/jogos'     , adminController.createJogo);   // upload já está no controller
router.delete('/jogos/:id' , adminController.deleteJogo);

module.exports = router;