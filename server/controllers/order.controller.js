// controllers/order.controller.js
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import asyncHandler from "../utils/AsynHandler.util.js";
import ApiError from "../utils/ErrorHandler.utils.js";
import ApiResponse from "../utils/ApiResponse.util.js";


//create order
export const createOrder = asyncHandler(async (req, res) => {
  const { products, shippingAddress } = req.body;
  const userId = req.user._id; // assuming you attach user from auth middleware

  if (!products || products.length === 0) {
    throw new ApiError(400, "No products in the order.");
  }

  // Calculate total price dynamically
  let totalPrice = 0;
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new ApiError(404, `Product not found: ${item.product}`);
    }
    totalPrice += item.quantity * product.price;
  }

  const newOrder = await Order.create({
    user: userId,
    products,
    shippingAddress,
    totalPrice,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newOrder, "Order created successfully"));
});



//get all user orders
export const getMyOrders = asyncHandler(async (req, res) => {  
  const orders = await Order.find({ user: req.user._id }).populate("products.product");

  res
    .status(200)
    .json(new ApiResponse(200, orders, "User orders fetched successfully"));
});



//delete order(user only)
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) throw new ApiError(404, "Order not found");

  if(order.user.toString() !== req.user._id.toString()){
    throw new ApiError(403, "Not authorized to delete this order");
  }

  if(order.orderStatus !== "pending"){
    throw new ApiError(400, "Only pending orders can be cancelled");
  }

  await order.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, deleteOrder, "Order deleted successfully"));
});
