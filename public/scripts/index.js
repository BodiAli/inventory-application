const heroElement = document.querySelector(".hero");
const hamburgerButton = document.querySelector(".hamburger");
const navElement = document.querySelector(".nav");
const listElement = document.querySelector(".nav > ul");
const spanElement = document.querySelector(".button-container > span");
const logoElement = document.querySelector(".nav .logo");

function toggleNav(e) {
  e.target.classList.toggle("is-active");
  navElement.classList.toggle("is-active");
  listElement.classList.toggle("is-active");
  spanElement.classList.toggle("is-active");
  heroElement.classList.toggle("is-active");
  logoElement.classList.toggle("is-active");
}
hamburgerButton.addEventListener("click", toggleNav);
