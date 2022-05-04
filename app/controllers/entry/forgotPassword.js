const Mess = require('../../models/mess');
const Customer = require('../../models/customer');
const Otp = require('../../models/otp');
const bcrypt = require('bcrypt');
const jwtToken = require('../modules/jwt');
const Notifier = require('../modules/notifier');

function createRandomPassword() {
    return Math.floor(Math.random() * 100000)
}

exports.sendOtp = async(req, res) => {
    let randomNumber = createRandomPassword();
    let userId = 0;
    if (req.body.role === "mess") {
        await Mess.findOne({ email: req.body.email })
            .then(doc => {
                userId = doc._id
            })
            .catch(err => {
                res.status(500).json({
                    message: "some error occured while finding user",
                    error: err
                });
            })
    } else if (req.body.role === "customer") {
        await Customer.findOne({ email: req.body.email })
            .then(doc => {
                userId = doc._id
            })
            .catch(err => {
                res.status(500).json({
                    message: "some error occured while finding user",
                    error: err
                });
            })
    }
    let otp = new Otp({
        otp: randomNumber,
        role: req.body.role,
        email: req.body.email,
        userId: userId
    })

    console.log(otp)

    otp.save()
        .then(doc => {
            let object = {
                userId: userId,
                otp: randomNumber
            }
            try {
                Notifier.requestOtp(object, req.body.email)
            } catch (err) {
                throw err
            }
            res.status(200).json({
                message: "success",
                otp: doc
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "some error occured while saving otp",
                error: err
            });
        })
}

exports.verifyOtp = async(req, res) => {
    await Otp.findOne({ otp: req.body.otp })
        .then(doc => {
            if (doc != null) {
                Otp.findByIdAndDelete({ _id: doc._id })
                    .then(doc => {
                        const jwt = new jwtToken();
                        let token = jwt.createForgotPasswordToken(doc.email, doc.userId, doc.role, 60 * 10);
                        res.status(200).json({
                            message: "success",
                            token: token
                        })
                    })
                    .catch(err => {
                        throw new Error(err)
                    })
            } else {
                res.status(401).json({
                    message: "something went wrong, either OTP expired or Invalid OTP was sent",
                    doc: doc
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "some error occured while finding otp",
                error: err
            });
        })
}

exports.setNewMessPassword = async(req, res) => {
    await bcrypt.hash(req.body.password, 10, (err, result) => {
        if (err) {
            res.status(500).json({
                message: "some error occured while storing data"
            })
        }
        if (result) {
            Mess.findOneAndUpdate({ email: req.body.email }, { password: result })
                .then(doc => {
                    try {
                        Notifier.successfullPasswordReset(req.body.email);
                    } catch (err) {
                        throw err
                    }
                    res.status(200).json({
                        message: "successfully password reset",
                        doc: doc
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        message: "some error occured while updating data"
                    })
                })
        }
    })
}

exports.setNewCustomerPassword = async(req, res) => {
    await bcrypt.hash(req.body.password, 10, (err, result) => {
        if (err) {
            res.status(500).json({
                message: "some error occured while storing data"
            })
        }
        if (result) {
            Customer.findOneAndUpdate({ email: req.body.email }, { password: result })
                .then(doc => {
                    try {
                        Notifier.successfullPasswordReset(req.body.email);
                    } catch (err) {
                        throw err
                    }
                    res.status(200).json({
                        message: "successfully password reset",
                        doc: doc
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        message: "some error occured while updating data"
                    })
                })
        }
    })
}