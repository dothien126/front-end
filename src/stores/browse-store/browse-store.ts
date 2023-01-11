import {defineStore} from "pinia";
import {MyStore} from "@/stores/my-store";
import {ref} from "vue";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {IBrowseResponse} from "@/model/interface/IBrowseResponse";
import {IBrowseRequest} from "@/model/interface/IBrowseRequest";
import BrowseService from "@/service/BrowseService";

export const MyBrowseStore = defineStore('myBrowseStore', () => {
    //init value
    const myStore = MyStore();
    const bodyRequest = ref<IBrowseRequest>({
        browseBy: 'domains',
        maxToReturn: 100,
    } as IBrowseRequest);
    const myBrowseList = ref<IBrowseResponse>({bd: []} as IBrowseResponse);

    // Lay danh sach filter rule
    async function initGetBrowseList() {
        if (myStore.token) {
            //reset value
            myBrowseList.value.bd = [];
            //call request
            const response = await BrowseService.browseRequest(bodyRequest.value, myStore.token);
            if (response.data) {
                const responseData: ResponseData = response.data;
                //Kiểm tra backend có trả error ko
                if (responseData.values.error) {
                    // Set thông báo thất bại
                    showToastMessage(responseData.values.error, true);
                } else {
                    const datas = responseData.values as IBrowseResponse;
                    //logic set to list
                    if (datas && datas.bd && datas.bd.length > 0) {
                        myBrowseList.value.bd.push(...datas.bd);
                    }
                }
            } else {
                showToastMessage(undefined, true);
            }
        }
    }

    return {
        bodyRequest,
        myBrowseList,
        initGetBrowseList,
    }
});