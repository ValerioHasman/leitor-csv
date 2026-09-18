/**
 * @param {HTMLElement} elemento
 * @param {HTMLElement|string} conteudo
 * @param {object} [opcoes]
 * @returns {bootstrap.Tooltip}
 */
export default function Tooltip(elemento, conteudo, opcoes = {}) {
  const bs = new bootstrap.Tooltip(elemento, {
    title: conteudo,
    html: conteudo instanceof HTMLElement,
    popperConfig: { strategy: 'fixed' },
    delay: { show: 150, hide: 0 },
    ...opcoes,
  });

  const observador = new MutationObserver(() => {
    if (!elemento.isConnected) {
      bs.dispose();
      observador.disconnect();
    }
  });
  observador.observe(document.body, { childList: true, subtree: true });

  return bs;
}


/** @param {HTMLElement} div */
export function ancoraBalaoCloneSpan(div) {
  const id = `--${crypto.randomUUID()}`;

  div.classList.add("line-clamp-1-box", "balao-hover-out-origem");
  div.style.setProperty("anchor-name", id);

  let clone = null;
  let observador = null;

  function observarRemocaoDoDiv() {
    if (observador) return;
    observador = new MutationObserver(() => {
      if (!div.isConnected) forcarApagarClone();
    });
    observador.observe(document.body, { childList: true, subtree: true });
  }

  function pararObservacao() {
    observador?.disconnect();
    observador = null;
  }

  async function exibirClone() {
    await new Promise(r => setTimeout(r, 150));
    if (!clone && (div.matches(":hover"))) {
      clone = div.cloneNode(true);
      clone.classList.add(
        "p-1",
        "bg-body-tertiary",
        "shadow-sm",
        "rounded-2",
        "border",
        "balao-hover-out",
        "text-start",
        "small",
        "exibe"
      );
      clone.style.setProperty("position-anchor", id);
      clone.classList.remove("balao-hover-out-origem", "opacity-50", "line-clamp-1-box");
      clone.style.removeProperty("anchor-name");
      clone.addEventListener("pointerenter", exibirClone);
      div.classList.add("opacity-50");
      clone.addEventListener("pointerleave", apagarClone);
      document.body.append(clone);
      observarRemocaoDoDiv();
      requestAnimationFrame(apagarClone);
    }
  }

  function apagarClone() {
    if (clone && !(div.matches(":hover") || clone.matches(":hover"))) {
      const refClone = clone;
      clone = null;
      pararObservacao();
      div.classList.remove("opacity-50");
      function remover() { refClone.remove(); }
      refClone.addEventListener("transitionend", remover, { once: true });
      refClone.addEventListener("transitioncancel", remover, { once: true });
      setTimeout(remover, 150);
      refClone.classList.remove("exibe");
    }
  }

  function forcarApagarClone() {
    pararObservacao();
    if (clone) {
      clone.remove();
      clone = null;
    }
    div.classList.remove("opacity-50");
  }

  div.addEventListener("pointerenter", exibirClone);
  div.addEventListener("pointerleave", apagarClone);

  return div;
}
