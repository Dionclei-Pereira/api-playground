import { windows } from './home.api-list';

let homeApiPanel: HTMLDivElement | null;
let current: number | null = null;

document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('main-panel');
    if (!(el instanceof HTMLDivElement)) return;
    homeApiPanel = el;

    if (windows && windows.length !== 0) {
        current = windows.at(0)!.id;
    }

    renderHomePanel();
});

const renderHomePanel = (): void => {
    if (!homeApiPanel) return;
    
    if (current === null) {
        const html: string = `
            <p>No window selected</p>
        `;
        homeApiPanel.innerHTML = html;
        return;
    }

    const html: string = `
    
    `;

    homeApiPanel.innerHTML = html;
}

export const handleClickHomeResolver = (id: number): void => {
    current = id;
    renderHomePanel();
}