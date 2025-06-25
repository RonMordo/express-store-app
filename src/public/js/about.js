import utils from "./utils.js";

const init = () => {
  utils.checkAndRenderAuth();
};

document.addEventListener("DOMContentLoaded", init);
