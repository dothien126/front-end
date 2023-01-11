export interface IAdminUser {
    _id: string;
    account: string;
    password: string;
    lifetime: number;
    jwt: string; //client only
    passwordNew: string; //client only
    confirmPassword: string; //client only
}