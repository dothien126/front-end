import {defineStore} from "pinia";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {computed, ref} from "vue";
import {FieldOfWhoDetail, IAdminWhoDetail} from "@/model/admin/dto/IAdminWhoDetail";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import AdminWhoService from "@/service/admin/mail-gateway/AdminWhoService";
import {inDeny, inWhitelist, outDeny} from "@/utils/MyVariables";
import AdminQuarantineService from "@/service/admin/mail-gateway/AdminQuarantineService";
import {IAdminTrackingCenter} from "@/model/admin/dto/IAdminTrackingCenter";
import t from "typy";
import {IAdminQuarantine} from "@/model/admin/dto/IAdminQuarantine";

export const AdminMailGatewayStore = defineStore('adminMailGatewayStore', () => {
    //init value
    const adminStore = MyAdminStore();
    const myJwt = computed(() => adminStore.myAdminJwt);
    //get all who detail
    const whoDetailList = ref<IAdminWhoDetail[]>([] as IAdminWhoDetail[]);
    //who detail of in deny
    const whoDetailInDeny = ref<IAdminWhoDetail>({objectName: inDeny, whoId: '', whoDetail: [] as FieldOfWhoDetail[]} as IAdminWhoDetail);
    //who detail of out deny
    const whoDetailOutDeny = ref<IAdminWhoDetail>({objectName: outDeny, whoId: '', whoDetail: [] as FieldOfWhoDetail[]} as IAdminWhoDetail);
    //who detail of in whitelist
    const whoDetailInWhitelist = ref<IAdminWhoDetail>({objectName: inWhitelist, whoId: '', whoDetail: [] as FieldOfWhoDetail[]} as IAdminWhoDetail);
    //get all spam user
    const spamUserList = ref<IAdminQuarantine>({accountList: [] as string[]} as IAdminQuarantine);
    //get all quarantine list
    const quarantineList = ref<IAdminQuarantine[]>([] as IAdminQuarantine[]);
    //get content of spam or virus quarantine
    const quarantineContent = ref<IAdminQuarantine>({} as IAdminQuarantine);

    //method
    async function initGetAllWhoDetail() {
        if(myJwt.value){
            //call request
            const response = await AdminWhoService.getAllWhoDetail(myJwt.value);
            if (response.data) {
                const responseData: ResponseData = response.data;
                if (!responseData.values.error) {
                    // Set giá trị
                    const bodyResponse = responseData.values as IAdminWhoDetail[];
                    if (bodyResponse && bodyResponse.length > 0) {
                        //set value
                        whoDetailList.value = bodyResponse;
                    }
                } else {
                    adminStore.deleteAdminCookie();
                    showToastMessage(responseData.values.error, true);
                }
            }
        }
    }

    async function initGetWhoDetailInDeny() {
        await initGetAllWhoDetail();
        if (whoDetailList.value && whoDetailList.value.length > 0) {
            for (const item of whoDetailList.value) {
                if (item.objectName === whoDetailInDeny.value.objectName) {
                    whoDetailInDeny.value.whoId = item.whoId;
                    whoDetailInDeny.value.whoDetail = item.whoDetail;
                    break;
                }
            }
        }
    }

    async function initGetWhoDetailOutDeny() {
        await initGetAllWhoDetail();
        if (whoDetailList.value && whoDetailList.value.length > 0) {
            for (const item of whoDetailList.value) {
                if (item.objectName === whoDetailOutDeny.value.objectName) {
                    whoDetailOutDeny.value.whoId = item.whoId;
                    whoDetailOutDeny.value.whoDetail = item.whoDetail;
                    break;
                }
            }
        }
    }

    async function initGetWhoDetailInWhitelist() {
        await initGetAllWhoDetail();
        if (whoDetailList.value && whoDetailList.value.length > 0) {
            for (const item of whoDetailList.value) {
                if (item.objectName === whoDetailInWhitelist.value.objectName) {
                    whoDetailInWhitelist.value.whoId = item.whoId;
                    whoDetailInWhitelist.value.whoDetail = item.whoDetail;
                    break;
                }
            }
        }
    }

    async function initGetAllSpamUser(item: IAdminTrackingCenter) {
         if (myJwt.value) {
             //reset value
             spamUserList.value.accountList = [];
             //init request
             const itemFind = {starttime: item.starttime, endtime: item.endtime} as IAdminTrackingCenter;
             //call request
             const response = await AdminQuarantineService.getAllSpamUser(itemFind, myJwt.value);
             if (response.data) {
                 const responseData: ResponseData = response.data;
                 if (!responseData.values.error) {
                     // Set giá trị
                     const bodyResponse = responseData.values as IAdminQuarantine;
                     if (t(bodyResponse.accountList).safeArray.length > 0) {
                         //set value
                         spamUserList.value.accountList.push(...bodyResponse.accountList);
                     }
                 } else {
                     adminStore.deleteAdminCookie();
                     showToastMessage(responseData.values.error, true);
                 }
             }
         }
     }

    async function initGetAllSpam(item: IAdminTrackingCenter) {
        if (myJwt.value) {
            //reset value
            quarantineList.value = [];
            //init request
            const itemFind = {from: item.from, starttime: item.starttime, endtime: item.endtime} as IAdminTrackingCenter;
            //call request
            const response = await AdminQuarantineService.getAllSpam(itemFind, myJwt.value);
            if (response.data) {
                const responseData: ResponseData = response.data;
                if (!responseData.values.error) {
                    // Set giá trị
                    const bodyResponse = responseData.values as IAdminQuarantine[];
                    if (t(bodyResponse).safeArray.length > 0) {
                        //set value
                        quarantineList.value.push(...bodyResponse);
                    }
                } else {
                    adminStore.deleteAdminCookie();
                    showToastMessage(responseData.values.error, true);
                }
            }
        }
    }

    async function initGetAllVirus(item: IAdminTrackingCenter) {
        if (myJwt.value) {
            //reset value
            quarantineList.value = [];
            //init request
            const itemFind = {starttime: item.starttime, endtime: item.endtime} as IAdminTrackingCenter;
            //call request
            const response = await AdminQuarantineService.getAllVirus(itemFind, myJwt.value);
            if (response.data) {
                const responseData: ResponseData = response.data;
                if (!responseData.values.error) {
                    // Set giá trị
                    const bodyResponse = responseData.values as IAdminQuarantine[];
                    if (t(bodyResponse).safeArray.length > 0) {
                        //set value
                        quarantineList.value.push(...bodyResponse);
                    }
                } else {
                    adminStore.deleteAdminCookie();
                    showToastMessage(responseData.values.error, true);
                }
            }
        }
    }

    function removeItemOfGetAllQuarantine(item: IAdminQuarantine){
        //find index
        const findIndex = quarantineList.value.findIndex(value => value.id === item.id);
        if(findIndex >= 0){
            //remove in list
            quarantineList.value.splice(findIndex, 1);
            //remove object selected
            quarantineContent.value = {} as IAdminQuarantine;
        }
    }

    function resetGetAllQuarantine(){
        quarantineList.value = [];
        quarantineContent.value = {} as IAdminQuarantine;
    }

    async function actionGetContent(item: IAdminQuarantine) {
        //reset value
        quarantineContent.value = {} as IAdminQuarantine;
        //init request
        const itemFind = {id: item.id} as IAdminTrackingCenter;
        //call request
        const response = await AdminQuarantineService.getContent(itemFind, adminStore.myAdminJwt);
        if (response.data) {
            const responseData: ResponseData = response.data;
            if (!responseData.values.error) {
                // Set giá trị
                quarantineContent.value = responseData.values as IAdminQuarantine;
            } else {
                showToastMessage(responseData.values.error, true);
            }
        }
    }

    async function actionDeliverContent(item: IAdminQuarantine) {
        //init request
        const itemFind = {id: item.id} as IAdminTrackingCenter;
        //call request
        const response = await AdminQuarantineService.deliverContent(itemFind, adminStore.myAdminJwt);
        if (response.data) {
            const responseData: ResponseData = response.data;
            if (responseData.values.error) {
                showToastMessage(responseData.values.error, true);
            }
        }
    }

    async function actionDeleteContent(item: IAdminQuarantine) {
        //init request
        const itemFind = {id: item.id} as IAdminTrackingCenter;
        //call request
        const response = await AdminQuarantineService.deleteContent(itemFind, adminStore.myAdminJwt);
        if (response.data) {
            const responseData: ResponseData = response.data;
            if (responseData.values.error) {
                showToastMessage(responseData.values.error, true);
            }
        }
    }

    return {
        whoDetailList,
        whoDetailInDeny,
        whoDetailOutDeny,
        whoDetailInWhitelist,
        initGetAllWhoDetail,
        initGetWhoDetailInDeny,
        initGetWhoDetailOutDeny,
        initGetWhoDetailInWhitelist,
        initGetAllSpamUser,
        initGetAllSpam,
        initGetAllVirus,
        spamUserList,
        quarantineList,
        quarantineContent,
        removeItemOfGetAllQuarantine,
        resetGetAllQuarantine,
        actionGetContent,
        actionDeliverContent,
        actionDeleteContent,
    }
});