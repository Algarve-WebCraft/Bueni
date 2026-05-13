"use strict";
import Swup from "swup";
import SwupHeadPlugin from "@swup/head-plugin";

////// Load all functions in as the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  runSwupHooks();
  activateHamburgerMenu();
  updateActiveNavLink();
  resetHomeLoadedClass();
  darkMode();
  menuChangeCategory();
  menuMobileSwipe();
  setGalleryMasonryAndGlightbox();
  stopTransitionOnResize();

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
    updateActiveNavLink();
    menuChangeCategory();
    homepageMenuJump();
    setGalleryMasonryAndGlightbox();

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
}

/////////////////////////////////////////////////////////////* Opening hero intro animations *///////////////////////////////////////////////////////////////////////////*

function gsapOpeningHomeAnimations() {
  /* return; */

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

////////////////////////////////////////////////////////////* GSAP scrolling animations *////////////////////////////////////////////////////////////////////////////////*

function gsapScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  /* return; */

  /* ScrollTrigger.defaults({ markers: true });  */

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
        animProps = { ...animProps, y: 150 };
        break;
      case "slide-down":
        animProps = { ...animProps, y: -150 };
        break;
      case "slide-left":
        animProps = { ...animProps, x: -150 };
        break;
      case "slide-right":
        animProps = { ...animProps, x: 150 };
        break;
      case "scale-size":
        animProps = { ...animProps, scale: 0.75, duration: 1.5 };
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
      case "shutter-horizontal":
        gsap.fromTo(
          el,
          { clipPath: "inset(0 50% 0 50%)" },
          {
            clipPath: "inset(0 0% 0 0%)",
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform, opacity",
            scrollTrigger: {
              trigger: el,
              start: "top 65%",
            },
          },
        );
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
    const triggerStartPoint = group.dataset.animateStart || "top 40%";

    group.querySelectorAll("[data-animate]").forEach((el) => {
      const animationType = el.dataset.animate;
      let animProps = { opacity: 0, ease: "power4.out" };

      switch (animationType) {
        case "slide-left":
          animProps.x = -120;
          break;
        case "slide-right":
          animProps.x = 120;
          break;
        case "slide-up":
          animProps.y = 120;
          break;
        case "slide-down":
          animProps.y = -120;
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

/////////////////////////////////////////////////////////////////* Menu section change menu *//////////////////////////////////////////////////////////////////////////*

function menuChangeCategory() {
  const menuButtons = document.querySelectorAll(".menu-headings__inner button");
  const menuWrapper = document.querySelector(".menu-items-container");
  let activeMenu = document.querySelector(".menu-items__inner.menu-is-active");
  let isAnimating = false;

  function updateMenuHeight(selectedMenu) {
    menuWrapper.style.height = selectedMenu.scrollHeight + "px";
  }

  if (activeMenu) {
    requestAnimationFrame(() => updateMenuHeight(activeMenu));
  }

  window.addEventListener("resize", () => {
    if (activeMenu) {
      updateMenuHeight(activeMenu);
    }
  });

  menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const menuDataTarget = button.dataset.menu;
      const selectedMenuItem = document.querySelector(
        `.menu-items__inner[data-menu="${menuDataTarget}"]`,
      );

      if (selectedMenuItem === activeMenu || isAnimating) return;
      isAnimating = true;

      const previousMenu = activeMenu;

      const tl = gsap.timeline({
        defaults: { duration: 0.75, ease: "power3.out" },
      });

      if (previousMenu) {
        tl.to(previousMenu, {
          x: "-5rem",
          opacity: 0,
          onStart: () => {
            gsap.delayedCall(0.35, () => {
              updateMenuHeight(selectedMenuItem);
            });
          },
          onComplete: () => {
            previousMenu.classList.remove("menu-is-active");
            previousMenu.setAttribute("aria-hidden", "true");
            previousMenu.style.display = "none";
            gsap.set(previousMenu, { x: 0 });
          },
        });
      }

      tl.fromTo(
        selectedMenuItem,
        { x: "5rem", opacity: 0 },
        {
          x: 0,
          opacity: 1,
          onStart: () => {
            selectedMenuItem.style.display = "grid";
            selectedMenuItem.setAttribute("aria-hidden", "false");
            selectedMenuItem.classList.add("menu-is-active");
          },
          onComplete: () => {
            selectedMenuItem.style.pointerEvents = "auto";
          },
        },
        "-=0.4",
      );

      tl.eventCallback("onComplete", () => {
        activeMenu = selectedMenuItem;
        isAnimating = false;
      });

      menuButtons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle("menu-is-active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    });
  });
}

//// Jump to correct menu section from homepage.

function homepageMenuJump() {
  const menuWrapper = document.querySelector(".menu-items-container");
  const menuScrollSection = document.querySelector(".menu-scroll-start-point");
  const windowHash = window.location.hash.replace("#", "");

  if (!windowHash) return;

  // Prevent menu items from popping in and out due to scrolltriggers when coming from the homepage.
  menuWrapper.style.opacity = "0";

  setTimeout(() => {
    menuWrapper.style.opacity = "1";
  }, 800);

  const targetButton = document.querySelector(
    `.menu-headings__inner button[data-menu="${windowHash}"]`,
  );
  const targetMenu = document.querySelector(
    `.menu-items__inner[data-menu="${windowHash}"]`,
  );
  const activeMenu = document.querySelector(
    ".menu-items__inner.menu-is-active",
  );
  const activeButton = document.querySelector(
    ".menu-headings__inner button.menu-is-active",
  );

  if (!targetMenu || !targetButton) return;

  activeMenu.classList.remove("menu-is-active");
  activeButton.classList.remove("menu-is-active");

  targetMenu.classList.add("menu-is-active");
  targetMenu.setAttribute("aria-hidden", "false");
  targetButton.classList.add("menu-is-active");
  targetButton.setAttribute("aria-selected", "true");

  if (menuWrapper && targetMenu) {
    menuWrapper.style.height = targetMenu.scrollHeight + "px";
  }

  menuScrollSection?.scrollIntoView({
    behavior: "auto",
    block: "start",
  });

  // Prevent focus-outline from appearing on menu change
  window.addEventListener("load", () => {
    if (window.location.hash) {
      document.activeElement?.blur();
    }
  });

  menuChangeCategory();
}

///// Mobile swipe functionality.

function menuMobileSwipe() {
  const menuWrapper = document.querySelector(".menu-items-container");
  const swipeThreshold = 50;
  let touchStartX = 0;
  let touchEndX = 0;

  menuWrapper?.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  menuWrapper?.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;

    if (Math.abs(diff) < swipeThreshold) return;

    const buttons = Array.from(menuButtons);
    const activeButton = document.querySelector(
      ".menu-headings__inner button.menu-is-active",
    );

    if (!activeButton) return;

    const currentIndex = buttons.indexOf(activeButton);

    if (diff < 0 && currentIndex < buttons.length - 1) {
      buttons[currentIndex + 1].click();
    }

    if (diff > 0 && currentIndex > 0) {
      buttons[currentIndex - 1].click();
    }
  }
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

  hamburgerBtn.addEventListener("click", () => {
    if (isAnimating) return;
    const isOpen = navBar.classList.contains("hamburger-btn__open");

    if (isOpen) {
      isAnimating = true;
      hamburgerBtn.classList.remove("active");
      navBar.classList.remove("hamburger-btn__open");
    } else {
      navBar.style.display = "block";
      requestAnimationFrame(() => {
        isAnimating = true;
        hamburgerBtn.classList.add("active");
        navBar.classList.add("hamburger-btn__open");
      });
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

  document.addEventListener("click", (e) => {
    if (
      !navBar.classList.contains("hamburger-btn__open") ||
      e.target === navBar ||
      e.target === hamburgerBtn ||
      e.target === navBarList
    )
      return;

    isAnimating = true;
    navBar.classList.remove("hamburger-btn__open");
    hamburgerBtn.classList.remove("active");

    setNavAttributes();
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

/////////////////////////////////////////////////////////////////* Dark-mode change */////////////////////////////////////////////////////////////////////////////////*

function darkMode() {
  const darkModeButton = document.getElementById("dark-mode-toggle");
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function applyDarkMode() {
    document.documentElement.classList.add("dark-mode");
  }

  function applyLightMode() {
    document.documentElement.classList.remove("dark-mode");
  }

  function enableDarkMode() {
    applyDarkMode();
    localStorage.setItem("theme", "dark");
  }

  function disableDarkMode() {
    applyLightMode();
    localStorage.setItem("theme", "light");
  }

  function detectColorScheme() {
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme) {
      storedTheme === "dark" ? applyDarkMode() : applyLightMode();
      return;
    }

    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    prefersDark ? applyDarkMode() : applyLightMode();
  }

  detectColorScheme();

  function switchTheme(newTheme) {
    newTheme === "dark" ? enableDarkMode() : disableDarkMode();
  }

  mediaQuery.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      e.matches ? applyDarkMode() : applyLightMode();
    }
  });

  darkModeButton.addEventListener("click", () => {
    const isPressed = darkModeButton.getAttribute("aria-pressed") === "true";
    darkModeButton.setAttribute("aria-pressed", String(!isPressed));

    const currentTheme = localStorage.getItem("theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";

    if (!document.startViewTransition) {
      switchTheme(newTheme);
      return;
    }

    document.startViewTransition(() => {
      switchTheme(newTheme);
    });
  });
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
