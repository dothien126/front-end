import { apiClient } from '@/http-common';
import {IGetAccountDistributionListsRequest} from "@/model/interface/IGetAccountDistributionListsRequest";
import {IGetDistributionListMembersRequest} from "@/model/interface/IGetDistributionListMembersRequest";

class DistributionService {
  getAccountDistributionList(data: IGetAccountDistributionListsRequest, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/distribution/get-account-distribution-list', data);
  }
  getDistributionListMember(data: IGetDistributionListMembersRequest, cookie: string): Promise<any> {
    return apiClient(cookie).post('api/distribution/get-distribution-list-member', data);
  }
}

export default new DistributionService();
