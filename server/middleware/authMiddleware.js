const jwt = require("jsonwebtoken");

const authMiddleware = (requiredRole) => {
    return (req, res, next) => {
        try {
            // Extract token from the Authorization header
            const token = req.header("Authorization")?.split(" ")[1];
            if (!token) {
                return res.status(401).json({ message: "Access denied. No token provided." });
            }

            // Verify the token and attach user information to req.user
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            // Debugging logs (use only during development)
            if (process.env.NODE_ENV !== "production") {
                console.log("Decoded Token:", req.user);
            }

            // Check if the user's role matches the required role
            if (requiredRole) {
                // If `requiredRole` is a single role, convert it to an array for consistency
                const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

                // Deny access if the user's role is not in the allowed roles
                if (!roles.includes(req.user.role)) {
                    console.log(
                        `Access denied. User Role: ${req.user.role}, Allowed Roles: ${roles.join(", ")}`
                    );
                    return res.status(403).json({
                        message: "Access denied. Insufficient permissions.",
                    });
                }
            }

            // Allow the request to proceed
            next();
        } catch (err) {
            console.error("Token verification error:", err.message);
            res.status(400).json({ message: "Invalid token" });
        }
    };
};


module.exports = authMiddleware;
