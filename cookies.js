(() => {
  "use strict";
  const KEY = "jts-cookie-consent-v1",
    VERSION = 1,
    MAX_AGE = 183 * 24 * 60 * 60 * 1000;
  const cfg = window.JTS_CONFIG || {};
  const ga = /^G-[A-Z0-9]+$/.test(cfg.gaMeasurementId || "") ? cfg.gaMeasurementId : "";
  let choice = null;
  let previousFocus = null;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (
      saved?.version === VERSION &&
      typeof saved.analytics === "boolean" &&
      Number.isFinite(saved.timestamp) &&
      Date.now() - saved.timestamp >= 0 &&
      Date.now() - saved.timestamp < MAX_AGE
    )
      choice = saved;
  } catch {
    /* Continue with no consent if storage is unavailable. */
  }
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  function clearAnalyticsCookies() {
    if (window.location.protocol === "file:") return;
    document.cookie.split(";").forEach((part) => {
      const name = part.split("=")[0].trim();
      if (name === "_ga" || name.startsWith("_ga_") || name === "_gid" || name.startsWith("_gat")) {
        const domains = [null, location.hostname, "." + location.hostname];
        const labels = location.hostname.split(".");
        for (let i = 1; i < labels.length - 1; i++) domains.push("." + labels.slice(i).join("."));
        for (const domain of domains)
          document.cookie =
            name + "=; Max-Age=0; path=/" + (domain ? "; domain=" + domain : "") + "; SameSite=Lax";
      }
    });
  }
  function apply() {
    const allowed = choice?.analytics === true;
    if (ga) window["ga-disable-" + ga] = !allowed;
    gtag("consent", "update", {
      analytics_storage: allowed ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    if (allowed && ga && !document.getElementById("jts-analytics")) {
      const s = document.createElement("script");
      s.id = "jts-analytics";
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga);
      document.head.append(s);
      gtag("js", new Date());
      gtag("config", ga, { allow_google_signals: false, allow_ad_personalization_signals: false });
    }
    if (!allowed) clearAnalyticsCookies();
    window.dispatchEvent(new CustomEvent("jts:consent-change", { detail: { analytics: allowed } }));
  }
  const banner = document.createElement("aside");
  banner.className = "cookie-banner";
  banner.setAttribute("aria-label", "Cookie preferences");
  banner.hidden = !!choice;
  banner.innerHTML =
    "<h2>Your privacy, your choice.</h2><p>We use essential browser storage to remember your choice and protect enquiries. " +
    (ga
      ? "Optional analytics only load if you allow them."
      : "No analytics or advertising tracking is currently enabled.") +
    ' <a href="cookies.html">Cookie details</a>.</p><div class="cookie-actions"><button class="button cookie-choice" type="button" data-reject>Essential only</button><button class="button cookie-choice" type="button" data-accept>Allow optional</button></div><button type="button" class="cookie-customise" data-customise>Customise settings</button>';
  const dialog = document.createElement("dialog");
  dialog.className = "cookie-dialog";
  dialog.setAttribute("aria-labelledby", "cookie-title");
  dialog.innerHTML =
    '<button class="cookie-close" type="button" aria-label="Close cookie settings">×</button><h2 id="cookie-title">Cookie preferences</h2><p>Choose what you allow. You can change your mind using Cookie settings in the footer.</p><div class="cookie-option"><span><strong>Essential</strong><small>Privacy preferences and enquiry protection.</small></span><span>Always on</span></div><label class="cookie-option"><span><strong>Analytics</strong><small>' +
    (ga
      ? "Helps understand how the site is used. No advertising tracking."
      : "Not currently enabled. No analytics provider is configured.") +
    '</small></span><input type="checkbox" id="cookie-analytics" aria-label="Allow analytics" ' +
    (ga ? "" : "disabled") +
    '></label><div class="cookie-actions"><button type="button" class="button secondary" data-reject>Reject optional</button><button type="button" class="button" data-save>Save preferences</button></div>';
  document.body.append(banner, dialog);
  function close() {
    dialog.close();
    previousFocus?.focus();
  }
  function open() {
    previousFocus = document.activeElement;
    dialog.querySelector("input").checked = !!choice?.analytics && !!ga;
    dialog.showModal();
  }
  function save(analytics) {
    choice = { version: VERSION, analytics: !!analytics && !!ga, timestamp: Date.now() };
    try {
      localStorage.setItem(KEY, JSON.stringify(choice));
    } catch {
      /* Consent still applies for this visit. */
    }
    banner.hidden = true;
    apply();
    if (dialog.open) close();
  }
  banner.querySelector("[data-reject]").addEventListener("click", () => save(false));
  banner.querySelector("[data-accept]").addEventListener("click", () => save(true));
  banner.querySelector("[data-customise]").addEventListener("click", open);
  dialog.querySelector("[data-reject]").addEventListener("click", () => save(false));
  dialog
    .querySelector("[data-save]")
    .addEventListener("click", () => save(dialog.querySelector("input").checked));
  dialog.querySelector(".cookie-close").addEventListener("click", close);
  dialog.addEventListener("cancel", () => {
    previousFocus?.focus();
  });
  document
    .querySelectorAll("[data-cookie-settings]")
    .forEach((button) => button.addEventListener("click", open));
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      try {
        const c = JSON.parse(e.newValue || "null");
        choice = c?.version === VERSION && Date.now() - c.timestamp < MAX_AGE ? c : null;
      } catch {
        choice = null;
      }
      banner.hidden = !!choice;
      apply();
    }
  });
  apply();
})();
