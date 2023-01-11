import {apiAdmin} from "@/http-common";
import {IAdminUserManager} from "@/model/admin/dto/IAdminUserManager";
import {IAdminCreateAccountRequest} from "@/model/admin/IAdminCreateAccountRequest";
import {User} from "@/model/User";

class AdminUserManagerService {
    findUserByPage(data: IAdminUserManager, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/find-user-by-page', data);
    }
    findAllUserTrashByDomain(data: User, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/find-user-trash-by-domain', data);
    }
    revokeUserTrashByDomain(data: User, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/revoke-user-trash-by-domain', data);
    }
    createAccount(data: IAdminCreateAccountRequest, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/create-account', data);
    }
    importAccount(data: IAdminCreateAccountRequest[], jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/import-account', data);
    }
}

export default new AdminUserManagerService();