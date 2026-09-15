(() => {
  "use strict";


  /* ============================================================
     COPYRIGHT YEAR
  ============================================================ */

  document
    .querySelectorAll("[data-year]")
    .forEach((el) => {
      el.textContent =
        new Date().getFullYear();
    });



  /* ============================================================
     MOBILE NAVIGATION
  ============================================================ */

  const toggle =
    document.querySelector(
      ".menu-toggle"
    );


  const nav =
    document.querySelector(
      ".main-nav"
    );


  const closeMenu = () => {

    nav?.classList.remove(
      "is-open"
    );


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
        toggle.getAttribute(
          "aria-expanded"
        ) !== "true";


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
        !event.target.closest(
          ".nav-wrap"
        )
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
        nav?.classList.contains(
          "is-open"
        ) &&
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
    .matchMedia(
      "(min-width: 861px)"
    )
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


  const pricePanels =
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


        pricePanels.forEach(
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
     REDUCED MOTION
  ============================================================ */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );



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
      card
        .getBoundingClientRect()
        .width +
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
              button.dataset
                .testimonialDir
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
            step *
            direction;


          if (
            direction > 0 &&
            current >=
            maxScroll - 5
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
        event.key !==
          "ArrowLeft" &&
        event.key !==
          "ArrowRight"
      ) {

        return;

      }


      event.preventDefault();


      const direction =
        event.key ===
        "ArrowRight"
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


  let cookieChoice = null;


  try {

    cookieChoice =
      localStorage.getItem(
        cookieKey
      );

  } catch {

    /*
      Storage may be unavailable.
      The banner can still function.
    */

  }


  if (
    cookieBanner &&
    !cookieChoice
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

          try {

            localStorage.setItem(
              cookieKey,
              button.dataset
                .cookieChoice
            );

          } catch {

            /*
              Storage is optional.
            */

          }


          if (cookieBanner) {

            cookieBanner.hidden =
              true;

          }

        }
      );

    });



  /* ============================================================
     HOMEPAGE MINI SERVICE CAROUSEL
  ============================================================ */

  const serviceTrack =
    document.getElementById(
      "mobile-service-track"
    );


  const serviceArrows =
    document.querySelectorAll(
      "[data-service-slide]"
    );


  if (
    serviceTrack &&
    serviceArrows.length
  ) {

    const getServiceStep = () => {

      const card =
        serviceTrack.querySelector(
          ".mini-service"
        );


      if (!card) {

        return serviceTrack.clientWidth;

      }


      const styles =
        window.getComputedStyle(
          serviceTrack
        );


      const gap =
        parseFloat(
          styles.columnGap ||
          styles.gap ||
          "14"
        ) || 14;


      return (
        card
          .getBoundingClientRect()
          .width +
        gap
      );

    };


    serviceArrows.forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const direction =
              Number(
                button.dataset
                  .serviceSlide
              );


            const maxScroll =
              serviceTrack.scrollWidth -
              serviceTrack.clientWidth;


            const current =
              serviceTrack.scrollLeft;


            let next =
              current +
              getServiceStep() *
              direction;


            if (
              direction > 0 &&
              current >=
              maxScroll - 5
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

              behavior:
                reducedMotion.matches
                  ? "auto"
                  : "smooth"

            });

          }
        );

      }
    );

  }



  /* ============================================================
     SERVICES PAGE EXPLORER
     DESKTOP TABS + MOBILE ARROWS + SWIPE
  ============================================================ */

  const servicesPageExplorer =
    document.querySelector(
      ".page-services .svc-services"
    );


  if (servicesPageExplorer) {

    const serviceTabButtons =
      [
        ...servicesPageExplorer
          .querySelectorAll(
            "[data-service-tab]"
          )
      ];


    const servicePanels =
      [
        ...servicesPageExplorer
          .querySelectorAll(
            "[data-service-panel]"
          )
      ];


    const mobileArrows =
      servicesPageExplorer
        .querySelectorAll(
          "[data-svc-mobile-dir]"
        );


    const mobileCurrent =
      servicesPageExplorer
        .querySelector(
          "[data-svc-mobile-current]"
        );


    const mobileTotal =
      servicesPageExplorer
        .querySelector(
          "[data-svc-mobile-total]"
        );


    const mobileTitle =
      servicesPageExplorer
        .querySelector(
          "[data-svc-mobile-title]"
        );


    const panelWrap =
      servicesPageExplorer
        .querySelector(
          ".svc-panels"
        );


    const mobileMedia =
      window.matchMedia(
        "(max-width: 800px)"
      );


    if (
      serviceTabButtons.length &&
      servicePanels.length
    ) {

      let currentIndex =
        serviceTabButtons
          .findIndex(
            (button) =>
              button
                .classList
                .contains(
                  "is-active"
                )
          );


      if (currentIndex < 0) {

        currentIndex = 0;

      }


      const getServiceTitle =
        (index) => {

          const title =
            serviceTabButtons[index]
              ?.querySelector(
                ".svc-menu-copy strong"
              );


          return (
            title
              ?.textContent
              .trim() ||
            "LPG Service"
          );

        };


      const showService =
        (
          requestedIndex,
          direction = 1
        ) => {

          const total =
            serviceTabButtons.length;


          currentIndex =
            (
              requestedIndex %
              total +
              total
            ) %
            total;


          const activeButton =
            serviceTabButtons[
              currentIndex
            ];


          const target =
            activeButton
              .dataset
              .serviceTab;


          serviceTabButtons
            .forEach(
              (
                button,
                index
              ) => {

                const active =
                  index ===
                  currentIndex;


                button
                  .classList
                  .toggle(
                    "is-active",
                    active
                  );


                button.setAttribute(
                  "aria-selected",
                  String(active)
                );

              }
            );


          servicePanels
            .forEach(
              (panel) => {

                const active =
                  panel
                    .dataset
                    .servicePanel ===
                  target;


                panel.hidden =
                  !active;


                panel
                  .classList
                  .toggle(
                    "is-active",
                    active
                  );


                if (active) {

                  panel.style
                    .setProperty(
                      "--svc-enter-x",
                      direction < 0
                        ? "-14px"
                        : "14px"
                    );

                }

              }
            );


          if (mobileCurrent) {

            mobileCurrent.textContent =
              String(
                currentIndex + 1
              ).padStart(
                2,
                "0"
              );

          }


          if (mobileTotal) {

            mobileTotal.textContent =
              String(
                total
              ).padStart(
                2,
                "0"
              );

          }


          if (mobileTitle) {

            mobileTitle.textContent =
              getServiceTitle(
                currentIndex
              );

          }

        };


      /* ========================================================
         DESKTOP / TABLET SERVICE MENU
      ======================================================== */

      serviceTabButtons
        .forEach(
          (
            button,
            index
          ) => {

            button.addEventListener(
              "click",
              () => {

                const direction =
                  index >=
                  currentIndex
                    ? 1
                    : -1;


                showService(
                  index,
                  direction
                );

              }
            );

          }
        );


      /* ========================================================
         MOBILE SERVICE ARROWS
      ======================================================== */

      mobileArrows.forEach(
        (button) => {

          button.addEventListener(
            "click",
            () => {

              const direction =
                Number(
                  button.dataset
                    .svcMobileDir
                );


              showService(
                currentIndex +
                direction,
                direction
              );

            }
          );

        }
      );


      /* ========================================================
         MOBILE SERVICE SWIPE
      ======================================================== */

      let touchStartX = 0;
      let touchStartY = 0;


      panelWrap?.addEventListener(
        "touchstart",
        (event) => {

          if (
            !mobileMedia.matches
          ) {

            return;

          }


          const touch =
            event.changedTouches[0];


          touchStartX =
            touch.clientX;


          touchStartY =
            touch.clientY;

        },
        {
          passive: true
        }
      );


      panelWrap?.addEventListener(
        "touchend",
        (event) => {

          if (
            !mobileMedia.matches
          ) {

            return;

          }


          const touch =
            event.changedTouches[0];


          const deltaX =
            touch.clientX -
            touchStartX;


          const deltaY =
            touch.clientY -
            touchStartY;


          if (
            Math.abs(deltaX) < 55 ||
            Math.abs(deltaX) <=
            Math.abs(deltaY)
          ) {

            return;

          }


          const direction =
            deltaX < 0
              ? 1
              : -1;


          showService(
            currentIndex +
            direction,
            direction
          );

        },
        {
          passive: true
        }
      );


      /* ========================================================
         SERVICE KEYBOARD CONTROLS
      ======================================================== */

      panelWrap?.setAttribute(
        "tabindex",
        "0"
      );


      panelWrap?.addEventListener(
        "keydown",
        (event) => {

          if (
            event.key !==
              "ArrowLeft" &&
            event.key !==
              "ArrowRight"
          ) {

            return;

          }


          event.preventDefault();


          const direction =
            event.key ===
            "ArrowRight"
              ? 1
              : -1;


          showService(
            currentIndex +
            direction,
            direction
          );

        }
      );


      /* ========================================================
         INITIAL SERVICE
      ======================================================== */

      showService(
        currentIndex,
        1
      );

    }

  }



  /* ============================================================
     MOBILE WORK GALLERY
     EXACTLY ONE PHOTO AT A TIME
  ============================================================ */

  const workGallery =
    document.querySelector(
      "#work-gallery-track"
    );


  const workGalleryButtons =
    document.querySelectorAll(
      "[data-gallery-dir]"
    );


  if (
    workGallery &&
    workGalleryButtons.length
  ) {

    const galleryItems =
      [
        ...workGallery.querySelectorAll(
          ".work-gallery-item"
        )
      ];


    let galleryIndex = 0;


    let galleryScrollTimer = null;



    /* ==========================================================
       SHOW EXACT GALLERY IMAGE
    ========================================================== */

    const showGalleryImage =
      (requestedIndex) => {

        if (!galleryItems.length) {

          return;

        }


        galleryIndex =
          (
            requestedIndex %
            galleryItems.length +
            galleryItems.length
          ) %
          galleryItems.length;


        const item =
          galleryItems[
            galleryIndex
          ];


        if (!item) {

          return;

        }


        const trackRect =
          workGallery
            .getBoundingClientRect();


        const itemRect =
          item
            .getBoundingClientRect();


        const targetLeft =
          workGallery.scrollLeft +
          itemRect.left -
          trackRect.left;


        workGallery.scrollTo({

          left: targetLeft,

          behavior:
            reducedMotion.matches
              ? "auto"
              : "smooth"

        });

      };



    /* ==========================================================
       GALLERY ARROWS
    ========================================================== */

    workGalleryButtons.forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            const direction =
              Number(
                button.dataset
                  .galleryDir
              );


            showGalleryImage(
              galleryIndex +
              direction
            );

          }
        );

      }
    );



    /* ==========================================================
       KEEP INDEX IN SYNC AFTER MANUAL SWIPE
    ========================================================== */

    workGallery.addEventListener(
      "scroll",
      () => {

        clearTimeout(
          galleryScrollTimer
        );


        galleryScrollTimer =
          setTimeout(
            () => {

              const trackRect =
                workGallery
                  .getBoundingClientRect();


              const trackCentre =
                trackRect.left +
                trackRect.width / 2;


              let closestIndex = 0;

              let closestDistance =
                Infinity;


              galleryItems.forEach(
                (
                  item,
                  index
                ) => {

                  const rect =
                    item
                      .getBoundingClientRect();


                  const centre =
                    rect.left +
                    rect.width / 2;


                  const distance =
                    Math.abs(
                      centre -
                      trackCentre
                    );


                  if (
                    distance <
                    closestDistance
                  ) {

                    closestDistance =
                      distance;


                    closestIndex =
                      index;

                  }

                }
              );


              galleryIndex =
                closestIndex;

            },
            100
          );

      },
      {
        passive: true
      }
    );



    /* ==========================================================
       GALLERY KEYBOARD CONTROLS
    ========================================================== */

    workGallery.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key !==
            "ArrowLeft" &&
          event.key !==
            "ArrowRight"
        ) {

          return;

        }


        event.preventDefault();


        const direction =
          event.key ===
          "ArrowRight"
            ? 1
            : -1;


        showGalleryImage(
          galleryIndex +
          direction
        );

      }
    );



    /* ==========================================================
       RESET GALLERY POSITION WHEN RETURNING TO MOBILE
    ========================================================== */

    const galleryMobileMedia =
      window.matchMedia(
        "(max-width: 700px)"
      );


    const syncGalleryOnBreakpoint =
      (event) => {

        if (event.matches) {

          requestAnimationFrame(
            () => {

              showGalleryImage(
                galleryIndex
              );

            }
          );

        }

      };


    galleryMobileMedia
      .addEventListener(
        "change",
        syncGalleryOnBreakpoint
      );

  }

})();