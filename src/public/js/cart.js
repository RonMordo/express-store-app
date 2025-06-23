const createCartElement = ({ image, title, category, rating, price, _id }) => {
  const cartItemElement = document.createElement("div");
  cartItem.className = "product";
  cartItem.innerHTML = `
    <img src='${image}' alt='Product image' />
    <figcaption>
        <strong>${title}</strong>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Rating:</strong> ${rating}</p>
    </figcaption>
    <div class='add-to-cart'>
        <p><strong>${price}</strong>$</p>
        <button data-id='${_id}' class='add-product-button'><strong>Add to cart</strong></button>
    </div>
    <div class='loading-overlay' hidden>
        <div class='loading-spinner'></div>
    </div>
    `;
  return cartItemElement;
};

const renderCart = async () => {
  const interface = document.querySelector(".interface");
  const productsContainer = document.querySelector(".products-container");
  try {
    const cartItems = await fetchCartItems();
    cartItems.forEach((cartItem) => {
      const cartItemElement = createCartItemElement(cartItem);
      productsContainer.appendChild(cartItemElement);
    });
  } catch (err) {
    if (err.status === 404) {
      const emptyCartElement = document.createElement("div");
      emptyCartElement.className = "empty-cart";
      emptyCartElement.innerHTML = `
            <span>Your cart is empty!</span>
            <button>Shop</button>
        `;
      interface.appendChild(emptyCartElement);
    } else {
      console.log(err);
    }
  }
};

const initCart = async () => {
  try {
    const cartItems = await fetchCartItems();
    if (!cartItems) {
    }
  } catch (err) {
    console.log(err);
  }
};

document.addEventListener("DOMContentLoaded", initCart);
