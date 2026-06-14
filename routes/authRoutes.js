const router = require('express').Router();
const auth   = require('../controllers/authController');

router.post('/cadastrar', auth.cadastrar);
router.post('/login', auth.login);
router.get('/verificar-admin', auth.verificarAdmin);

module.exports = router;
