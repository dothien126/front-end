import {apiAdmin} from "@/http-common";
import {IUserAccount} from "@/model/admin/dto/IAdminUserManager";
import {IAdminModifyAccountRequest} from "@/model/admin/IAdminModifyAccountRequest";

class AdminAccountService {
    getAllAccount(jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/get-all-account');
    }
    moveAccountToTrash(data: IUserAccount, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/move-account-to-trash', data);
    }
    modifyAccount(data: IAdminModifyAccountRequest, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/modify-account', data);
    }
    deleteAccount(data: IUserAccount, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/delete-account', data);
    }
}

export default new AdminAccountService();