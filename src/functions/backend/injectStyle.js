export function injectStyle(css) {
    const node = document.createElement('style');
    const textNode = document.createTextNode(css);
    node.appendChild(textNode);
    document.head.appendChild(node);
}