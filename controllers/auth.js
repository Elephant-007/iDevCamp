const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../models/sendEmail');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async(req, res, next) => {
    // destructure
    const { name, email, password, role } = req.body;
    
    // Create user
    const user = await User.create({
        name,
        email, 
        password,
        role
    });

    sendTokenResponse(user, 200, res);
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async(req, res, next) => {
    // destructure
    const { email, password } = req.body;
    
    // Validate Email and Password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // check for user
    const user = await User.findOne({email}).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // check if password matches
    const isMatch = await user.matchPassword(password);

    // Create token
    const token = user.getSignedJwtToken();

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data:user
    });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async(req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(
            new ErrorResponse(`No user with email: ${req.body.email} found in the database`,
            404
            )
        );
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    // console.log('reset token --> ' + resetToken);
    await user.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
        data:user
    });
});

// Get token from model, create cookie and send response
const sendTokenResponse  = (user, statusCode, res) =>  {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    // For Production state set secure to true so cookie is send over HTTPS
    if (process.env.NODE.ENV === 'production') {
        options.secure = true;
    }

    res
      .status(statusCode)
      .cookie('token', token, options)
      .json({
          success: true,
          token
      });
};