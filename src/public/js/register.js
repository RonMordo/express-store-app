import utils from "/js/utils.js";

const resetFormFields = (inputs) => {
  inputs.forEach((input) => {
    input.classList = "";
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  const inputElements = e.target.querySelectorAll("input");
  for (const input of inputElements) {
    if (input.classList.contains("input-error")) {
      return;
    }
  }
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Error posting to api/auth/register");
    }
    const { email, password } = data;
    utils.login({ email, password });
  } catch (err) {
    console.log(err.message);
  }
};

const init = () => {
  const inputElements = document.querySelectorAll("input");
  document
    .querySelector(".register.form")
    .addEventListener("submit", (e) => handleSubmit(e));
  document
    .querySelector(".register.form")
    .addEventListener("reset", () => resetFormFields(inputElements));
  inputElements.forEach((input) => {
    input.addEventListener("blur", (e) => utils.validateInput(e));
    input.addEventListener("input", () => {
      if (input.value.length > 0) {
        input.classList.add("with-value");
      } else {
        input.classList.remove("with-value");
      }
      console.log(...input.classList);
    });
  });
};

document.addEventListener("DOMContentLoaded", init);
