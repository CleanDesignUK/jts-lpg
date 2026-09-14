(() => {
  "use strict";

  /* ============================================================
     JTS LPG ENQUIRY FORMS
     Works with:
     - homepage hero form
     - homepage bottom form
     - contact page form
  ============================================================ */

  const forms =
    document.querySelectorAll("form[data-enquiry]");

  if (!forms.length) {
    return;
  }


  /* ============================================================
     SWEETALERT
  ============================================================ */

  const notify = async (
    title,
    text,
    icon = "info"
  ) => {

    if (window.Swal) {

      return Swal.fire({
        title: title,
        text: text,
        icon: icon,

        confirmButtonText: "OK",

        confirmButtonColor: "#f4770b",

        background: "#151515",
        color: "#ffffff",

        iconColor:
          icon === "success"
            ? "#f4770b"
            : undefined,

        customClass: {
          popup: "jts-alert",
          confirmButton: "jts-alert-button"
        }
      });

    }


    /* fallback if SweetAlert fails to load */

    window.alert(
      title + "\n\n" + text
    );

  };


  /* ============================================================
     PHONE VALIDATION
  ============================================================ */

  const validUKPhone = (value) => {

    const raw =
      value.trim();


    if (!raw) {
      return false;
    }


    const cleaned =
      raw.replace(
        /[\s().-]/g,
        ""
      );


    return (
      /^0\d{10}$/.test(cleaned) ||
      /^\+44\d{10}$/.test(cleaned) ||
      /^44\d{10}$/.test(cleaned)
    );

  };


  /* ============================================================
     EMAIL VALIDATION
     Only runs if the current form ACTUALLY HAS an email field.
  ============================================================ */

  const validEmail = (value) => {

    if (!value) {
      return true;
    }


    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(value);

  };


  /* ============================================================
     EACH FORM
  ============================================================ */

  forms.forEach((form) => {

    let sending =
      false;


    form.addEventListener(
      "submit",
      async (event) => {

        /*
          CRITICAL:
          stop the browser from going to Web3Forms.
        */

        event.preventDefault();

        event.stopPropagation();


        if (sending) {
          return;
        }


        /* ======================================================
           FIELDS

           These are OPTIONAL because different JTS forms contain
           different fields.
        ====================================================== */

        const name =
          form.elements.namedItem("name");

        const phone =
          form.elements.namedItem("phone");

        const email =
          form.elements.namedItem("email");

        const location =
          form.elements.namedItem("location");

        const service =
          form.elements.namedItem("service");

        const botcheck =
          form.elements.namedItem("botcheck");


        /* ======================================================
           HONEYPOT
        ====================================================== */

        if (
          botcheck &&
          botcheck.checked
        ) {

          return;
        }


        /* ======================================================
           NORMAL HTML VALIDATION
        ====================================================== */

        if (!form.checkValidity()) {

          form.reportValidity();

          return;

        }


        /* ======================================================
           PHONE
        ====================================================== */

        if (
          phone &&
          !validUKPhone(phone.value)
        ) {

          await notify(
            "Check your phone number",
            "Please enter a valid UK phone number, for example 07498 579460.",
            "warning"
          );


          phone.focus();

          return;

        }


        /* ======================================================
           EMAIL
           Contact page has it.
           Homepage forms don't.
        ====================================================== */

        if (
          email &&
          email.value.trim() &&
          !validEmail(
            email.value.trim()
          )
        ) {

          await notify(
            "Check your email address",
            "Please enter a valid email address.",
            "warning"
          );


          email.focus();

          return;

        }


        /* ======================================================
           BUTTON STATE
        ====================================================== */

        const button =
          form.querySelector(
            'button[type="submit"]'
          );


        const originalButtonHTML =
          button
            ? button.innerHTML
            : "";


        sending =
          true;


        if (button) {

          button.disabled =
            true;

          button.textContent =
            "Sending…";

        }


        /* ======================================================
           FORM DATA
        ====================================================== */

        const data =
          new FormData(form);


        /*
          Keep values clean.
        */

        if (name) {

          data.set(
            "name",
            name.value.trim()
          );

        }


        if (phone) {

          data.set(
            "phone",
            phone.value.trim()
          );

        }


        if (email) {

          data.set(
            "email",
            email.value.trim()
          );

        }


        if (location) {

          data.set(
            "location",
            location.value.trim()
          );

        }


        /*
          Add the page URL so Jack can see where the
          enquiry came from.
        */

        data.set(
          "page",
          window.location.href
        );


        /*
          Build a useful subject automatically if required.
        */

        if (service?.value) {

          const existingSubject =
            data.get("subject");


          if (!existingSubject) {

            data.set(
              "subject",
              "New LPG enquiry: " +
              service.value
            );

          }

        }


        /* ======================================================
           WEB3FORMS AJAX SUBMISSION
        ====================================================== */

        try {

          const controller =
            new AbortController();


          const timeout =
            setTimeout(
              () => {
                controller.abort();
              },
              20000
            );


          const response =
            await fetch(
              "https://api.web3forms.com/submit",
              {
                method: "POST",

                body: data,

                headers: {
                  Accept:
                    "application/json"
                },

                signal:
                  controller.signal
              }
            );


          clearTimeout(timeout);


          const result =
            await response.json();


          if (
            !response.ok ||
            result.success !== true
          ) {

            throw new Error(
              result.message ||
              "Web3Forms rejected the enquiry."
            );

          }


          /* ====================================================
             SUCCESS
          ==================================================== */

          form.reset();


          await notify(
            "Thank you!",
            "Your enquiry has been sent to Jack. He will get back to you shortly.",
            "success"
          );


        } catch (error) {

          console.error(
            "JTS form submission error:",
            error
          );


          const message =
            error.name === "AbortError"
              ? "The request took too long. Please try again or contact Jack directly on 07498 579460."
              : "Your enquiry could not be sent. Please try again, call Jack on 07498 579460 or message him on WhatsApp.";


          await notify(
            "Unable to send your enquiry",
            message,
            "error"
          );


        } finally {

          sending =
            false;


          if (button) {

            button.disabled =
              false;

            button.innerHTML =
              originalButtonHTML;

          }

        }

      }
    );

  });

})();