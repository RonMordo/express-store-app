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

// __dirname setup for ESM
const __filename = fileURLToPath(import.meta.url);
console.log(import.meta.url);
console.log(__filename);
const __dirname = path.dirname(__filename);
console.log(__dirname);
const HTML_PATH = path.join(__dirname, "src/public/html");

// Init express app
const app = express();

// Init PORT
const PORT = process.env.PORT || 3000;

// Connect to mongodb
mongoose
  .connect("mongodb://localhost/shopping-app")
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
    cookie: {
      maxAge: 1000 * 60 * 30,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
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

// Start listening for incoming requests
app.listen(PORT, () => {
  console.log(chalk.green(`Server listening on PORT: ${PORT}`));
});
