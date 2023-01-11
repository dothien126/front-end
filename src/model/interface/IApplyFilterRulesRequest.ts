import {IFilterRule} from "./IFilterRule";

export interface IApplyFilterRulesRequest {
    _jsns: string;
    filterRules: FilterRule[];
    m : MOfApplyFilterRulesRequest;
    folderPathSelected: string[]; //client only
}

export interface FilterRule{
    filterRule: IFilterRule;
}

export interface MOfApplyFilterRulesRequest {
    ids: string;
}