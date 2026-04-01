// AI Sensei is a SPA. We wait for the OGS-URL textarea to appear, then fill it in.

function fillAndSubmit(ogsUrl) {
  // Try common selectors for a textarea or text input that accepts OGS links.
  const candidates = Array.from(
    document.querySelectorAll("textarea, input[type='text'], input[type='url']")
  );

  // Prefer a field that looks like it's for a URL/link.
  const field =
    candidates.find(
      (el) =>
        /url|link|ogs|game/i.test(el.placeholder || el.name || el.id || el.className)
    ) || candidates[0];

  if (!field) return false;

  // Set value in a way that React/Vue/Angular SPA frameworks detect.
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    field.tagName === "TEXTAREA"
      ? window.HTMLTextAreaElement.prototype
      : window.HTMLInputElement.prototype,
    "value"
  ).set;
  nativeInputValueSetter.call(field, ogsUrl);
  field.dispatchEvent(new Event("input", { bubbles: true }));
  field.dispatchEvent(new Event("change", { bubbles: true }));

  return true;
}

browser.storage.local.get("pendingOgsUrl").then(({ pendingOgsUrl }) => {
  if (!pendingOgsUrl) return;

  // Clear it so we don't re-fill on page navigations.
  browser.storage.local.remove("pendingOgsUrl");

  // The SPA may not have rendered the form yet — observe until it does.
  if (fillAndSubmit(pendingOgsUrl)) return;

  const observer = new MutationObserver(() => {
    if (fillAndSubmit(pendingOgsUrl)) {
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
