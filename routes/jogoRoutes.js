const router = require('express').Router();
const jogo   = require('../controllers/jogoController');

// montado em /jogos
router.get('/', jogo.listarPublico);
router.get('/top', jogo.top);
router.get('/:id', jogo.detalhe);

module.exports = router;
