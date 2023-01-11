import {apiClient} from "@/http-common";
import {BatchRequest} from "@/model/BatchRequest";

class BatchService {
    request(data: BatchRequest, cookie: string): Promise<any> {
        return apiClient(cookie).post('api/batch/request', data);
    }
}

export default new BatchService();