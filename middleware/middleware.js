const jwt = require("jsonwebtoken");

const authorized = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).send({success: false, msg: "You need token"});
    }

    jwt.verify(token, 'abcdefghijklmnopqrstuvwxyz', (error, user) => {
        if (error) {
            return res.status(400).send("Invalid token");
        }
        req.user = user;
        next();
    });
}

module.exports = authorized;
