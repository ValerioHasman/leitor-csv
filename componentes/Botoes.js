import Elemento from "../depende/Elemento.js";

export function BotaoDeConteiner({ type, onclick }, filho) {
  return Elemento.div(
    { classList: "col-auto" },
    Elemento.button(
      { className: `btn btn-outline-${type} btn-sm shadow-sm rounded-2 border border-${type} border-opacity-25`, onclick },
      filho
    )
  );
}