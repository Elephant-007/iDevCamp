const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Public/Admin
exports.getUsers = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});