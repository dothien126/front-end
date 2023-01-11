export interface ICreateContactRequest {
    _jsns: string;
    cn: CnFieldOfCreateContactRequest;
}

export interface CnFieldOfCreateContactRequest {
    id: string;
    l: string;
    a: AFieldOfCnFieldOfCreateContactRequest[];
    m: [];
}

export interface AFieldOfCnFieldOfCreateContactRequest{
    n: string;
    _content: string;
}