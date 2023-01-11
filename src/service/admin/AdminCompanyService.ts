import {apiAdmin} from '@/http-common';
import {Company} from "@/model/Company";

class AdminCompanyService {
  updateTitleAndLogo(data: Company, jwt: string): Promise<any> {
    return apiAdmin(jwt).post('api/admin/company/update-title-logo', data);
  }

  uploadLogo(data: any, jwt: string): Promise<any> {
    return apiAdmin(jwt).post('api/admin/company/upload-logo', data);
  }
}

export default new AdminCompanyService();
