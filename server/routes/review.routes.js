import express from 'express';
import {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview,
    getReviewById
} from "../controllers/review.controller.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post("/", verifyJWT, createReview);

router.get("/product/:productId", getProductReviews);

router.get("/:reviewId", getReviewById);

router.put("/:reviewId", verifyJWT, updateReview);

router.delete("/:reviewId", verifyJWT, deleteReview);

export default router;