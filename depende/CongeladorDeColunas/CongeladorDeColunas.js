import { aplicarAncoraPopOver } from "../../componentes/PopOver.js";
import Elemento from "Elemento";

export class CongeladorDeColunas {
  /** @type {HTMLTableElement} */ #aTabela;
  #ignorarPrimeiraColuna = false;
  #recalcularFunc;

  /**
   * @param {HTMLButtonElement} botao
   * @param {HTMLTableElement} aTabela
   * @param {Object} opcoes
   * @param {string} opcoes.seletor
   * @param {boolean} opcoes.ignorarPrimeiraColuna
   */
  constructor(botao, aTabela, { ignorarPrimeiraColuna }) {
    this.#aTabela = aTabela;

    this.#ignorarPrimeiraColuna = Boolean(ignorarPrimeiraColuna);

    if (ignorarPrimeiraColuna) {
      this.#aTabela.classList.add("freezer-colunas", "pular-primeira-coluna");
    } else {
      this.#aTabela.classList.add("freezer-colunas");
    }

    this.container = Elemento.span(
      {},
      aplicarAncoraPopOver(
        botao,
        Elemento.div(
          { className: "bg-body p-1 border border-secondary border-opacity-10 rounded-3 shadow" },
          Elemento.div(
            { className: "list-group gap-1" },
            Elemento.button(
              {
                type: "button", className: "list-group-item list-group-item-action border-0 rounded-3 py-1",
                onclick: () => this.descongelar()
              },
              "Não congelar"
            ),
            Elemento.button(
              {
                type: "button",
                className: "list-group-item list-group-item-action border-0 rounded-3 py-1",
                onclick: () => this.congelar(1)
              },
              "Congelar uma coluna"
            ),
            Elemento.button(
              {
                type: "button",
                className: "list-group-item list-group-item-action border-0 rounded-3 py-1",
                onclick: () => this.congelar(2)
              },
              "Congelar duas colunas"
            ),
            Elemento.button(
              {
                type: "button",
                className: "list-group-item list-group-item-action border-0 rounded-3 py-1",
                onclick: () => this.congelar(3)
              },
              "Congelar três colunas"
            )
          )
        )
      )
    );

    this.#recalcularFunc = () => { this.recalcular(); };

    window.addEventListener("resize", this.#recalcularFunc);
  }

  get aTabela() {
    return this.#aTabela;
  }

  destroy() {
    window.removeEventListener("resize", this.#recalcularFunc);
  }

  descongelar() {
    this.#aTabela.classList.remove("congelar-uma-coluna", "congelar-duas-coluna", "congelar-tres-coluna");
  }

  congelar(quantidade) {
    this.descongelar();
    const sufixos = ["uma-coluna", "duas-coluna", "tres-coluna"];
    this.#aTabela.classList.add(`congelar-${sufixos[quantidade - 1]}`);
    this.recalcular();
  }

  recalcularAgora() {
    const [th0, th1, th2] = Array.from(this.#aTabela.querySelectorAll("th"));

    let larguraZero = th0?.clientWidth || 0;
    let larguraUm = th1?.clientWidth || 0;
    let larguraDois = th2?.clientWidth || 0;

    if (this.#ignorarPrimeiraColuna) {
      this.#aTabela.style.setProperty("--largura-coluna-zero", `${larguraZero}px`);
      this.#aTabela.style.setProperty("--largura-coluna-um", `${larguraUm}px`);
      this.#aTabela.style.setProperty("--largura-coluna-dois", `${larguraDois}px`);
    } else {
      this.#aTabela.style.setProperty("--largura-coluna-zero", `0px`);
      this.#aTabela.style.setProperty("--largura-coluna-um", `${larguraZero}px`);
      this.#aTabela.style.setProperty("--largura-coluna-dois", `${larguraUm}px`);
    }
  }

  async recalcular() {
    for (let t = 0; t < 10; t = t + 3) {
      await new Promise(r => setTimeout(r, t));
      requestAnimationFrame(() => { this.recalcularAgora() });
    }
  }

}
