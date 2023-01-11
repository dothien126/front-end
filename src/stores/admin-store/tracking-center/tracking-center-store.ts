import {defineStore} from "pinia";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {computed, ref} from "vue";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {IAdminTrackingCenter} from "@/model/admin/dto/IAdminTrackingCenter";
import AdminTrackingCenterService from "@/service/admin/mail-gateway/AdminTrackingCenterService";
import t from "typy";

export const AdminTrackingCenterStore = defineStore('adminTrackingCenterStore', () => {
    //init value
    const adminStore = MyAdminStore();
    const myJwt = computed(() => adminStore.myAdminJwt);
    //get all account
    const trackingList = ref<IAdminTrackingCenter[]>([] as IAdminTrackingCenter[]);
    const trackingLogs = ref<string[]>([]);
    const trackingFilter = ref<IAdminTrackingCenter>({
        from: '',
        target: '',
        starttime: 0,
        endtime: 0,
        ndr: false,
        greylist: false,
    } as IAdminTrackingCenter);

    //method
    function setTrackingFilter(item: IAdminTrackingCenter){
        trackingFilter.value.id = item.id;
        trackingFilter.value.from = item.from;
        trackingFilter.value.target = item.target;
        trackingFilter.value.starttime = item.starttime;
        trackingFilter.value.endtime = item.endtime;
        trackingFilter.value.ndr = item.ndr;
        trackingFilter.value.greylist = item.greylist;
    }

    async function initFindTracking(item?: IAdminTrackingCenter) {
        if(item){
            //reset value logs
            trackingLogs.value = [];
        }
        else{
            //reset value
            trackingList.value = [];
        }
        //call request
        const response = await AdminTrackingCenterService.findTracking(trackingFilter.value, myJwt.value);
        if (response.data) {
            const responseData: ResponseData = response.data;
            if (!responseData.values.error) {
                // Set giá trị
                const bodyResponse = responseData.values as IAdminTrackingCenter[] | IAdminTrackingCenter;
                if(bodyResponse){
                    if(t(bodyResponse).isArray){
                        //set value
                        trackingList.value = bodyResponse as IAdminTrackingCenter[];
                    }
                    else if("logs" in bodyResponse){
                        trackingLogs.value = bodyResponse.logs;
                    }
                }
            } else {
                showToastMessage(responseData.values.error, true);
            }
        }
    }

    return {
        initFindTracking,
        trackingList,
        trackingLogs,
        setTrackingFilter,
    }
});