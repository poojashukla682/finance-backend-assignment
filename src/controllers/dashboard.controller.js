const dashboardService = require('../services/dashboard.service');
const ApiResponse = require('../utils/ApiResponse');

exports.getDashboardSummary = async (req, res, next) => {
    try {
        const summary = await dashboardService.getSummary();
        res.status(200).json(new ApiResponse(200, summary, 'Dashboard summary fetched successfully'));
    } catch (error) {
        next(error);
    }
};
