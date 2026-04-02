const authService = require('../services/auth.service');
const ApiResponse = require('../utils/ApiResponse');

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        
        res.status(200).json(new ApiResponse(200, result, 'Login successful'));
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        // req.user is populated by the authMiddleware
        const { password: _, ...userWithoutPassword } = req.user;
        res.status(200).json(new ApiResponse(200, { user: userWithoutPassword }, 'User profile fetched successfully'));
    } catch (error) {
        next(error);
    }
};
