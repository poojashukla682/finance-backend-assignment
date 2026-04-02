const userService = require('../services/user.service');
const ApiResponse = require('../utils/ApiResponse');

exports.createUser = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json(new ApiResponse(201, user, 'User created successfully'));
    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(new ApiResponse(200, users, 'Users retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json(new ApiResponse(200, user, 'User retrieved successfully'));
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        res.status(200).json(new ApiResponse(200, updatedUser, 'User updated successfully'));
    } catch (error) {
        next(error);
    }
};
