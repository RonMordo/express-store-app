import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  message: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

export default mongoose.model("Message", messageSchema);
