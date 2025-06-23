import Cart from "../mongoose/schemas/cart.js";

export const fetchCart = async ({ userId, sessionId }) => {
  const filter = userId ? { userId } : { sessionId };
  return await Cart.findOne(filter);
};

export const getCartItems = async ({ userId, sessionId }) => {
  const cart = await fetchCart({ userId, sessionId });
  if (!cart) {
    const err = new Error("Cart not found");
    err.status = 404;
    throw err;
  }
  return cart.items;
};

export const addCartItem = async ({
  userId,
  sessionId,
  productId,
  quantity,
}) => {
  const cart = await fetchCart({ userId, sessionId });
  if (cart) {
    const existingItem = cart.items.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
      });
    }
    return cart.save();
  } else {
    const newCart = Cart({
      userId,
      sessionId,
      items: [{ productId, quantity }],
    });
    return newCart.save();
  }
};
