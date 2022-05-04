const express = require('express');
const router = express.Router();

const customerAuth = require('../../controllers/auth/customerAuth')
const subscriptionController = require('../../controllers/modules/subscription');

//save mess feature
router.post('/subscribe/:custId/:messId', customerAuth, subscriptionController.subscribe);

router.delete('/unsubscribe/:subId', customerAuth, subscriptionController.unsubscribe);


module.exports = router;