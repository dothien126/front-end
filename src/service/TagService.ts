import { apiClient } from '@/http-common';
import {Tag} from "@/model/Tag";

class TagService {
  getTag(data: Tag, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/tag/get', data);
  }
  createTag(data: Tag, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/tag/create', data);
  }
  actionTag(data: Tag, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/tag/action', data);
  }
}

export default new TagService();
