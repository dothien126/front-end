import {IPagination} from "@/model/interface/IPagination";

export interface IAdminDistribution {
    distributionList: IDistribution[];
    //pagination
    pagination: IPagination;
}

export interface IDistribution{
    id: string;
    displayName: string;
    name: string;
    createdTime: Date;
    member: string[];
    status: string;
    description: string;
}