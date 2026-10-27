export const send = async (request: IHTTPRequest): Promise<IHTTPResponse> => {
    const execution = request.execution ?? 'proxy';

    if (execution === 'local') {
        const fetchHeaders = new Headers(request.headers);
        let fetchBody: string | undefined;
        if (request.method !== 'get') {
            if (request.type === 'json') {
                fetchBody = JSON.stringify(request.body);
                fetchHeaders.set('Content-Type', 'application/json');
            } else {
                fetchBody = request.body;
                fetchHeaders.set('Content-Type', 'text/plain');
            }
        }

        fetchHeaders.set('Accept', 'application/json');

        const fetchResponse: Response = await fetch(request.url, {
            body: fetchBody,
            headers: fetchHeaders,
            method: request.method,
        });

        const contentType = fetchResponse.headers.get('content-type') || '';
        let bodyResponse: string = '';
        if (contentType.includes('json')) {
            bodyResponse = JSON.stringify(await fetchResponse.json());
        } else if (contentType.includes('text/') || contentType.includes('application/xml')) {
            bodyResponse = await fetchResponse.text();
        }

        const response: IHTTPResponse = {
            statusCode: fetchResponse.status,
            body: bodyResponse,
        };

        return response;
    }

    // proxy mode
    const payload = {
        method: request.method,
        url: request.url,
        headers: request.headers,
        body: request.body,
        type: request.type,
    };

    const fetchResponse: Response = await fetch('/api/proxy/execute', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    let data: any = null;
    const contentType = fetchResponse.headers.get('content-type') || '';
    if (contentType.includes('json')) {
        data = await fetchResponse.json();
    } else {
        const text = await fetchResponse.text();
        try {
            data = JSON.parse(text);
        } catch {
            data = { statusCode: fetchResponse.status, body: text };
        }
    }

    const response: IHTTPResponse = {
        statusCode: data?.statusCode ?? fetchResponse.status,
        body: typeof data?.body === 'string' ? data.body : JSON.stringify(data?.body ?? ''),
    };

    return response;
};
