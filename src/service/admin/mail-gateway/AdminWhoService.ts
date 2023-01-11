import {apiAdmin} from "@/http-common";
import {FieldOfWhoDetail} from "@/model/admin/dto/IAdminWhoDetail";
import {IAdminRegexTest} from "@/model/admin/dto/IAdminRegexTest";

class AdminWhoService {
    getAllWhoDetail(jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/get-all-who-detail');
    }
    addWhoDetail(data: FieldOfWhoDetail, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/add-who-detail', data);
    }
    editWhoDetail(data: FieldOfWhoDetail, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/edit-who-detail', data);
    }
    deleteWhoDetail(data: FieldOfWhoDetail, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/delete-who-detail', data);
    }
    regexTestWhoDetail(data: IAdminRegexTest, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/regex-test', data);
    }
}

export default new AdminWhoService();