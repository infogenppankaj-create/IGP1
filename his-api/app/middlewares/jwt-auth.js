const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.JWT_SECRET;
//
const authenticateJWT = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        //
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            //
            jwt.verify(token, accessTokenSecret, (err, user) => {
                if (err) {
                    return res.status(403).send({
                        message: 'Invalid token',
                    });
                }
                req.user = user; // Store user information in request
                next();  
            });
        } else {
            res.status(401).send({
                message: 'Authorization is required',
            });
        }
    } catch (error) {
        console.error("Error in authenticateJWT:", error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

module.exports = authenticateJWT;