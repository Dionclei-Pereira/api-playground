import { windows, updateWindow } from './home.api-list';
import { send } from './home.api-resolver';

let homeApiPanel: HTMLDivElement | null = null;
let current: IWindow | null = null;

document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('main-panel');

    if (!(el instanceof HTMLDivElement)) return;

    homeApiPanel = el;

    if (windows.length !== 0) {
        current = windows.at(0)!;
    }

    setupHomePanelEvents();
    renderHomePanel();
});

const setupHomePanelEvents = (): void => {
    if (!homeApiPanel) return;

    /**
     * SELECTS
     */
    homeApiPanel.addEventListener('change', (event) => {
        if (current === null) return;

        const target = event.target;

        if (!(target instanceof HTMLSelectElement)) return;

        switch (target.id) {
            case 'request-method': {
                current = updateWindow({
                    ...current,
                    request: {
                        ...current.request,
                        method: target.value as HTTPMethod,
                    },
                });

                break;
            }

            case 'request-type': {
                console.log('CHANGE:', target.value);

                current = updateWindow({
                    ...current,
                    request: {
                        ...current.request,
                        type: target.value as HTTPType,
                    },
                });

                console.log(
                    'Novo type:',
                    current?.request.type
                );

                break;
            }
        }
    });

    /**
     * INPUTS
     */
    homeApiPanel.addEventListener('input', (event) => {
        if (current === null) return;

        const target = event.target;

        /**
         * Request URL
         */
        if (
            target instanceof HTMLInputElement &&
            target.id === 'request-url'
        ) {
            current = updateWindow({
                ...current,
                request: {
                    ...current.request,
                    url: target.value,
                },
            });

            return;
        }

        /**
         * Request body
         */
        if (
            target instanceof HTMLTextAreaElement &&
            target.id === 'request-body-input'
        ) {
            current = updateWindow({
                ...current,
                request: {
                    ...current.request,
                    body: target.value,
                },
            });

            return;
        }

        /**
         * Header key
         */
        if (
            target instanceof HTMLInputElement &&
            target.hasAttribute('data-header-key')
        ) {
            const index = Number(
                target.getAttribute('data-header-key')
            );

            if (Number.isNaN(index)) return;

            const headers = current.request.headers.map(
                (header, i) => {
                    if (i !== index) {
                        return header;
                    }

                    return [
                        target.value,
                        header[1],
                    ] as [string, string];
                }
            );

            current = updateWindow({
                ...current,
                request: {
                    ...current.request,
                    headers,
                },
            });

            return;
        }

        /**
         * Header value
         */
        if (
            target instanceof HTMLInputElement &&
            target.hasAttribute('data-header-value')
        ) {
            const index = Number(
                target.getAttribute('data-header-value')
            );

            if (Number.isNaN(index)) return;

            const headers = current.request.headers.map(
                (header, i) => {
                    if (i !== index) {
                        return header;
                    }

                    return [
                        header[0],
                        target.value,
                    ] as [string, string];
                }
            );

            current = updateWindow({
                ...current,
                request: {
                    ...current.request,
                    headers,
                },
            });

            return;
        }
    });

    /**
     * BUTTONS
     */
    homeApiPanel.addEventListener('click', async (event) => {
        if (current === null) return;

        const target = event.target;

        if (!(target instanceof HTMLButtonElement)) return;

        /**
         * Send request
         */
        if (target.id === 'send-request-btn') {
            try {
                sendBtnDisable(true);
                const responseFetch = await send(current.request);
                current = updateWindow({
                    ...current,
                    response: responseFetch
                });
            } catch (err) {
                
            } finally {
                sendBtnDisable(false);
            }

            renderHomePanel();

            return;
        }

        /**
         * Add header
         */
        if (target.id === 'add-header-btn') {
            current = updateWindow({
                ...current,
                request: {
                    ...current.request,
                    headers: [
                        ...current.request.headers,
                        ['', ''],
                    ],
                },
            });

            renderHomePanel();

            return;
        }

        /**
         * Remove header
         */
        if (target.hasAttribute('data-remove-header')) {
            const index = Number(
                target.getAttribute('data-remove-header')
            );

            if (Number.isNaN(index)) return;

            const headers = current.request.headers.filter(
                (_, i) => i !== index
            );

            current = updateWindow({
                ...current,
                request: {
                    ...current.request,
                    headers,
                },
            });

            renderHomePanel();

            return;
        }
    });
};

