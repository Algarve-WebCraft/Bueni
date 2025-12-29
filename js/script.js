"use strict";

// Load all functions in as the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  menuChangeCategory();
  homepageMenuJump();
  menuMobileSwipe();
  activateHamburgerMenu();
  updateActiveNavLink();
  resetHomeLoadedClass();
  darkMode();
  stopTransitionOnResize();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  gsapOpeningHomeAnimations();
  gsapScrollAnimations();
});

///////////////////////////////////////////////////////////* Swup page navigation *////////////////////////////////////////////////////////////////////////////////////////*

const swup = new Swup({
  containers: ["#swup", "#swup-header-container", "#footer"],
});

swup.hooks.on("page:view", () => {
  activateHamburgerMenu();
  updateActiveNavLink();

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  setTimeout(() => ScrollTrigger.refresh(true), 300);

  setTimeout(() => {
    gsapScrollAnimations();
  }, 1000);
});

/////////////////////////////////////////////////////////////* Opening hero intro animations *///////////////////////////////////////////////////////////////////////////*

function gsapOpeningHomeAnimations() {
  const isMobile = window.matchMedia("(max-width: 62.5rem)");
  const body = document.body;

  return;
  const tl = gsap.timeline({
    defaults: { ease: "power3.out" },
    delay: 0.3,
  });

  window.addEventListener("load", () => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 0);
  });

  if (body.classList.contains("home")) {
    document.documentElement.style.overflow = "hidden";
  }

  tl.fromTo(
    "#pg1-hero",
    {
      opacity: 0,
      rotateX: 30,
      rotateY: -100,
      scale: 6,
      transformOrigin: "center center",
    },
    {
      opacity: 1,
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 3,
      ease: "power3.out",
    }
  );
  tl.from(
    "#hero-heading",
    {
      x: -230,
      opacity: 0,
      duration: 1.25,
    },
    "+=0.75"
  )
    .from(
      ".hero__image-main",
      {
        opacity: 0,
        scale: 0.1,
        duration: 0.1,
        onComplete() {
          const images = document.querySelectorAll(".hero__image-main");

          images.forEach((image) => {
            image.classList.add("slide-in-elliptic");
            gsap.set(".hero__image-main", { clearProps: "all" });
          });
        },
      },
      "-=1.5"
    )
    .from(".hero-text", { x: 230, opacity: 0, duration: 1.25 }, "-=0.8")
    .from(
      ".cmp-topper-heading--pg1-hero",
      { opacity: 0, duration: 2.5 },
      "-=0.4"
    )
    .from(".cmp-main-btn--pg1-hero", { opacity: 0, duration: 2.5 }, "-=2")
    .from(
      ".home-header",
      { x: -1600, opacity: 0, duration: 3 },
      `${isMobile.matches ? "-=5.5" : "-=4.4"}`
    )
    .to(
      {},
      {
        duration: 1,
        onComplete() {
          document.documentElement.style.overflow = "";
          document.body.classList.remove("loading");
          document.body.classList.add("loaded");
          gsap.set("#pg1-hero", { clearProps: "all" });
        },
      },
      "-=5" /* Remove the hidden overflow a few seconds before the end of the animations so the user can scroll again */
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

  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  /* ScrollTrigger.defaults({ markers: true }); */ // Enable markers to show where the scroller starts and ends while planning

  const animatedElements = document.querySelectorAll("[data-animate]");

  /* Add 'data-animate' to the elements you want to animate from the list below ie. data-animate="slide-up". */
  /* Add 'data-reversible' to the elements you want to reverse the animation when scrolling back up. */
  /* Add 'data-no-scrub' so the elements will pop in as soon as the trigger is hit, instead of slowly scrubbing in. */

  animatedElements.forEach((el) => {
    const animationType = el.dataset.animate;
    const isReversible = el.hasAttribute("data-reversible");
    const noScrub = el.hasAttribute("data-no-scrub");
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
      case "slide-up-fast":
        animProps = { ...animProps, y: 150, duration: 0.2 };
        break;
      case "slide-down-fast":
        animProps = { ...animProps, y: -150, duration: 0.2 };
        break;
      case "slide-left-fast":
        animProps = { ...animProps, x: -150, duration: 0.2 };
        break;
      case "slide-right-fast":
        animProps = { ...animProps, x: 150, duration: 0.2 };
        break;
      case "fade-in":
      default:
        animProps = { ...animProps, duration: 1 };
        break;
    }

    gsap.from(el, {
      ...animProps,
      scrollTrigger: {
        trigger: el,
        start: "top 58%",

        end: "top 45%",
        scrub: noScrub ? false : 5,
        once: isReversible ? false : true,
        toggleActions: isReversible
          ? "play none none reverse"
          : "play none none none",
      },
    });
  });

  ScrollTrigger.refresh(true);
}

