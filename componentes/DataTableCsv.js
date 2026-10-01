import DataTable from "datatables.net";
import "datatables.net-bs5";
import "datatables.net-columncontrol";
import "datatables.net-columncontrol-bs5";
import "datatables.net-datetime";
import "datatables.net-searchbuilder";
import "datatables.net-searchbuilder-bs5";
import "datatables.net-colreorder";
import "datatables.net-colreorder-bs5";
DataTable.ext.errMode = 'throw';
import TabelaRedimencionavel from "../depende/TabelaRedimencionavel/TabelaRedimencionavel.js";
import Elemento, { Controle, execute } from "Elemento";
import { aplicarAncoraPopOver } from "../componentes/PopOver.js";
import { CongeladorDeColunas } from "../depende/CongeladorDeColunas/CongeladorDeColunas.js";
import { botaoCSV } from "./LerCsv.js";
import { main, spinner } from "../scripts/main.js";
import Tooltip, { ancoraBalaoCloneSpan } from "./Tooltip.js";
import { unirInputLabel } from "./unirInputLabel.js";
import { aplicarEstiloBtn } from "./Botoes.js";

DataTable.ColumnControl.content.buscaEntidade = {
  defaults: { placeholder: '' },
  init: function (config) {
    const self = this;
    const dt = this.dt();
    const colIdx = this.idx();

    const input = document.createElement('input');
    input.type = 'search';
    input.className = 'form-control form-control-sm border-0';
    input.placeholder = config.placeholder;

    input.addEventListener(
      'input',
      () => {
        const term = input.value;
        const col = dt.column(self.idx());

        if (!term) {
          col.search.fixed('dtcc', '');
        } else {
          col.search.fixed('dtcc', fraseCelula => compareIncludes(term, fraseCelula));
        }

        col.draw(false);
      }
    );

    dt.on('stateSaveParams.DT', function (e, s, data) {
      if (!data.columnControl) data.columnControl = {};
      if (!data.columnControl[colIdx]) data.columnControl[colIdx] = {};
      data.columnControl[colIdx].buscaEntidade = input.value;
    });

    dt.on('stateLoaded.DT', function (e, s, state) {
      const saved = state?.columnControl?.[colIdx]?.buscaEntidade;
      if (saved === undefined) return;
      input.value = saved;
      input.dispatchEvent(new Event("input"));
    });

    return input;
  }
};


DataTable.ColumnControl.content.buscaBoleano = {
  defaults: {},
  init: function (config) {
    const self = this;
    const dt = this.dt();
    const colIdx = this.idx();

    const select = document.createElement('select');
    select.className = 'form-select form-select-sm border-0';
    select.append(
      new Option("", ""),
      new Option("Sim", "sim"),
      new Option("Não", "nao"),
    )

    select.addEventListener(
      'change',
      () => {
        const term = select.value;
        const col = dt.column(self.idx());

        if (!term) {
          col.search.fixed('dtcc', '');
        } else if (term === "sim") {
          col.search.fixed(
            'dtcc',
            resp => {
              return resp === 'SIM';
            }
          );
        } else if (term === "nao") {
          col.search.fixed(
            'dtcc',
            resp => {
              return resp === 'NAO';
            }
          );
        }

        col.draw(false);
      }
    );

    dt.on('stateSaveParams.DT', function (e, s, data) {
      if (!data.columnControl) data.columnControl = {};
      if (!data.columnControl[colIdx]) data.columnControl[colIdx] = {};
      data.columnControl[colIdx].buscaBoleano = select.value;
    });

    dt.on('stateLoaded.DT', function (e, s, state) {
      const saved = state?.columnControl?.[colIdx]?.buscaBoleano;
      if (saved === undefined) return;
      select.value = saved;
      select.dispatchEvent(new Event("change"));
    });

    return select;
  }
};

DataTable.ColumnControl.content.ocultarColuna = {
  init: function (config) {
    const self = this;
    const dt = this.dt();

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dtcc-button';
    btn.innerHTML = '<i class="lh-1 bi bi-eye-slash"></i>';
    btn.addEventListener('click', () => {
      dt.column(self.idx()).visible(false);
    });

    return btn;
  }
};


/**
 * @param {HTMLElement} el
 * @param {string} clss
 * @param {string} nclss
 */
function replaceClass(el, clss, ...nclss) {
  for (const ch of el.querySelectorAll(`.${clss}`)) {
    ch.classList.remove(clss);
    for (const ncl of nclss)
      ch.classList.add(ncl);
  }
}

function renderEntidade(data, type, row) {
  if (type === 'display') {
    if (!data) {
      return Elemento.span({ className: "user-select-none controle-celula small line-clamp-1-box" }, "\u00A0");
    }
    return ancoraBalaoCloneSpan(Elemento.span({ className: "controle-celula small" }, data));
  }
  return data || "";
}

