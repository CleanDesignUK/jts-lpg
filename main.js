(() => {
  "use strict";


  /* ============================================================
     COPYRIGHT YEAR
  ============================================================ */

  document
    .querySelectorAll("[data-year]")
    .forEach((el) => {
      el.textContent = new Date().getFullYear();
    });



  /* ============================================================
     MOBILE NAVIGATION
  ============================================================ */

  const toggle =
    document.querySelector(".menu-toggle");

  const nav =
    document.querySelector(".main-nav");


  const closeMenu = () => {

    nav?.classList.remove("is-open");

    toggle?.setAttribute(
      "aria-expanded",
      "false"
    );

    toggle?.setAttribute(
      "aria-label",
      "Open menu"
    );

  };


  toggle?.addEventListener(
    "click",
    () => {

      const open =
        toggle.getAttribute("aria-expanded") !==
        "true";


      toggle.setAttribute(
        "aria-expanded",
        String(open)
      );


      toggle.setAttribute(
        "aria-label",
        open
          ? "Close menu"
          : "Open menu"
      );


      nav?.classList.toggle(
        "is-open",
        open
      );

    }
  );


  document.addEventListener(
    "click",
    (event) => {

      if (
        !event.target.closest(".nav-wrap")
      ) {

        closeMenu();

      }

    }
  );


  let lastScrollY =
    window.scrollY;


  window.addEventListener(
    "scroll",
    () => {

      if (
        nav?.classList.contains("is-open") &&
        Math.abs(
          window.scrollY -
          lastScrollY
        ) > 8
      ) {

        closeMenu();

      }


      lastScrollY =
        window.scrollY;

    },
    {
      passive: true
    }
  );


  document.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key === "Escape"
      ) {

        closeMenu();

      }

    }
  );


  nav
    ?.querySelectorAll("a")
    .forEach((link) => {

      link.addEventListener(
        "click",
        closeMenu
      );

    });


  window
    .matchMedia("(min-width: 861px)")
    .addEventListener(
      "change",
      (event) => {

        if (event.matches) {
          closeMenu();
        }

      }
    );



  /* ============================================================
     PRICING TABS
  ============================================================ */

  const tabs =
    [
      ...document.querySelectorAll(
        "[data-price-tab]"
      )
    ];


  const panels =
    [
      ...document.querySelectorAll(
        "[data-price-panel]"
      )
    ];


  tabs.forEach((tab) => {

    tab.addEventListener(
      "click",
      () => {

        const target =
          tab.dataset.priceTab;


        tabs.forEach(
          (button) => {

            button.setAttribute(
              "aria-selected",
              String(
                button === tab
              )
            );

          }
        );


        panels.forEach(
          (panel) => {

            panel.hidden =
              panel.dataset.pricePanel !==
              target;

          }
        );

      }
    );

  });



  /* ============================================================
     TESTIMONIAL CAROUSEL
  ============================================================ */

  const testimonialTrack =
    document.getElementById(
      "testimonial-track"
    );


  const testimonialArrows =
    document.querySelectorAll(
      "[data-testimonial-dir]"
    );


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );


  const getTestimonialStep = () => {

    if (!testimonialTrack) {
      return 0;
    }


    const card =
      testimonialTrack.querySelector(
        ".trust-review-card"
      );


    if (!card) {
      return testimonialTrack.clientWidth;
    }


    const styles =
      window.getComputedStyle(
        testimonialTrack
      );


    const gap =
      parseFloat(
        styles.columnGap ||
        styles.gap ||
        "20"
      ) || 20;


    return (
      card.getBoundingClientRect().width +
      gap
    );

  };


  testimonialArrows.forEach(
    (button) => {

      button.addEventListener(
        "click",
        () => {

          if (!testimonialTrack) {
            return;
          }


          const direction =
            Number(
              button.dataset.testimonialDir
            );


          const step =
            getTestimonialStep();


          const maxScroll =
            testimonialTrack.scrollWidth -
            testimonialTrack.clientWidth;


          const current =
            testimonialTrack.scrollLeft;


          let next =
            current +
            step * direction;


          /*
            LOOP CAROUSEL

            Right arrow at the end:
            return to beginning.

            Left arrow at beginning:
            jump to the end.
          */

          if (
            direction > 0 &&
            current >= maxScroll - 5
          ) {

            next = 0;

          }


          if (
            direction < 0 &&
            current <= 5
          ) {

            next = maxScroll;

          }


          testimonialTrack.scrollTo({

            left: next,

            behavior:
              reducedMotion.matches
                ? "auto"
                : "smooth"

          });

        }
      );

    }
  );



  /* ============================================================
     TESTIMONIAL KEYBOARD CONTROLS
  ============================================================ */

  testimonialTrack?.addEventListener(
    "keydown",
    (event) => {

      if (
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight"
      ) {

        return;

      }


      event.preventDefault();


      const direction =
        event.key === "ArrowRight"
          ? 1
          : -1;


      testimonialTrack.scrollBy({

        left:
          getTestimonialStep() *
          direction,

        behavior:
          reducedMotion.matches
            ? "auto"
            : "smooth"

      });

    }
  );



  /* ============================================================
     TESTIMONIAL READ MORE / READ LESS
  ============================================================ */

  const reviewCopies =
    document.querySelectorAll(
      ".trust-review-copy"
    );


  reviewCopies.forEach(
    (wrapper) => {

      const text =
        wrapper.querySelector(
          ".trust-review-text"
        );


      const button =
        wrapper.querySelector(
          ".trust-review-toggle"
        );


      if (
        !text ||
        !button
      ) {

        return;

      }


      const checkOverflow = () => {

        /*
          Only show Read More if
          the review is actually clipped.
        */

        const overflowing =
          text.scrollHeight >
          text.clientHeight + 3;


        if (
          !wrapper.classList.contains(
            "is-expanded"
          )
        ) {

          button.hidden =
            !overflowing;

        }

      };


      requestAnimationFrame(
        checkOverflow
      );


      button.addEventListener(
        "click",
        () => {

          const expanded =
            button.getAttribute(
              "aria-expanded"
            ) === "true";


          wrapper.classList.toggle(
            "is-expanded",
            !expanded
          );


          button.setAttribute(
            "aria-expanded",
            String(!expanded)
          );


          button.textContent =
            expanded
              ? "Read more"
              : "Read less";

        }
      );

    }
  );



  /* ============================================================
     COOKIE BANNER
  ============================================================ */

  const cookieBanner =
    document.querySelector(
      "[data-cookie-banner]"
    );


  const cookieKey =
    "jts-cookie-choice";


  if (
    cookieBanner &&
    !localStorage.getItem(
      cookieKey
    )
  ) {

    cookieBanner.hidden =
      false;

  }


  document
    .querySelectorAll(
      "[data-cookie-choice]"
    )
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          localStorage.setItem(
            cookieKey,
            button.dataset.cookieChoice
          );


          if (cookieBanner) {
            cookieBanner.hidden = true;
          }

        }
      );

    });

