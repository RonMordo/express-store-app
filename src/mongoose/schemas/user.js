import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  displayName: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

export default mongoose.model("User", userSchema);
