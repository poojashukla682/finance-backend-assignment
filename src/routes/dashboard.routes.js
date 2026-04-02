const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Access summaries (Viewer, Analyst, Admin)
// Viewer can view dashboard data
router.get('/', authenticate, authorize('Viewer', 'Analyst', 'Admin'), dashboardController.getDashboardSummary);

module.exports = router;
