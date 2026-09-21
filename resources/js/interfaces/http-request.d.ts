interface IHTTPRequest {
    id: number;
    method: HTTPMethod;
    headers: string[];
    body: string;
    type: HTTPType;
}