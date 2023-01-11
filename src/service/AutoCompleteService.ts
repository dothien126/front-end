import { apiClient } from '@/http-common';
import {AutoComplete} from "@/model/AutoComplete";

class AutoCompleteService {
  find(data: AutoComplete, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/auto-complete/find', data);
  }
}

export default new AutoCompleteService();
