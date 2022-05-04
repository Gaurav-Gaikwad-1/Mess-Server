const jwttoken = require('../modules/jwt');

exports.getMessNewToken = (req, res) => {
    email = req.body.email
    userId = req.body._id

    //create token
    const role = "mess";
    const time = 60 * 60 * 10;
    const jwt = new jwttoken();
    const token = jwt.createToken(email, role, time);

    //return response
    res.status(200).json({
        message: "success",
        userId: userId,
        token: token
    })
}

exports.getCustomerNewToken = (req, res) => {
    email = req.body.email

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
    })
}