(() => {
  "use strict";

  const forms = document.querySelectorAll("[data-enquiry]");

  if (!forms.length) return;


  /* ============================================================
     SWEETALERT / FALLBACK
  ============================================================ */

  const showAlert = async ({
    title,
    text,
    icon = "info"
  }) => {

    if (window.Swal) {

      return Swal.fire({
        title,
        text,
        icon,

        confirmButtonText: "OK",

        confirmButtonColor: "#f47a0b",

        background: "#151515",

        color: "#ffffff",

        iconColor:
          icon === "success"
            ? "#f47a0b"
            : undefined,

        customClass: {
          popup: "jts-alert",
          confirmButton: "jts-alert-button"
        }
      });

    }


    window.alert(
      `${title}\n\n${text}`
    );

  };


  /* ============================================================
     BASIC UK PHONE VALIDATION
  ============================================================ */

  const validPhone = (value) => {

    const clean =
      value
        .replace(/[^\d+]/g, "")
        .trim();


    return (
      /^0\d{10}$/.test(clean) ||
      /^\+44\d{10}$/.test(clean)
    );

  };


  /* ============================================================
     FORMS
  ============================================================ */

  forms.forEach((form) => {

    let sending = false;


    form.addEventListener(
      "submit",
      async (event) => {

        event.preventDefault();


        if (sending) {
          return;
        }


        /* -----------------------------------------------
           NATIVE VALIDATION
        ------------------------------------------------ */

        if (!form.checkValidity()) {

          form.reportValidity();

          return;

        }


        /* -----------------------------------------------
           HONEYPOT
        ------------------------------------------------ */

        const botcheck =
          form.elements.botcheck;


        if (
          botcheck &&
          botcheck.checked
        ) {

          return;

        }


        /* -----------------------------------------------
           PHONE VALIDATION
        ------------------------------------------------ */

        const phone =
          form.elements.phone;


        if (
          phone &&
          !validPhone(phone.value)
        ) {

          await showAlert({
            title: "Check your phone number",
            text:
              "Please enter a valid UK phone number, for example 07498 579460.",
            icon: "warning"
          });


          phone.focus();

          return;

        }


        /* -----------------------------------------------
           SUBMIT BUTTON
        ------------------------------------------------ */

        const button =
          form.querySelector(
            '[type="submit"]'
          );


        const originalText =
          button
            ? button.innerHTML
            : "";


        if (button) {

          button.disabled = true;

          button.textContent =
            "Sending…";

        }


        sending = true;


        /* -----------------------------------------------
           BUILD DATA
        ------------------------------------------------ */

        const data =
          new FormData(form);


        /*
          Helps Jack know which page/form
          produced the enquiry.
        */

        data.set(
          "page",
          window.location.href
        );


        /* -----------------------------------------------
           WEB3FORMS
        ------------------------------------------------ */

        try {

          const response =
            await fetch(
              "https://api.web3forms.com/submit",
              {
                method: "POST",

                body: data,

                headers: {
                  Accept:
                    "application/json"
                }
              }
            );


          const result =
            await response.json();


          if (
            !response.ok ||
            result.success !== true
          ) {

            throw new Error(
              result.message ||
              "Submission failed"
            );

          }


          /* ---------------------------------------------
             SUCCESS
          ---------------------------------------------- */

          form.reset();


          await showAlert({
            title: "Thank you!",
            text:
              "Your enquiry has been sent to Jack. He will get back to you shortly.",
            icon: "success"
          });


        } catch (error) {

          console.error(
            "JTS enquiry error:",
            error
          );


          await showAlert({
            title: "Unable to send your enquiry",
            text:
              "Please try again, or contact Jack on 07498 579460 or WhatsApp.",
            icon: "error"
          });

        } finally {

          sending = false;


          if (button) {

            button.disabled = false;

            button.innerHTML =
              originalText;

          }

        }

      }
    );

  });

})();