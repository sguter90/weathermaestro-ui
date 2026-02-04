export function renderContentWrapper(wrapper, content) {
    wrapper.className = 'flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8';

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