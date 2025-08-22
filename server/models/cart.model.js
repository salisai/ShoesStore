import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
        {
            product: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Product" 
            },
            size: String,
            color: String,
            quantity: { 
                type: Number, 
                default: 1 
            }
        }
    ]
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
