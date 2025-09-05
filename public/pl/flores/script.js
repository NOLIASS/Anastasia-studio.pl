const searchInput = document.getElementById('search');
const flowerBoxes = document.querySelectorAll('.main-content__flower-box');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase().trim();

  flowerBoxes.forEach(box => {
    const text = box.querySelector('.flower-name').textContent.toLowerCase();
    if (text.includes(query)) {
      box.style.display = 'flex'; // показуємо блок
    } else {
      box.style.display = 'none'; // ховаємо блок
    }
  });
});