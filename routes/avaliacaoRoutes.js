const router    = require('express').Router();
const avaliacao = require('../controllers/avaliacaoController');

// montado em / (caminhos completos)
router.get('/jogos/:id/avaliacoes', avaliacao.resumo);
router.post('/jogos/:id/avaliacoes', avaliacao.avaliar);

module.exports = router;
