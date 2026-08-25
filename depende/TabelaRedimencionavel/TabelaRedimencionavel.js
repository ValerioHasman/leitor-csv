/** @description Compatível comqualquer tabela */
export default class TabelaRedimencionavel extends EventTarget {

  #thApoio = document.createElement("th");

  /** @param {HTMLTableElement} table */
  constructor(table, { seletor }) {
    super();

    table.classList.add("tabela-redimencionavel");

    this.aTabela = table;

    /** @type {NodeListOf<HTMLTableCellElement>} */
    const colunas = table.querySelectorAll(seletor || "th:nth-child(n+2)");

    colunas.forEach(th => {
      TabelaRedimencionavel.definirLargurEmPixel(th, 110)
      th.addEventListener("dblclick", () => {
        TabelaRedimencionavel.definirLargurEmPixel(th, 300)
      })
      if (!th.querySelector("div.th-redimensionavel")) {
        th.append(this.criarBarraDiv(th));
      }
    })
  }

  /**
   * @param {HTMLTableCellElement} th
   * @param {number} px 
   * */
  static definirLargurEmPixel(th, px = 110) {
    th.style.setProperty("--largura-cabecalho-coluna", `${px}px`);
  }

  /** Cria barra de redimensionamento para uma coluna específica
   * @param {HTMLTableCellElement} th
   */
  criarBarraDiv(th) {
    const div = document.createElement("div");
    div.className = "th-redimensionavel";

    /** @param {MouseEvent|TouchEvent} ev */
    const iniciarRedimensionamento = (ev) => {
      ev.stopPropagation();
      ev.preventDefault();

      inpedirInteracao();

      this.protegerLargura();

      document.addEventListener("mousemove", redimensionar);
      document.addEventListener("touchmove", redimensionar);

      document.addEventListener("mouseup", finalizarRedimensionamento);
      document.addEventListener("touchend", finalizarRedimensionamento);
    };

    let touchStartX;

    /** @param {MouseEvent|TouchEvent} ev */
    function redimensionar(ev) {
      const { offsetWidth } = th;

      if (ev instanceof MouseEvent) {
        const { movementX } = ev;
        var novaLargura = offsetWidth + movementX;

      } else if (ev instanceof TouchEvent) {
        const { touches } = ev;
        const { clientX } = touches.item(0);
        const movementX = clientX - (touchStartX || clientX);
        var novaLargura = offsetWidth + movementX;
        touchStartX = clientX;

      }

      TabelaRedimencionavel.definirLargurEmPixel(th, novaLargura);
      th.dataset.larguraTemp = novaLargura;
    };

    /** @param {MouseEvent|TouchEvent} ev */
    const finalizarRedimensionamento = (ev) => {
      devolverInteracao();

      document.removeEventListener("mousemove", redimensionar);
      document.removeEventListener("touchmove", redimensionar);

      document.removeEventListener("mouseup", finalizarRedimensionamento);
      document.removeEventListener("touchend", finalizarRedimensionamento);

      this.descongelarLargura();

      this.dispatchEvent(new CustomEvent("fimArrasto", { detail: { th } }));
    };


    function inpedirInteracao() {
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.body.style.pointerEvents = 'none';
      div.style.opacity = 1;
    }

    function devolverInteracao() {
      document.body.style.cursor = null;
      document.body.style.userSelect = null;
      document.body.style.pointerEvents = null;
      div.style.opacity = null;
    }

    div.addEventListener("mousedown", iniciarRedimensionamento);
    div.addEventListener("touchstart", iniciarRedimensionamento, { passive: false });

    return div;
  }

  protegerLargura() {

    const primeiraLinha = this.aTabela.querySelector('thead>tr');

    this.congelarLargura();

    this.#thApoio.style.minWidth = `${1080 * 2}px`;

    primeiraLinha.append(this.#thApoio);
  }

  congelarLargura() {
    const colunas = Array.from(this.aTabela.querySelectorAll('thead>tr>th:has(.th-redimensionavel)'));
    for (const col of colunas) {
      const larguraPX = Number.parseInt(col.style.getPropertyValue("--largura-cabecalho-coluna")) || col.clientWidth;
      col.dataset.larguraTemp = larguraPX;
    }
    for (const col of colunas) {
      TabelaRedimencionavel.definirLargurEmPixel(col, col.clientWidth)
    }
  }

  descongelarLargura() {
    const colunas = Array.from(this.aTabela.querySelectorAll('thead>tr>th:has(.th-redimensionavel)'));
    for (const col of colunas) {
      TabelaRedimencionavel.definirLargurEmPixel(col, col.dataset.larguraTemp);
    }
    this.#thApoio.remove();
  }
}
