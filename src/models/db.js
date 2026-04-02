const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Mock Database Implementation
// Using async methods to simulate real database latency and Promise-based APIs.

class Database {
    constructor() {
        this.users = [];
        this.records = [];
        this._initializeAdmin();
    }

    // Initialize a default admin user
    async _initializeAdmin() {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        this.users.push({
            id: uuidv4(),
            name: 'Super Admin',
            email: 'admin@finance.com',
            password: hashedPassword,
            role: 'Admin',
            status: 'active',
            createdAt: new Date().toISOString()
        });
    }

    // --- USER METHODS ---
    
    async findUserByEmail(email) {
        return this.users.find(u => u.email === email) || null;
    }

    async findUserById(id) {
        return this.users.find(u => u.id === id) || null;
    }

    async createUser(userData) {
        const newUser = {
            id: uuidv4(),
            ...userData,
            status: userData.status || 'active',
            createdAt: new Date().toISOString()
        };
        this.users.push(newUser);
        return newUser;
    }

    async getAllUsers() {
        // Exclude passwords
        return this.users.map(({ password, ...user }) => user);
    }

    async updateUser(id, updateData) {
        const index = this.users.findIndex(u => u.id === id);
        if (index === -1) return null;

        // Ensure we don't accidentally update id
        const { id: _id, ...safeUpdateData } = updateData;
        
        this.users[index] = { ...this.users[index], ...safeUpdateData };
        return this.users[index];
    }

    // --- RECORD METHODS ---

    async getAllRecords(filters = {}) {
        let results = [...this.records];
        
        if (filters.type) {
            results = results.filter(r => r.type === filters.type);
        }
        if (filters.category) {
            results = results.filter(r => r.category === filters.category);
        }
        if (filters.startDate) {
            results = results.filter(r => new Date(r.date) >= new Date(filters.startDate));
        }
        if (filters.endDate) {
            results = results.filter(r => new Date(r.date) <= new Date(filters.endDate));
        }
        
        return results.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    async getRecordById(id) {
        return this.records.find(r => r.id === id) || null;
    }

    async createRecord(recordData) {
        const newRecord = {
            id: uuidv4(),
            ...recordData,
            createdAt: new Date().toISOString()
        };
        this.records.push(newRecord);
        return newRecord;
    }

    async updateRecord(id, updateData) {
        const index = this.records.findIndex(r => r.id === id);
        if (index === -1) return null;

        const { id: _id, ...safeUpdateData } = updateData;
        this.records[index] = { ...this.records[index], ...safeUpdateData };
        return this.records[index];
    }

    async deleteRecord(id) {
        const index = this.records.findIndex(r => r.id === id);
        if (index === -1) return false;
        
        // Hard delete for simplicity, could implement soft delete if requested
        this.records.splice(index, 1);
        return true;
    }
}

// Export a singleton instance
module.exports = new Database();
