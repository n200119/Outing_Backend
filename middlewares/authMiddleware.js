const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // Get token from the Authorization header
    const token = req.headers["authorization"]; // Assuming the format is "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Access denied, no token provided" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.WHATISYOURNAME);
        req.mainEmail = decoded.mainEmail; // Attach the decoded information to the request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        console.log(`Token verification error: ${error}`);
        res.status(400).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
