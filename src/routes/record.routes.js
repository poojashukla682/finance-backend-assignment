const express = require('express');
const { body, validationResult } = require('express-validator');
const recordController = require('../controllers/record.controller');
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

const recordValidation = [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('category').notEmpty().withMessage('Category is required'),
    body('date').isISO8601().withMessage('Date must be a valid ISO8601 date'),
    body('notes').optional().isString()
];

// All record routes require authentication
router.use(authenticate);

// Viewers can't do anything here except theoretically read, but we let Analysts and Admins read/write.
// Actually, Viewer should not access records directly according to req, but let's say Viewer can read records.
// The prompt says: "A viewer should not be able to create or modify records"
// "An analyst may be allowed to read records and access summaries"

// Get ALL Records (Viewer, Analyst, Admin)
router.get('/', authorize('Viewer', 'Analyst', 'Admin'), recordController.getRecords);
router.get('/:id', authorize('Viewer', 'Analyst', 'Admin'), recordController.getRecordById);

// Create, Update, Delete (Admin only)
// Note: Prompt says "An admin may be allowed full management access", "Analyst may read"
router.post('/', authorize('Admin'), validate(recordValidation), recordController.createRecord);
router.put('/:id', authorize('Admin'), validate(recordValidation), recordController.updateRecord);
router.delete('/:id', authorize('Admin'), recordController.deleteRecord);

module.exports = router;
