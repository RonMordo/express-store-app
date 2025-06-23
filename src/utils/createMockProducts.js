import mongoose from "mongoose";
import Product from "../mongoose/schemas/product.js";

const dbUri = "mongodb://localhost/shopping-app";

const fetchProducts = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error("Error fetching data");
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

(async () => {
  try {
    await mongoose.connect(dbUri);
    console.log("Connected to DB");
    const rawProducts = await fetchProducts();
    const products = rawProducts.map((raw) => {
      return {
        title: raw.title,
        price: raw.price,
        description: raw.description,
        category: raw.category,
        image: raw.image,
        rating: `${raw.rating.rate} by ${raw.rating.count} reviews`,
      };
    });
    await Product.insertMany(products);
    console.log("Products added to DB");
    await mongoose.disconnect();
    console.log("Disconnected from DB");
  } catch (err) {
    console.log(err);
  }
})();
