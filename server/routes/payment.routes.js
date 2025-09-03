import express from "express";
import { createStripePayment, createEasyPaisaPaymentController, createJazzCashPaymentController } from "../controllers/payment.controller";
import {verifyJWT} from "../middlewares/auth.middleware.js"
const router = express.Router();

router.post("/stripe",verifyJWT, createStripePayment);
router.post("/jazzcash", createJazzCashPaymentController);
router.post("/easypaisa", createEasyPaisaPaymentController)