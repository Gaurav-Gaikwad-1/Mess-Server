const express = require('express');
const router = express.Router();
const emailTest = require('../controllers/modules/smtp');

email = "adityadawadikar2000@gmail.com";

router.get("/successemail", async(req, res) => {
    try {
        await emailTest.successful_registration(email)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "some error occured"
        })
        return
    }
    res.status(200).json({
        message: "success"
    });
});

module.exports = router;