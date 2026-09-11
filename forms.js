/* Enquiries: client validation + honeypot + cooldown + server-verified hCaptcha via Web3Forms.
   Configure the public access key in config.js and REQUIRE hCaptcha in the Web3Forms dashboard.
   Client checks improve quality but can be bypassed. They are not a substitute for server verification. */
(() => {
  "use strict";
  const cfg = window.JTS_CONFIG || {};
  const forms = [...document.querySelectorAll("[data-enquiry]")];
  if (!forms.length) return;
  const key = cfg.web3formsAccessKey?.trim();
  const ready = Boolean(key && /^[a-zA-Z0-9-]{20,}$/.test(key));
  const states = new WeakMap();
  const getSaved = () => {
    try {
      return Number(sessionStorage.getItem("jts-last-enquiry") || 0);
    } catch {
      return 0;
    }
  };
  const setSaved = () => {
    try {
      sessionStorage.setItem("jts-last-enquiry", String(Date.now()));
    } catch {
      /* Storage is optional. */
    }
  };
  const phoneValid = (value) => {
    const raw = value.trim();
    if (
      !/^[+\d\s().-]+$/.test(raw) ||
      /\+.*\+/.test(raw) ||
      (/\+/.test(raw) && !raw.startsWith("+"))
    )
      return false;
    const digits = raw.replace(/\D/g, "");
    if (/(\d)\1{3,}/.test(digits)) return false; // Reject 4+ identical consecutive digits, as requested.
    return /^(?:0\d{10}|44\d{10})$/.test(digits); // UK format: 07..., 01..., 02..., +44..., or 44... .
  };
  const emailValid = (value) =>
    value.length <= 254 &&
    /^[^\s@]+@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/.test(value) &&
    !value.split("@")[0].startsWith(".") &&
    !value.split("@")[0].endsWith(".") &&
    !value.split("@")[0].includes("..");
  const notify = async (title, text, icon = "info") => {
    if (window.Swal)
      return Swal.fire({
        title,
        text,
        icon,
        confirmButtonText: "OK",
        confirmButtonColor: "#e97417",
        iconColor: icon === "success" ? "#1e73da" : "#e97417",
        color: "#141414",
        background: "#ffffff",
        customClass: { popup: "jts-alert", confirmButton: "jts-alert-button" },
      });
    window.alert(title + "\n\n" + text);
  };
  let captchaPromise;
  const loadCaptcha = () => {
    if (!ready) return Promise.resolve();
    if (captchaPromise) return captchaPromise;
    captchaPromise = new Promise((resolve, reject) => {
      window.jtsCaptchaReady = () => {
        forms.forEach((form) => {
          const state = states.get(form);
          state.widget = window.hcaptcha.render(form.querySelector("[data-captcha-slot]"), {
            sitekey: cfg.hcaptchaSiteKey,
            size: "compact",
            theme: "light",
            callback: () => {
              form.querySelector(".form-status").textContent = "";
            },
            "expired-callback": () => {
              form.querySelector(".form-status").textContent =
                "Please complete the security check again.";
            },
          });
        });
        resolve();
      };
      const script = document.createElement("script");
      script.src =
        "https://js.hcaptcha.com/1/api.js?onload=jtsCaptchaReady&render=explicit&recaptchacompat=off";
      script.async = true;
      script.defer = true;
      script.onerror = () => reject(new Error("Security check could not load"));
      document.head.append(script);
    });
    return captchaPromise;
  };
  forms.forEach((form) => {
    states.set(form, { started: Date.now(), widget: null, busy: false });
    const phone = form.elements.phone,
      email = form.elements.email,
      name = form.elements.name,
      location = form.elements.location;
    const validate = () => {
      phone.setCustomValidity(
        phone.value && !phoneValid(phone.value)
          ? "Enter a UK phone number, such as 07712 345678. Do not use four or more identical digits in a row."
          : "",
      );
      email.setCustomValidity(
        email.value && !emailValid(email.value.trim())
          ? "Enter a valid email address, such as name@example.co.uk."
          : "",
      );
      name.setCustomValidity(
        name.value && name.value.trim().length < 2 ? "Please enter your name." : "",
      );
      location.setCustomValidity(
        location.value && location.value.trim().length < 2
          ? "Please enter your town or postcode."
          : "",
      );
    };
    form.addEventListener("input", validate);
    form.addEventListener(
      "focusin",
      () => {
        loadCaptcha().catch(() => {
          form.querySelector(".form-status").textContent =
            "The security check could not load. Please check your connection or call Jack.";
        });
      },
      { once: true },
    );
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const state = states.get(form);
      if (state.busy) return;
      validate();
      if (!form.reportValidity()) return;
      if (form.elements.botcheck.checked) return;
      const status = form.querySelector(".form-status");
      if (!ready) {
        status.textContent =
          "Online enquiries are temporarily unavailable. Please call 07498 579460 or message Jack on WhatsApp.";
        await notify(
          "Please contact Jack directly",
          "The online form is not available yet. Please call 07498 579460 or message Jack on WhatsApp.",
        );
        return;
      }
      if (Date.now() - state.started < 2500) {
        status.textContent = "Please check your details, then send your enquiry.";
        return;
      }
      const cooldown = (cfg.formCooldownSeconds || 60) * 1000;
      if (Date.now() - getSaved() < cooldown) {
        status.textContent =
          "Your previous enquiry was sent. Please wait a minute before sending another.";
        return;
      }
      try {
        await loadCaptcha();
      } catch {
        status.textContent =
          "The security check could not load. Please call Jack or try again later.";
        return;
      }
      const token = state.widget !== null ? window.hcaptcha?.getResponse(state.widget) : "";
      if (!token) {
        status.textContent = "Please complete the security check before sending.";
        form
          .querySelector("[data-captcha-slot]")
          .scrollIntoView({ block: "center", behavior: "smooth" });
        return;
      }
      state.busy = true;
      const button = form.querySelector("[type=submit]");
      const original = button.innerHTML;
      button.disabled = true;
      button.textContent = "Sending…";
      status.textContent = "Sending your enquiry…";
      const data = new FormData(form);
      data.set("access_key", key);
      data.set("h-captcha-response", token);
      data.set("email", email.value.trim());
      data.set("name", name.value.trim());
      data.set("phone", phone.value.trim());
      data.set("from_name", "JTS LPG website");
      data.set("subject", "New LPG enquiry: " + form.elements.service.value);
      data.set(
        "page",
        window.location.protocol === "file:"
          ? window.location.pathname.split("/").pop()
          : window.location.origin + window.location.pathname,
      );
      data.delete("g-recaptcha-response");
      if (!data.get("message"))
        data.set(
          "message",
          "Call back requested. Please see the service, property and contact details supplied.",
        );
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: data,
          signal: controller.signal,
          headers: { Accept: "application/json" },
        });
        const result = await response.json();
        if (!response.ok || result.success !== true) throw new Error("Submission rejected");
        setSaved();
        form.reset();
        state.started = Date.now();
        status.textContent = "Thank you. Your enquiry has been sent to Jack.";
        await notify("Thank you!", "I will get in touch with you shortly.", "success");
      } catch (error) {
        status.textContent =
          error.name === "AbortError"
            ? "Delivery could not be confirmed. Please contact Jack before trying again to avoid duplicate enquiries."
            : "Your enquiry could not be sent. Your details are still here. Please try again or call 07498 579460.";
        await notify("Unable to confirm delivery", status.textContent, "error");
      } finally {
        clearTimeout(timer);
        state.busy = false;
        button.disabled = false;
        button.innerHTML = original;
        if (state.widget !== null) window.hcaptcha?.reset(state.widget);
      }
    });
  });
})();
