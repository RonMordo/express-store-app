import express from "express";
import Product from "../mongoose/schemas/product.js";
import {
  fetchCart,
  getCartItems,
  addCartItem,
  removeCartItem,
} from "../services/cart.service.js";
import { validateSchema, attachData } from "../utils/middlewares.js";
import {
  addCartItemBodySchema,
  deleteCartItemSchema,
} from "../utils/validationSchemas.js";

const router = express.Router();

router.get("/api/cart/items", async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.session.id;
    const items = await getCartItems({ userId, sessionId });
    return res.status(200).json(items);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.get("/api/cart", async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.session.id;
    const cart = await fetchCart({ userId, sessionId });
    return res.status(200).json(cart);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.post(
  "/api/cart",
  validateSchema(addCartItemBodySchema),
  attachData,
  async (req, res) => {
    const { productId, quantity } = res.locals.data;
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      if (product.quantity < quantity) {
        return res.status(400).json({ error: "Not enough stock" });
      }
      const userId = req.user?.id;
      const sessionId = req.session.id;
      const updatedCart = await addCartItem({
        userId,
        sessionId,
        productId,
        quantity,
      });
      const populatedCart = await updatedCart.populate("items.productId");
      req.session.cartId = updatedCart._id;
      return res.status(201).json(populatedCart);
    } catch (err) {
      return res.status(404).json({ error: err.message });
    }
  }
);

router.delete(
  "/api/cart",
  validateSchema(deleteCartItemSchema),
  attachData,
  async (req, res) => {
    try {
      const { productId } = res.locals.data;
      const userId = req.user?.id;
      const sessionId = req.session.id;
      await removeCartItem({ userId, sessionId, productId });
      return res.sendStatus(204);
    } catch (err) {
      console.log(err);
      return res.status(400).json({ error: err });
    }
  }
);

export default router;
