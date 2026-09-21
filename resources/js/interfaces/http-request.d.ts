interface IHTTPRequest {
    method: HTTPMethod;
    headers: string[][];
    url: string;
    body: string;
    type: HTTPType;
}