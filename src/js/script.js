"use strict";
import Swup from "swup";
import SwupHeadPlugin from "@swup/head-plugin";

////// Load all functions in as the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  runSwupHooks();
  activateHamburgerMenu();
  intParallax();
  updateActiveNavLink();
  resetHomeLoadedClass();
  updateCopyrightYear();
  stopTransitionOnResize();

  setTimeout(() => {
    setGalleryMasonryAndGlightbox();
  }, 200);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsapOpeningHomeAnimations();

  // Ensure Scroll Triggers wait until everything has fully loaded in.
  window.addEventListener("load", () => {
    document.documentElement.classList.remove("is-loading");
    setTimeout(() => {
      requestAnimationFrame(() => {
        gsapScrollAnimations();
        ScrollTrigger.refresh();
      });
    }, 100);
  });

  document.documentElement.classList.add("has-smooth-scroll");
});

///////////////////////////////////////////////////////////* Swup page navigation *////////////////////////////////////////////////////////////////////////////////////////*

const swup = new Swup({
  containers: ["#swup", "#swup-header-container", "#footer"],
  animateHistoryBrowsing: true,
  respectScroll: false,

  plugins: [
    new SwupHeadPlugin({
      awaitAssets: false,
      persistAssets: true,
    }),
  ],
});

function runSwupHooks() {
  swup.hooks.on("page:view", () => {
    activateHamburgerMenu();
    resetHamburger();
    updateActiveNavLink();
    intParallax();
    setGalleryMasonryAndGlightbox();
    updateCopyrightYear();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsapScrollAnimations();
  });

  // Prevents the browser from smooth scrolling when changing pages, only happens when still on the same page.
  swup.hooks.on("visit:start", () => {
    document.documentElement.classList.remove("has-smooth-scroll");
  });

  swup.hooks.on("visit:end", () => {
    document.documentElement.classList.add("has-smooth-scroll");
  });

  function resetHamburger() {
    const hamburgerBtn = document.querySelector(".hamburger-btn");

    hamburgerBtn.classList.remove("active");
  }
}

/////////////////////////////////////////////////////////////* Opening hero intro animations *///////////////////////////////////////////////////////////////////////////*

function gsapOpeningHomeAnimations() {
  return;

  const body = document.body;
  const heroHeading = document.querySelector(".cmp-hero-heading");

  if (!document.body.classList.contains("home")) return;

  heroHeading.classList.remove("transition-fade");

  window.addEventListener("load", () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 0);
  });

  if (body.classList.contains("home")) {
    document.documentElement.style.overflow = "hidden";
  }

  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    delay: 0.2,
  });

  tl.fromTo(
    ".cmp-hero-section__image",
    {
      clipPath: "inset(0 0 100% 0)",
      transform: "translateY(30px) scale(1.2)",
    },
    {
      clipPath: "inset(0 0 0% 0)",
      duration: 1.2,
      ease: "power3.inOut",
    },
  )
    .to(
      ".cmp-hero-section__image",
      {
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.inOut",
      },
      0,
    )
    .from(
      ".cmp-hero-heading",
      {
        opacity: 0,
        x: -150,
        duration: 1.5,
        onComplete() {
          heroHeading.classList.add("transition-fade");
          document.documentElement.style.overflow = "auto";
        },
      },
      "+=0.2",
    )
    .from(
      ".header",
      {
        y: -30,
        opacity: 0,
        duration: 2,
      },
      "-=1",
    )
    .from(
      ".hero-flex__inner-flex",
      {
        opacity: 0,
        y: 100,
        duration: 2,
      },
      "-=1.75",
    );
}

function resetHomeLoadedClass() {
  if (!document.body.classList.contains("home")) {
    document.body.classList.add("loaded");
    return;
  }
}

function intParallax() {
  const parallax = document.querySelectorAll(".cmp-hero-section");
  const isMobile = window.matchMedia("(max-width: 62.5rem)");
  const speed = `${isMobile.matches ? "0.25" : "0.5"}`;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;

      parallax.forEach((el) => {
        el.style.backgroundPosition = `center ${y * speed}px`;
      });
    },
    { passive: true },
  );
}

////////////////////////////////////////////////////////////* GSAP scrolling animations *////////////////////////////////////////////////////////////////////////////////*

function gsapScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  /* return; */

  /* ScrollTrigger.defaults({ markers: true }); */

  ScrollTrigger.refresh();

  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 1000);

  const animatedElements = document.querySelectorAll(
    "[data-animate]:not([data-animate-group] [data-animate])",
  );

  animatedElements.forEach((el) => {
    const animationType = el.dataset.animate;
    let animProps = { opacity: 0, duration: 1, ease: "power4.out" };

    switch (animationType) {
      case "slide-up":
        animProps = { ...animProps, y: 30 };
        break;
      case "slide-down":
        animProps = { ...animProps, y: -30 };
        break;
      case "slide-left":
        animProps = { ...animProps, x: -30 };
        break;
      case "slide-right":
        animProps = { ...animProps, x: 30 };
        break;
      case "scale-size":
        animProps = { ...animProps, scale: 0.75, duration: 1 };
        break;
      case "scale":
        gsap.from(el, {
          scale: 2,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          clearProps: "transform, opacity",
          scrollTrigger: {
            trigger: el,
            start: "top 0%",
          },
        });
        return;
      case "fade-in":
      default:
        animProps = { ...animProps, duration: 1 };
        break;
    }

    gsap.from(el, {
      ...animProps,
      clearProps: "transform, opacity",
      scrollTrigger: {
        trigger: el,
        start: "top 65%",
      },
    });
  });

  //// Group scroll animations (multiple elements controlled by a single trigger).
  document.querySelectorAll("[data-animate-group]").forEach((group) => {
    const triggerStartPoint = group.dataset.animateStart || "top 50%";

    group.querySelectorAll("[data-animate]").forEach((el) => {
      const animationType = el.dataset.animate;
      let animProps = { opacity: 0, ease: "power4.out" };

      switch (animationType) {
        case "slide-left":
          animProps.x = -40;
          break;
        case "slide-right":
          animProps.x = 40;
          break;
        case "slide-up":
          animProps.y = 40;
          break;
        case "slide-down":
          animProps.y = -40;
          break;
      }

      gsap.set(el, animProps);
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: group,
        start: triggerStartPoint,
        once: true,
      },
    });

    group.querySelectorAll("[data-animate]").forEach((el) => {
      tl.to(
        el,
        {
          x: 0,
          y: 0,
          opacity: 1,
          ease: "power4.out",
          duration: 0.5,
          clearProps: "transform, opacity",
        },
        0,
      );
    });
  });
}

