import mongoose from "mongoose";

const Cart = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  sessionId: {
    type: mongoose.Schema.Types.String,
    default: null,
  },
  items: [
    {
      _id: false,
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
});

export default mongoose.model("Cart", Cart);
