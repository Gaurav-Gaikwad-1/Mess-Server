const nodemailer = require('nodemailer');

function successfulMessRegistration(recipient) {
    let subject = "Successful registration"
    let message = "congratulations!!! Now you have succefully registered to our website. Visit the website to setup your mess!!!"
    main(recipient, subject, message);
}

function successfulCustomerRegistration(recipient) {
    let subject = "Successful registration"
    let message = "congratulations!!! Now you have succefully registered to our website. Visit the website to checkout near by mess!!!"
    main(recipient, subject, message);
}

function requestOtp(object, recipient) {
    let subject = "OTP for user " + object.userId
    let message = "Dear user, Your one time password is " + object.otp + ". This Code is active only for next 10 mins. Please do no share this code with anyone."
    main(recipient, subject, message)
}

function successfullPasswordReset(recipient) {
    let subject = "Password reset successful";
    let message = "dear user " + recipient + " your password is successfully reset. try logging in with new password";
    main(recipient, subject, message);
}

function broadCast(recipients, subject, message) {
    main(recipients, subject, message)
}

function test() {
    let recipient = "adityadawadikar2000@gmail.com"
    let subject = "smtp test 1"
    let message = "smtp works"
    main(recipient, subject, message)
}

async function main(recipients, subject, message) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.APPLICATION_EMAIL,
            pass: process.env.APPLICATION_PASSWORD
        }
    });

    const email_option = {
        from: process.env.APPLICATION_EMAIL,
        to: recipients,
        subject: subject,
        text: message
    }

    transporter.sendMail(email_option, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
}

module.exports = {
    successfulMessRegistration,
    successfulCustomerRegistration,
    successfullPasswordReset,
    requestOtp,
    broadCast,
    test
}