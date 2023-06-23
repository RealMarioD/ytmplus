export function injectStyle(css) {
    const node = document.createElement('style');
    const textNode = document.createTextNode(css);
    node.appendChild(textNode);
    return document.head.appendChild(node);
}