const express = require('express');
const router = express.Router();

const messAuth = require('../../controllers/auth/messAuth');
const messMenuControllers = require('../../controllers/modules/menuList');

//get all saved menu by mess user
router.get('/all/:messid', messAuth, messMenuControllers.getMyMenus);

//add new menu to menu list
router.post('/new/:messid', messAuth, messMenuControllers.addNewMenu);

//get menu by id
router.get('/:messid/:menuid', messMenuControllers.getMenuById);

//update a menu
router.patch('/update/:messid/:menuid', messAuth, messMenuControllers.updateMenuById);

//delete a menu
router.delete('/delete/:messid/:menuid', messAuth, messMenuControllers.deleteMenuById);

module.exports = router;