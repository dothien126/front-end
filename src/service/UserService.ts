import { apiClient } from '@/http-common';
import { User } from '@/model/User';
import {RequestNoResponse} from "@/model/RequestNoResponse";

class UserService {
  login(data: User): Promise<any> {
    return apiClient('').post('api/user/login', data);
  }

  changePassword(data: User, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/user/change-password', data);
  }

  update(data: User, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/user/update', data);
  }

  findOneByToken(data: User, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/user/find-one-by-token', data);
  }

  modifyPrefs(data: RequestNoResponse, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/user/modify-prefs', data);
  }
}

export default new UserService();
