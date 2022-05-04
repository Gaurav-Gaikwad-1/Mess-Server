const express = require('express');
const router = express.Router();

const customerAuth = require('../../controllers/auth/customerAuth');
const customerFeatureController = require('../../controllers/modules/customerFeatures');

router.get('/savedmess/:custId', customerAuth, customerFeatureController.getMySavedMess);

module.exports = router