/* ============================================================
   MOBILE SERVICES 03 - 05 CAROUSEL
============================================================ */

const serviceTrack =
  document.getElementById("mobile-service-track");

const serviceArrows =
  document.querySelectorAll("[data-service-slide]");


if (serviceTrack && serviceArrows.length) {

  const getServiceStep = () => {

    const card =
      serviceTrack.querySelector(".mini-service");

    if (!card) {
      return serviceTrack.clientWidth;
    }


    const styles =
      window.getComputedStyle(serviceTrack);


    const gap =
      parseFloat(
        styles.columnGap ||
        styles.gap ||
        "14"
      ) || 14;


    return (
      card.getBoundingClientRect().width +
      gap
    );

  };


  serviceArrows.forEach((button) => {

    button.addEventListener("click", () => {

      const direction =
        Number(button.dataset.serviceSlide);


      const maxScroll =
        serviceTrack.scrollWidth -
        serviceTrack.clientWidth;


      const current =
        serviceTrack.scrollLeft;


      let next =
        current +
        getServiceStep() *
        direction;


      /* loop at either end */

      if (
        direction > 0 &&
        current >= maxScroll - 5
      ) {
        next = 0;
      }


      if (
        direction < 0 &&
        current <= 5
      ) {
        next = maxScroll;
      }


      serviceTrack.scrollTo({
        left: next,
        behavior: "smooth"
      });

    });

  });

}
})();