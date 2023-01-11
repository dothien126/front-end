import {defineStore} from "pinia";
import {computed, ref} from "vue";
import {IAdminUserManager, IUserAccount} from "@/model/admin/dto/IAdminUserManager";
import {IPagination} from "@/model/interface/IPagination";
import AdminUserManagerService from "@/service/admin/AdminUserManagerService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {RANGE_PAGE_SIZE} from "@/utils/MyVariables";
import AdminAccountService from "@/service/admin/AdminAccountService";
import {User} from "@/model/User";

export const AdminUserManagerStore = defineStore('adminUserManagerStore', () => {
    //init value
    const adminStore = MyAdminStore();
    const myJwt = computed(() => adminStore.myAdminJwt);
    //get all account
    const allAccountList = ref<IAdminUserManager>({
        userList: [] as IUserAccount[],
        pagination: {} as IPagination
    } as IAdminUserManager);
    //user manager list (by page)
    const numberPage = ref(1);
    const pageSize = ref(RANGE_PAGE_SIZE[0]);
    const statusAccount = ref('');
    const nameAccount = ref('');
    const userManager = ref<IAdminUserManager>({
        userList: [] as IUserAccount[],
        pagination: {} as IPagination,
    });
    //user trash
    const userTrashList = ref<User[]>([] as User[]);
    const nameUserTrash = ref('');

    //method
    async function initGetAllAccount() {
        //call request
        const response = await AdminAccountService.getAllAccount(myJwt.value);
        if (response.data) {
            const responseData: ResponseData = response.data;
            if (!responseData.values.error) {
                // Set giá trị
                const bodyResponse = responseData.values as IAdminUserManager;
                if (bodyResponse && bodyResponse.userList) {
                    //set value
                    allAccountList.value = bodyResponse;
                }
            } else {
                showToastMessage(responseData.values.error, true);
            }
        }
    }

    async function initGetUserManagerList() {
        //init request
        const itemFind = {
            pagination: {
                number: numberPage.value,
                size: pageSize.value,
                sortBy: "name",
                sortAscending: "1",
                query: statusAccount.value + nameAccount.value,
            }
        } as IAdminUserManager;
        //call request
        const response = await AdminUserManagerService.findUserByPage(itemFind, myJwt.value);
        if (response.data) {
            const responseData: ResponseData = response.data;
            if (!responseData.values.error) {
                // Set giá trị
                const bodyResponse = responseData.values as IAdminUserManager;
                if (bodyResponse && bodyResponse.userList) {
                    //set value
                    userManager.value = bodyResponse;
                }
            } else {
                showToastMessage(responseData.values.error, true);
            }
        }
    }

    async function initGetAllUserTrash() {
        //call request
        let searchUser = new User();
        if(nameUserTrash.value){
            searchUser.account = nameUserTrash.value;
        }
        const response = await AdminUserManagerService.findAllUserTrashByDomain(searchUser, myJwt.value);
        if (response.data) {
            const responseData: ResponseData = response.data;
            if (!responseData.values.error) {
                // Set giá trị
                const bodyResponse = responseData.values as User[];
                if (bodyResponse) {
                    //set value
                    userTrashList.value = bodyResponse;
                }
            } else {
                showToastMessage(responseData.values.error, true);
            }
        }
    }

    return {
        userManager,
        allAccountList,
        numberPage,
        pageSize,
        statusAccount,
        nameAccount,
        nameUserTrash,
        userTrashList,
        initGetAllAccount,
        initGetUserManagerList,
        initGetAllUserTrash,
    }
});