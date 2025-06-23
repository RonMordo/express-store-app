import mongoose from "mongoose";

const Product = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  price: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  description: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  image: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  rating: {
    type: mongoose.Schema.Types.String,
  },
});

export default mongoose.model("Product", Product);
