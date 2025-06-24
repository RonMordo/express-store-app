const fetchCartItems = async () => {
  const response = await fetch("/api/cart");
  if (!response.ok) {
    const errorMessage = await response.json();
    const error = new Error(errorMessage);
    error.status = response.status;
    throw error;
  }
  const cartItems = await response.json();
  return cartItems;
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
        <p><strong>${price}$</strong></p>
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
  try {
    const cartItems = await fetchCartItems();
    cartItems.forEach((cartItem) => {
      console.log(cartItem);
      const cartItemElement = createCartItemElement(cartItem);
      productsContainer.appendChild(cartItemElement);
    });
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
    setTimeout(() => {
      button.disabled = false;
      LoadingOverlay.hidden = true;
      productContainer.remove();
    }, 1500);
  } catch (err) {
    console.log(err);
  }
};

const initCart = async () => {
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
