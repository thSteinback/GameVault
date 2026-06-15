const router = require('express').Router();
const upload = require('../config/multer');
const jogo   = require('../controllers/jogoController');
const admin  = require('../controllers/adminController');

// montado em /admin (já protegido por auth + isAdmin no server.js)
router.get('/jogos', jogo.listarAdmin);
router.post('/jogos', upload.single('imagem'), jogo.criar);
router.delete('/jogos/:id', jogo.excluir);

router.get('/usuarios', admin.listarUsuarios);
router.delete('/usuarios/:id', admin.excluirUsuario);

router.post('/moderar', admin.moderar);
router.post('/usuarios/:id/desbanir', admin.desbanir);
router.post('/usuarios/:id/promover', admin.promover);
router.post('/usuarios/:id/rebaixar', admin.rebaixar);

module.exports = router;
