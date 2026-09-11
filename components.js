/*
 * GLOBAL NAVBAR AND FOOTER
 * Edit the two HTML sections below to update every page.
 * No terminal commands, HTML includes, fetch() calls or build process are needed.
 * Load this file before main.js and cookies.js on every page.
 */
(() => {
  "use strict";

  // ============================================================
  // GLOBAL NAVBAR: edit navigation and the Call Jack button here.
  // ============================================================
  const navbarHTML = `
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="topbar">
      <div class="container">
        <span>
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          ANGLESEY &amp; SELECTED NORTH WALES WORK
        </span>
        <span>
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z" />
            <path d="m8 11 3 3 5-5" />
          </svg>
          Gas Safe registered · 958399
        </span>
        <span class="desktop-hours">Mon–Fri 8am–6pm</span>
      </div>
    </div>
    <header class="site-header">
      <div class="container nav-wrap">
        <a class="brand" href="index.html" aria-label="JTS LPG Services home">
          <img src="images/jts-lpg-services-logo.webp" alt="JTS LPG Services" width="62" height="62" />
          <span class="brand-copy">
            <strong>JTS LPG SERVICES</strong>
            <small>Caravan &amp; leisure gas specialist</small>
          </span>
        </a>
        <nav class="main-nav" id="main-navigation" aria-label="Main navigation">
          <a href="index.html">Home</a>
          <a href="services.html">Services</a>
          <a href="areas-covered.html">Areas covered</a>
          <a href="about.html">Meet Jack</a>
          <a href="pricing.html">Prices</a>
          <a href="contact.html">Contact</a>
        </nav>
        <a class="button nav-call" href="tel:+447498579460">
          Call Jack
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 3.1 5.2 2 2 0 0 1 5.1 3h3l2 5-2.4 1.8a16 16 0 0 0 6.5 6.5L16 14z"
            />
          </svg>
        </a>
        <button
          class="menu-toggle"
          aria-controls="main-navigation"
          aria-expanded="false"
          aria-label="Open menu"
        >
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  `;

  // ============================================================
  // GLOBAL FOOTER: edit contact details, links and socials here.
  // ============================================================
  const footerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-about">
            <a class="brand" href="index.html" aria-label="JTS LPG Services home">
              <img
                src="images/jts-lpg-services-logo.webp"
                alt="JTS LPG Services"
                width="62"
                height="62"
              />
              <span class="brand-copy">
                <strong>JTS LPG SERVICES</strong>
                <small>Caravan &amp; leisure gas specialist</small>
              </span>
            </a>
            <p>
              JTS LPG Services is Jack’s independent LPG gas engineering business on Anglesey (Ynys
              Môn). Gas safety certificates, LPG boiler servicing, repairs and installations for static
              caravans, holiday homes, lodges and domestic LPG properties across the island, with
              selected work in Bangor and North Wales by arrangement.
            </p>
            <div class="socials">
              <a
                href="https://share.google/kycgcLAGMWo3HcO8X"
                aria-label="JTS LPG Services on Google"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20 7a9 9 0 1 0 1 7h-9v-4h10v3" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/people/JTS-LPG-Services/61577346257321/"
                aria-label="JTS LPG Services on Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M14 22V13h3l1-4h-4V7c0-1 0-2 2-2h2V1h-3c-4 0-6 2-6 6v2H6v4h3v9" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/jts_lpg/"
                aria-label="JTS LPG Services on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <path d="M17.5 6.5h.01" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3>LPG services</h3>
            <div class="footer-links">
              <a href="gas-safety-certificates.html">Gas safety certificates</a>
              <a href="lpg-boiler-servicing.html">Boiler &amp; appliance servicing</a>
              <a href="lpg-repairs.html">Breakdowns &amp; repairs</a>
              <a href="boiler-installation.html">Boiler installations</a>
              <a href="caravan-connections.html">Caravan connections</a>
              <a href="regulators-and-supply.html">Regulators, meters &amp; hoses</a>
              <a href="caravan-parks.html">Caravan &amp; holiday parks</a>
            </div>
          </div>
          <div>
            <h3>Your local specialist</h3>
            <div class="footer-links">
              <a href="anglesey.html">Anglesey / Ynys Môn</a>
              <a href="north-wales.html">Bangor &amp; North Wales</a>
              <a href="areas-covered.html">All areas covered</a>
              <a href="about.html">Meet Jack</a>
              <a href="reviews.html">Customer reviews</a>
              <a href="faqs.html">Your questions answered</a>
              <a
                href="https://www.gassaferegister.co.uk/find-an-engineer-or-check-the-register/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Check Gas Safe no. 958399
              </a>
            </div>
          </div>
          <div>
            <h3>Speak to Jack</h3>
            <div class="footer-links">
              <a href="tel:+447498579460">07498 579460</a>
              <a href="mailto:jack@jtslpg.co.uk">jack@jtslpg.co.uk</a>
              <a href="https://wa.me/447498579460" target="_blank" rel="noopener noreferrer">
                Message on WhatsApp
              </a>
              <span>Monday–Friday: 8am–6pm</span>
              <span>Saturday: by appointment</span>
              <span>Sunday: closed. Emergency enquiries where possible.</span>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>
            ©
            <span data-year>2026</span>
            JTS LPG Services
          </span>
          <span>
            <a href="privacy.html">Privacy</a>
            ·
            <a href="cookies.html">Cookies</a>
            ·
            <button type="button" data-cookie-settings>Cookie settings</button>
          </span>
          <a href="https://cleandesignuk.com" target="_blank" rel="noopener noreferrer">
            Website designed with 🩵 by Clean Design UK
          </a>
        </div>
      </div>
    </footer>
    <a
      class="whatsapp-float"
      href="https://wa.me/447498579460"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Jack on WhatsApp"
    >
      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 11.5A9.5 9.5 0 0 1 7 20l-5 2 1.7-5A9.5 9.5 0 1 1 21 11.5Z" />
        <path d="m8 6 2 3-1 2a9 9 0 0 0 4 4l2-1 3 1c-1 4-5 3-8 0S5 7 8 6Z" />
      </svg>
      <span>WhatsApp Jack</span>
    </a>
  `;

  document.getElementById("site-header").innerHTML = navbarHTML;
  document.getElementById("site-footer").innerHTML = footerHTML;

  const currentPage = decodeURIComponent(window.location.pathname).split("/").pop() || "index.html";

  document.querySelectorAll(".main-nav a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });
})();
