const jwt = require("jsonwebtoken");

async function optionalAuthMiddleware(req, res, next) {
    const token = req.cookies.token
    
    // No token provided - proceed as anonymous user
    if(!token) {
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message:"Token expired"
            });
        }
        return res.status(401).json({
            message:"Invalid token"
        });
    }
}

module.exports = optionalAuthMiddleware;
