const hamburger = document.querySelector(".hamburger");
const mobileNav = document.querySelector(".mobile-nav");

hamburger.addEventListener("click", (e) => {
  e.currentTarget.classList.toggle("is-active");
  mobileNav.classList.toggle("is-active");
});
