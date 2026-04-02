const db = require('../models/db');
const ApiError = require('../utils/ApiError');
const bcrypt = require('bcryptjs');

class UserService {
    async createUser(data) {
        // Check if email already exists
        const existing = await db.findUserByEmail(data.email);
        if (existing) {
            throw new ApiError(400, 'User with this email already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const newUser = await db.createUser({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: data.role || 'Viewer', // Default to Viewer if not provided
            status: data.status || 'active'
        });

        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    }

    async getAllUsers() {
        return await db.getAllUsers();
    }

    async getUserById(id) {
        const user = await db.findUserById(id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async updateUser(id, updateData) {
        // Prevent password and email update from this basic flow for simplicity
        if (updateData.password) {
            delete updateData.password;
        }
        
        if (updateData.email) {
            const existing = await db.findUserByEmail(updateData.email);
            if (existing && existing.id !== id) {
                throw new ApiError(400, 'Email is already taken by another user');
            }
        }

        const updated = await db.updateUser(id, updateData);
        if (!updated) {
            throw new ApiError(404, 'User not found');
        }

        const { password: _, ...userWithoutPassword } = updated;
        return userWithoutPassword;
    }
}

module.exports = new UserService();
