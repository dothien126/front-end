export interface IAdminWhoDetail {
    objectName: string;
    whoId: string;
    whoDetail: FieldOfWhoDetail[];
}

export interface FieldOfWhoDetail{
    id: string;
    type: string;
    value: string;
    whoId: string;
}