import express from "express";
import Product from "../mongoose/schemas/product.js";
import { getProductQuerySchema } from "../utils/validationSchemas.js";
import { attachData, validateSchema } from "../utils/middlewares.js";

const router = express.Router();

router.get(
  "/api/products",
  validateSchema(getProductQuerySchema),
  attachData,
  async (req, res) => {
    try {
      const { title, category, sort, minPrice, maxPrice } = res.locals.data;

      const query = {};
      const sortOption = {};
      if (title) {
        query.title = { $regex: title, $options: "i" };
      }

      if (Array.isArray(category)) {
        query.category = { $in: category };
      } else if (category) {
        query.category = category;
      }
      if (sort === "1") {
        sortOption.price = -1;
      } else if (sort === "2") {
        sortOption.price = 1;
      }
      if (minPrice && maxPrice) {
        query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
      }
      const products = await Product.find(query).sort(sortOption);
      return res.status(200).json(products);
    } catch (err) {
      console.log(err);
      res.status(500).json({ errors: err });
    }
  }
);

router.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    return product ? res.status(200).json(product) : res.sendStatus(404);
  } catch (err) {
    return err.name === "CastError"
      ? res.status(400).json({ error: "Invalid ID format" })
      : res.status(500).json({ errors: err });
  }
});

export default router;
