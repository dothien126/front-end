import {defineStore} from "pinia";
import {MyStore} from "@/stores/my-store";
import {ref} from "vue";
import {Tag} from "@/model/Tag";
import TagService from "@/service/TagService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";

export const MyTagStore = defineStore('myTagStore', () => {
    //init value
    const myStore = MyStore();
    const tagList = ref<Tag[]>([]);
    const tagSelected = ref<Tag>(new Tag());

    async function initGetTagList() {
        //reset value
        tagList.value = [];
        //init request
        const itemFind = new Tag();
        //call request
        const response = await TagService.getTag(itemFind, myStore.token);
        if (response.data) {
            const responseData: ResponseData = response.data;
            //Kiểm tra backend có trả error ko
            if (responseData.values.error) {
                // Set thông báo thất bại
                showToastMessage(responseData.values.error, true);
            } else {
                const bodyResponse: Tag[] = responseData.values;
                //set item to store
                tagList.value.push(...bodyResponse);
            }
        } else {
            showToastMessage(undefined, true);
        }
    }

    return {
        tagList,
        tagSelected,
        initGetTagList,
    }
} );