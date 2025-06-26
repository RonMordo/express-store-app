import utils from "./utils.js";

const createFavoriteItemElement = ({
  image,
  title,
  category,
  rating,
  price,
  _id,
}) => {
  const favoriteItemElement = document.createElement("div");
  favoriteItemElement.className = "product";
  favoriteItemElement.innerHTML = `
    <img src='${image}' alt='Product image' />
    <figcaption>
        <strong>${title}</strong>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Rating:</strong> ${rating}</p>
    </figcaption>
    <div class='add-to-cart'>
        <p><strong>${price}$</strong></p>
        <div class='product-controls' data-product-id='${_id}'>
            <button class='product-button add'><strong>Add to cart</strong></button>
            <button class='favorite'><i class="fa-regular fa-star"></i></button>           
        </div>
    </div>
    <div class='loading-overlay' hidden>
        <div class='loading-spinner'></div>
    </div>
    `;
  return favoriteItemElement;
};

const renderFavorites = async () => {
  const favoritesInterface = document.querySelector(".interface");
  const productsContainer = document.querySelector(".products-container");
  try {
    const favoriteItems = await utils.fetchFavoriteItems();
    if (favoriteItems.length === 0) {
      const emptyFavortiesElement = document.createElement("div");
      emptyFavortiesElement.className = "empty-cart";
      emptyFavortiesElement.innerHTML = `
            <span>You dont have favorite products</span>
            <a href='/shop'>Go Shopping</a>
        `;
      favoritesInterface.appendChild(emptyFavortiesElement);
      return;
    }
    favoriteItems.forEach((favoriteItem) => {
      const favoriteItemElement = createFavoriteItemElement(favoriteItem);
      productsContainer.appendChild(favoriteItemElement);
    });
  } catch (err) {
    console.log(err);
  }
};

// const onRemoveItem = async (productId, button) => {
//   const productContainer = button.closest(".product");
//   const LoadingOverlay = productContainer.querySelector(".loading-overlay");
//   try {
//     button.disabled = true;
//     LoadingOverlay.hidden = false;
//     const response = await fetch("/api/cart", {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         productId,
//       }),
//     });
//     if (!response.ok) {
//       const error = await response.json();
//       LoadingOverlay.hidden = true;
//       button.disabled = false;
//       throw new Error(error);
//     }
//     setTimeout(() => {
//       button.disabled = false;
//       LoadingOverlay.hidden = true;
//       productContainer.remove();
//     }, 1500);
//   } catch (err) {
//     console.log(err);
//   }
// };

const init = async () => {
  utils.checkAndRenderAuth();
  await renderFavorites();
  utils.favoriteButtonsInit();
};

document.addEventListener("DOMContentLoaded", init);
