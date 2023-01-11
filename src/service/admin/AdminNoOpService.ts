import {apiAdmin} from "@/http-common";

class AdminNoOpService {
    noOpRequest(jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/no-op');
    }
}

export default new AdminNoOpService();