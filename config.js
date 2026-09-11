/* Configure before public launch. Web3Forms access keys are public form identifiers, not private API secrets. */
window.JTS_CONFIG = Object.freeze({
  web3formsAccessKey: "", // Paste Jack's Web3Forms access key here. Never paste an email password or private API key.
  hcaptchaSiteKey: "50b2fe65-b00b-4b9e-ad62-3ba471098be2", // Web3Forms public free-plan key; enforce hCaptcha in its dashboard.
  gaMeasurementId: "", // Optional GA4 G-... ID. Leave blank for no analytics. Update privacy notice before enabling.
  formCooldownSeconds: 60,
});
