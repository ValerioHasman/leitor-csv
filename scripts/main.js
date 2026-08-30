import { DataTableCsv } from "../componentes/DataTableCsv.js";
import { botaoCSV } from "../componentes/LerCsv.js";
import Elemento, { execute } from "Elemento";

export const main = Elemento.main({ className: "flex-grow-1 overflow-hidden d-flex flex-column" });

document.body.append(
  Elemento.div(
    { className: "estilo-tabela-associacao d-flex flex-column vh-100 dvh-100" },
    execute(
      Elemento.div({ className: "py-1" }),
      (div) => {
        div.append(
          botaoCSV(
            (dados) => {
              main.replaceChildren(spinner());
              main.replaceChildren(
                DataTableCsv(dados).table().container()
              );
              div.remove();
            }
          )
        )
      }
    ),
    main
  )
);

function spinner() {
  return Elemento.div(
    { className: "m-auto" },
    Elemento.div(
      { className: "spinner-border", role: "status" },
      Elemento.span({ className: "visually-hidden" }, "Carregando…")
    )
  );
}
