import express from "express";
import usersService from "../services/users.service.js";
import { validateSchema, attachData } from "../utils/middlewares.js";
import {
  createUserBodySchema,
  loginUserBodySchema,
} from "../utils/validationSchemas.js";
import passport from "passport";
import "../strategies/localStrategy.js";

const router = express.Router();

router.post(
  "/api/auth/register",
  validateSchema(createUserBodySchema),
  attachData,
  async (req, res) => {
    try {
      const { data } = res.locals;
      const savedUser = await usersService.createNewUser(data);
      return res.status(201).json(savedUser);
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message });
    }
  }
);

router.post(
  "/api/auth/login",
  validateSchema(loginUserBodySchema),
  passport.authenticate("local"),
  (req, res) => {
    res.sendStatus(200);
  }
);

router.get("/api/auth/status", (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  res.sendStatus(200);
});

export default router;
