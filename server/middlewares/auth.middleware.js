import {ApiError} from "../utils/ApiError.js"
import {catchAsync} from "../utils/catchAsync.js"
import User from "../models/User.model.js"
import jwt from "jsonwebtoken"

//for route protection
export const verifyJWT = catchAsync(async(req, res) => {
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");

        if(token){
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken"
        )

        if(!user){
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user 
        next()

    }catch(error){
        throw new ApiError(401, error?.message || "Invalid access Token")
    }
});



export const isAdmin = (req, res, next) => {
    if(req.user && req.user.role === "admin"){
        next();
    } else {
        throw new ApiError(403, error?.message || "Access denied. Admins only.")
    }
}