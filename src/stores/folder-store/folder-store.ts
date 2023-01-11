import {defineStore} from "pinia";
import {MyStore} from "@/stores/my-store";
import {Folder} from "@/model/Folder";
import {computed, ref} from "vue";
import FolderService from "@/service/FolderService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {firstBy} from "thenby";
import {t} from "typy";

export const FolderStore = defineStore('folderStore', () => {
    //init value
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const calendarFolder = ref<Folder>(new Folder()); //Vi khong duoc de calendar xuat hien cay thu muc nen phai tach rieng trong danh sach folder list tra ve
    const myFolderList = ref<Folder[]>([]);
    const myFolderListHasRoot = ref<Folder[]>([]);
    const folderSelected = ref<Folder>(new Folder());

    function sortFolderBeforeShow(foldersResponse: Folder[]){
        foldersResponse.sort(firstBy((v1: Folder) => {
            if(v1.name === 'Inbox'){
                return -1;
            }
            else{
                return 0;
            }
        }).thenBy((v1 : Folder) => {
            if(v1.name === 'Sent'){
                return -1;
            }
            else{
                return 0;
            }
        }).thenBy((v1 : Folder) => {
            if(v1.name === 'Drafts'){
                return -1;
            }
            else{
                return 0;
            }
        }).thenBy((v1 : Folder) => {
            if(v1.name === 'Junk'){
                return -1;
            }
            else{
                return 0;
            }
        }).thenBy((v1 : Folder) => {
            if(v1.name === 'Trash'){
                return -1;
            }
            else{
                return 0;
            }
        }).thenBy((v1 : Folder) => {
            if(v1.name === 'Chats'){
                return -1;
            }
            else{
                return 0;
            }
        }).thenBy((v1 : Folder) => {
            if(v1.name === 'Calendar'){
                return -1;
            }
            else{
                return 0;
            }
        }));
    }

    async function initGetFolder() {
        if(myStore.token){
            //reset value
            //myFolderList.value = [];
            //init request
            const itemFind = new Folder();
            itemFind.view = 'message';
            //call request
            const response = await FolderService.find(itemFind, myStore.token);
            if (response.data) {
                const responseData: ResponseData = response.data;
                //Kiểm tra backend có trả error ko
                if (responseData.values.error) {
                    // Set thông báo thất bại
                    showToastMessage(responseData.values.error, true);
                } else {
                    const foldersResponse: Folder[] = responseData.values;
                    //Tim calendar folder
                    if(foldersResponse && foldersResponse.length > 0){
                        const findCalendarFolder = foldersResponse.find(value => value.folderPath === '/Calendar');
                        if(findCalendarFolder){
                            calendarFolder.value = findCalendarFolder;
                        }
                    }
                    //sort
                    sortFolderBeforeShow(foldersResponse);
                    //Chi lay cac loai folder ben duoi
                    myFolderList.value = foldersResponse.filter(value => (value.view === 'message' || value.folderPath === '/Trash') && value.folderPath !== '/Chats');
                }
            } else {
                showToastMessage(undefined, true);
            }
        }
    }

    async function initGetFolderHasRoot() {
       if(myStore.token){
           //reset value
           myFolderListHasRoot.value = [];
           //init request
           const itemFind = new Folder();
           itemFind.view = 'message';
           //call request
           const response = await FolderService.listCreateFolder(itemFind, myStore.token);
           if (response.data) {
               const responseData: ResponseData = response.data;
               //Kiểm tra backend có trả error ko
               if (responseData.values.error) {
                   // Set thông báo thất bại
                   showToastMessage(responseData.values.error, true);
               } else {
                   const foldersResponse: Folder[] = responseData.values;
                   if (foldersResponse && foldersResponse.length > 0){
                       foldersResponse[0].label = locale.value.rootPath;
                       //sort
                       sortFolderBeforeShow(foldersResponse[0].nodes);
                       //add to list
                       myFolderListHasRoot.value.push(...foldersResponse);
                   }
               }
           } else {
               showToastMessage(undefined, true);
           }
       }
    }

    async function reloadDataUnreadCountFolder() {
        if(myStore.token){
            //init request
            const itemFind = new Folder();
            itemFind.view = 'message';
            //call request
            const response = await FolderService.getArrayFolder(itemFind, myStore.token);
            if (response.data) {
                const responseData: ResponseData = response.data;
                //Kiểm tra backend có trả error ko
                if (responseData.values.error) {
                    // Set thông báo thất bại
                    showToastMessage(responseData.values.error, true);
                } else {
                    const foldersResponse: Folder[] = responseData.values;
                    //Chi lay cac loai folder ben duoi
                    const arrayFolder = foldersResponse.filter(value => (value.view === 'message' || value.folderPath === '/Trash') && value.folderPath !== '/Chats');
                    //Duyet tung phan tu trong list folder tra ve
                    if(t(arrayFolder).safeArray.length > 0){
                        for(const item of arrayFolder){
                            //duyet tung phan tu trong folder dang hien thi tren client
                            for(const root of myFolderList.value){
                                accessNestedObjectAndReloadUnreadCount(item, root);
                            }
                        }
                    }
                }
            } else {
                showToastMessage(undefined, true);
            }
        }
    }

    //function de quy
    function accessNestedObjectAndReloadUnreadCount(item: Folder, root: Folder) {
        //Neu root = item ==> update luon
        if(item.folderId === root.folderId){
            root.unreadCount = item.unreadCount;
        }
        //Neu root khong co child ===> return
        if (t(root.nodes).safeArray.length <= 0) {
            return;
        }
        //Neu root co child ===> su dung de quy de update
        root.nodes.forEach((child: Folder) => {
            if(item.folderId === child.folderId){
                child.unreadCount = item.unreadCount;
            }
            accessNestedObjectAndReloadUnreadCount(item, child);
        });
    }

    return {
        myFolderList,
        myFolderListHasRoot,
        initGetFolder,
        initGetFolderHasRoot,
        calendarFolder,
        folderSelected,
        reloadDataUnreadCountFolder,
    }
});
