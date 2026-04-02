const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const ApiError = require('../utils/ApiError');

class AuthService {
    async login(email, password) {
        const user = await db.findUserByEmail(email);
        if (!user) {
            throw new ApiError(401, 'Invalid credentials');
        }

        if (user.status !== 'active') {
            throw new ApiError(403, 'Account is inactive. Please contact administrator.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const token = this.generateToken(user);
        
        // Exclude password from the returned user object
        const { password: _, ...userWithoutPassword } = user;
        
        return { user: userWithoutPassword, token };
    }

    generateToken(user) {
        const payload = {
            id: user.id,
            role: user.role
        };
        return jwt.sign(payload, process.env.JWT_SECRET || 'super_secret', { expiresIn: '1d' });
    }
}

module.exports = new AuthService();
