import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {ResponseData} from "@/model/ResponseData";
import {SearchRequest} from "@/model/SearchRequest";
import {showToastMessage} from "@/utils/MyFunction";
import ConversationService from "@/service/ConversationService";
import {Conversation} from "@/model/Conversation";
import {MyStore} from "@/stores/my-store";
import {ItemConversationDetail, ItemTag} from "@/model/ConversationDetail";
import {FolderStore} from "@/stores/folder-store/folder-store";
import {Folder} from "@/model/Folder";
import t from "typy";

export const ConversationStore = defineStore('myConversationStore', () => {
    //Init value
    const myStore = MyStore();
    const folderStore = FolderStore();
    const folderSelected = computed(() => folderStore.folderSelected as Folder);
    const conversation = ref<Conversation>(new Conversation());
    const selectedBox = ref<string[]>([]);
    const searchRequest = ref<SearchRequest>(new SearchRequest());
    const searchTag = ref<string[]>([]);

    function setFilterForFindConversation(find: SearchRequest) {
        searchRequest.value = new SearchRequest();
        searchRequest.value.fullConversation = find.fullConversation;
        searchRequest.value.offset = find.offset;
        searchRequest.value.limit = find.limit;
        searchRequest.value.filter = find.filter;
        searchRequest.value.sortBy = find.sortBy;
        searchRequest.value.locale = find.locale;
        searchRequest.value.types = find.types;
        searchRequest.value.recip = find.recip;
        searchRequest.value.cursor = find.cursor;
        searchRequest.value.path = folderSelected.value.folderPath;
    }

    async function getConversation() {
        if(t(searchRequest.value.filter).safeString.length > 0){
            const response = await ConversationService.find(searchRequest.value, myStore.token);
            if (response.data) {
                const responseData: ResponseData = response.data;
                //Kiểm tra backend có trả error ko
                if (responseData.values.error) {
                    // Set thông báo thất bại
                    showToastMessage(responseData.values.error, true);
                } else {
                    conversation.value = responseData.values as Conversation;
                }
            } else {
                showToastMessage(undefined, true);
            }
        }
    }

    function handleTagConversation (itemID: string, itemTag: ItemTag, op: string) {
        if (itemID) {
            for (const item of conversation.value.itemList) {
                if (item.conversationId === itemID) {
                    if (op === 'tag') {
                        // check nếu itemTag chua có trong tagList thì thêm vào
                        if (!item.tagList.find(t => t.id === itemTag.id)) {
                            item.tagList.push(itemTag) // thêm tag
                        }
                    }
                    else if (op === '!tag') {
                        item.tagList = item.tagList.filter(t => t.id !== itemTag.id) // xoá tag
                    }
                }
            }
        }
    }

    function handleFlagConversation (itemDetail: ItemConversationDetail) {
        if (itemDetail) {
            for (const item of conversation.value.itemList) {
                if (item.conversationId === itemDetail.conversationId) {
                    item.flag = itemDetail.flag;
                    return;
                }
            }
        }
    }

    return {
        conversation,
        searchRequest,
        getConversation,
        handleTagConversation,
        handleFlagConversation,
        setFilterForFindConversation,
        searchTag,
        selectedBox,
    };
});
