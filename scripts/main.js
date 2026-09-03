import { DataTableCsv } from "../componentes/DataTableCsv.js";
import { botaoCSV } from "../componentes/LerCsv.js";
import Elemento, { execute } from "Elemento";

export const main = Elemento.main({ className: "flex-grow-1 overflow-hidden d-flex flex-column" });

document.body.append(
  Elemento.div(
    { className: "estilo-tabela-associacao d-flex flex-column vh-100 dvh-100" },
    execute(
      Elemento.div({ className: "p-5" }),
      (div) => {
        div.append(
          botaoCSV(
            async (dados) => {
              div.remove();
              main.replaceChildren(spinner());

              await new Promise(r => setTimeout(r));

              main.replaceChildren(
                DataTableCsv(dados).table().container()
              )
            }
          )
        )
      }
    ),
    main
  )
);

export function spinner() {
  return Elemento.div(
    { className: "m-auto" },
    Elemento.div(
      { className: "spinner-border", role: "status" },
      Elemento.span({ className: "visually-hidden" }, "Carregando…")
    )
  );
}
