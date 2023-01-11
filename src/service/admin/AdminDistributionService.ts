import {apiAdmin} from "@/http-common";
import {IAdminDistribution} from "@/model/admin/dto/IAdminDistribution";
import {IAdminCreateDistributionListRequest} from "@/model/admin/IAdminCreateDistributionListRequest";
import {IAdminDeleteDistributionListRequest} from "@/model/admin/IAdminDeleteDistributionListRequest";
import {IAdminModifyDistributionListRequest} from "@/model/admin/IAdminModifyDistributionListRequest";

class AdminDistributionService {
    getDistributionList(jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/get-distribution-list');
    }
    addMemberDistributionByUserManager(data: IAdminDistribution, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/add-member-distribution-by-user-manager', data);
    }
    removeMemberDistributionByUserManager(data: IAdminDistribution, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/remove-member-distribution-by-user-manager', data);
    }
    createDistributionList(data: IAdminCreateDistributionListRequest, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/create-distribution-list', data);
    }
    findDistributionByPage(data: IAdminDistribution, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/find-distribution-by-page', data);
    }
    deleteDistributionList(data: IAdminDeleteDistributionListRequest, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/delete-distribution', data);
    }
    modifyDistributionList(data: IAdminModifyDistributionListRequest, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/edit-distribution', data);
    }
}

export default new AdminDistributionService();