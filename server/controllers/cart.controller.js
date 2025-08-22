// controllers/cart.controller.js
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// 🛒 Get user's cart
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  if (!cart) {
    return res
      .status(200)
      .json(new ApiResponse(200, { items: [] }, "Cart is empty"));
  }

  res.status(200).json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

// 🛒 Add item to cart
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, size, color, quantity } = req.body;

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  // Check if item already in cart
  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color === color
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, size, color, quantity });
  }

  await cart.save();
  res.status(200).json(new ApiResponse(200, cart, "Item added to cart"));
});

// 🛒 Update item quantity
export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, "Cart not found");

  const item = cart.items.id(itemId);
  if (!item) throw new ApiError(404, "Cart item not found");

  if (quantity <= 0) {
    // remove item if quantity set to 0
    cart.items.id(itemId).remove();
  } else {
    item.quantity = quantity;
  }

  await cart.save();
  res.status(200).json(new ApiResponse(200, cart, "Cart updated"));
});

// 🛒 Remove item from cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, "Cart not found");

  const item = cart.items.id(itemId);
  if (!item) throw new ApiError(404, "Cart item not found");

  item.remove();
  await cart.save();

  res.status(200).json(new ApiResponse(200, cart, "Item removed from cart"));
});

// 🛒 Clear entire cart
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw new ApiError(404, "Cart not found");

  cart.items = [];
  await cart.save();

  res.status(200).json(new ApiResponse(200, cart, "Cart cleared"));
});
