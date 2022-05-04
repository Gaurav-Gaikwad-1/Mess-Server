const express = require('express');
const router = express.Router();
const forgotPasswordControllers = require('../../controllers/entry/forgotPassword');
const forgotPasswordAuth = require('../../controllers/auth/forgotPasswordAuth');

router.post('/otp', forgotPasswordControllers.sendOtp);

router.post('/verify', forgotPasswordControllers.verifyOtp);

router.post('/password/customer', forgotPasswordAuth, forgotPasswordControllers.setNewCustomerPassword);

router.post('/password/mess', forgotPasswordAuth, forgotPasswordControllers.setNewMessPassword);

module.exports = router;