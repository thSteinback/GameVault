const router  = require('express').Router();
const upload  = require('../config/multer');
const usuario = require('../controllers/usuarioController');

router.post('/upload-avatar', upload.single('avatar'), usuario.uploadAvatar);
router.get('/usuario-avatar', usuario.getAvatar);
router.post('/upload-banner', upload.single('banner'), usuario.uploadBanner);
router.get('/usuario-banner', usuario.getBanner);
router.get('/usuario-info', usuario.getInfo);
router.get('/usuario-perfil', usuario.perfil);

module.exports = router;
