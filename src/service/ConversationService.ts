import { apiClient } from '@/http-common';
import {SearchRequest} from "@/model/SearchRequest";
import {RequestNoResponse} from "@/model/RequestNoResponse";
import {Item} from "@/model/Conversation";

class ConversationService {
  find(data: SearchRequest, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/conversation/find', data);
  }
  action(data: RequestNoResponse, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/conversation/action', data);
  }
  print(data: Item, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/conversation/print', data);
  }
}

export default new ConversationService();
