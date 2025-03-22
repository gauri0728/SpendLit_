const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user info to the request
        next();
    } catch (err) {
        res.status(403).json({ msg: 'Invalid token' });
    }
};

module.exports = authenticate;
