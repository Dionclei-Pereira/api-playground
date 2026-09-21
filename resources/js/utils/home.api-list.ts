import { handleClickHomeResolver } from "./home.api-resolver";

let apiListPanel: HTMLDivElement | null;
let idCounter: number = 0;

export let windows: IWindow[] = [];

document.addEventListener('DOMContentLoaded', (): void => {
    const element = document.getElementById('list-panel');
    if (!(element instanceof HTMLDivElement)) return;
    apiListPanel = element;

    renderApiList();
});

const addWindow = (): void => {
    const request: IHTTPRequest = {
        body: '',
        headers: [],
        method: "get",
        type: "json"
    };

    const response: IHTTPResponse = {
        body: '',
        statusCode: 0
    };

    windows.push({
        id: idCounter++,
        request: request,
        response: response
    });

    renderApiList();
};

const removeWindow = (id: string): void => {
    if (!id) return;
    windows = windows.filter(win => String(win.id) != id);
    renderApiList();
}

const renderApiList = (): void => {
    if (!apiListPanel) return;

    let html: string = '';

    windows.forEach(win => {
        let cssClass: string = '';
        switch (win.request.method) {
            case "get":
                cssClass = 'btn-success';
                break;
            case "post":
                cssClass = 'btn-warning';
                break;
            case "put":
                cssClass = 'btn-primary';
                break;
            case "delete":
                cssClass = 'btn-danger';
                break;
            default:
                cssClass = 'btn-secondary';
                break;
        }
        html += `
            <div id=${win.id} class="window btn ${cssClass} flex-shrink-0 h-75 h-btn-md w-md-75 w-50 d-flex justify-content-between align-items-center">
                ${win.request.method.toUpperCase()}
                <button id="${win.id}" class="btn close-window-btn">X</button>
            </div>
        `
    });

    html += `
        <button id="add-window-btn" class="btn btn-light flex-shrink-0 w-md-75 w-50">
            +
        </button>
    `
    
    apiListPanel.innerHTML = html;

    const addBtn = document.getElementById('add-window-btn');
    if (!(addBtn instanceof HTMLButtonElement)) return;

    addBtn.addEventListener('click', () => addWindow());

    const closeBtns = document.querySelectorAll('.close-window-btn');

    closeBtns.values().forEach(btn => {
        if (!(btn instanceof HTMLButtonElement)) return;
        const id: string = btn.id;
        btn.addEventListener('click', () => removeWindow(id));
    });

    const currentWindows = document.querySelectorAll('.window');
    currentWindows.values().forEach(el => {
        if (!(el instanceof HTMLDivElement)) return;
        el.addEventListener('click', () => {
            const win: IWindow | undefined = windows.find(cWin => cWin.id = Number(el.id));
            if (!win) return;
            handleClickHomeResolver(win);
        });
    });
};