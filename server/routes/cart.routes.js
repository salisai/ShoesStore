import express from "express";
import {
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    addToCart
} from "../controllers/cart.controller.js";

import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = express.Router();

router.get("/", verifyJWT, getCart);
router.post("/", verifyJWT, addToCart);
router.put("/", verifyJWT, updateCartItem);
router.delete("/:itemId", verifyJWT, removeFromCart);

router.delete("/", verifyJWT, clearCart);

export default router; 