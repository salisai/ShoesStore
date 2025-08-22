// controllers/review.controller.js
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

// @desc Add a new review
export const createReview = asyncHandler(async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.user._id; // Assuming user is authenticated

    if (!productId || !rating) {
        throw new ApiError(400, "Product ID and rating are required");
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this product");
    }

    const review = await Review.create({
        user: userId,
        product: productId,
        rating,
        comment
    });

    return res
        .status(201)
        .json(new ApiResponse(201, review, "Review added successfully"));
});

// @desc Get all reviews for a product
export const getProductReviews = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, reviews, "Reviews fetched successfully"));
});

// @desc Update a review
export const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    // Ensure the logged-in user is the review owner
    if (review.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this review");
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    return res
        .status(200)
        .json(new ApiResponse(200, review, "Review updated successfully"));
});

// @desc Delete a review
export const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    if (review.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this review");
    }

    await review.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Review deleted successfully"));
});

// @desc Get single review by ID
export const getReviewById = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId).populate("user", "name email");
    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, review, "Review fetched successfully"));
});
