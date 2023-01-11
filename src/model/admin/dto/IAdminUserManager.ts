import {IPagination} from "@/model/interface/IPagination";
import {IDistribution} from "@/model/admin/dto/IAdminDistribution";

export interface IAdminUserManager {
    userList: IUserAccount[];
    //pagination
    pagination: IPagination;
}

export interface IUserAccount {
    zimbraUserId: string;
    displayName: string;
    account: string;
    password: string;
    dataUse: number;
    dataMax: number;
    forwardAddressList: string[];
    groupMailList: IDistribution[];
    status: string;
    description: string;
    lastLogin: Date;
    selected: boolean; //client only
}