//////////////////////////////////////////////////////////* Gallery page Masonry layout + Glightbox *//////////////////////////////////////////////////////////////////*

function setGalleryMasonryAndGlightbox() {
  const galleryPage = document.querySelector(".gallery-page-container");

  if (!galleryPage) return;

  const msnry = new Masonry(galleryPage, {
    itemSelector: "a",
    columnWidth: "a",
    percentPosition: true,
    fitWidth: true,
  });

  imagesLoaded(galleryPage, () => {
    msnry.layout();
  });

  function getGalleryGutter() {
    if (window.innerWidth < 500) {
      return 10;
    } else if (window.innerWidth < 850) {
      return 15;
    } else {
      return 20;
    }
  }

  msnry.options.gutter = getGalleryGutter();
  msnry.layout();

  window.lightbox = GLightbox({
    selector: ".glightbox",
    loop: false,
    zoomable: false,
    keyboardNavigation: true,
    touchNavigation: true,
    openEffect: "fade",
    closeEffect: "fade",
  });

  galleryPage?.querySelectorAll("a.glightbox").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });
}

////////////////////////////////////////////////////* Hamburger menu and Navigation accessibility attributes */////////////////////////////////////////////////////////*

function activateHamburgerMenu() {
  const hamburgerBtn = document.querySelector(".hamburger-btn");
  const navBar = document.querySelector(".nav-bar");
  const navBarList = document.querySelector(".nav-bar ul");
  let isAnimating = false;

  document.documentElement.style.overflowY = "";

  hamburgerBtn.addEventListener("click", (e) => {
    if (isAnimating) return;

    const isOpen = navBar.classList.contains("hamburger-btn__open");
    isAnimating = true;

    if (isOpen) {
      hamburgerBtn.classList.remove("active");
      document.documentElement.style.overflowY = "";
      navBar.classList.remove("hamburger-btn__open");
    } else {
      requestAnimationFrame(() => {
        hamburgerBtn.classList.add("active");
        navBar.classList.add("hamburger-btn__open");
      });

      setTimeout(() => {
        document.documentElement.style.overflowY = "hidden";
      }, 300);
    }

    setNavAttributes();

    setTimeout(() => {
      isAnimating = false;
    }, 800);
  });

  navBar.addEventListener("transitionend", (e) => {
    if (e.propertyName !== "transform") return;

    isAnimating = false;
  });
}

function setNavAttributes() {
  const navBar = document.querySelector(".nav-bar");
  const navBarLinks = document.querySelectorAll(".nav-bar a");
  const navBarHasActiveClass = navBar.classList.contains("hamburger-btn__open");
  const hamburgerBtn = document.querySelector(".hamburger-btn");

  if (!navBarHasActiveClass && navBar.contains(document.activeElement)) {
    document.activeElement.blur();
  }

  navBar.setAttribute("aria-hidden", String(!navBarHasActiveClass));
  hamburgerBtn.setAttribute("aria-expanded", String(navBarHasActiveClass));

  navBarLinks.forEach((link) => {
    link.tabIndex = navBarHasActiveClass ? 0 : -1;
  });
}

//////////////////////////////////////////////////////////////////* Show the current page on nav-bar *////////////////////////////////////////////////////////////////*

function updateActiveNavLink() {
  const navBarLinks = document.querySelectorAll(".nav-bar a");
  const currentPath = window.location.pathname;

  for (const link of navBarLinks) {
    const linkPath = new URL(link.href).pathname;

    if (linkPath === currentPath) {
      link.classList.add("active-link");

      requestAnimationFrame(() => {
        link.classList.add("animate-underline");
      });

      break; // Break the loop so only the homepage link has the active-link class.
    } else {
      link.classList.remove("active-link", "animate-underline");
    }
  }
}

//////////////////////////////////////////////////////////////* Footer copyright-year update *////////////////////////////////////////////////////////////////////////*

function updateCopyrightYear() {
  const currentYear = new Date().getFullYear();
  const copyrightSymbol = "\u00A9";

  document.getElementById("year").innerHTML =
    `${copyrightSymbol} Copyright ${currentYear}`;
}

////////////////////////////////////////////////////////* Prevent navigation transitions happening on resize *////////////////////////////////////////////////////////////////////////*

function stopTransitionOnResize() {
  const navBar = document.querySelector(".nav-bar");
  let resizeTimeout;

  window.addEventListener("resize", () => {
    navBar.classList.add("no-transition");

    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      navBar.classList.remove("no-transition");
    }, 1);
  });
}
