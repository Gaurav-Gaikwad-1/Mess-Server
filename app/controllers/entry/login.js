const Customer = require('../../models/customer');
const Mess = require('../../models/mess');
const bcrypt = require('bcrypt');
const jwttoken = require('../modules/jwt');

exports.getLoginPage = (req, res) => {
    res.send("login page");
}

exports.customerLogin = (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    Customer.find({ email: email })
        .exec()
        .then(doc => {
            //check if email is present
            if (doc.length < 1) {
                res.status(400).json({
                    message: "User not registered",
                    error: "Email cannot be found"
                });
            } else {
                //check password match
                bcrypt.compare(password, doc[0].password, (err, result) => {
                    if (err) {
                        res.status(500).json({
                            message: "Internal server error",
                            error: err
                        })
                    }
                    if (result === true) {
                        //create token
                        const role = "customer";
                        const time = 60 * 60 * 10;
                        const jwt = new jwttoken();
                        const token = jwt.createToken(email, role, time);

                        //return response
                        res.status(200).json({
                            message: "success",
                            userId: doc[0]._id,
                            token: token
                                /*
                                refreshToken: refreshToken,
                                redirect: ""
                                */
                        })
                    } else {
                        res.status(400).json({
                            message: "Email and password combination doesnt match",
                            error: err
                        })
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            });
        })
}

exports.messLogin = (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    Mess.find({ email: email })
        .exec()
        .then(doc => {
            //check if email is present
            if (doc.length < 1) {
                res.status(400).json({
                    message: "User not registered",
                    error: "Email cannot be found"
                });
            } else {
                //check password match
                bcrypt.compare(password, doc[0].password, (err, result) => {
                    if (err) {
                        res.status(500).json({
                            message: "Internal server error",
                            error: err
                        })
                    }
                    if (result === true) {
                        //create token
                        const role = "mess";
                        const time = 60 * 60 * 10;
                        // const time = 60;
                        const jwt = new jwttoken();
                        const token = jwt.createToken(email, role, time);

                        //return response
                        res.status(200).json({
                            message: "success",
                            userId: doc[0]._id,
                            token: token
                        })
                    } else {
                        res.status(400).json({
                            message: "Email and password combination doesnt match",
                            error: err
                        })
                    }
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "internal server error",
                error: err
            });
        })
}