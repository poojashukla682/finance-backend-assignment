const db = require('../models/db');
const ApiError = require('../utils/ApiError');

class RecordService {
    async createRecord(recordData, userId) {
        return await db.createRecord({
            ...recordData,
            createdBy: userId
        });
    }

    async getRecords(filters) {
        return await db.getAllRecords(filters);
    }

    async getRecordById(id) {
        const record = await db.getRecordById(id);
        if (!record) {
            throw new ApiError(404, 'Financial record not found');
        }
        return record;
    }

    async updateRecord(id, updateData) {
        const updated = await db.updateRecord(id, updateData);
        if (!updated) {
            throw new ApiError(404, 'Financial record not found');
        }
        return updated;
    }

    async deleteRecord(id) {
        const deleted = await db.deleteRecord(id);
        if (!deleted) {
            throw new ApiError(404, 'Financial record not found');
        }
    }
}

module.exports = new RecordService();
