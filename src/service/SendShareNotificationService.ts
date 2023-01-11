import {apiClient} from "@/http-common";
import {SendShareNotificationRequest} from "@/model/SendShareNotificationRequest";

class SendShareNotificationService {
    sendShareNotification(data: SendShareNotificationRequest, cookie: string): Promise<any> {
        return apiClient(cookie).post('api/send-share-notification/action', data);
    }
}

export default new SendShareNotificationService();