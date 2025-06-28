const checkAndRenderAuth = async () => {
  try {
    const authControllers = document.querySelectorAll(".auth a");
    const authContainer = document.querySelector(".auth");
    const response = await fetch("/api/auth/status");
    if (!response.ok) {
      throw new Error("Error fetching status");
    }
    const data = await response.json();
    if (!data.user) {
      return;
    }
    authControllers.forEach((controller) => {
      controller.remove();
    });
    const logoutElement = document.createElement("a");
    logoutElement.innerHTML = "Logout";
    logoutElement.href = "#";
    logoutElement.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });
        if (response.ok) {
          window.location.href = "/login";
        } else {
          const data = await response.json();
          throw new Error(data.error || "Logout failed");
        }
      } catch (err) {
        console.log(err);
      }
    });
    authContainer.appendChild(logoutElement);
  } catch (err) {
    console.log(err);
  }
};

const login = async (data) => {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      const error = new Error(errorData.error);
      error.status = response.status;
      throw error;
    }
    console.log("Success");
    window.location.href = "/success-auth";
  } catch (err) {
    console.log(err);
  }
};

const checkEmail = async (email) => {
  try {
    const response = await fetch(`/api/auth/check-email?email=${email}`);
    if (!response.ok) {
      throw new Error("Error checking email");
    }
    const data = await response.json();
    return data.exists;
  } catch (err) {
    console.log(err);
  }
};

const validateInput = async (e) => {
  const { name, value, validity, classList } = e.target;

  const setValid = () => {
    classList.remove("input-error");
    classList.add("input-ok");
  };

  const setInvalid = () => {
    classList.remove("input-ok");
    classList.add("input-error");
  };

  try {
    switch (name) {
      case "email":
        if (window.location.href.split("/").pop() !== "customer-support") {
          const emailExists = await checkEmail(value);
          if (emailExists || !validity.valid || validity.valueMissing) {
            setInvalid();
          } else {
            setValid();
          }
        } else {
          if (!validity.valid || validity.valueMissing) {
            console.log("before, Invalid if", ...classList);
            setInvalid();
            console.log("After, invlaid if", ...classList);
          } else {
            console.log("before, valid if", ...classList);
            setValid();
            console.log("After, valid if", ...classList);
          }
        }
        break;
      case "password":
        value.length < 6 ? setInvalid() : setValid();
        break;
      case "message":
        value.split(" ").length < 5 ? setInvalid() : setValid();
        break;
      default:
        const isInvalid = /[^a-zA-Z ]/.test(value) || validity.valueMissing;
        isInvalid ? setInvalid() : setValid();
    }
  } catch (err) {
    console.error("Validation error:", err);
  }
};

const fetchFavoriteItems = async () => {
  const response = await fetch("/api/users/favorites");
  if (!response.ok) {
    const errorMessage = await response.json();
    const error = new Error(errorMessage.message);
    error.status = response.status;
    throw error;
  }
  const data = await response.json();
  return data.favorites;
};

const removeProductFromFavorites = async (productId) => {
  try {
    const response = await fetch("/api/users/favorites/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) {
      throw new Error("Error removing from favorites");
    }
  } catch (err) {
    console.log(err);
  }
};

const addToFavorites = async (productId) => {
  try {
    console.log(productId);
    const response = await fetch("/api/users/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    });
    if (!response.ok) {
      const error = new Error("Error fetching favorites");
      error.status = response.status;
      throw error;
    }
  } catch (err) {
    console.log(err);
  }
};

const favoriteButtonsInit = async () => {
  const favoriteButtons = document.querySelectorAll(".favorite");
  const favoriteItems = await fetchFavoriteItems();
  favoriteButtons.forEach((button) => {
    const productContainer = button.closest(".product");
    const productId = button.closest("div").dataset.productId;
    if (favoriteItems.some((favoriteItem) => favoriteItem._id === productId)) {
      button.innerHTML = '<i class="fa-solid fa-star"></i>';
    }
    button.addEventListener("click", () => {
      if (
        favoriteItems.some((favoriteItem) => favoriteItem._id === productId)
      ) {
        removeProductFromFavorites(productId);
        if (window.location.href.split("/").pop() === "favorites") {
          productContainer.remove();
        } else {
          button.innerHTML = '<i class="fa-regular fa-star">';
        }
      } else {
        addToFavorites(productId);
        button.innerHTML = '<i class="fa-solid fa-star"></i>';
      }
    });
  });
};

const getLoggedinUser = async () => {
  try {
    const response = await fetch("/api/auth/status");
    if (!response.ok) {
      throw new Error("Error checking login status");
    }
    const user = await response.json();
    return user.user;
  } catch (err) {
    console.log(err);
  }
};

export default {
  checkAndRenderAuth,
  login,
  checkEmail,
  validateInput,
  fetchFavoriteItems,
  removeProductFromFavorites,
  favoriteButtonsInit,
  getLoggedinUser,
};
