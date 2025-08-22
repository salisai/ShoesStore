import express from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} from "../controllers/order.controller.js";

import {validate} from "../middlewares/validate.middleware.js"
import {createOrderValidation} from "../validations/orderValidation.js"
const router = express.Router();

router.post("/", validate(createOrderValidation), createOrder);
router.get("/", getMyOrders);

router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);

router.delete("/:id", deleteOrder);

export default router; 