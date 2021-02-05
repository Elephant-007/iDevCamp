const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await Review.find({ bootcamp: req.params.bootcampId });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc    Get single review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });

    if (!review) {
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc    Add review
// @route   POST /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
    // update bootcamp id and user id
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    // find bootcamp
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    // throw error if bootcamp DOES NOT exists in the database
    if (!bootcamp) {
        return next(
            new ErrorResponse(`No bootcamp with the Id: ${req.params.bootcampId}`, 404));
    }

    // if bootcamp exists create a review 
    const review = await Review.create(req.body);

    // respond the review
    res.status(201).json({
        success: true,
        data: review
    });
});

// @desc    Update review
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    // find the review from the database
    let review = await Review.findById(req.params.id);

    // validate that the review exists in the database
    if (!review) {
        return next(
            new ErrorResponse(`No review found in the database with the Id: ${req.params.id}`, 404));
    }
    // Make sure review belongs to the user and/or the user is an ADMIN
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Not authorized to update review`, 401));
    }
    // update the review
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    // respond with the updated review
    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc    Delete review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    // find the review from the database
    const review = await Review.findById(req.params.id);

    // validate that the review exists in the database
    if (!review) {
        return next(
            new ErrorResponse(`No review found in the database iwth the Id: ${req.params.id}`, 404));
    }

    // Make sure review belongs to the user and/or the user is an ADMIN
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`Not authorized to delete review`, 404));
    }

    // delete the review
    await review.remove();

    // send response
    res.status(200).json({
        success: true,
        data: {}
    });
});