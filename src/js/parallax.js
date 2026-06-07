(function () {
  const parallax = document.querySelectorAll(".cmp-hero-section");
  const speed = 0.5;

  window.addEventListener("scroll", () => {
    const y = window.scrollY;

    parallax.forEach(el => {
      el.style.backgroundPosition = `center ${y * speed}px`;
    });
  }, { passive: true });
})();