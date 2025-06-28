import utils from "./utils.js";

const fetchCart = async () => {
  const response = await fetch("/api/cart");
  if (!response.ok) {
    const errorMessage = await response.json();
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  return response.json();
};

const updateQuantity = async (
  cartItemElement,
  cartItemId,
  totalPriceElement,
  newQuantity
) => {
  try {
    let response = null;
    let updatedCart = null;
    if (parseInt(newQuantity) !== 0) {
      const body = { productId: cartItemId, quantity: newQuantity };
      response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error("Error updating quantity");
      }
      updatedCart = await response.json();
    } else {
      updatedCart = await fetchCart();
    }
    if (updatedCart.items.length === 0) {
      totalPriceElement.innerHTML = 0 + "$";
      return;
    }
    if (parseInt(newQuantity)) {
      const originalPrice = updatedCart.items.find(
        (item) => item.productId._id === cartItemId
      ).productId.price;
      cartItemElement.querySelector(".cost-and-quantity strong").innerHTML =
        (originalPrice * parseInt(newQuantity)).toFixed(2) + "$";
    }
    const totalPrice = updatedCart.items.reduce((acc, item) => {
      return acc + item.productId.price * item.quantity;
    }, 0);
    totalPriceElement.innerHTML = totalPrice.toFixed(2) + "$";
  } catch (err) {
    console.log(err);
  }
};

const createCartItemElement = ({
  image,
  title,
  category,
  rating,
  price,
  _id,
}) => {
  const cartItemElement = document.createElement("div");
  cartItemElement.className = "product";
  cartItemElement.innerHTML = `
    <img src='${image}' alt='Product image' />
    <figcaption>
        <strong>${title}</strong>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Rating:</strong> ${rating}</p>
    </figcaption>
    <div class='add-to-cart'>
        <div class='cost-and-quantity'>
          <p><strong>${price.toFixed(2)}$</strong></p>
          <div class='quantity'>
            <input type='number' value='1' min='1' onkeydown="return false"/>
            <div class='quantity-controls'>
              <button class='more'><i class="fa-solid fa-caret-down"></i></button>
              <button class='less'><i class="fa-solid fa-caret-down"></i></button>
            </div>
          </div>
        </div>
        <div class='product-controls'>
            <button data-product-id='${_id}' class='product-button remove'><strong>Remove item</strong></button>
            <button class='favorite'><i class="fa-regular fa-star"></i></button>           
        </div>
    </div>
    <div class='loading-overlay' hidden>
        <div class='loading-spinner'></div>
    </div>
    `;
  return cartItemElement;
};

const renderCart = async () => {
  const cartInterface = document.querySelector(".interface");
  const productsContainer = document.querySelector(".products-container");
  const totalPriceElement = cartInterface.querySelector(
    ".price-and-checkout .price"
  );
  const addedProducts = new Set();
  try {
    const cart = await fetchCart();
    let totalPrice = 0;
    cart.items.forEach((cartItem) => {
      if (!addedProducts.has(cartItem.productId._id)) {
        const cartItemElement = createCartItemElement(cartItem.productId);
        cartItemElement.querySelector(".cost-and-quantity strong").innerHTML =
          (cartItem.productId.price * cartItem.quantity).toFixed(2) + "$";
        productsContainer.appendChild(cartItemElement);
        totalPrice += cartItem.productId.price * cartItem.quantity;
        const quantityInput = cartItemElement.querySelector(
          ".cost-and-quantity input"
        );
        quantityInput.value = cartItem.quantity;
        cartItemElement.querySelector(".less").addEventListener("click", () => {
          const updatedQuantity = parseInt(quantityInput.value) - 1;
          if (updatedQuantity === 0) {
            onRemoveItem(cartItem.productId._id, cartItemElement);
          } else {
            updateQuantity(
              cartItemElement,
              cartItem.productId._id,
              totalPriceElement,
              updatedQuantity
            );
            quantityInput.value = updatedQuantity;
          }
        });
        cartItemElement.querySelector(".more").addEventListener("click", () => {
          quantityInput.value = parseInt(quantityInput.value) + 1;
          updateQuantity(
            cartItemElement,
            cartItem.productId._id,
            totalPriceElement,
            quantityInput.value
          );
        });
        addedProducts.add(cartItem.productId._id);
      }
    });
    totalPriceElement.innerHTML =
      totalPriceElement.innerHTML + totalPrice.toFixed(2) + "$";
  } catch (err) {
    if (err.status === 404) {
      const emptyCartElement = document.createElement("div");
      emptyCartElement.className = "empty-cart";
      emptyCartElement.innerHTML = `
            <span>Your cart is empty!</span>
            <a href='/shop'>Go Shopping</a>
        `;
      cartInterface.appendChild(emptyCartElement);
    } else {
      console.log(err);
    }
  }
};

const onRemoveItem = async (productId, button) => {
  const productContainer = button.closest(".product");
  const LoadingOverlay = productContainer.querySelector(".loading-overlay");
  const totalPriceElement = document.querySelector(
    ".price-and-checkout .price"
  );
  try {
    button.disabled = true;
    LoadingOverlay.hidden = false;
    const response = await fetch("/api/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      LoadingOverlay.hidden = true;
      button.disabled = false;
      throw new Error(error);
    }
    setTimeout(async () => {
      button.disabled = false;
      LoadingOverlay.hidden = true;
      await updateQuantity(productContainer, productId, totalPriceElement, "0");
      productContainer.remove();
    }, 1500);
  } catch (err) {
    console.log(err);
  }
};

const initCart = async () => {
  utils.checkAndRenderAuth();
  await renderCart();
  const removeProductButtons = document.querySelectorAll(
    ".product-button.remove"
  );
  removeProductButtons.forEach((button) =>
    button.addEventListener("click", (e) =>
      onRemoveItem(button.dataset.productId, e.target)
    )
  );
};

document.addEventListener("DOMContentLoaded", initCart);
