import Elemento from "../depende/Elemento.js";

export default class Dialog {
  static simples(...filhos) {
    const dialog = Elemento.dialog(
      {
        className: "dialog-html p-0 bg-body bg-text border shadow rounded-3"
      },
      ...filhos
    );

    document.body.append(dialog);

    dialog.showModal();

    return dialog;
  }
}
