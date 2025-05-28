window.addEventListener('DOMContentLoaded', () => {
  
  // 🎶 Controle da Música
  const bgMusic = document.getElementById('bgMusic');
  const toggleBtn = document.getElementById('toggleMusic');

  toggleBtn.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      toggleBtn.textContent = '⏸️';
    } else {
      bgMusic.pause();
      toggleBtn.textContent = '▶️';
    }
  });

  // 📸 Lightbox
  const galleryImages = document.querySelectorAll('.gallery img');
  const lightbox = document.createElement('div');
  lightbox.classList.add('lightbox');
  document.body.appendChild(lightbox);

  lightbox.innerHTML = `
    <span class="close">❌</span>
    <span class="prev">⬅️</span>
    <img src="" alt="Imagem ampliada">
    <span class="next">➡️</span>
  `;

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = lightbox.querySelector('.prev');
  const nextBtn = lightbox.querySelector('.next');

  let currentIndex = 0;

  function showLightbox(index) {
    currentIndex = index;
    lightboxImg.src = galleryImages[currentIndex].src;
    lightbox.style.display = 'flex';
  }

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
      showLightbox(index);
    });
  });

  closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
  });

  // Fechar com tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      lightbox.style.display = 'none';
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % galleryImages.length;
      lightboxImg.src = galleryImages[currentIndex].src;
    }
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
      lightboxImg.src = galleryImages[currentIndex].src;
    }
  });

});

const animatedElements = document.querySelectorAll('[data-animate]');

function animateOnScroll() {
  animatedElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight - 50) {
      el.classList.add('show');
    }
  });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);