/////////////////////////////////////////////////////////////////* Menu section change menu *//////////////////////////////////////////////////////////////////////////*

const menuButtons = document.querySelectorAll(".menu-headings__inner button");
const menuWrapper = document.querySelector(".menu-items-container");
const activeMenu = document.querySelector(".menu-items__inner.menu-is-active");

function menuChangeCategory() {
  function updateMenuHeight(selectedMenu) {
    menuWrapper.style.height = selectedMenu.scrollHeight + "px";
  }

  if (activeMenu) {
    updateMenuHeight(activeMenu);
  }

  window.addEventListener("resize", () => {
    if (activeMenu) {
      updateMenuHeight(activeMenu);
    }
  });

  menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const menuDataTarget = button.dataset.menu;
      const activeMenu = document.querySelector(
        ".menu-items__inner.menu-is-active"
      );
      const selectedMenuItem = document.querySelector(
        `.menu-items__inner[data-menu="${menuDataTarget}"]`
      );

      selectedMenuItem.setAttribute("aria-hidden", "false");

      if (selectedMenuItem.classList.contains("menu-is-active")) return;

      if (activeMenu) {
        activeMenu.classList.add("menu-is-leaving");
        activeMenu.classList.remove("menu-is-active");
        activeMenu.setAttribute("aria-hidden", "true");

        setTimeout(() => {
          activeMenu.classList.remove("menu-is-leaving");
        }, 500);
      }

      selectedMenuItem.classList.add("menu-is-active");
      updateMenuHeight(selectedMenuItem);

      menuButtons.forEach((btn) => {
        btn.classList.remove("menu-is-active");
        btn.setAttribute("aria-selected", "false");
      });

      button.classList.add("menu-is-active");
      button.setAttribute("aria-selected", "true");
    });
  });
}

///////* Jump to correct menu section from homepage *///////////

function homepageMenuJump() {
  const windowHash = window.location.hash.replace("#", "");
  if (!windowHash) return;

  const targetButton = document.querySelector(
    `.menu-headings__inner button[data-menu="${windowHash}"]`
  );
  const targetMenu = document.querySelector(
    `.menu-items__inner[data-menu="${windowHash}"]`
  );
  const activeMenu = document.querySelector(
    ".menu-items__inner.menu-is-active"
  );
  const activeButton = document.querySelector(
    ".menu-headings__inner button.menu-is-active"
  );

  if (!targetMenu || !targetButton) return;

  activeMenu.classList.remove("menu-is-active");
  activeButton.classList.remove("menu-is-active");

  targetMenu.classList.add("menu-is-active");
  targetMenu.setAttribute("aria-hidden", "false");
  targetButton.classList.add("menu-is-active");
  targetButton.setAttribute("aria-selected", "true");

  // Prevent focus-outline from appearing on menu change
  window.addEventListener("load", () => {
    if (window.location.hash) {
      document.activeElement?.blur();
    }
  });
}

///////////////* Mobile swipe functionality *////////////////

function menuMobileSwipe() {
  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 50;

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
      ".menu-headings__inner button.menu-is-active"
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

//////////////////////////////////////////////////////////* Our services page heading underline draw *//////////////////////////////////////////////////////////////////*

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

  navBarLinks.forEach((link) => {
    const linkPath = new URL(link.href).pathname;

    if (linkPath === currentPath) {
      link.classList.add("active-link");

      requestAnimationFrame(() => {
        link.classList.add("animate-underline");
      });
    } else {
      link.classList.remove("active-link", "animate-underline");
    }
  });
}

/////////////////////////////////////////////////////////////////* Dark-mode change */////////////////////////////////////////////////////////////////////////////////*

function darkMode() {
  const darkModeButton = document.getElementById("dark-mode-toggle");

  function enableDarkMode() {
    document.documentElement.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  }

  function disableDarkMode() {
    document.documentElement.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }

  function detectColorScheme() {
    let theme = "light";

    if (localStorage.getItem("theme")) {
      theme = localStorage.getItem("theme");
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      theme = "dark";
    }

    theme === "dark" ? enableDarkMode() : disableDarkMode();
  }

  detectColorScheme();

  function switchTheme(newTheme) {
    newTheme === "dark" ? enableDarkMode() : disableDarkMode();
  }

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
