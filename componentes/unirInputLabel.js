/**
 * @param {HTMLInputElement} input
 * @param {HTMLLabelElement} label
 */
export function unirInputLabel(input, label) {
  const id = input.id || (() => {
    const id = crypto.randomUUID();
    input.id = id;
    return id;
  })();
  label.setAttribute("for", id);
  return [
    input,
    label
  ];
}

/**
 * @param {HTMLLabelElement} label
 * @param {HTMLInputElement} input
 */
export function unirLabelInput(label, input) {
  const id = input.id || (() => {
    const id = crypto.randomUUID();
    input.id = id;
    return id;
  })();
  label.setAttribute("for", id);
  return [
    label,
    input
  ];
}
