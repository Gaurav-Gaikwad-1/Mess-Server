const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const payload = req.headers.authorization;
    if (payload) {
        try {
            const token = payload.split(' ')[1];
            jwt.verify(token, process.env.JWT_KEY, (err, verified) => {
                if (err) {
                    res.status(401).json({
                        message: "Auth failed",
                        error: "token expired"
                    })
                } else {
                    const decoded = jwt.decode(token);
                    if (decoded.role === "mess") {
                        next()
                    } else {
                        res.status(401).json({
                            message: "Auth failed",
                            error: "cannot grant access to the resource"
                        })
                    }
                }
            })
        } catch (err) {
            res.status(401).json({
                message: "Auth failed",
                error: "token was tampered"
            })
        }


    } else {
        res.status(401).json({
            message: "Auth failed",
            error: "token not found"
        })
    }
}