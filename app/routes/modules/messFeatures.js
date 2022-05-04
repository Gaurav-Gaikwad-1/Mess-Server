const express = require('express');
const router = express.Router();

const messAuth = require('../../controllers/auth/messAuth');
const messFeatureController = require('../../controllers/modules/messFeatures');

router.get('/subscribers/:messid', messAuth, messFeatureController.getSubscriberInfo);

module.exports = router