function limparString(string) {
  return String(string).normalize('NFD').replace(/\p{Mn}/gu, "").toLowerCase();
}

function compareIncludes(buscador, recipiente) {
  const fragmentos = limparString(buscador).split("\u0020");
  const frase = limparString(recipiente);

  for (const fragmento of fragmentos) {
    if (!frase.includes(fragmento)) {
      return false
    }
  }
  return true;
}

export function DataTableCsv(dados) {

  const colunas = Object.keys(dados.data[0]);

  const limiteInicialColunas = Math.ceil(document.body.clientWidth / 110) + 1;

  const tabelaNode = Elemento.table(
    { className: "table align-middle table-sm table-hover" },
    Elemento.thead(
      { className: "sticky-top small" },
      Elemento.tr(
        {},
        ...colunas.map(
          (coluna) => (
            Elemento.th(
              {
                className: "text-center",
                dataset: {
                  name: coluna,
                  data: coluna
                },
              },
              (() => {
                const spanF = Elemento.span({}, coluna)
                const span = Elemento.span({ className: "line-clamp-2-box small" },
                  spanF
                );
                if (coluna) Tooltip(spanF, coluna);
                return span;
              })()
            )
          )
        )
      )
    ),
    Elemento.tbody()
  );

  const ths = tabelaNode.querySelectorAll('thead th[data-name]');

  for (const th of ths) {
    th.addEventListener('mousedown', function (e) {
      if (e.button !== 1) return;
      e.preventDefault();
      tabelaDataTable.column(th).visible(false);
      tabelaDataTable.state.save();
    });
  }

  const tabelaRedmenci = new TabelaRedimencionavel(
    tabelaNode,
    { seletor: "th" }
  );

  const congelador = new CongeladorDeColunas(
    Elemento.button(
      {
        className: "btn btn-outline-secondary btn-sm",
        dataset: {
          dicaFerramenta: "Congelar colunas"
        }
      },
      Elemento.i({ className: "bi bi-snow" })
    ),
    tabelaNode,
    { ignorarPrimeiraColuna: false }
  );

  const tabelaDataTable = new DataTable(tabelaNode,
    {
      colReorder: {
        columns: '[data-name]:not([data-name="entidade"])',
        headerRows: [0],
      },
      initComplete: function (settings) {
        const thisApi = this.api();

        const container = thisApi.table().container();

        aplicarEstiloBtn(
          container.querySelector('[for^="dt-search"]')
        );

        const inputSearch = container.querySelector('[id^="dt-search"]');
        inputSearch.accessKey = 'b';
        inputSearch.placeholder = 'B\u0332uscar';

        /** @type {HTMLDivElement[]} */
        const [painel1, painel2, painel3] = container.querySelectorAll("&>*");

        painel1.style.setProperty("--bs-gutter-x", 0);
        painel2.style.setProperty("--bs-gutter-x", 0);
        painel3.style.setProperty("--bs-gutter-x", 0);

        painel1.classList.add("bg-body-tertiary", "px-2");
        painel3.classList.add("bg-body-tertiary", "px-2");

        painel1.classList.add("gap-1", "p-1");

        replaceClass(painel1, "d-md-flex", "d-flex", "flex-wrap");
        replaceClass(painel1, "row", "d-flex", "flex-wrap", "gap-2");
        replaceClass(container, "col-md-auto", "col-auto");
        replaceClass(container, "mt-2");

        function paginationClassListAdd(s) {
          container.querySelector(".pagination").classList.add("pagination-sm");
        }

        thisApi.on("column-sizing", paginationClassListAdd);
        thisApi.on("init", paginationClassListAdd);
        thisApi.on("draw", paginationClassListAdd);

        container.querySelector("&>div").append(
          Elemento.div(
            { className: "justify-content-between align-items-center col-auto d-flex gap-1" },
            botaoCSV(
              async (dados) => {
                congelador.destroy();
                tabelaDataTable.destroy();
                main.replaceChildren(spinner());

                await new Promise(r => setTimeout(r));

                main.replaceChildren(
                  DataTableCsv(dados).table().container()
                );
              }
            ),
            aplicarAncoraPopOver(
              aplicarEstiloBtn(
                Elemento.button(
                  {},
                  Elemento.i({ className: "bi bi-snow" })
                )
              ),
              Elemento.div(
                { className: "bg-body p-1 border border-secondary border-opacity-10 rounded-3 shadow" },
                Elemento.div(
                  { className: "list-group gap-1" },
                  Elemento.button(
                    { type: "button", className: "list-group-item list-group-item-action border-0 rounded-3 py-1 line-clamp-1-box", onclick: descongelar },
                    "Não congelar"
                  ),
                  Elemento.button(
                    { type: "button", className: "list-group-item list-group-item-action border-0 rounded-3 py-1 line-clamp-1-box", onclick: congelarUmaColuna },
                    "Congelar uma coluna"
                  ),
                  Elemento.button(
                    { type: "button", className: "list-group-item list-group-item-action border-0 rounded-3 py-1 line-clamp-1-box", onclick: congelarDuasColunas },
                    "Congelar duas colunas"
                  ),
                  Elemento.button(
                    { type: "button", className: "list-group-item list-group-item-action border-0 rounded-3 py-1 line-clamp-1-box", onclick: congelarTresColunas },
                    "Congelar três colunas"
                  ),
                )
              )
            ),
            sb(),
            listaVisibilidade()
          )
        );

        function descongelar() {
          tabelaNode.classList.remove("congelar-uma-coluna", "congelar-duas-coluna", "congelar-tres-coluna");
        }

        function congelarUmaColuna() {
          descongelar();
          tabelaNode.classList.add("congelar-uma-coluna");
        }

        function congelarDuasColunas() {
          descongelar();
          tabelaNode.classList.add("congelar-duas-coluna");
        }

        function congelarTresColunas() {
          descongelar();
          tabelaNode.classList.add("congelar-tres-coluna");
        }

      },
      data: dados.data,
      lengthMenu: [25, 50, 200, -1],
      searchBuilder: {
        columns: "[data-name]",
        conditions: {

          num: {
            'between': null,
            '!between': null
          },

          date: {
            '=': null,
            '!=': null,
            'between': null,
            '!between': null
          },

          array: {
            '=': null,
            '!=': null,
          }
        }
      },
      columns: [
        ...colunas.map(
          (coluna, indice) => {
            return {
              name: coluna,
              data: coluna,
              render: renderEntidade,
              visible: indice < limiteInicialColunas
            }
          }
        )
      ],
      language: {
        thousands: ".",
        decimal: ",",
        searchBuilder: {
          data: "Coluna",
          condition: "Condição",
          conditions: {
            number: {
              between: 'Entre',
              empty: 'Vazio',
              equals: 'Igual',
              gt: 'Maior que',
              gte: 'Maior que igual a',
              lt: 'Menor que',
              lte: 'Menor que igual a',
              not: 'Diferente de',
              notBetween: 'Por fora de',
              notEmpty: 'Preenchido'
            },
            string: {
              contains: 'Contém',
              empty: 'Vazio',
              endsWith: 'Termina Com',
              equals: 'Igual a',
              not: 'Diferente de',
              notContains: 'Não contém',
              notEmpty: 'Preenchido',
              notEndsWith: 'Não termina com',
              notStartsWith: 'Não começa com',
              startsWith: 'Começa com'
            },
            date: {
              after: 'Depois de',
              before: 'Antes de',
              between: 'Entre',
              empty: 'Vazio',
              equals: 'Igual a',
              not: 'Diferente',
              notBetween: 'Por fora de',
              notEmpty: 'Preenchido'
            },
            array: {
              contains: 'Contém',
              empty: 'Vazio',
              equals: 'Igual a',
              not: 'Diferente',
              notEmpty: 'Preenchido',
              without: 'Não tem'
            }
          },
          logicAnd: "E",
          logicOr: "OU",
          delete: `<i class="bi bi-x-lg"></i>`,
          left: `<i class="bi bi-chevron-up"></i>`,
          right: `<i class="bi bi-chevron-down"></i>`,
          clearAll: `<i class="bi bi-x-lg"></i>`,
          add: `<i class="bi bi-plus-lg"></i>`,
          title: "Filtrar",
          value: "Valor",
          valueJoiner: "E",
          rightTitle: "Adicionar condição",
          leftTitle: "Remover condiçãoo",
          deleteTitle: "Remover condicão",
        },
        emptyTable: "A tabela está vazia",
        processing: "Processando...",
        lengthMenu: `_MENU_ <i class="bi ms-2 bi-table"></i>`,
        lengthLabels: { '-1': 'Todos' },
        zeroRecords: "Nenhum resultado encontrado",
        info: '<small class="ms-2 text-muted fst-italic">De _START_ até _END_ | _TOTAL_ / _MAX_</small>',
        infoEmpty: "",
        infoFiltered: "",
        infoPostFix: "",
        search: `<i class="bi bi-search"></i>`,
        url: "",
        paginate: {
          first: `<i class="bi bi-chevron-double-left"></i>`,
          previous: `<i class="bi bi-chevron-left"></i>`,
          next: `<i class="bi bi-chevron-right"></i>`,
          last: `<i class="bi bi-chevron-double-right"></i>`
        },
        aria: {
          sortAscending: ": Ordenar colunas de forma ascendente",
          sortDescending: ": Ordenar colunas de forma descendente",
          orderable: "",
          orderableRemove: "",
          orderableReverse: ""
        },
        columnControl: {
          search: {
            datetime: {
              equal: "Igual a",
              notEqual: "Diferente de",
              empty: "Vazio",
              notEmpty: "Preenchido",
              greater: "Maior que",
              less: "Menor que"
            },
            text: {
              contains: "Contém",
              notContains: "Não contém",
              starts: "Inicia com",
              ends: "Termina com",
              equal: "Igual a",
              notEqual: "Diferente de",
              empty: "Vazio",
              notEmpty: "Preenchido",
            },
            number: {
              equal: "Igual a",
              notEqual: "Diferente de",
              empty: "Vazio",
              notEmpty: "Preenchido",
              greater: "Maior que",
              greaterOrEqual: "Maior/Igual que",
              less: "Menor que",
              lessOrEqual: "Menor/Igual que"
            }
          },
          order: "",
          reorder: "",
          reorderLeft: "",
          reorderRight: "",
          orderAsc: "Crescente",
          orderDesc: "Decrescente",
          orderClear: "Desordenar",
          orderAddAsc: "",
          orderAddDesc: "",
          orderRemove: "",
          searchDropdown: "",
          list: {
            all: `<i class="bi bi-check-lg"></i>`,
            empty: "",
            none: `<i class="bi bi-x-lg"></i>`,
            search: "🔎"
          }
        }
      },
      columnControl: true,
      columnDefs: [
        {
          targets: '_all',
          className: 'dt-left',
        },
        {
          targets: '*',
          columnControl: [
            { target: 0, content: ['order'] },
            { target: 1, content: ['search'] }
          ]
        },
      ],
      ordering: {
        handler: false,
        indicators: false
      },
      responsive: true,
      pageLength: 50
    }
  );

  function sb() {
    return aplicarAncoraPopOver(
      aplicarEstiloBtn(
        Elemento.button(
          {},
          Elemento.i({ className: "bi bi-funnel" })
        )
      ),
      execute(
        Elemento.div({ style: { minWidth: "300px" } }),
        async (div) => {
          await new Promise(r => setTimeout(r));
          const painelDeBusca = tabelaDataTable.searchBuilder.container()[0];
          div.append(painelDeBusca);
        }
      )
    )
  }

  function listaVisibilidade() {

    const ul = Elemento.ul({ className: "list-group gap-1" });

    const popOver = Elemento.div({}, ul);

    popOver.addEventListener(
      "toggle",
      (ev) => {
        if (ev.newState === "open") {
          const ths = tabelaDataTable.columns().header().toArray();
          const colunasComVisibilidade = colunas.map(col => {
            const idx = ths.findIndex(th => th.dataset.name === col);
            return { col, idx, visible: tabelaDataTable.column(idx).visible() };
          });

          colunasComVisibilidade.sort((a, b) => {
            if (a.visible !== b.visible) return a.visible ? 1 : -1;
            return a.col.localeCompare(b.col, "pt-BR", { sensitivity: 'base' });
          });

          ul.replaceChildren(
            ...colunasComVisibilidade
              .map(
                ({ col, idx, visible }) => {
                  const api = tabelaDataTable.column(idx);

                  return Elemento.li({ className: "list-group-item list-group-item-action border-0 rounded-3 py-0 px-1" },
                    Elemento.div(
                      { className: "form-check form-switch mb-0" },
                      ...unirInputLabel(
                        Elemento.input({
                          className: "form-check-input",
                          type: "checkbox",
                          role: "switch",
                          checked: Boolean(visible),
                          onchange: (e) => {
                            api.visible(e.currentTarget.checked);
                          }
                        }),
                        Elemento.label({ className: "form-check-label stretched-link line-clamp-1-box" }, col)
                      )
                    )
                  )
                }
              )
          );
        }
      }
    )

    return aplicarAncoraPopOver(
      aplicarEstiloBtn(
        Elemento.button(
          {},
          Elemento.i({ className: "bi bi-eye" })
        )
      ),
      popOver
    );
  }

  tabelaDataTable.on(
    'draw',
    () => { congelador.recalcular(); }
  );

  tabelaRedmenci.addEventListener(
    "fimArrasto",
    () => { congelador.recalcular(); }
  );

  tabelaRedmenci.addEventListener(
    "arrastando",
    () => { congelador.recalcular(); }
  );

  tabelaDataTable.on(
    'column-visibility',
    () => { congelador.recalcular(); }
  );


  return tabelaDataTable;
}

