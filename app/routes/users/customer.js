const express = require('express');
const router = express.Router();
const customerAuth = require('../../controllers/auth/customerAuth');

const customerController = require('../../controllers/users/customer');

//get all customers
router.get('/all', customerController.getAllCustomers);

//get customer by email
router.get('/email', customerController.getCustomerByEmail);

//get customer by id
router.get('/:id', customerController.getCustomerById);

//update customer by id
router.patch('/update/:id', customerAuth, customerController.updateCustomerById);

//delete customer
router.delete('/delete/:id', customerAuth, customerController.deleteCustomerById);

module.exports = router;