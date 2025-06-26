import User from "../mongoose/schemas/user.js";
import productService from "./products.service.js";
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

const emailExists = async ({ email }) => {
  try {
    const user = await User.exists({ email });
    return user ? true : false;
  } catch (err) {
    const error = new Error(err);
    error.status(500);
    throw error;
  }
};

const createNewUser = async ({ email, name, password }) => {
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
    });
    return await newUser.save();
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error("Email already exists");
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

const addProductToFavorites = async ({ userId, productId }) => {
  try {
    await productService.getProduct(productId);
    await User.findByIdAndUpdate(userId, {
      $addToSet: { favorites: productId },
    });
  } catch (err) {
    const error = new Error(err);
    error.status = 500;
    throw error;
  }
};

const removeProductFromFavorites = async ({ userId, productId }) => {
  try {
    console.log(userId, productId);
    await User.findByIdAndUpdate(userId, {
      $pull: { favorites: productId },
    });
  } catch (err) {
    const error = new Error(err);
    error.status = 500;
    throw error;
  }
};

const getFavorites = async (userId) => {
  try {
    const user = await User.findById(userId).populate("favorites");
    return user.favorites;
  } catch (err) {
    const error = new Error("Error fetching favorites");
    error.status = 500;
    throw error;
  }
};

export default {
  createNewUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  emailExists,
  addProductToFavorites,
  getFavorites,
  removeProductFromFavorites,
};
