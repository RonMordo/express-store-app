import utils from "/js/utils.js";

const onSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  utils.login(data);
};

const initLogin = async () => {
  document
    .querySelector(".login.form")
    .addEventListener("submit", (e) => onSubmit(e));
  const inputs = document.querySelectorAll(".login.form input");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      console.log("Inside input listener");

      if (input.value.length > 0) {
        input.classList.add("with-value");
      } else {
        input.classList.remove("with-value");
      }
      console.log(...input.classList);
    });
  });
};

document.addEventListener("DOMContentLoaded", initLogin);
