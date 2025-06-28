import Message from "../mongoose/schemas/message.js";
import express from "express";
import { validateSchema, attachData } from "../utils/middlewares.js";
import { createMessageBodySchema } from "../utils/validationSchemas.js";

const router = express.Router();

router.post(
  "/api/messages",
  validateSchema(createMessageBodySchema),
  attachData,
  async (req, res) => {
    const { email, name, message } = res.locals.data;
    const newMessage = new Message({ email, name, message });
    try {
      const savedMessage = await newMessage.save();
      return res.status(201).json({ savedMessage });
    } catch (err) {
      return res.status(500).json({ error: err });
    }
  }
);

export default router;
