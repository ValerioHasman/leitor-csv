import Elemento from "Elemento";

export function botaoComAncoraPopOver(conteudoBtn, conteudo) {
  return (
    aplicarAncoraPopOver(
      Elemento.button({
        className: "btn btn-primary bg-gradient",
      }, conteudoBtn),
      Elemento.div({
        className: "p-3 border border-secondary border-opacity-10 rounded-3 shadow",
      },
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
    console.log(e.newState)
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