const { Router } = require('express');
const { check } = require('express-validator');
const { authLogin, authLogout, authLoginStart } = require('../controllers/auth');
const { authentication } = require('../middleware/authentication');
const { validarCampos } = require('../middleware/validar-campos');
const router = new Router();

router.get('/login', authLogin);

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('contraseña', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], authLoginStart);

router.get('/logout', authLogout);

module.exports = router;