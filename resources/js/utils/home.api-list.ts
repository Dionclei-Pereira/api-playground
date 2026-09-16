let panel: HTMLDivElement | null;
let windows: IHTTPRequest[] = [];

document.addEventListener('DOMContentLoaded', () => {
    const element = document.getElementById('list-panel');
    if (!(element instanceof HTMLDivElement)) return;
    panel = element;

    renderApiList();
});

const addWindow = () => {
    let newWindow: IHTTPRequest = {
        body: '',
        headers: [],
        method: "get",
        type: "json"
    };
    console.log('aa')
    windows.push(newWindow);

    renderApiList();
};

const renderApiList = () => {
    if (!panel) return;

    let html: string = '';

    windows.forEach(win => {
        let cssClass: string = '';
        switch (win.method) {
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
            <div class="btn ${cssClass} flex-shrink-0 h-75 h-btn-md w-md-75 w-50 d-flex justify-content-between align-items-center">
                ${win.method.toUpperCase()}
                <button class="btn">X</button>
            </div>
        `
    });

    html += `
        <button id="add-window-btn" class="btn btn-light flex-shrink-0 w-md-75 w-50">
            +
        </button>
    `
    
    panel.innerHTML = html;

    const addBtn = document.getElementById('add-window-btn');
    if (!(addBtn instanceof HTMLButtonElement)) return;

    addBtn.addEventListener('click', () => addWindow());
};