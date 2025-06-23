import User from "../mongoose/schemas/user.js";
import { hashPassword } from "../utils/helpers.js";

const getAllUsers = async () => {
  const users = await User.find();
  if (!users) {
    const err = new Error("No users found");
    err.status = 404;
    throw err;
  }
  return users;
};

const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      const err = new Error("User not found");
      err.status = 404;
      throw err;
    }
    return user;
  } catch (err) {
    if (err.name === "CastError") {
      const err = new Error("Invalid user ID");
      err.status = 400;
      throw err;
    }
    throw err;
  }
};

const createNewUser = async ({ email, username, password, displayName }) => {
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      displayName,
    });
    return await newUser.save();
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("Email or username already exists");
      error.status = 409; // Conflict
      throw error;
    }
    throw err;
  }
};

const updateUser = async (userData) => {
  const { userId, updatedData } = userData;
  const user = await getUserById(userId);
  user = { userId, ...updatedData };
  return user.save();
};

const deleteUser = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deleteUser) {
    const err = new Error("User not found");
    err.status(400);
    throw err;
  }
  return deletedUser;
};

export default {
  createNewUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
