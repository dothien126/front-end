export interface IAdminCreateAccountRequest {
    _jsns: string;
    name: string;
    password: string;
    a: AFieldOfCreateAccountRequest[];
}

export interface AFieldOfCreateAccountRequest{
    n: string;
    _content: string;
}