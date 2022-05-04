const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Customer = require('../../models/customer');
const Mess = require('../../models/mess');
const Notifier = require('../modules/notifier');

exports.getRegisterPage = (req, res) => {
    res.send("register page");
}

//customer registration
exports.customerRegister = (req, res) => {
    var availabilityFlag = false;

    //check if the customer already exists
    Customer.find({ email: req.body.email })
        .exec()
        .then(doc => {
            if (doc.length < 1) {
                //new entry
                availabilityFlag = true;
                //if the email is available to used as new user, then create new user
                if (availabilityFlag === true) {
                    //hash the password received from request body
                    bcrypt.hash(req.body.password, 10, (err, result) => {
                        if (err) {
                            //send error response if error occurs while hashing password
                            res.status(500).json({
                                message: "error occured while storing the customer password",
                                error: "internal server error"
                            });
                        } else {
                            //create new customer with hashed password
                            const customerPassword = result;
                            const customer = new Customer({
                                _id: new mongoose.Types.ObjectId,
                                name: req.body.name,
                                email: req.body.email,
                                password: customerPassword,
                                phone: req.body.phone
                            });
                            //save new customer in the collection "customers"
                            customer.save()
                                .then(doc => {
                                    try {
                                        Notifier.successfulCustomerRegistration(req.body.email)
                                    } catch (err) {
                                        throw err
                                    }
                                    res.status(200).json({
                                        message: "success",
                                        customer: doc
                                    });
                                })
                                .catch(err => {
                                    console.log(err)
                                    res.status(500).json({
                                        message: "some error occured while storing new customer",
                                        error: "internal server error"
                                    });
                                });
                        }
                    })
                }
            } else {
                res.status(400).json({
                    message: "this email already exists, try logging in with this email or try another email and register"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while checking the records",
                error: "internal server error"
            });
        })
}

//mess registration
exports.messRegister = (req, res) => {
    var availabilityFlag = false;

    //check if the customer already exists
    Mess.find({ email: req.body.email })
        .exec()
        .then(doc => {
            if (doc.length < 1) {
                //new entry
                availabilityFlag = true;
                //if the email is available to used as new user, then create new user
                if (availabilityFlag === true) {
                    //hash the password received from request body
                    bcrypt.hash(req.body.password, 10, (err, result) => {
                        if (err) {
                            //send error response if error occurs while hashing password
                            res.status(500).json({
                                message: "error occured while storing the mess password",
                                error: "internal server error"
                            });
                        } else {
                            //create new customer with hashed password
                            const messPassword = result;
                            const reviewsObjectZero = {

                            }
                            const mess = new Mess({
                                _id: new mongoose.Types.ObjectId,
                                email: req.body.email,
                                password: messPassword,
                                messDetails: {
                                    messName: req.body.messDetails.messName,
                                    ownerName: req.body.messDetails.ownerName,
                                    phone: req.body.messDetails.phone,
                                    address: req.body.messDetails.address
                                },
                                price: {
                                    homeDelivery: {
                                        available: req.body.price.homeDelivery.available,
                                        DeliveryCharge: null
                                    },
                                    onVenue: {
                                        available: req.body.price.onVenue.available
                                    }
                                },
                                Speciality: [],
                                MenuList: [],
                                Rating: 0,
                                Reviews: {
                                    sum: 0,
                                    reviewers: []
                                }
                            });
                            //save new customer in the collection "customers"
                            mess.save()
                                .then(doc => {
                                    console.log(doc);
                                    try {
                                        Notifier.successfulMessRegistration(req.body.email)
                                    } catch (err) {
                                        throw err
                                    }
                                    res.status(200).json({
                                        message: "success",
                                        mess: doc
                                    });
                                }).catch(err => {
                                    console.log(err);
                                    res.status(500).json({
                                        message: "error occured while storing the mess details",
                                        error: "internal server error"
                                    });
                                })
                        }
                    })
                }
            } else {
                res.status(400).json({
                    message: "this email already exists, try logging in with this email or try another email and register"
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while checking the records",
                error: "internal server error"
            });
        })


}