import Product from "../mongoose/schemas/product.js";

const getProduct = async (productId) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      const error = new Error("Product not found");
      error.status = 404;
      throw error;
    }
    return product;
  } catch (err) {
    const error = new Error("Error fetching product");
    error.status = 500;
    throw error;
  }
};

export default { getProduct };
