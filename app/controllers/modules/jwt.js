const jwt = require('jsonwebtoken');

module.exports = class Authorization {
    constructor() {}

    //send token
    createToken(email, role, time) {
        const token = jwt.sign({
                email: email,
                role: role,
                refreshToken: false
            },
            process.env.JWT_KEY, {
                expiresIn: time
            }
        );
        const refreshToken = jwt.sign({
                email: email,
                role: role,
                refreshToken: true
            },
            process.env.JWT_KEY, {
                expiresIn: time * 2
            }
        );

        let tokenObject = {
            token: token,
            refreshToken: refreshToken
        }

        return tokenObject;
    }

    //send forgot password token
    createForgotPasswordToken(email, userId, role, time) {
        const token = jwt.sign({
                email: email,
                userId: userId,
                role: role
            },
            process.env.JWT_KEY, {
                expiresIn: time
            }
        );
        return token
    }

    //verify token 
}