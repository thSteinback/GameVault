const express         = require('express');
const router          = express.Router();
const adminController = require('../controllers/adminController');

/* ───── Rotas de Jogos ───── */
router.get   ('/jogos'     , adminController.listJogos);
router.post  ('/jogos'     , adminController.createJogo);   // upload já está no controller
router.delete('/jogos/:id' , adminController.deleteJogo);

module.exports = router;