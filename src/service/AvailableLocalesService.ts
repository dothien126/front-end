import { apiClient } from '@/http-common';

class AvailableLocalesService {
  getAvailable(cookie: string): Promise<any> {
    return apiClient(cookie).post('api/locales/get-available');
  }
}

export default new AvailableLocalesService();
