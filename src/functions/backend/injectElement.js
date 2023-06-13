export function injectElement(type, id, wrapperElm, customClass, customStyle, prepend) {
    const node = document.createElement(type);
    node.id = id;
    if(customClass) node.classList.add(customClass);
    if(customStyle) node.style = customStyle;
    if(!wrapperElm) {
        console.error('injectElement: Wrapper is undefined');
        return;
    }
    if(prepend) wrapperElm.prepend(node);
    else wrapperElm.appendChild(node);
    return node;
}