// ======= HERO SLIDER =======
const heroSlider = document.querySelector('#heroSlider');
if (heroSlider) {
  const carousel = new bootstrap.Carousel(heroSlider, {
    interval: 4000, // Slide every 4 seconds
    ride: 'carousel',
    pause: false
  });

  // Optional: Pause and resume on hover
  /*
  heroSlider.addEventListener('mouseenter', () => {
    bootstrap.Carousel.getInstance(heroSlider).pause();
  });
  heroSlider.addEventListener('mouseleave', () => {
    bootstrap.Carousel.getInstance(heroSlider).cycle();
  });
  */
}

// ======= LOAD MENU FROM JSON =======
fetch('js/data.json')
  .then(res => res.json())
  .then(data => {
    const menuDiv = document.getElementById('menuItems');
    if (menuDiv && data.menu) {
      data.menu.forEach(item => {
        const div = document.createElement('div');
        div.className = 'col-md-4';
        div.innerHTML = `
          <div class="card shadow h-100">
            <img src="${item.image}" class="card-img-top" alt="${item.name}">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">${item.description}</p>
              <p class="text-warning fw-bold">${item.price}</p>
            </div>
          </div>`;
        menuDiv.appendChild(div);
      });
    }
  })
  .catch(err => console.error('Error loading menu:', err));

// ======= PRELOADER =======
window.addEventListener("load", function () {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => preloader.classList.add("hidden"), 800); // smooth fade-out delay
  }
});

// ======= COUNTER ANIMATION =======
document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".count");
  const statsSection = document.querySelector(".stats-section");

  if (!statsSection || !counters.length) return;

  const animateCounter = (counter) => {
    const target = +counter.getAttribute("data-target");
    const duration = 1500; // total time in ms
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else counter.textContent = target.toLocaleString();
    }

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(animateCounter);
          obs.unobserve(entry.target); // trigger only once
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(statsSection);
});
