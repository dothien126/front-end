import { apiClient } from '@/http-common';
import {SearchRequest} from "@/model/SearchRequest";
import {ICreateContactRequest} from "@/model/interface/ICreateContactRequest";
import {RequestNoResponse} from "@/model/RequestNoResponse";

class ContactService {
  find(data: SearchRequest, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/contact/find', data);
  }
  createModifyContact(data: ICreateContactRequest, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/contact/create-modify-contact', data);
  }
  action(data: RequestNoResponse, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/contact/action', data);
  }
}

export default new ContactService();
