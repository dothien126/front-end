import {apiClient} from "@/http-common";
import {IInOutFilterRule} from "@/model/interface/IFilterRule";
import {IApplyFilterRulesRequest} from "@/model/interface/IApplyFilterRulesRequest";

class FilterRuleService {
    findAll(data: IInOutFilterRule, cookie: string): Promise<any> {
        return apiClient(cookie).post('api/filter-rule/get-all', data);
    }

    modify(data: IInOutFilterRule, cookie: string): Promise<any> {
        return apiClient(cookie).post('api/filter-rule/modify', data);
    }

    run(data: IApplyFilterRulesRequest, cookie: string): Promise<any> {
        return apiClient(cookie).post('api/filter-rule/run', data);
    }

    activityStream(data: IInOutFilterRule, cookie: string): Promise<any> {
        return apiClient(cookie).post('api/filter-rule/activity-stream', data);
    }
}

export default new FilterRuleService();