const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {

    const { correo, contraseña } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('login', { errors: errors.errors, correo, contraseña });
    }

    next();
}

module.exports = {
    validarCampos
}