import {apiClient} from "@/http-common";
import {RequestMessage} from "@/model/RequestMessage";
import {MessageDetail} from "@/model/MessageDetail";
import {RequestNoResponse} from "@/model/RequestNoResponse";

class RequestMessageService {
    findOne(data: MessageDetail, cookie: string): Promise<any> {
        return apiClient(cookie).post('api/message/find-one', data);
    }
    removeAttachment(data: RequestNoResponse, cookie: string): Promise<any> {
        return apiClient(cookie).post('api/message/remove-attachment', data);
    }
    saveDraft(data: RequestMessage, cookie: string): Promise<any> {
        return apiClient(cookie).post('api/message/save-draft', data);
    }
    send(data: RequestMessage, cookie: string): Promise<any> {
        return apiClient(cookie).post('api/message/send', data);
    }
}
export default new RequestMessageService();
