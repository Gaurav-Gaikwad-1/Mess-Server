const express = require('express');
const router = express.Router();

const registerRoutes = require('../../controllers/entry/register');

router.get('/', registerRoutes.getRegisterPage);

//register customer
router.post('/customer', registerRoutes.customerRegister);

//register mess
router.post('/mess', registerRoutes.messRegister);

module.exports = router;