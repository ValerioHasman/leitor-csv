/** @param {HTMLElement} btn */
export function aplicarEstiloBtn(btn) {
  btn.style.setProperty("--bs-btn-color", "var(--bs-body-color-rgb)");
  btn.classList.add("btn", "btn-sm", "btn-outline-primary", "border-0");
  return btn
}
