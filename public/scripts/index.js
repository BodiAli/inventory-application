const heroElement = document.querySelector(".hero");
const buttonContainerElement = document.querySelector(".button-container");
const hamburgerButton = document.querySelector(".hamburger");
const navElement = document.querySelector(".nav");
const listElement = document.querySelector(".nav > ul");
const spanElement = document.querySelector(".button-container > span");
const logoElement = document.querySelector(".nav .logo");
const hrElement = document.querySelector(".nav > hr");

function toggleNav(e) {
  e.currentTarget.classList.toggle("is-active");
  hamburgerButton.classList.toggle("is-active");
  navElement.classList.toggle("is-active");
  listElement.classList.toggle("is-active");
  spanElement.classList.toggle("is-active");
  heroElement.classList.toggle("is-active");
  logoElement.classList.toggle("is-active");
  hrElement.classList.toggle("is-active");
}
buttonContainerElement.addEventListener("click", toggleNav);

const imagesObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.children[0].classList.add("animate");
      }
    });
  },
  { rootMargin: "0px 0px -200px 0px" }
);

const images = document.querySelectorAll(".get-started-img");

images.forEach((image) => imagesObserver.observe(image));

const pObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  },
  { rootMargin: "0px 0px -100px 0px" }
);

const getStartedPTags = document.querySelectorAll(".get-started-text > p");

getStartedPTags.forEach((pTag) => pObserver.observe(pTag));
