import { apiClient } from '@/http-common';
import { RequestNoResponse } from '@/model/RequestNoResponse';
import {SearchConvRequest} from "@/model/SearchConvRequest";
import {ItemConversationDetail} from "@/model/ConversationDetail";

class ConversationDetailService {
  find(data: SearchConvRequest, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/conversation-detail/find-detail', data);
  }
  action(data: RequestNoResponse, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/conversation-detail/action', data);
  }
  showOriginal(data: ItemConversationDetail, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/conversation-detail/show-original', data);
  }
}

export default new ConversationDetailService();
