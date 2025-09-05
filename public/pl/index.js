const images = [
    "1.jpg",
    "14.jpg",
    "24.jpg"
  ];
  let currentIndex = 0;
  const imgElement = document.getElementById("slide-image");

  function changeImage() {
    currentIndex = (currentIndex + 1) % images.length;
    imgElement.src = images[currentIndex];
  }

  // Змінюємо зображення кожні 3 секунди
  setInterval(changeImage, 3000);