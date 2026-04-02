const recordService = require('../services/record.service');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');

exports.createRecord = async (req, res, next) => {
    try {
        const record = await recordService.createRecord(req.body, req.user.id);
        res.status(201).json(new ApiResponse(201, record, 'Financial record created successfully'));
    } catch (error) {
        next(error);
    }
};

exports.getRecords = async (req, res, next) => {
    try {
        const filters = {
            type: req.query.type,
            category: req.query.category,
            startDate: req.query.startDate,
            endDate: req.query.endDate
        };
        const records = await recordService.getRecords(filters);
        res.status(200).json(new ApiResponse(200, records, 'Records retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

exports.getRecordById = async (req, res, next) => {
    try {
        const record = await recordService.getRecordById(req.params.id);
        res.status(200).json(new ApiResponse(200, record, 'Record retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

exports.updateRecord = async (req, res, next) => {
    try {
        const updatedRecord = await recordService.updateRecord(req.params.id, req.body);
        res.status(200).json(new ApiResponse(200, updatedRecord, 'Record updated successfully'));
    } catch (error) {
        next(error);
    }
};

exports.deleteRecord = async (req, res, next) => {
    try {
        await recordService.deleteRecord(req.params.id);
        res.status(200).json(new ApiResponse(200, null, 'Record deleted successfully'));
    } catch (error) {
        next(error);
    }
};