const renderHomePanel = (): void => {
    if (!homeApiPanel) return;

    if (current === null) {
        homeApiPanel.innerHTML = `
            <p>No window selected</p>
        `;

        return;
    }

    const request = current.request;
    const response = current.response;

    const headersHtml =
        request.headers.length > 0
            ? request.headers
                .map(
                    (header, index) => `
                        <div class="d-flex gap-2 mb-2">
                            <input
                                type="text"
                                class="form-control form-control-sm"
                                placeholder="Header"
                                value="${escapeHtml(header[0])}"
                                data-header-key="${index}"
                            >
                            <input
                                type="text"
                                class="form-control form-control-sm"
                                placeholder="Value"
                                value="${escapeHtml(header[1])}"
                                data-header-value="${index}"
                            >
                            <button
                                type="button"
                                class="btn btn-sm btn-outline-danger"
                                data-remove-header="${index}"
                            >
                                X
                            </button>
                        </div>
                    `
                )
                .join('')
            : `
                <small class="text-muted">
                    No headers
                </small>
            `;

    const html = `
        <div class="w-100 h-100 d-flex flex-column">
            <div class="row w-100 h-100 g-0">
                <!-- REQUEST -->
                <div
                    class="
                        col-12
                        col-md-6
                        h-100
                        border-end
                        d-flex
                        flex-column
                    "
                >
                    <!-- REQUEST BAR -->
                    <div class="p-3 border-bottom">
                        <div class="d-flex gap-2">
                            <select
                                id="request-method"
                                class="form-select"
                                style="max-width: 120px;"
                            >
                                <option
                                    value="get"
                                    ${request.method === 'get' ? 'selected' : ''}
                                >
                                    GET
                                </option>
                                <option
                                    value="post"
                                    ${request.method === 'post' ? 'selected' : ''}
                                >
                                    POST
                                </option>
                                <option
                                    value="put"
                                    ${request.method === 'put' ? 'selected' : ''}
                                >
                                    PUT
                                </option>
                                <option
                                    value="delete"
                                    ${request.method === 'delete' ? 'selected' : ''}
                                >
                                    DELETE
                                </option>
                            </select>

                            <input
                                id="request-url"
                                type="text"
                                class="form-control"
                                placeholder="Request URL"
                                value="${escapeHtml(request.url ?? '')}"
                            >

                            <button
                                id="send-request-btn"
                                type="button"
                                class="btn btn-primary"
                            >
                                Send
                            </button>
                        </div>
                    </div>

                    <!-- REQUEST CONTENT -->
                    <div
                        class="
                            p-3
                            flex-grow-1
                            overflow-auto
                        "
                    >
                        <ul class="nav nav-tabs mb-3">
                            <li class="nav-item">
                                <button
                                    class="nav-link active"
                                    data-bs-toggle="tab"
                                    data-bs-target="#request-headers"
                                    type="button"
                                >
                                    Headers
                                </button>
                            </li>
                            <li class="nav-item">
                                <button
                                    class="nav-link"
                                    data-bs-toggle="tab"
                                    data-bs-target="#request-body"
                                    type="button"
                                >
                                    Body
                                </button>
                            </li>
                        </ul>

                        <div class="tab-content">
                            <!-- HEADERS -->
                            <div
                                id="request-headers"
                                class="tab-pane fade show active"
                            >
                                <div
                                    class="
                                        d-flex
                                        justify-content-between
                                        align-items-center
                                        mb-3
                                    "
                                >
                                    <strong>
                                        Headers
                                    </strong>

                                    <button
                                        id="add-header-btn"
                                        type="button"
                                        class="
                                            btn
                                            btn-sm
                                            btn-outline-primary
                                        "
                                    >
                                        + Header
                                    </button>
                                </div>

                                <div id="headers-container">
                                    ${headersHtml}
                                </div>
                            </div>

                            <!-- BODY -->
                            <div
                                id="request-body"
                                class="tab-pane fade"
                            >
                                <div class="mb-2">
                                    <label class="form-label">
                                        Content Type
                                    </label>

                                    <select
                                        id="request-type"
                                        class="form-select"
                                    >
                                        <option
                                            value="json"
                                            ${request.type === 'json' ? 'selected' : ''}
                                        >
                                            JSON
                                        </option>
                                        <option
                                            value="text"
                                            ${request.type === 'text' ? 'selected' : ''}
                                        >
                                            Text
                                        </option>
                                    </select>
                                </div>

                                <textarea
                                    id="request-body-input"
                                    class="
                                        form-control
                                        font-monospace
                                    "
                                    rows="15"
                                    placeholder="Request body..."
                                >${escapeHtml(request.body ?? '')}</textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RESPONSE -->
                <div
                    class="
                        col-12
                        col-md-6
                        h-100
                        d-flex
                        flex-column
                    "
                >
                    <div
                        class="
                            p-3
                            border-bottom
                            d-flex
                            justify-content-between
                            align-items-center
                        "
                    >
                        <strong>
                            Response
                        </strong>

                        <span
                            class="
                                badge
                                ${response.statusCode >= 200 && response.statusCode < 300
            ? 'bg-success' : response.statusCode >= 400 ? 'bg-danger' :
                'bg-secondary'}
                            "
                        >
                            ${response.statusCode}
                        </span>
                    </div>

                    <div
                        class="
                            p-3
                            flex-grow-1
                            overflow-auto
                        "
                    >
                        <ul class="nav nav-tabs mb-3">
                            <li class="nav-item">
                                <button
                                    class="nav-link active"
                                    data-bs-toggle="tab"
                                    data-bs-target="#response-body"
                                    type="button"
                                >
                                    Body
                                </button>
                            </li>
                            <li class="nav-item">
                                <button
                                    class="nav-link"
                                    data-bs-toggle="tab"
                                    data-bs-target="#response-info"
                                    type="button"
                                >
                                    Info
                                </button>
                            </li>
                        </ul>

                        <div class="tab-content">
                            <!-- RESPONSE BODY -->
                            <div
                                id="response-body"
                                class="
                                    tab-pane
                                    fade
                                    show
                                    active
                                "
                            >
                                <pre
                                    class="
                                        bg-light
                                        border
                                        rounded
                                        p-3
                                        w-100
                                    "
                                    style="
                                        min-height: 300px;
                                        white-space: pre-wrap;
                                    "
                                >${escapeHtml(response.body ?? '')}</pre>
                            </div>

                            <!-- RESPONSE INFO -->
                            <div
                                id="response-info"
                                class="tab-pane fade"
                            >
                                <div class="mb-2">
                                    <strong>
                                        Status:
                                    </strong>

                                    ${response.statusCode}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    homeApiPanel.innerHTML = html;
};

export const handleClickHomeResolver = (
    request: IWindow
): void => {
    current = request;

    renderHomePanel();
};

const escapeHtml = (value: string): string => {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
};

const sendBtnDisable = (value: boolean): void => {
    const btn = document.getElementById('send-request-btn');
    if (!(btn instanceof HTMLButtonElement)) return;
    btn.disabled = value;
};