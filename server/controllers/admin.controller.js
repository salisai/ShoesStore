import User from "../models/user.model.js";
import Product from "../models/product.model.js"
import Order from "../models/order.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


//USER MANAGEMENT 
export const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find();

    return res.status(200).json(new ApiResponse(200, users, "Users fetched"));
});

export const getUserById = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user, "User fetched successfully"))
});


export const deleteUser = asyncHandler(async(req, res) =>  {
    const user = await User.findByIdAndDelete(req.params.id);

    if(!user){
        throw new ApiError(404, "User not found")
    }

    return res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
})


//PRODUCT MANAGEMENT
export const createProduct = asyncHandler(async(req, res) => {
    const product = await Product.create(req.body);

    res.status(201).json(new ApiResponse(201,product, "Product added successfully"));
});

export const updateProduct = asyncHandler(async(req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});

    if(!product){
        throw new ApiError(405, "Product not found");
    }

    return res
    .status(200)
    .json(new ApiResponse())
})