import utils from "/js/utils.js";

const resetFormFields = (inputs) => {
  inputs.forEach((input) => {
    input.classList = "";
  });
};

const onSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  const inputElements = e.target.querySelectorAll("input, textarea");
  inputElements.forEach((input) => {
    if (input.classList.contains("input-error")) {
      return;
    }
  });
  try {
    const response = await fetch("api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Error posting message");
    }
    const sentMessage = await response.json();
    console.log(sentMessage.savedMessage);
    e.target.reset();
    inputElements.forEach((input) => {
      input.classList.remove("input-ok");
    });
  } catch (err) {
    console.log(err);
  }
};

const initForm = async () => {
  const user = await utils.getLoggedinUser();
  const emailInput = document.querySelector('input[name="email"]');
  const nameInput = document.querySelector('input[name="name"]');
  const messageInput = document.querySelector("textarea");
  if (user) {
    emailInput.value = user.email;
    nameInput.value = user.name;
  }
  emailInput.addEventListener("blur", (e) => utils.validateInput(e));
  nameInput.addEventListener("blur", (e) => utils.validateInput(e));
  messageInput.addEventListener("blur", (e) => utils.validateInput(e));
  document
    .querySelector(".support-form")
    .addEventListener("submit", (e) => onSubmit(e));
  document
    .querySelector(".support-form")
    .addEventListener("reset", () =>
      resetFormFields([emailInput, nameInput, messageInput])
    );
};

const initFaq = () => {
  const faqQuestionElements = document.querySelectorAll(".question");
  faqQuestionElements.forEach((question) => {
    question.addEventListener("click", () => {
      const faqCard = question.closest(".faq-card");
      const answerElement = faqCard.querySelector(".answer");
      if (answerElement.classList.contains("hidden")) {
        answerElement.classList.remove("hidden");
      } else {
        answerElement.classList.add("hidden");
      }
    });
  });
};

const init = () => {
  utils.checkAndRenderAuth();
  initFaq();
  initForm();
};

document.addEventListener("DOMContentLoaded", init);
