
/** @typedef {import("Elemento").Elementar} Elementar */

import Elemento from "../depende/Elemento.js";

/** 
 * @param {Elementar} botaoAtivador 
 * @param {Elementar} conteudoPainel */
export function botaoDropDownEnd(botaoAtivador, conteudoPainel) {
  botaoAtivador.atribuirProps({
    dataset: {
      bsToggle: "dropdown",
      bsAutoClose: "outside"
    },
    classList: { add: ["dropdown-toggle"] }
  })

  const elementoDrop = Elemento.div({ className: "dropdown-center" },
    botaoAtivador,
    Elemento.div({
      className: "dropdown-menu shadow overflow-auto mvh-65 p-3 border-0",
      style: {
        width: "max-content",
        maxWidth: "calc(-100px + 100vw)",
      },
      onmouseup: falseResize,
      ontouchend: falseResize,
    },
      conteudoPainel
    )
  );

  function falseResize() {
    setTimeout(
      () => {
        window.dispatchEvent(new Event("resize"));
      },
      100
    );
  }

  return (
    elementoDrop
  );
}

export function botaoComAncoraPopOver(conteudoBtn, conteudo) {
  return (
    aplicarAncoraPopOver(
      conteudoBtn,
      Elemento.div(
        { className: "p-3 border border-secondary border-opacity-10 rounded-3 shadow" },
        conteudo
      ),
    )
  );
}


/**
 * @param {HTMLButtonElement} elementoBotao
 * @param {HTMLElement} recipiente
 */
export function aplicarAncoraPopOver(elementoBotao, recipiente) {
  const id = crypto.randomUUID();

  elementoBotao.setAttribute('popovertarget', id);
  elementoBotao.style.setProperty("anchor-name", `--${id}`);

  recipiente.classList.add("popover-on", "ancorado-ao-botao");
  recipiente.id = id;
  recipiente.popover = "auto";
  recipiente.style.setProperty("position-anchor", `--${id}`);

  recipiente.addEventListener('toggle', function (e) {
    if (e.newState === 'open') {
      window.dispatchEvent(
        new Event('resize')
      );
    }
  });

  return (
    Elemento.Fragment(
      elementoBotao, recipiente
    )
  );
}

/**
 * @param {HTMLInputElement} input
 * @param {HTMLElement} recipiente */
export function aplicarAncoraPopOverInput(input, recipiente) {
  const id = crypto.randomUUID();

  input.style.setProperty("anchor-name", `--${id}`);

  recipiente.classList.add("popover-on", "ancorado-ao-botao");
  recipiente.id = id;
  recipiente.popover = "auto";
  recipiente.style.setProperty("position-anchor", `--${id}`);

  input.addEventListener(
    "click",
    () => {
      recipiente.showPopover();
    }
  );

  return (
    Elemento.Fragment(
      input, recipiente
    )
  );

}