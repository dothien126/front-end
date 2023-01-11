export interface IAdminModifyAccountRequest {
    _jsns: string;
    id: string;
    a: AFieldOfModifyAccountRequest[];
}

export interface AFieldOfModifyAccountRequest {
    n: string;
    _content: string;
}