import {apiAdmin} from "@/http-common";
import {IAdminTrackingCenter} from "@/model/admin/dto/IAdminTrackingCenter";

class AdminTrackingCenterService {
    findTracking(data: IAdminTrackingCenter, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/find-tracking', data);
    }
}

export default new AdminTrackingCenterService();