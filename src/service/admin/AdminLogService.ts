import {apiAdmin} from "@/http-common";
import {IAdminLogByPage} from "@/model/admin/IAdminLog";

class AdminLogService {
    find(data: IAdminLogByPage, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/log/find', data);
    }
}

export default new AdminLogService();