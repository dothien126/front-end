import {defineStore} from "pinia";
import {MyStore} from "@/stores/my-store";
import {ref} from "vue";
import {IFilterRule, IInOutFilterRule} from "@/model/interface/IFilterRule";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import FilterRuleService from "@/service/FilterRuleService";
import {FolderStore} from "@/stores/folder-store/folder-store";

export const MyFilterRuleStore = defineStore('myFilterRuleStore', () => {
    //init value
    const myStore = MyStore();
    const folderStore = FolderStore();
    const myFilterRuleList = ref<IFilterRule[]>([] as IFilterRule[]);
    const myOutgoingFilterRuleList = ref<IFilterRule[]>([] as IFilterRule[]);
    const filterRuleStatus = ref('')

    // Lay danh sach filter rule
    async function initGetFilterRuleList(outgoingFilter: boolean) {
        if(myStore.token){
            //reset value
            if (outgoingFilter) {
                myOutgoingFilterRuleList.value = [];
            } else {
                myFilterRuleList.value = [];
            }
            //init request
            const request = {outgoingFilterRule: outgoingFilter} as IInOutFilterRule;
            //call request
            const response = await FilterRuleService.findAll(request, myStore.token);
            if (response.data) {
                const responseData: ResponseData = response.data;
                //Kiểm tra backend có trả error ko
                if (responseData.values.error) {
                    // Set thông báo thất bại
                    showToastMessage(responseData.values.error, true);
                } else {
                    const datas = responseData.values as any[];
                    //logic set to list
                    if (datas && datas.length > 0) {
                        for (const item of datas) {
                            //set gia tri cho client only default
                            item.selected = false;
                            item.indexSelected = 0;
                            item.moveAdd = false;
                            item.moveRemove = false;
                            item.moveUp = false;
                            item.moveDown = false;
                            if (outgoingFilter) {
                                myOutgoingFilterRuleList.value.push(item);
                            } else {
                                myFilterRuleList.value.push(item);
                            }
                        }
                    }
                }
            } else {
                showToastMessage(undefined, true);
            }
        }
    }

    function removeFilterRuleSelected(item: IFilterRule, outgoingFilter: boolean) {
        if(outgoingFilter){
            const findIndex = myOutgoingFilterRuleList.value.findIndex(value => value.name === item.name);
            if (findIndex >= 0) {
                myOutgoingFilterRuleList.value.splice(findIndex, 1);
            }
        }
        else{
            const findIndex = myFilterRuleList.value.findIndex(value => value.name === item.name);
            if (findIndex >= 0) {
                myFilterRuleList.value.splice(findIndex, 1);
            }
        }
    }

    function moveUpFilterRuleSelected(item: IFilterRule, outgoingFilter: boolean) {
        if(outgoingFilter){
            const index = myOutgoingFilterRuleList.value.findIndex(e => e.name == item.name);
            if (index > 0) {
                const el = myOutgoingFilterRuleList.value[index];
                myOutgoingFilterRuleList.value[index] = myOutgoingFilterRuleList.value[index - 1];
                myOutgoingFilterRuleList.value[index - 1] = el;
            }
        }
        else{
            const index = myFilterRuleList.value.findIndex(e => e.name == item.name);
            if (index > 0) {
                const el = myFilterRuleList.value[index];
                myFilterRuleList.value[index] = myFilterRuleList.value[index - 1];
                myFilterRuleList.value[index - 1] = el;
            }
        }
    }

    function moveDownFilterRuleSelected(item: IFilterRule, outgoingFilter: boolean) {
        if(outgoingFilter){
            const index = myOutgoingFilterRuleList.value.findIndex(e => e.name == item.name);
            if (index !== -1 && index < myOutgoingFilterRuleList.value.length - 1) {
                const el = myOutgoingFilterRuleList.value[index];
                myOutgoingFilterRuleList.value[index] = myOutgoingFilterRuleList.value[index + 1];
                myOutgoingFilterRuleList.value[index + 1] = el;
            }
        }
        else{
            const index = myFilterRuleList.value.findIndex(e => e.name == item.name);
            if (index !== -1 && index < myFilterRuleList.value.length - 1) {
                const el = myFilterRuleList.value[index];
                myFilterRuleList.value[index] = myFilterRuleList.value[index + 1];
                myFilterRuleList.value[index + 1] = el;
            }
        }
    }

    async function modifyFilterRule(outgoingFilter: boolean, reload: boolean) {
        //init request
        const filterRules = outgoingFilter ? myOutgoingFilterRuleList.value : myFilterRuleList.value;
        const request = {outgoingFilterRule: outgoingFilter, filterRules: filterRules} as IInOutFilterRule;
        //call request
        const response = await FilterRuleService.modify(request, myStore.token);
        if (response.data) {
            const responseData: ResponseData = response.data;
            if (!responseData.values.error) {
                //alert success
                showToastMessage();
            } else {
                showToastMessage(responseData.values.error, true);
            }
            //reload data
            if (reload) await initGetFilterRuleList(outgoingFilter);
        }
    }

    async function activityStreamFilterRule(filterRules: IFilterRule, reload: boolean) {
        //init request
        const request = {outgoingFilterRule: false, filterRules: [filterRules]} as IInOutFilterRule;
        //call request
        const response = await FilterRuleService.activityStream(request, myStore.token);
        if (response.data) {
            const responseData: ResponseData = response.data;
            if (!responseData.values.error) {
                //alert success
                showToastMessage();
            } else {
                showToastMessage(responseData.values.error, true);
            }
            //reload data
            if (reload){
                await initGetFilterRuleList(false);
                await folderStore.initGetFolder();
            }
        }
    }

    return {
        myOutgoingFilterRuleList,
        myFilterRuleList,
        initGetFilterRuleList,
        removeFilterRuleSelected,
        moveUpFilterRuleSelected,
        moveDownFilterRuleSelected,
        modifyFilterRule,
        activityStreamFilterRule,
        filterRuleStatus
    }
});