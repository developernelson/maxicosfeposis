const { Router } = require('express');
const { clientes, ventas, stock, historial, actualizar, enviar} = require('../controllers/data');
const { authentication } = require('../middleware/authentication');
const router = new Router();

router.get('/clientes', authentication, clientes);

router.get('/ventas', authentication, ventas);
router.get('/stock', authentication, stock);
router.get('/historial', authentication, historial);

router.get('/actualizar', authentication, actualizar);
router.get('/enviar', authentication, enviar);


module.exports = router;