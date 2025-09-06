import { debounce } from "./utils.js";
import { renderSearch } from "./ui.js";
let searchField = document.getElementById("locationInput");

document.querySelectorAll(".info i").forEach((icon) => {
  const color = icon.dataset.color;
  if (color) icon.style.color = color;
});

searchField.addEventListener(
  "input",
  debounce(() => {
    
    let query = searchField.value.trim();
    /* No Empty Query */
    if (query === "") {
      return;
    }
    renderSearch(query);
  }, 500)
);

