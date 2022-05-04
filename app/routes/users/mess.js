const express = require('express');
const router = express.Router();

const messAuth = require('../../controllers/auth/messAuth');
const messControllers = require('../../controllers/users/mess');

//get all mess
router.get('/all', messControllers.getAllMess);

//get mess by email
router.get('/email', messControllers.getMessByEmail);

//get mess by id
router.get('/:id', messControllers.getMessById);

//update mess by id
router.patch('/update/:id', messAuth, messControllers.updateMessById);

//delete mess
router.delete('/delete/:id', messAuth, messControllers.deleteMessById);

module.exports = router;