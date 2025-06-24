const fetchProducts = async () => {
  try {
    const response = await fetch(`/api/products`);
    if (!response.ok) {
      throw new Error("Error fetching products");
    }
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const createProductElement = ({
  _id,
  image,
  title,
  category,
  price,
  rating,
}) => {
  const productElement = document.createElement("figure");
  const productsContainer = document.querySelector(".products-container");
  productElement.className = "product";
  productElement.innerHTML = `
        <img src='${image}' alt='Product image' />
        <figcaption>
            <strong>${title}</strong>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Rating:</strong> ${rating}</p>
        </figcaption>
        <div class='add-to-cart'>
            <p><strong>${price}$</strong></p>
            <div class='product-controls'>
            <button data-product-id='${_id}' class='product-button add'><strong>Add to cart</strong></button>
            <button class='favorite'><i class="fa-regular fa-star"></i></button>           
            </div>
        </div>
        <div class='loading-overlay' hidden>
          <div class='loading-spinner'></div>
        </div>
    `;
  productsContainer.appendChild(productElement);
};

const onAddToCart = async (productId, button) => {
  const productContainer = button.closest(".product");
  const overlay = productContainer.querySelector(".loading-overlay");
  try {
    button.disabled = true;
    overlay.hidden = false;
    const response = await fetch(`/api/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        quantity: 1,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      button.disabled = false;
      overlay.hidden = true;
      throw new Error(errorData);
    }
    const data = await response.json();
    setTimeout(() => {
      button.disabled = false;
      overlay.hidden = true;
    }, 1500);
    console.log("Success:", data);
  } catch (err) {
    console.log(err);
  }
};

const initShop = async () => {
  try {
    const products = await fetchProducts();
    products.forEach((product) => createProductElement(product));
    const addProductButtons = document.querySelectorAll(".product-button.add");
    addProductButtons.forEach((button) =>
      button.addEventListener("click", (e) =>
        onAddToCart(button.dataset.productId, e.target)
      )
    );
  } catch (err) {
    console.log(err);
  }
};

document.addEventListener("DOMContentLoaded", initShop);
