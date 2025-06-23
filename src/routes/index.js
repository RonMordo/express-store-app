import express from "express";
import authRouter from "./auth.js";
import productsRouter from "./products.js";
import cartRouter from "./cart.js";
import userRouter from "./users.js";

// Init router
const router = express.Router();

// Middleware
router.use(authRouter);
router.use(productsRouter);
router.use(cartRouter);
router.use(userRouter);

export default router;
