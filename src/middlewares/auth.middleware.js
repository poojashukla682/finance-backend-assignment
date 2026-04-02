const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const db = require('../models/db');

/**
 * Middleware to authenticate user via JWT
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'Unauthorized access: No token provided');
        }

        const token = authHeader.split(' ')[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_for_evaluation');
        
        // Fetch user context
        const user = await db.findUserById(decoded.id);
        if (!user) {
            throw new ApiError(401, 'Unauthorized access: User not found attached to token');
        }

        if (user.status !== 'active') {
            throw new ApiError(403, 'Account is inactive. Please contact administrator.');
        }

        req.user = user;
        next();
    } catch (error) {
        // Distinguish between token expiration vs other JWT errors
        if (error.name === 'TokenExpiredError') {
            next(new ApiError(401, 'Token has expired'));
        } else if (error.name === 'JsonWebTokenError') {
            next(new ApiError(401, 'Invalid token'));
        } else {
            next(error);
        }
    }
};

/**
 * Middleware for Role-Based Access Control
 * @param  {...string} roles - array of allowed roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ApiError(403, `Forbidden: Requires one of these roles: ${roles.join(', ')}`));
        }
        next();
    };
};

module.exports = {
    authenticate,
    authorize
};
