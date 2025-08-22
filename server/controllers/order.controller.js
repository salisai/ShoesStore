// controllers/order.controller.js
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import asyncHandler from "../utils/AsynHandler.util.js";
import ApiError from "../utils/ErrorHandler.utils.js";
import ApiResponse from "../utils/ApiResponse.util.js";


//create order
export const createOrder = asyncHandler(async (req, res, next) => {
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



//get all orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("products.product");

  res
    .status(200)
    .json(new ApiResponse(200, orders, "User orders fetched successfully"));
});



//get one specific order
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("products.product");

  if (!order) throw new ApiError(404, "Order not found");

  // Only allow the owner or admin
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    throw new ApiError(403, "Not authorized to view this order");
  }

  res.status(200).json(new ApiResponse(200, order, "Order fetched successfully"));
});



//update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) throw new ApiError(404, "Order not found");

  order.orderStatus = status || order.orderStatus;
  await order.save();

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});


//delete order
export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) throw new ApiError(404, "Order not found");

  await order.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, null, "Order deleted successfully"));
});
