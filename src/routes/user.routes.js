const express = require('express');
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const ApiError = require('../utils/ApiError');

const router = express.Router();

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) return next();
        const extractedErrors = [];
        errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));
        next(new ApiError(400, 'Validation Error', extractedErrors));
    };
};

// All user routes require authentication and Admin role
router.use(authenticate);
router.use(authorize('Admin'));

// Create User
router.post('/', validate([
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['Viewer', 'Analyst', 'Admin']).withMessage('Invalid role')
]), userController.createUser);

// Get All Users
router.get('/', userController.getAllUsers);

// Get User by ID
router.get('/:id', userController.getUserById);

// Update User
router.put('/:id', validate([
    body('role').optional().isIn(['Viewer', 'Analyst', 'Admin']).withMessage('Invalid role'),
    body('status').optional().isIn(['active', 'inactive']).withMessage('Invalid status')
]), userController.updateUser);

module.exports = router;
