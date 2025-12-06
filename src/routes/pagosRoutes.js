const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');

router.get('/vista', pagosController.listar);

router.post('/', pagosController.crear);

router.get('/editar/:id', pagosController.editarForm);
router.post('/editar/:id', pagosController.actualizar);

router.get('/eliminar/:id', pagosController.eliminar);

module.exports = router;
