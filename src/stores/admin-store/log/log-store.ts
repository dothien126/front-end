import {defineStore} from "pinia";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {computed, ref} from "vue";
import {IAdminLogByPage} from "@/model/admin/IAdminLog";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {RANGE_PAGE_SIZE} from "@/utils/MyVariables";
import AdminLogService from "@/service/admin/AdminLogService";
import {IPagination} from "@/model/interface/IPagination";

export const AdminLogStore = defineStore('adminLogStore', () => {
    //init value
    const adminStore = MyAdminStore();
    const myJwt = computed(() => adminStore.myAdminJwt);
    const numberPage = ref(1);
    const pageSize = ref(RANGE_PAGE_SIZE[0]);
    //get all log by domain
    const logList = ref<IAdminLogByPage>({adminLog: [], pagination: {} as IPagination} as IAdminLogByPage);

    async function initFindAdminLog() {
        //init request
        const itemFind = {
            pagination: {
                number: numberPage.value,
                size: pageSize.value,
            }
        } as IAdminLogByPage;
        //call request
        const response = await AdminLogService.find(itemFind, myJwt.value);
        if (response.data) {
            const responseData: ResponseData = response.data;
            if (!responseData.values.error) {
                // Set giá trị
                const bodyResponse = responseData.values as IAdminLogByPage;
                if(bodyResponse && bodyResponse.adminLog){
                    //set value
                    logList.value = bodyResponse;
                }
            } else {
                showToastMessage(responseData.values.error, true);
            }
        }
    }

    return {
        logList,
        initFindAdminLog,
        numberPage,
        pageSize,
    }
});