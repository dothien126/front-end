import {defineStore} from "pinia";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {computed, ref} from "vue";
import {IPagination} from "@/model/interface/IPagination";
import {RANGE_PAGE_SIZE} from "@/utils/MyVariables";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {IAdminDistribution, IDistribution} from "@/model/admin/dto/IAdminDistribution";
import AdminDistributionService from "@/service/admin/AdminDistributionService";

export const AdminDistributionStore = defineStore('adminDistributionStore', () => {
    //init value
    const adminStore = MyAdminStore();
    const myJwt = computed(() => adminStore.myAdminJwt);
    //get all account
    const distributionAllList = ref<IAdminDistribution>({
        distributionList: [] as IDistribution[],
        pagination: {} as IPagination
    } as IAdminDistribution);
    //user manager list (by page)
    const numberPage = ref(1);
    const pageSize = ref(RANGE_PAGE_SIZE[0]);
    const statusDistribution = ref('');
    const nameDistribution = ref('');
    const distribution = ref<IAdminDistribution>({
        distributionList: [] as IDistribution[],
        pagination: {} as IPagination,
    });

    //method
    async function initGetAllDistribution() {
        //call request
        const response = await AdminDistributionService.getDistributionList(myJwt.value);
        if (response.data) {
            const responseData: ResponseData = response.data;
            if (!responseData.values.error) {
                // Set giá trị
                const bodyResponse = responseData.values as IAdminDistribution;
                if (bodyResponse && bodyResponse.distributionList) {
                    //set value
                    distributionAllList.value.distributionList = bodyResponse.distributionList;
                }
            } else {
                showToastMessage(responseData.values.error, true);
            }
        }
    }

    async function initGetDistributionList() {
        //init request
        const itemFind = {
            pagination: {
                number: numberPage.value,
                size: pageSize.value,
                sortBy: "name",
                sortAscending: "1",
                query: statusDistribution.value + nameDistribution.value,
            }
        } as IAdminDistribution;
        //call request
        const response = await AdminDistributionService.findDistributionByPage(itemFind, myJwt.value);
        if (response.data) {
            const responseData: ResponseData = response.data;
            if (!responseData.values.error) {
                // Set giá trị
                const bodyResponse = responseData.values as IAdminDistribution;
                if (bodyResponse && bodyResponse.distributionList) {
                    //set value
                    distribution.value = bodyResponse;
                }
            } else {
                showToastMessage(responseData.values.error, true);
            }
        }
    }

    return {
        distribution,
        distributionAllList,
        numberPage,
        pageSize,
        statusDistribution,
        nameDistribution,
        initGetAllDistribution,
        initGetDistributionList,
    }
});