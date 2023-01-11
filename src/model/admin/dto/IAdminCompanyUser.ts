export interface IAdminCompanyUser {
    adminId: string;
    adminName: string;
    adminEmail: string;
    companyId: string;
    companyTitle: string;
    companyLogo: string;
    companyLogoDarkMode: string;
    companyCreatedAt: Date;
    companyVerticalMode: boolean;
    domain: string;
    dataUse: number;
    dataMax: number;
    accountUse: number;
    accountMax: number;
    groupUse: number;
    groupMax: number;
    zimbraHost: string;
}