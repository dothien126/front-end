import {apiAdmin} from "@/http-common";
import {IAdminTrackingCenter} from "@/model/admin/dto/IAdminTrackingCenter";

class AdminQuarantineService {
    getAllSpamUser(data: IAdminTrackingCenter, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/quarantine/get-all-spam-user', data);
    }
    getAllVirus(data: IAdminTrackingCenter, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/quarantine/get-all-virus', data);
    }
    getAllSpam(data: IAdminTrackingCenter, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/quarantine/get-all-spam', data);
    }
    getContent(data: IAdminTrackingCenter, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/quarantine/get-content', data);
    }
    deliverContent(data: IAdminTrackingCenter, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/quarantine/deliver-content', data);
    }
    deleteContent(data: IAdminTrackingCenter, jwt: string): Promise<any> {
        return apiAdmin(jwt).post('api/admin/quarantine/delete-content', data);
    }
}

export default new AdminQuarantineService();