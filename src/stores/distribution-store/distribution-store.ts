import {defineStore} from "pinia";
import {MyStore} from "@/stores/my-store";
import {ref} from "vue";
import {IDistribution} from "@/model/interface/IDistribution";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {IGetAccountDistributionListsRequest} from "@/model/interface/IGetAccountDistributionListsRequest";
import DistributionService from "@/service/DistributionService";
import {IGetDistributionListMembersRequest} from "@/model/interface/IGetDistributionListMembersRequest";

export const MyDistributionStore = defineStore('myDistributionStore', () => {
    //init value
    const myStore = MyStore();
    const accountDistributionList = ref<IDistribution>({distributionList: [], hasMore: false, total: 0} as IDistribution);
    const distributionListMember = ref<IDistribution>({distributionList: [], hasMore: false, total: 0} as IDistribution);

    async function initGetAccountDistributionList() {
        if(myStore.token){
            //reset value
            accountDistributionList.value.distributionList = [];
            accountDistributionList.value.hasMore = false;
            //init request
            const itemFind = {} as IGetAccountDistributionListsRequest;
            //call request
            const response = await DistributionService.getAccountDistributionList(itemFind, myStore.token);
            if (response.data) {
                const responseData: ResponseData = response.data;
                //Kiểm tra backend có trả error ko
                if (responseData.values.error) {
                    // Set thông báo thất bại
                    showToastMessage(responseData.values.error, true);
                } else {
                    const bodyResponse: IDistribution = responseData.values;
                    //set to list
                    accountDistributionList.value.distributionList.push(...bodyResponse.distributionList);
                }
            } else {
                showToastMessage(undefined, true);
            }
        }
    }

    async function getDistributionListMember(request: IGetDistributionListMembersRequest) {
        if (myStore.token) {
            //call request
            const response = await DistributionService.getDistributionListMember(request, myStore.token);
            if (response.data) {
                const responseData: ResponseData = response.data;
                //Kiểm tra backend có trả error ko
                if (responseData.values.error) {
                    // Set thông báo thất bại
                    showToastMessage(responseData.values.error, true);
                } else {
                    const bodyResponse: IDistribution = responseData.values;
                    //set to list
                    distributionListMember.value.distributionList.push(...bodyResponse.distributionList);
                    distributionListMember.value.hasMore = bodyResponse.hasMore;
                    distributionListMember.value.total = bodyResponse.total;
                }
            } else {
                showToastMessage(undefined, true);
            }
        }
    }

    return {
        initGetAccountDistributionList,
        getDistributionListMember,
        accountDistributionList,
        distributionListMember,
    }
});