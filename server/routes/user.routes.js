import express from "express";
import {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    logoutUser
} from "../controllers/user.controller.js"

import {validate} from "../middlewares/validate.middleware.js"
import {
    registerValidation,
    loginValidation,
    updateUserValidation
} from "../validations/userValidation.js"


const router = express.Router();

router.post("/register", validate(registerValidation), registerUser);
router.post("/login", validate(loginValidation), loginUser);
router.get("/profile", getProfile);
router.put("/profile", validate(updateUserValidation), updateProfile);

router.post("/logout", loginUser);

export default router;