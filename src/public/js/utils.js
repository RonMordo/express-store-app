const checkAndRenderAuth = async () => {
  try {
    console.log("inside checkAndRender");
    const authControllers = document.querySelectorAll(".auth a");
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
  } catch (err) {
    console.log(err);
  }
};

export default { checkAndRenderAuth };
