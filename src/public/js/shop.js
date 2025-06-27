import utils from "./utils.js";

const filterState = {
  categories: new Set(),
  title: "",
  sort: "",
  minPrice: null,
  maxPrice: null,
};

const fetchProducts = async (queryString) => {
  try {
    let response = null;
    if (queryString) {
      response = await fetch(`/api/products${queryString}`);
    } else {
      response = await fetch(`/api/products`);
    }
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
            <div class='product-controls' data-product-id='${_id}'>
              <button class='product-button add'><strong>Add to cart</strong></button>
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

const renderProducts = (products) => {
  document.querySelector(".products-container").innerHTML = "";
  products.forEach((product) => createProductElement(product));
  const addProductButtons = document.querySelectorAll(".product-button.add");
  addProductButtons.forEach((button) => {
    const controlsDiv = button.closest("div");
    button.addEventListener("click", (e) =>
      onAddToCart(controlsDiv.dataset.productId, e.target)
    );
  });
  utils.favoriteButtonsInit();
};

const updateRange = (lowPrice, highPrice, lowRangeBar, highRangeBar) => {
  let low = parseInt(lowRangeBar.value);
  let high = parseInt(highRangeBar.value);
  if (low > high) {
    [low, high] = [high, low];
  }
  lowPrice.value = low;
  highPrice.value = high;
  filterState.minPrice = low;
  filterState.maxPrice = high;
};

const applyFilters = async () => {
  const params = new URLSearchParams();

  filterState.categories.forEach((cat) => params.append("category", cat));

  if (filterState.title) params.set("title", filterState.title);
  if (filterState.sort) params.set("sort", filterState.sort);

  if (filterState.minPrice && filterState.maxPrice) {
    params.set("minPrice", filterState.minPrice);
    params.set("maxPrice", filterState.maxPrice);
  }

  const queryString = params.toString() ? `?${params.toString()}` : "";
  const products = await fetchProducts(queryString);
  renderProducts(products);
};

const initFilters = (categories, minPrice, maxPrice) => {
  const categoryFiltersContainer = document.querySelector(".filter.category");
  categories.forEach((category) => {
    const categoryButton = document.createElement("button");
    categoryButton.dataset.category = category;
    categoryButton.innerHTML = `
      ${category}
    `;
    categoryButton.addEventListener("click", async () => {
      if (filterState.categories.has(category)) {
        filterState.categories.delete(category);
        categoryButton.classList.remove("selected");
      } else {
        filterState.categories.add(category);
        categoryButton.classList.add("selected");
      }
      await applyFilters();
    });
    categoryFiltersContainer.appendChild(categoryButton);
  });
  const minPriceFilter = document.querySelector(
    '.price-inputs input[name="minPrice-filter"]'
  );
  const maxPriceFilter = document.querySelector(
    '.price-inputs input[name="maxPrice-filter"]'
  );
  const lowRangeFilter = document.querySelector(
    '.range input[name="startRange"]'
  );
  const highRangeFilter = document.querySelector(
    '.range input[name="endRange"]'
  );
  minPriceFilter.value = minPrice;
  maxPriceFilter.value = maxPrice;
  lowRangeFilter.min = minPrice;
  lowRangeFilter.max = maxPrice;
  lowRangeFilter.value = minPrice;
  highRangeFilter.min = minPrice;
  highRangeFilter.max = maxPrice;
  highRangeFilter.value = maxPrice;
  lowRangeFilter.addEventListener("input", () =>
    updateRange(minPriceFilter, maxPriceFilter, lowRangeFilter, highRangeFilter)
  );
  lowRangeFilter.addEventListener("change", async () => {
    await applyFilters();
  });
  highRangeFilter.addEventListener("input", () =>
    updateRange(minPriceFilter, maxPriceFilter, lowRangeFilter, highRangeFilter)
  );
  highRangeFilter.addEventListener("change", async () => {
    await applyFilters();
  });
  const filterInputs = document.querySelectorAll(
    '.filters-container input:not([type="range"])'
  );
  filterInputs.forEach((input) => {
    input.addEventListener("input", async () => {
      const key = input.name.replace("-filter", "");
      filterState[key] = input.value.trim();
      await applyFilters();
    });
  });
  const sortButtons = document.querySelectorAll(".sort button");
  sortButtons.forEach((button) =>
    button.addEventListener("click", async () => {
      if (button.classList.contains("selected")) {
        filterState.sort = "";
        button.classList.remove("selected");
      } else {
        filterState.sort = button.dataset.sort;
        button.classList.add("selected");
      }
      sortButtons.forEach((b) => {
        if (
          b.dataset.sort !== button.dataset.sort &&
          b.classList.contains("selected")
        ) {
          b.classList.remove("selected");
        }
      });
      await applyFilters();
    })
  );
};

const initShop = async () => {
  utils.checkAndRenderAuth();
  const products = await fetchProducts();
  renderProducts(products);
  const categories = [];
  let minPrice = Infinity;
  let maxPrice = 0;
  products.forEach((product) => {
    if (!categories.includes(product.category)) {
      categories.push(product.category);
    }
    if (minPrice > product.price) {
      minPrice = product.price;
    }
    if (maxPrice < product.price) {
      maxPrice = product.price;
    }
  });
  filterState.minPrice = minPrice;
  filterState.maxPrice = maxPrice;
  initFilters(categories, Math.floor(minPrice), Math.ceil(maxPrice));
};

document.addEventListener("DOMContentLoaded", initShop);
