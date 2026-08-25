export class Controle extends EventTarget {
  #objetoGuardado;

  #funcao = (it) => { return it };

  #eventoAlterado = new Event('change');

  /** @param {() => any} controle - Funcão de tipagem */
  constructor(controle, padrao) {
    super();
    if (typeof controle == "function")
      this.#funcao = controle;
    this.#objetoGuardado = this.#funcao(padrao);
  }

  set valor(dado) {
    this.#objetoGuardado = this.#funcao(dado);
    this.dispatchEvent(this.#eventoAlterado);
  }

  get valor() {
    return this.#objetoGuardado;
  }

  add() { }

  remove() { }

  toString() {
    return this.valor;
  }
}

/**
 * @template T
 * @param {(valor: T)=>T} validate
 * @returns {[Controle, (valor: any) => any]} */
export function moduloDeControle(validate, padrao) {
  const objeto = new Controle(validate, padrao);

  return ([
    objeto,
    (dado) => { objeto.valor = dado }
  ]);
}


/**
 * @callback atribuirProps
 * @param {Partial<HTMLElement>} nvsProps - quem doa
 * @param {Partial<HTMLElement>} paraObj - quem recebe
 * @param {HTMLElement} pai - elemento pai
 * @returns {void}
 */

/** @typedef {{atribuirProps: atribuirProps}} ElMent */

/** Cria um elemento HTML e anexa os itens do array.
 * @template {keyof HTMLElementTagNameMap} ChavesHTML
 * @param {ChavesHTML} tagName - O nome da tag do elemento a ser criado. 
 * @param {HTMLElementTagNameMap[ChavesHTML]&ElementCreationOptions|Object|undefined} props - Um array de itens para anexar ao elemento criado.
 * @param {(Node | string)[]} nodulo - Um array de itens para anexar ao elemento criado.
 * @returns {HTMLElementTagNameMap[ChavesHTML]&ElMent} - O elemento HTML criado. */
function NReact(tagName, props = {}, nodulo = []) {
  const element = document.createElement(tagName /*, !props?.is || { is: props.is }*/);
  // delete props.is;
  element.append(...nodulo.map(ndl => ndl instanceof Controle ? textNodeOuve(ndl) : ndl));
  element.atribuirProps = atribuirProps;
  element.atribuirProps(props);
  return element;
}

/** @param {Controle} controle */
function textNodeOuve(controle) {
  const textND = document.createTextNode(controle.valor);
  controle.addEventListener('change', (ev) => {
    textND.data = ev.target.valor;
  });
  return textND;
}

/** 
 * @type {atribuirProps}
 * @this HTMLElement
 */
function atribuirProps(nvsProps, paraObj, pai) {
  const esteElmt = this ?? paraObj;
  for (const prop in nvsProps) {
    if (nvsProps[prop] instanceof Controle) {
      esteElmt[prop] = nvsProps[prop].valor;
      nvsProps[prop].addEventListener("change", (ev) => {
        esteElmt[prop] = ev.target.valor;
      });
    } else if (
      typeof esteElmt[prop] != "function" &&
      typeof nvsProps[prop] == "object" &&
      !(nvsProps[prop] instanceof Node)
    ) {
      atribuirProps(nvsProps[prop], esteElmt[prop], pai ?? esteElmt);
    } else if (
      typeof esteElmt[prop] == "function" &&
      Array.isArray(nvsProps[prop])
    ) {
      esteElmt[prop](...nvsProps[prop]);
    } else {
      try {
        esteElmt[prop] = nvsProps[prop];
        if (prop == "value") esteElmt.defaultValue = nvsProps[prop];
        if (prop == "checked") esteElmt.defaultChecked = nvsProps[prop];
      } catch (err) {
        esteElmt.setAttribute(prop, nvsProps[prop]);
      }
    }
  }
  return esteElmt;
}

export default class Elemento {
  /** @param {Partial<HTMLAnchorElement>} props @param {...(Node|string)} nodulo */ static a(props = {}, ...nodulo) { return NReact("a", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static abbr(props = {}, ...nodulo) { return NReact("abbr", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static address(props = {}, ...nodulo) { return NReact("address", props, nodulo); }
  /** @param {Partial<HTMLAreaElement>} props @param {...(Node|string)} nodulo */ static area(props = {}, ...nodulo) { return NReact("area", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static article(props = {}, ...nodulo) { return NReact("article", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static aside(props = {}, ...nodulo) { return NReact("aside", props, nodulo); }
  /** @param {Partial<HTMLAudioElement>} props @param {...(Node|string)} nodulo */ static audio(props = {}, ...nodulo) { return NReact("audio", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static b(props = {}, ...nodulo) { return NReact("b", props, nodulo); }
  /** @param {Partial<HTMLBaseElement>} props @param {...(Node|string)} nodulo */ static base(props = {}, ...nodulo) { return NReact("base", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static bdi(props = {}, ...nodulo) { return NReact("bdi", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static bdo(props = {}, ...nodulo) { return NReact("bdo", props, nodulo); }
  /** @param {Partial<HTMLQuoteElement>} props @param {...(Node|string)} nodulo */ static blockquote(props = {}, ...nodulo) { return NReact("blockquote", props, nodulo); }
  /** @param {Partial<HTMLBodyElement>} props @param {...(Node|string)} nodulo */ static body(props = {}, ...nodulo) { return NReact("body", props, nodulo); }
  /** @param {Partial<HTMLBRElement>} props @param {...(Node|string)} nodulo */ static br(props = {}, ...nodulo) { return NReact("br", props, nodulo); }
  /** @param {Partial<HTMLButtonElement>} props @param {...(Node|string)} nodulo */ static button(props = {}, ...nodulo) { return NReact("button", props, nodulo); }
  /** @param {Partial<HTMLCanvasElement>} props @param {...(Node|string)} nodulo */ static canvas(props = {}, ...nodulo) { return NReact("canvas", props, nodulo); }
  /** @param {Partial<HTMLTableCaptionElement>} props @param {...(Node|string)} nodulo */ static caption(props = {}, ...nodulo) { return NReact("caption", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static cite(props = {}, ...nodulo) { return NReact("cite", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static code(props = {}, ...nodulo) { return NReact("code", props, nodulo); }
  /** @param {Partial<HTMLTableColElement>} props @param {...(Node|string)} nodulo */ static col(props = {}, ...nodulo) { return NReact("col", props, nodulo); }
  /** @param {Partial<HTMLTableColElement>} props @param {...(Node|string)} nodulo */ static colgroup(props = {}, ...nodulo) { return NReact("colgroup", props, nodulo); }
  /** @param {Partial<HTMLDataElement>} props @param {...(Node|string)} nodulo */ static data(props = {}, ...nodulo) { return NReact("data", props, nodulo); }
  /** @param {Partial<HTMLDataListElement>} props @param {...(Node|string)} nodulo */ static datalist(props = {}, ...nodulo) { return NReact("datalist", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static dd(props = {}, ...nodulo) { return NReact("dd", props, nodulo); }
  /** @param {Partial<HTMLModElement>} props @param {...(Node|string)} nodulo */ static del(props = {}, ...nodulo) { return NReact("del", props, nodulo); }
  /** @param {Partial<HTMLDetailsElement>} props @param {...(Node|string)} nodulo */ static details(props = {}, ...nodulo) { return NReact("details", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static dfn(props = {}, ...nodulo) { return NReact("dfn", props, nodulo); }
  /** @param {Partial<HTMLDialogElement>} props @param {...(Node|string)} nodulo */ static dialog(props = {}, ...nodulo) { return NReact("dialog", props, nodulo); }
  /** @param {Partial<HTMLDivElement>} props @param {...(Node|string)} nodulo */ static div(props = {}, ...nodulo) { return NReact("div", props, nodulo); }
  /** @param {Partial<HTMLDListElement>} props @param {...(Node|string)} nodulo */ static dl(props = {}, ...nodulo) { return NReact("dl", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static dt(props = {}, ...nodulo) { return NReact("dt", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static em(props = {}, ...nodulo) { return NReact("em", props, nodulo); }
  /** @param {Partial<HTMLEmbedElement>} props @param {...(Node|string)} nodulo */ static embed(props = {}, ...nodulo) { return NReact("embed", props, nodulo); }
  /** @param {Partial<HTMLFieldSetElement>} props @param {...(Node|string)} nodulo */ static fieldset(props = {}, ...nodulo) { return NReact("fieldset", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static figcaption(props = {}, ...nodulo) { return NReact("figcaption", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static figure(props = {}, ...nodulo) { return NReact("figure", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static footer(props = {}, ...nodulo) { return NReact("footer", props, nodulo); }
  /** @param {Partial<HTMLFormElement>} props @param {...(Node|string)} nodulo */ static form(props = {}, ...nodulo) { return NReact("form", props, nodulo); }
  /** @param {Partial<HTMLHeadingElement>} props @param {...(Node|string)} nodulo */ static h1(props = {}, ...nodulo) { return NReact("h1", props, nodulo); }
  /** @param {Partial<HTMLHeadingElement>} props @param {...(Node|string)} nodulo */ static h2(props = {}, ...nodulo) { return NReact("h2", props, nodulo); }
  /** @param {Partial<HTMLHeadingElement>} props @param {...(Node|string)} nodulo */ static h3(props = {}, ...nodulo) { return NReact("h3", props, nodulo); }
  /** @param {Partial<HTMLHeadingElement>} props @param {...(Node|string)} nodulo */ static h4(props = {}, ...nodulo) { return NReact("h4", props, nodulo); }
  /** @param {Partial<HTMLHeadingElement>} props @param {...(Node|string)} nodulo */ static h5(props = {}, ...nodulo) { return NReact("h5", props, nodulo); }
  /** @param {Partial<HTMLHeadingElement>} props @param {...(Node|string)} nodulo */ static h6(props = {}, ...nodulo) { return NReact("h6", props, nodulo); }
  /** @param {Partial<HTMLHeadElement>} props @param {...(Node|string)} nodulo */ static head(props = {}, ...nodulo) { return NReact("head", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static header(props = {}, ...nodulo) { return NReact("header", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static hgroup(props = {}, ...nodulo) { return NReact("hgroup", props, nodulo); }
  /** @param {Partial<HTMLHRElement>} props @param {...(Node|string)} nodulo */ static hr(props = {}, ...nodulo) { return NReact("hr", props, nodulo); }
  /** @param {Partial<HTMLHtmlElement>} props @param {...(Node|string)} nodulo */ static html(props = {}, ...nodulo) { return NReact("html", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static i(props = {}, ...nodulo) { return NReact("i", props, nodulo); }
  /** @param {Partial<HTMLIFrameElement>} props @param {...(Node|string)} nodulo */ static iframe(props = {}, ...nodulo) { return NReact("iframe", props, nodulo); }
  /** @param {Partial<HTMLImageElement>} props @param {...(Node|string)} nodulo */ static img(props = {}, ...nodulo) { return NReact("img", props, nodulo); }
  /** @param {Partial<HTMLInputElement>} props @param {...(Node|string)} nodulo */ static input(props = {}, ...nodulo) { return NReact("input", props, nodulo); }
  /** @param {Partial<HTMLModElement>} props @param {...(Node|string)} nodulo */ static ins(props = {}, ...nodulo) { return NReact("ins", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static kbd(props = {}, ...nodulo) { return NReact("kbd", props, nodulo); }
  /** @param {Partial<HTMLLabelElement>} props @param {...(Node|string)} nodulo */ static label(props = {}, ...nodulo) { return NReact("label", props, nodulo); }
  /** @param {Partial<HTMLLegendElement>} props @param {...(Node|string)} nodulo */ static legend(props = {}, ...nodulo) { return NReact("legend", props, nodulo); }
  /** @param {Partial<HTMLLIElement>} props @param {...(Node|string)} nodulo */ static li(props = {}, ...nodulo) { return NReact("li", props, nodulo); }
  /** @param {Partial<HTMLLinkElement>} props @param {...(Node|string)} nodulo */ static link(props = {}, ...nodulo) { return NReact("link", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static main(props = {}, ...nodulo) { return NReact("main", props, nodulo); }
  /** @param {Partial<HTMLMapElement>} props @param {...(Node|string)} nodulo */ static map(props = {}, ...nodulo) { return NReact("map", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static mark(props = {}, ...nodulo) { return NReact("mark", props, nodulo); }
  /** @param {Partial<HTMLMenuElement>} props @param {...(Node|string)} nodulo */ static menu(props = {}, ...nodulo) { return NReact("menu", props, nodulo); }
  /** @param {Partial<HTMLMetaElement>} props @param {...(Node|string)} nodulo */ static meta(props = {}, ...nodulo) { return NReact("meta", props, nodulo); }
  /** @param {Partial<HTMLMeterElement>} props @param {...(Node|string)} nodulo */ static meter(props = {}, ...nodulo) { return NReact("meter", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static nav(props = {}, ...nodulo) { return NReact("nav", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static noscript(props = {}, ...nodulo) { return NReact("noscript", props, nodulo); }
  /** @param {Partial<HTMLObjectElement>} props @param {...(Node|string)} nodulo */ static object(props = {}, ...nodulo) { return NReact("object", props, nodulo); }
  /** @param {Partial<HTMLOListElement>} props @param {...(Node|string)} nodulo */ static ol(props = {}, ...nodulo) { return NReact("ol", props, nodulo); }
  /** @param {Partial<HTMLOptGroupElement>} props @param {...(Node|string)} nodulo */ static optgroup(props = {}, ...nodulo) { return NReact("optgroup", props, nodulo); }
  /** @param {Partial<HTMLOptionElement>} props @param {...(Node|string)} nodulo */ static option(props = {}, ...nodulo) { return NReact("option", props, nodulo); }
  /** @param {Partial<HTMLOutputElement>} props @param {...(Node|string)} nodulo */ static output(props = {}, ...nodulo) { return NReact("output", props, nodulo); }
  /** @param {Partial<HTMLParagraphElement>} props @param {...(Node|string)} nodulo */ static p(props = {}, ...nodulo) { return NReact("p", props, nodulo); }
  /** @param {Partial<HTMLPictureElement>} props @param {...(Node|string)} nodulo */ static picture(props = {}, ...nodulo) { return NReact("picture", props, nodulo); }
  /** @param {Partial<HTMLPreElement>} props @param {...(Node|string)} nodulo */ static pre(props = {}, ...nodulo) { return NReact("pre", props, nodulo); }
  /** @param {Partial<HTMLProgressElement>} props @param {...(Node|string)} nodulo */ static progress(props = {}, ...nodulo) { return NReact("progress", props, nodulo); }
  /** @param {Partial<HTMLQuoteElement>} props @param {...(Node|string)} nodulo */ static q(props = {}, ...nodulo) { return NReact("q", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static rp(props = {}, ...nodulo) { return NReact("rp", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static rt(props = {}, ...nodulo) { return NReact("rt", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static ruby(props = {}, ...nodulo) { return NReact("ruby", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static s(props = {}, ...nodulo) { return NReact("s", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static samp(props = {}, ...nodulo) { return NReact("samp", props, nodulo); }
  /** @param {Partial<HTMLScriptElement>} props @param {...(Node|string)} nodulo */ static script(props = {}, ...nodulo) { return NReact("script", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static search(props = {}, ...nodulo) { return NReact("search", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static section(props = {}, ...nodulo) { return NReact("section", props, nodulo); }
  /** @param {Partial<HTMLSelectElement>} props @param {...(Node|string)} nodulo */ static select(props = {}, ...nodulo) { return NReact("select", props, nodulo); }
  /** @param {Partial<HTMLSlotElement>} props @param {...(Node|string)} nodulo */ static slot(props = {}, ...nodulo) { return NReact("slot", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static small(props = {}, ...nodulo) { return NReact("small", props, nodulo); }
  /** @param {Partial<HTMLSourceElement>} props @param {...(Node|string)} nodulo */ static source(props = {}, ...nodulo) { return NReact("source", props, nodulo); }
  /** @param {Partial<HTMLSpanElement>} props @param {...(Node|string)} nodulo */ static span(props = {}, ...nodulo) { return NReact("span", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static strong(props = {}, ...nodulo) { return NReact("strong", props, nodulo); }
  /** @param {Partial<HTMLStyleElement>} props @param {...(Node|string)} nodulo */ static style(props = {}, ...nodulo) { return NReact("style", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static sub(props = {}, ...nodulo) { return NReact("sub", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static summary(props = {}, ...nodulo) { return NReact("summary", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static sup(props = {}, ...nodulo) { return NReact("sup", props, nodulo); }
  /** @param {Partial<HTMLTableElement>} props @param {...(Node|string)} nodulo */ static table(props = {}, ...nodulo) { return NReact("table", props, nodulo); }
  /** @param {Partial<HTMLTableSectionElement>} props @param {...(Node|string)} nodulo */ static tbody(props = {}, ...nodulo) { return NReact("tbody", props, nodulo); }
  /** @param {Partial<HTMLTableCellElement>} props @param {...(Node|string)} nodulo */ static td(props = {}, ...nodulo) { return NReact("td", props, nodulo); }
  /** @param {Partial<HTMLTemplateElement>} props @param {...(Node|string)} nodulo */ static template(props = {}, ...nodulo) { return NReact("template", props, nodulo); }
  /** @param {Partial<HTMLTextAreaElement>} props @param {...(Node|string)} nodulo */ static textarea(props = {}, ...nodulo) { return NReact("textarea", props, nodulo); }
  /** @param {Partial<HTMLTableSectionElement>} props @param {...(Node|string)} nodulo */ static tfoot(props = {}, ...nodulo) { return NReact("tfoot", props, nodulo); }
  /** @param {Partial<HTMLTableCellElement>} props @param {...(Node|string)} nodulo */ static th(props = {}, ...nodulo) { return NReact("th", props, nodulo); }
  /** @param {Partial<HTMLTableSectionElement>} props @param {...(Node|string)} nodulo */ static thead(props = {}, ...nodulo) { return NReact("thead", props, nodulo); }
  /** @param {Partial<HTMLTimeElement>} props @param {...(Node|string)} nodulo */ static time(props = {}, ...nodulo) { return NReact("time", props, nodulo); }
  /** @param {Partial<HTMLTitleElement>} props @param {...(Node|string)} nodulo */ static title(props = {}, ...nodulo) { return NReact("title", props, nodulo); }
  /** @param {Partial<HTMLTableRowElement>} props @param {...(Node|string)} nodulo */ static tr(props = {}, ...nodulo) { return NReact("tr", props, nodulo); }
  /** @param {Partial<HTMLTrackElement>} props @param {...(Node|string)} nodulo */ static track(props = {}, ...nodulo) { return NReact("track", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static u(props = {}, ...nodulo) { return NReact("u", props, nodulo); }
  /** @param {Partial<HTMLUListElement>} props @param {...(Node|string)} nodulo */ static ul(props = {}, ...nodulo) { return NReact("ul", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static var(props = {}, ...nodulo) { return NReact("var", props, nodulo); }
  /** @param {Partial<HTMLVideoElement>} props @param {...(Node|string)} nodulo */ static video(props = {}, ...nodulo) { return NReact("video", props, nodulo); }
  /** @param {Partial<HTMLElement>} props @param {...(Node|string)} nodulo */ static wbr(props = {}, ...nodulo) { return NReact("wbr", props, nodulo); }

  /**
   * @param {...(Node|string)}
   * @description Nunca deverá ser retornado apara aguardar uma assíncrono
   */
  static Fragment(...nodulo) {
    const fragment = new DocumentFragment();
    fragment.append(...nodulo);
    return fragment;
  }

  /**
   * @template T
   * @param {string} tagName
   * @param {new (...args: any[]) => T} ClassConstruct
   * @param {ElementDefinitionOptions} options
   * @returns {(props: Partial<T>, ...nodulo: Node|string[])=>T}
   */
  static custom(tagName, ClassConstruct, options) {
    if (window.customElements.get(tagName)) {
      window.customElements.define(tagName, ClassConstruct, options);
    }
    return function (props, nodulo) {
      return NReact(tagName, props, nodulo);
    }
  }
}

/**
 * @template T
 * @param {T} it
 * @param {(it: T) => Promise<void>} fun
 * @returns {T}
 */
export function execute(it, fun) {
  fun(it);
  return it;
}

/**
 * @param {HTMLElement} doElemento
 * @param {HTMLElement} paraElemento 
 */
export function troquarOElemento(deElemento, paraElemento) {
  deElemento.insertAdjacentElement("afterend", paraElemento);
  deElemento.remove();
}
