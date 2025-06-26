import mongoose from "mongoose";
import User from "../mongoose/schemas/user.js";
import { hashPassword } from "./helpers.js";
import dotenv from "dotenv";

dotenv.config();
const dbUri = "mongodb://localhost/shopping-app";
// const dbUri = process.env.MONGODB_URI;

const rawPasswords = [
  "password1",
  "password2",
  "password3",
  "password4",
  "password5",
  "password6",
  "password7",
  "password8",
  "password9",
  "password10",
];

const mockUsers = [
  {
    email: "alice@example.com",
    name: "Alice Johnson",
  },
  {
    email: "bob@example.com",
    name: "Bob Smith",
  },
  {
    email: "carol@example.com",
    name: "Carol Davis",
  },
  {
    email: "dave@example.com",
    name: "Dave Brown",
  },
  {
    email: "eve@example.com",
    name: "Eve Taylor",
  },
  {
    email: "frank@example.com",
    name: "Frank Miller",
  },
  {
    email: "grace@example.com",
    name: "Grace Hopper",
  },
  {
    email: "heidi@example.com",
    name: "Heidi Wilson",
  },
  {
    email: "ivan@example.com",
    name: "Ivan Anderson",
  },
  {
    email: "judy@example.com",
    name: "Judy Martinez",
  },
];

(async () => {
  const hashedPasswords = await Promise.all(
    rawPasswords.map((password) => hashPassword(password))
  );
  mockUsers.forEach((user) => {
    user.password = hashedPasswords.shift();
  });
  try {
    await mongoose.connect(dbUri);
    console.log("Connected to DB");
    await User.insertMany(mockUsers);
    console.log("Users added");
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  } catch (err) {
    console.log("Error adding mock users", err);
  }
})();
