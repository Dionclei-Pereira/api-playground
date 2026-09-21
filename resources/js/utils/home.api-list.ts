import { handleClickHomeResolver } from './home.api-menu';

let apiListPanel: HTMLDivElement | null = null;
let idCounter = 0;

export let windows: IWindow[] = [];

document.addEventListener('DOMContentLoaded', (): void => {
    const element = document.getElementById('list-panel');

    if (!(element instanceof HTMLDivElement)) return;

    apiListPanel = element;

    renderApiList();
});

const addWindow = (): IWindow => {
    const request: IHTTPRequest = {
        body: '',
        headers: [],
        method: 'get',
        type: 'json',
        url: '',
    };

    const response: IHTTPResponse = {
        body: '',
        statusCode: 0,
    };

    const win: IWindow = {
        id: idCounter,
        request,
        response,
    }

    windows.push(win);

    idCounter++;

    renderApiList();

    return win;
};

const removeWindow = (id: string): void => {
    if (!id) return;

    windows = windows.filter(
        win => String(win.id) !== id
    );

    renderApiList();
};

export const updateWindow = (win: IWindow): IWindow => {
    const updatedWindow: IWindow = {
        ...win,
        request: {
            ...win.request,
        },
        response: {
            ...win.response,
        },
    };

    windows = windows.map(obj => {
        if (obj.id !== win.id) {
            return obj;
        }

        return updatedWindow;
    });

    renderApiList();
    return updatedWindow;
};

const renderApiList = (): void => {
    if (!apiListPanel) return;

    let html = '';

    windows.forEach(win => {
        let cssClass = '';

        switch (win.request.method) {
            case 'get':
                cssClass = 'btn-success';
                break;
            case 'post':
                cssClass = 'btn-warning';
                break;
            case 'put':
                cssClass = 'btn-primary';
                break;
            case 'delete':
                cssClass = 'btn-danger';
                break;
            default:
                cssClass = 'btn-secondary';
                break;
        }

        html += `
            <div
                data-window-id="${win.id}"
                class="
                    window
                    btn
                    ${cssClass}
                    flex-shrink-0
                    h-75
                    h-btn-md
                    w-md-75
                    w-50
                    d-flex
                    justify-content-between
                    align-items-center
                "
            >
                ${win.request.method.toUpperCase()}

                <button
                    type="button"
                    data-window-id="${win.id}"
                    class="btn close-window-btn"
                >
                    X
                </button>
            </div>
        `;
    });

    html += `
        <button
            id="add-window-btn"
            type="button"
            class="
                btn
                btn-light
                flex-shrink-0
                w-md-75
                w-50
            "
        >
            +
        </button>
    `;

    apiListPanel.innerHTML = html;

    const addBtn = apiListPanel.querySelector('#add-window-btn');

    if (addBtn instanceof HTMLButtonElement) {
        addBtn.addEventListener('click', () => {
            addWindow();
        });
    }

    const closeBtns = apiListPanel.querySelectorAll('.close-window-btn');

    closeBtns.forEach(btn => {
        if (!(btn instanceof HTMLButtonElement)) return;

        btn.addEventListener('click', event => {
            event.stopPropagation();

            const id = btn.dataset.windowId;

            if (!id) return;

            removeWindow(id);
        });
    });

    const currentWindows =
        apiListPanel.querySelectorAll('.window');

    currentWindows.forEach(el => {
        if (!(el instanceof HTMLDivElement)) return;

        el.addEventListener('click', event => {
            const target = event.target;

            if (
                target instanceof HTMLButtonElement &&
                target.classList.contains('close-window-btn')
            ) {
                return;
            }

            const id = el.dataset.windowId;

            if (!id) return;

            const win = windows.find(
                cWin => cWin.id === Number(id)
            );

            if (!win) return;

            handleClickHomeResolver(win);
        });
    });
};