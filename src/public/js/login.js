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
};

document.addEventListener("DOMContentLoaded", initLogin);
