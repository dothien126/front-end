import {apiClient} from "@/http-common";
import {ItemConversationDetail} from "@/model/ConversationDetail";

class FileAttachmentService {
    initUpload(data: any, cookie): Promise<any> {
        return apiClient(cookie).post('api/upload/attachment', data);
    }
    downloadAttachment(data: ItemConversationDetail, cookie): Promise<any> {
        return apiClient(cookie).post('api/download/attachment', data, {
            responseType: "arraybuffer",
        });
    }
}

export default new FileAttachmentService();