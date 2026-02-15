export function renderContentWrapper(wrapper, content) {
    wrapper.className = 'content-wrapper';

    if (typeof content === 'string') {
        wrapper.innerHTML = content;
    } else if (content instanceof HTMLElement) {
        wrapper.appendChild(content);
    } else if (typeof content === 'function' && content.prototype) {
        const instance = new content(wrapper);
        if (typeof instance.render === 'function') {
            instance.render();
        }
    } else if (typeof content === 'function') {
        content(wrapper);
    } else {
        console.error('Invalid content provided. Expected a string, HTMLElement, or function that renders content. Got:', typeof content);
    }

    return wrapper;
}