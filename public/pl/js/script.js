const images = [
    "14.jpg",
    "16.jpg",
    "24.jpg"
  ];

  let currentIndex = 0;
  const imgElement = document.getElementById("slide-image");

  function changeImage() {
    currentIndex = (currentIndex + 1) % images.length;
    imgElement.src = images[currentIndex];
  }

  // Змінюємо зображення кожні 3 секунди
  setInterval(changeImage, 5000);
  const contents = [
    "Привіт! Це перший блок тексту.",
    "Тут може бути будь-який HTML-контент.",
    "Можна вставляти <strong>теги</strong>, посилання або кнопки.",
    "Цей текст змінюється кожні кілька секунд."
  ];

  let index = 0;
  const box = document.getElementById("content-box");

  function changeContent() {
    // Додаємо fade-out
    box.classList.add("fade-out");

    setTimeout(() => {
  index = (index + 1) % contents.length;
  box.innerHTML = contents[index];
  box.classList.remove("fade-out");
}, 0);
  }

  setInterval(changeContent, 5000);
  let lastScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  let currentScroll = window.scrollY;

  if (currentScroll <= 90) {
    // якщо в перших 90px сторінки → завжди показаний
    header.classList.remove("hidden");
  } else if (currentScroll > lastScroll) {
    // далі: якщо гортати вниз → ховати
    header.classList.add("hidden");
  } else {
    // якщо гортати вгору → показати
    header.classList.remove("hidden");
  }

  lastScroll = currentScroll;
});
const elements = document.querySelectorAll(".zagol, .ic2, .ic3, .backraund-img, .backraund-img2, .backraund-img3, .backraund-img4, .main-content__flower__flower");

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("active"); // запускає твою анімацію
      observer.unobserve(entry.target); // необов’язково, але оптимально
    }
  });
}, { threshold: 0.1 }); // спрацьовує коли елемент наполовину видно

elements.forEach(el => observer.observe(el));
