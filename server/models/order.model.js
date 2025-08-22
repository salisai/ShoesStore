import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            size: String,
            color: String,
            quantity: { type: Number, default: 1 },
            price: Number
        }
    ],
    totalPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    orderStatus: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancelled"],
        default: "processing"
    },
    shippingAddress: {
        street: String,
        city: String,
        country: String,
        postalCode: String
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
