import { DataTableCsv } from "../componentes/DataTableCsv.js";
import { botaoCSV } from "../componentes/LerCsv.js";
import Elemento from "../depende/Elemento.js";

const main = Elemento.main({ className: "flex-grow-1 overflow-hidden d-flex flex-column" });

document.body.append(
  Elemento.div(
    { className: "estilo-tabela-associacao freezer-colunas container-fluid d-flex flex-column vh-100 dvh-100" },
    Elemento.div({ className: "py-1" },
      botaoCSV(
        (dados) => {
          main.replaceChildren(
            DataTableCsv(dados).table().container()
          );
        }
      ),
    ),
    main
  )
);
