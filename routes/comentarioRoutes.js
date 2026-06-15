const router = require('express').Router();
const coment = require('../controllers/comentarioController');

// montado em / (caminhos completos)
router.get('/jogos/:id/comentarios', coment.listar);
router.post('/jogos/:id/comentarios', coment.criar);
router.get('/comentarios/recentes', coment.recentes);
router.delete('/comentarios/:id', coment.excluir);

module.exports = router;
