const express = require('express');
const router = express.Router();

const messAuth = require('../../controllers/auth/messAuth');
const custAuth = require('../../controllers/auth/customerAuth');
const currentMenuController = require('../../controllers/modules/currentMenu');

router.get('/all', custAuth, currentMenuController.getAllMenus);

router.get('/:id', custAuth, currentMenuController.getMenuById);

router.post('/new', messAuth, currentMenuController.postNewMenu);

router.patch('/update/:id', messAuth, currentMenuController.updateCurrentMenuById);

router.delete('/delete/:id', messAuth, currentMenuController.deleteCurrentMenuById);

module.exports = router;