const express = require('express');
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const ApiError = require('../utils/ApiError');

const router = express.Router();

// Validation middleware generator
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

        next(new ApiError(400, 'Validation Error', extractedErrors));
    };
};

router.post('/login', validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password must not be empty')
]), authController.login);

router.get('/me', authenticate, authController.getMe);

module.exports = router;
