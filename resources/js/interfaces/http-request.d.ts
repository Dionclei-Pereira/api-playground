interface IHTTPRequest {
    method: HTTPMethod;
    headers: [string, string][];
    url: string;
    body: string;
    type: HTTPType;
}