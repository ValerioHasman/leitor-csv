import papaparse from "papaparse";
import Elemento, { execute } from "Elemento";
import Dialog from "./Dialog.js";
import { unirLabelInput } from "./unirInputLabel.js";

export function inputFile() {
  const input = document.createElement("input");
  input.name = "csvContent";
  input.className = "form-control form-control-sm";
  input.type = "file";
  input.required = true;
  input.accept = ".csv";
  return input;
}

export function botaoCSV(funcao) {
  return Elemento.button(
    {
      className: "btn btn-primary btn-sm",
      type: "button",
      onclick: () => {
        const pre = document.createTextNode("");

        const modal = Dialog.simples(
          Elemento.form(
            {
              onsubmit: (ev) => {
                ev.preventDefault();
                modal.close();
                const form = ev.target;
                const separador = form.querySelector('[name="separador"]');
                const csvContent = form.querySelector('[name="csvContent"]');

                const file = csvContent.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (e) => {
                  const conteudo = e.target.result;
                  const dados = papaparse.parse(conteudo, {
                    header: true,
                    delimiter: separador.value,
                    quoteChar: '"',
                    escapeChar: '"',
                    skipEmptyLines: true
                  });
                  funcao(dados);
                };
                reader.readAsText(file);
              }
            },
            Elemento.div(
              { className: "p-1 fw-bold bg-body-tertiary d-flex align-items-center" },
              Elemento.div(
                { className: "px-3" },
                "Escolher csv"
              ),
              Elemento.button(
                {
                  className: "ms-auto btn btn-sm btn-outline-danger border-0",
                  type: "button",
                  onclick: () => { modal.close(); }
                },
                Elemento.i({ className: "bi bi-x-lg" })
              )
            ),
            Elemento.div(
              { className: "p-3 d-flex gap-2 flex-wrap" },
              Elemento.div({ className: "col-12" },
                ...unirLabelInput(
                  Elemento.label({ className: "form-label" }, "Arquivo CSV"),
                  execute(inputFile(), (i) => {
                    i.click();
                    i.addEventListener(
                      "change",
                      () => {
                        const file = i.files[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onload = (e) => {
                          const conteudo = e.target.result;

                          pre.data = conteudo;
                        };
                        reader.readAsText(file);
                      }
                    )
                  })
                )
              ),
              Elemento.div({ className: "col-auto" },
                ...unirLabelInput(
                  Elemento.label({ className: "form-label" }, "Separador"),
                  Elemento.select({ className: "form-select form-select-sm", name: "separador", required: true },
                    new Option(""),
                    new Option("Ponto e Vírgula", ";"),
                    new Option("Vírgula", ","),
                    new Option("Tabulação", "\u0009"),
                  )
                )
              ),
              Elemento.div(
                { className: "col-12 small" },
                Elemento.pre({ className: "bg-body-tertiary p-3 rounded-1", style: { maxHeight: "300px" } }, pre)
              )
            ),
            Elemento.div(
              { className: "fw-bold bg-body-tertiary d-flex align-items-center" },
              Elemento.div(
                { className: "ms-auto px-3 py-1" },
                Elemento.button(
                  {
                    className: "btn btn-sm btn-primary",
                    type: "submit"
                  },
                  "Carregar arquivo",
                  Elemento.i({ className: "ms-2 bi bi-filetype-csv" })
                )
              ),
            )
          )
        );
      }
    },
    "Carregar arquivo",
    Elemento.i({ className: "ms-2 bi bi-filetype-csv" })
  )
}