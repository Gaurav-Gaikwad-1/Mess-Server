const express = require('express');
const router = express.Router();

const searchBarController = require('../../controllers/modules/searchbar');

router.get('/mess', searchBarController.searchMessByName);

module.exports = router