import express from "express";
import userService from "../services/users.service.js";
import {
  createUserBodySchema,
  addToFavoritesBodySchema,
} from "../utils/validationSchemas.js";
import { validateSchema, attachData } from "../utils/middlewares.js";

const router = express.Router();

router.get("/api/users", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.get("/api/users/favorites", async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Not logged in" });
  }
  try {
    const favorites = await userService.getFavorites(userId);
    return res.status(200).json({ favorites });
  } catch (err) {
    return res.status(err.status).json({ error: err.message });
  }
});

router.get("/api/users/:id", async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json(user);
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.post(
  "/api/users",
  validateSchema(createUserBodySchema),
  attachData,
  async (req, res) => {
    try {
      const { data } = res.locals;
      const savedUser = await userService.createNewUser(data);
      return res.status(201).json(savedUser);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }
);

router.post(
  "/api/users/favorites",
  validateSchema(addToFavoritesBodySchema),
  attachData,
  async (req, res) => {
    try {
      const { productId } = res.locals.data;
      const userId = req.user?.id;
      await userService.addProductToFavorites({ userId, productId });
      return res.sendStatus(200);
    } catch (err) {
      return res.status(err.status).json({ error: err.message });
    }
  }
);

router.post(
  "/api/users/favorites/remove",
  validateSchema(addToFavoritesBodySchema),
  attachData,
  async (req, res) => {
    try {
      const { productId } = res.locals.data;
      const userId = req.user?.id;
      await userService.removeProductFromFavorites({ userId, productId });
      return res.sendStatus(200);
    } catch (err) {
      return res.status(err.status).json({ error: err.message });
    }
  }
);

export default router;
