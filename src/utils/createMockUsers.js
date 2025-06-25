import mongoose from "mongoose";
import User from "../mongoose/schemas/user.js";
import { hashPassword } from "./helpers.js";
import dotenv from "dotenv";

dotenv.config();
// const dbUri = "mongodb://localhost/shopping-app";
const dbUri = process.env.MONGODB_URI;

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
    username: "alice123",
    displayName: "Alice Johnson",
  },
  {
    email: "bob@example.com",
    username: "bobby",
    displayName: "Bob Smith",
  },
  {
    email: "carol@example.com",
    username: "carol_87",
    displayName: "Carol Davis",
  },
  {
    email: "dave@example.com",
    username: "dave92",
    displayName: "Dave Brown",
  },
  {
    email: "eve@example.com",
    username: "eve_tech",
    displayName: "Eve Taylor",
  },
  {
    email: "frank@example.com",
    username: "frankie",
    displayName: "Frank Miller",
  },
  {
    email: "grace@example.com",
    username: "grace_hopper",
    displayName: "Grace Hopper",
  },
  {
    email: "heidi@example.com",
    username: "heidi01",
    displayName: "Heidi Wilson",
  },
  {
    email: "ivan@example.com",
    username: "ivan_the_great",
    displayName: "Ivan Anderson",
  },
  {
    email: "judy@example.com",
    username: "judy_dev",
    displayName: "Judy Martinez",
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
