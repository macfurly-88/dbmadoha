const express = require('express');
const router = express.Router();
const ordenesController = require('../controllers/ordenesController');

router.get('/vista', ordenesController.listar);

router.post('/', ordenesController.crear);
router.get('/editar/:id', ordenesController.editarForm);
router.post('/editar/:id', ordenesController.actualizar);
router.get('/eliminar/:id', ordenesController.eliminar);

module.exports = router;
