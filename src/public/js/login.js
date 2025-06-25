const onSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
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
    window.location.href = "/";
  } catch (err) {
    console.log(err);
    e.target.reset();
  }
};

const initLogin = async () => {
  document
    .querySelector(".login.form")
    .addEventListener("submit", (e) => onSubmit(e));
};

document.addEventListener("DOMContentLoaded", initLogin);
