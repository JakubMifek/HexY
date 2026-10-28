/** @param {string} tag @param {string} [text]
 * @param {Record<string, string>} [attributes] */
export function element(tag, text = '', attributes = {}) {
  const node = document.createElement(tag);
  node.textContent = text;
  for (const [key, value] of Object.entries(attributes))
    node.setAttribute(key, value);
  return node;
}

/** @param {string} tag @param {Record<string, string>} attributes @param {string} [text] */
export function svg(tag, attributes, text = '') {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, value] of Object.entries(attributes))
    node.setAttribute(key, value);
  node.textContent = text;
  return node;
}

/** @param {string} text @param {string} id @param {() => void} action
 * @param {AbortSignal} signal */
export function button(text, id, action, signal) {
  const node = document.createElement('button');
  node.type = 'button';
  node.id = id;
  node.textContent = text;
  node.addEventListener('click', action, { signal });
  return node;
}

/** @param {string} text @param {HTMLElement} control */
export function field(text, control) {
  const label = element('label', text);
  label.append(control);
  return label;
}

/** @param {string} name @param {string} type @param {string} value */
export function input(name, type, value) {
  const node = document.createElement('input');
  Object.assign(node, { name, id: name, type, value });
  return node;
}

/** @param {string} name @param {string[][]} options @param {string} [value] */
export function select(name, options, value) {
  const node = document.createElement('select');
  node.id = node.name = name;
  for (const [key, text] of options) node.add(new Option(text, key));
  if (value) node.value = value;
  return node;
}
