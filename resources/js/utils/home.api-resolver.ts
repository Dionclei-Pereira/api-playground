export const send = async (request: IHTTPRequest): Promise<IHTTPResponse> => {

    const fetchHeaders = new Headers(request.headers);
    let fetchBody: string | undefined;
    if (request.method !== "get") {
        if (request.type === "json") {
            fetchBody = JSON.stringify(request.body);
            fetchHeaders.set("Content-Type", "application/json");
        } else {
            fetchBody = request.body;
            fetchHeaders.set("Content-Type", "text/plain");
        }
    }

    fetchHeaders.set("Accept", "application/json");

    const fetchResponse: Response = await fetch(request.url, {
        body: fetchBody,
        headers: fetchHeaders,
        method: request.method,

    });

    const contentType = fetchResponse.headers.get("content-type") || "";
    let bodyResponse: string = '';
    if (contentType.includes("json")) {
        bodyResponse = JSON.stringify(await fetchResponse.json());
    } else if (contentType.includes("text/") || contentType.includes("application/xml")) {
        bodyResponse = await fetchResponse.text();
    }

    const response: IHTTPResponse = {
        statusCode: fetchResponse.status,
        body: bodyResponse
    }

    return response;
};