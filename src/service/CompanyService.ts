import { apiClient } from '@/http-common';
import {Company} from "@/model/Company";

class CompanyService {
  findOne(data: Company): Promise<any> {
    return apiClient('').post('api/company/find-one', data);
  }
  showLogoLightMode(): Promise<any> {
    return apiClient('').get('api/company/show-logo/light-mode');
  }
  showLogoDarkMode(): Promise<any> {
    return apiClient('').get('api/company/show-logo/dark-mode');
  }
}

export default new CompanyService();
