const checkAndRenderAuth = async () => {
  try {
    console.log("inside checkAndRender");
    const authControllers = document.querySelectorAll(".auth a");
    const authContainer = document.querySelector(".auth");
    console.log(authControllers);
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

export default { checkAndRenderAuth };
