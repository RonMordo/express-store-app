import express from "express";
import usersService from "../services/users.service.js";
import { validateSchema, attachData } from "../utils/middlewares.js";
import {
  createUserBodySchema,
  loginUserBodySchema,
  getUserEmailSchema,
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
  (req, res, next) => {
    console.log("/api/auth/login");

    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(401).json({ error: info?.message || "Unauthorized" });
      }
      req.logIn(user, (err) => {
        if (err) {
          console.log("logIn err");
          return res.status(500).json({ error: err.message });
        }
        console.log("Success");
        return res.sendStatus(200);
      });
    })(req, res, next);
  }
);

router.post("/api/auth/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

router.get("/api/auth/status", (req, res) => {
  if (!req.user) {
    return res.status(200).json({ user: null });
  }
  res
    .status(200)
    .json({ user: { email: req.user.email, name: req.user.name } });
});

router.get(
  "/api/auth/check-email",
  validateSchema(getUserEmailSchema),
  attachData,
  async (req, res) => {
    try {
      const exists = await usersService.emailExists(res.locals.data);
      return res.status(200).json({ exists });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

export default router;
