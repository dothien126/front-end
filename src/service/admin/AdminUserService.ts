import {apiAdmin} from "@/http-common";
import {IAdminUser} from "@/model/admin/IAdminUser";

class AdminUserService {
    authRequest(data: IAdminUser): Promise<any> {
        return apiAdmin('').post('api/admin/auth', data);
    }

    changePassword(data: IAdminUser, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/change-password', data);
    }

    getCompanyUser(jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/get-company-user');
    }

    searchDirectory(data: IAdminUser, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/search-directory', data);
    }
}

export default new AdminUserService();