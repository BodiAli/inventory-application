const slides = document.querySelector(".slides");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
const dotsContainer = document.querySelector(".dots");

let currentIndex = 0;

function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    if (index === currentIndex) {
      dot.classList.add("active");
    } else {
      dot.classList.remove("active");
    }
  });
}

function updateCarousel() {
  const offset = -currentIndex * 500;

  slides.style.transform = `translateX(${offset}px)`;
  updateDots();
}

function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
}

for (let i = 0; i < slides.children.length; i++) {
  const dot = document.createElement("div");

  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => {
    goToSlide(i);
  });

  dotsContainer.appendChild(dot);
}

nextButton.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % slides.children.length;
  updateCarousel();
});

prevButton.addEventListener("click", () => {
  currentIndex = (currentIndex + slides.children.length - 1) % slides.children.length;
  updateCarousel();
});

let interval = setInterval(() => {
  currentIndex = (currentIndex + 1) % slides.children.length;
  updateCarousel();
}, 5000);

slides.parentElement.addEventListener("mouseover", () => {
  clearInterval(interval);
});

slides.parentElement.addEventListener("mouseout", () => {
  interval = setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.children.length;
    updateCarousel();
  }, 5000);
});
