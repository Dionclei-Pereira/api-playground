interface IHTTPRequest {
    method: HTTPMethod;
    headers: string[];
    body: string;
    type: HTTPType;
}