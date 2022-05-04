const express = require('express');
const router = express();

const refreshTokenController = require('../../controllers/entry/refreshToken');
const refreshTokenAuth = require('../../controllers/auth/refreshTokenAuth');

router.get('/mess', refreshTokenAuth, refreshTokenController.getMessNewToken);

router.get('/customer', refreshTokenAuth, refreshTokenController.getCustomerNewToken);

module.exports = router;