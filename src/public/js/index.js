import utils from "./utils.js";

const init = () => {
  console.log("init index");
  utils.checkAndRenderAuth();
};

document.addEventListener("DOMContentLoaded", init);
