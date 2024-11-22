const hamburgerButton = document.querySelector(".hamburger");
const navElement = document.querySelector(".nav");
const listElement = document.querySelector(".nav > ul");
function toggleNav(e) {
  e.target.classList.toggle("is-active");
  navElement.classList.toggle("is-active");
  listElement.classList.toggle("is-active");
}
hamburgerButton.addEventListener("click", toggleNav);
