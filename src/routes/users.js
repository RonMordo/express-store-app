import express from "express";
import userService from "../services/users.service.js";
import { createUserBodySchema } from "../utils/validationSchemas.js";
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

export default router;
