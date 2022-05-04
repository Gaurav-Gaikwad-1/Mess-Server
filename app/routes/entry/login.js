const express = require('express');
const router = express.Router();

const loginRoutes = require('../../controllers/entry/login');

router.get('/', loginRoutes.getLoginPage);

//login customer
router.post('/customer', loginRoutes.customerLogin);

//login mess
router.post('/mess', loginRoutes.messLogin);

module.exports = router;