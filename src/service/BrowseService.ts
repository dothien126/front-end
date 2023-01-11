import { apiClient } from '@/http-common';
import {IBrowseRequest} from "@/model/interface/IBrowseRequest";

class BrowseService {
  browseRequest(data: IBrowseRequest, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/browse/browse-request', data);
  }
}

export default new BrowseService();
