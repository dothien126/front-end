import {defineStore} from "pinia";
import {MyStore} from "@/stores/my-store";
import {ref} from "vue";
import {Folder} from "@/model/Folder";
import FolderService from "@/service/FolderService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {Contact} from "@/model/Contact";
import {SearchRequest} from "@/model/SearchRequest";
import ContactService from "@/service/ContactService";
import {firstBy} from "thenby";
import {RequestNoResponse} from "@/model/RequestNoResponse";

export const MyContactStore = defineStore('myContactStore', () => {
    //init value
    const myStore = MyStore();
    const contactData = ref<Contact>(new Contact());
    const myContactList = ref<Folder[]>([]);
    const myCreateContactList = ref<Folder[]>([]);
    const contactFolderSelected = ref<Folder>(new Folder());
    const createContactFolderSelected = ref<Folder>(new Folder());
    const isContactSearch = ref(false)

    function sortFolderBeforeShow(foldersResponse: Folder[]){
        foldersResponse.sort(firstBy((v1: Folder) => {
            if(v1.name === 'Contacts'){
                return -1;
            }
            else{
                return 0;
            }
        }).thenBy((v1 : Folder) => {
            if(v1.name === 'Emailed Contacts'){
                return -1;
            }
            else{
                return 0;
            }
        }).thenBy((v1 : Folder) => {
            if(v1.name === 'Mail Group'){
                return -1;
            }
            else{
                return 0;
            }
        }));
    }

    async function initGetContactList() {
        if(myStore.token){
            //reset value
            myContactList.value = [];
            myCreateContactList.value = [];
            //init request
            const itemFind = new Folder();
            itemFind.view = 'contact';
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
                    //add clone folder distribution group
                    const distributionFolder = new Folder();
                    distributionFolder.id = 'distributionFolderId';
                    distributionFolder.folderId = 'distributionFolderFolderId';
                    distributionFolder.iconName = 'book';
                    distributionFolder.folderPath = '/DistributionList';
                    distributionFolder.label = 'mailgroup';
                    distributionFolder.name = 'mailgroup';
                    //sort
                    sortFolderBeforeShow(foldersResponse);
                    //Chi lay cac loai folder ben duoi
                    myContactList.value.push(...foldersResponse, distributionFolder);
                    //create contact list cung lay tuong tu tru distribution list
                    myCreateContactList.value.push(...foldersResponse);
                }
            } else {
                showToastMessage(undefined, true);
            }
        }
    }

    async function actionContactRequest(item: RequestNoResponse, hasDeleteItemContact: boolean) {
        //call request
        const response = await ContactService.action(item, myStore.token);
        if (response.data) {
            const responseData: ResponseData = response.data;
            //Kiểm tra backend có trả error ko
            if (responseData.values.error) {
                // Set thông báo thất bại
                showToastMessage(responseData.values.error, true);
            } else {
                if(hasDeleteItemContact){
                    //find id
                    const findIndex = contactData.value.itemList.findIndex(values => values.id === item.itemId);
                    if(findIndex >= 0){
                        contactData.value.itemList.splice(findIndex, 1);
                    }
                }
            }
        } else {
            showToastMessage(undefined, true);
        }
    }

    //Contact
    async function getContactData(offsetContact: number, isFindInput: boolean, findContactInput: string, typeContactSelected: string) {
        //reset value
        contactData.value = new Contact();
        //init request
        const itemFind = new SearchRequest();
        itemFind.offset = String(offsetContact);
        itemFind.sortBy = 'nameAsc';
        itemFind.filter = isFindInput ? findContactInput : typeContactSelected;
        itemFind.types = 'contact';
        //call request
        const response = await ContactService.find(itemFind, myStore.token);
        if (response.data) {
            const responseData: ResponseData = response.data;
            //Kiểm tra backend có trả error ko
            if (responseData.values.error) {
                // Set thông báo thất bại
                showToastMessage(responseData.values.error, true);
            } else {
                const contactResponse = responseData.values as Contact;
                contactData.value.hasMore = contactResponse.hasMore;
                contactData.value.itemList.push(...contactResponse.itemList);
            }
        } else {
            showToastMessage(undefined, true);
        }
    }

    async function actionFindContactByInput(offsetContact: number, findContactInput: string, typeContactSelected: string) {
        //reset value
        offsetContact = 0;
        if (findContactInput.length > 1) {
            //reload data
            await getContactData(offsetContact, true, findContactInput, typeContactSelected);
        } else {
            //reload data
            await getContactData(offsetContact, false, findContactInput, typeContactSelected);
        }
    }

    return {
        initGetContactList,
        myContactList,
        myCreateContactList,
        contactFolderSelected,
        createContactFolderSelected,
        contactData,
        getContactData,
        actionContactRequest,
        actionFindContactByInput,
        isContactSearch
    }
});