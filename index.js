import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import passport from "passport";

import router from "./src/routes/index.js";
import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// __dirname setup for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const HTML_PATH = path.join(__dirname, "src/public/html");

// Init express app
const app = express();

// Init PORT
const PORT = process.env.PORT || 3000;

// Connect to mongodb
const uri =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI
    : "mongodb://localhost/shopping-app";

mongoose
  .connect(uri)
  .then(() => {
    console.log(chalk.cyan("Connected to MongoDB"));
  })
  .catch((err) => {
    console.log(chalk.red(err));
  });

// Middlewares
app.use(express.static(path.join(__dirname, "src/public")));
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "This is a dev secret",
    saveUninitialized: false,
    resave: false,
    rolling: true,
    cookie: {
      maxAge: 1000 * 60 * 30,
    },
    store: MongoStore.create({
      mongoUrl: uri,
      ttl: 1000 * 60 * 30,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(router);

// Static files
app.get("/about", (req, res) => {
  res.status(200).sendFile(path.join(HTML_PATH, "about.html"));
});

app.get("/shop", (req, res) => {
  res.status(200).sendFile(path.join(HTML_PATH, "shop.html"));
});

app.get("/cart", (req, res) => {
  res.status(200).sendFile(path.join(HTML_PATH, "cart.html"));
});

app.get("/login", (req, res) => {
  res.status(200).sendFile(path.join(HTML_PATH, "login.html"));
});

app.get("/register", (req, res) => {
  res.status(200).sendFile(path.join(HTML_PATH, "register.html"));
});

app.get("/success-auth", (req, res) => {
  res.status(200).sendFile(path.join(HTML_PATH, "success-auth.html"));
});

app.get("/favorites", (req, res) => {
  res.status(200).sendFile(path.join(HTML_PATH, "favorites.html"));
});

app.get("/customer-support", (req, res) => {
  res.status(200).sendFile(path.join(HTML_PATH, "customer-support.html"));
});

// Start listening for incoming requests
app.listen(PORT, () => {
  console.log(chalk.green(`Server listening on PORT: ${PORT}`));
});
