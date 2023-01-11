import { apiClient } from '@/http-common';
import {WhiteBlackList} from "@/model/WhiteBlackList";

class MailOptionService {
  getWhiteBlackList(cookie: string): Promise<any> {
    return apiClient(cookie).post('api/mail-option/get-white-black-list');
  }

  modifyWhiteBlackList(data: WhiteBlackList, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/mail-option/modify-white-black-list', data);
  }
}

export default new MailOptionService();
