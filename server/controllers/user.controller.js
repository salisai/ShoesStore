import User from "../models/user.model.js"
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// REGISTER USER
export const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User already exists with this email");
    }

    const user = await User.create({ name, email, password, phone });

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.status(201).json(
        new ApiResponse(201, { user, accessToken, refreshToken }, "User registered successfully")
    );
});


// LOGIN USER
export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    // Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    res.status(200).json(
        new ApiResponse(200, { user, accessToken, refreshToken }, "Login successful")
    );
});

// GET USER
export const getProfile = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        throw new ApiError(401, "Not authorized");
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "Profile fetched successfully"));
});

// UPDATE PROFILE
export const updateProfile = asyncHandler(async (req, res, next) => {
    const { name, phone, address } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.status(200).json(new ApiResponse(200, user, "Profile updated successfully"));
});

// LOGOUT USER
export const logoutUser = asyncHandler(async (req, res, next) => {
    // If you are storing refresh tokens in DB or Redis, you’d remove it here.
    res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});
