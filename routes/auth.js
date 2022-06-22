const { Router } = require('express');
const { check } = require('express-validator');
const { authLogin, authLogout, authLoginStart, authRegister, authRegisterStart } = require('../controllers/auth');
const { authentication } = require('../middleware/authentication');
const { validarCampos } = require('../middleware/validar-campos');
const router = new Router();


router.get('/login', authLogin);

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('contraseña', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], authLoginStart);


router.get('/register', authRegister);

router.post('/register',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo es obligatorio').isEmail(),
    check('contraseña1', 'La contraseña es obligatoria').not().isEmpty(),
    check('contraseña1', 'La contraseña debe ser mayor a 5 caracteres').isLength({min : 5}),
    check('contraseña2', 'Las contraseñas no coinciden.').custom((value, {req}) => {
        if(value !== req.body.contraseña1) {
         return false;
        }
        return true;
     }),
    validarCampos
], authRegisterStart);

router.get('/logout', authLogout);

module.exports = router;