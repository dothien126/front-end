import {IPagination} from "@/model/interface/IPagination";
export interface IAdminLogByPage{
    adminLog: IAdminLog[];
    //pagination
    pagination: IPagination;
}

export interface IAdminLog {
    _id: string;
    name: NameFieldOfAdminLog;
    byAccount: string;
    domain: string;
    action: ActionFieldOfAdminLog;
    data: any;
    createdAt: Date;
    updatedAt: Date;
}

export enum NameFieldOfAdminLog{
    LOG_USER_ACCOUNT = 'userAccount',
    LOG_MAIL_GROUP = 'mailGroup',
    LOG_BRAND_CONFIG = 'brandConfig',
    LOG_SPAM_FILTER = 'spamFilter',
}

export enum ActionFieldOfAdminLog{
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'deleted',
    MOVE_TRASH = 'deleting',
    LOGIN = 'login',
}