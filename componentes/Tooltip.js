/**
 * @param {HTMLElement} elemento
 * @param {HTMLElement|string} conteudo
 * @param {object} [opcoes]
 * @returns {bootstrap.Tooltip}
 */
export default function Tooltip(elemento, conteudo, opcoes = {}) {
  return new bootstrap.Tooltip(
    elemento,
    {
      title: conteudo,
      html: conteudo instanceof HTMLElement,
      popperConfig: { strategy: 'fixed' },
      delay: { show: 150, hide: 0 },
      ...opcoes,
    }
  );
}
