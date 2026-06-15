const router    = require('express').Router();
const favorito  = require('../controllers/favoritoController');

// montado em /favoritos
router.get('/', favorito.listar);
router.get('/status', favorito.status);
router.post('/toggle', favorito.toggle);

module.exports = router;
