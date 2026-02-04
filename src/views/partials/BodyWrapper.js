export function renderBodyWrapper(content) {
    return `
        <div class="h-full flex flex-col overflow-auto scrollbar-thin">
            ${content}
        </div>
    `
}