import {defineStore} from "pinia";
import {ref} from "vue";
import {IAdminUser} from "@/model/admin/IAdminUser";
import {env} from "@/utils/MyVariables";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import AdminNoOpService from "@/service/admin/AdminNoOpService";
import {IAdminCompanyUser} from "@/model/admin/dto/IAdminCompanyUser";
import AdminUserService from "@/service/admin/AdminUserService";
import {Company} from "@/model/Company";

export const MyAdminStore = defineStore('myAdminStore', () => {
    const myAdminJwt = ref('');
    const myAdminHasLogged = ref(false);
    const myAdminCompanyUser = ref<IAdminCompanyUser>({} as IAdminCompanyUser);
    //Cookie
    function setAdminCookie(user: IAdminUser) {
        if (user.jwt) {
            const d = new Date();
            d.setTime(user.lifetime);
            const expires = d.toUTCString();
            // Set it
            document.cookie = env.nameAdminCookie + '=' + user.jwt + '; expires=' + expires + '; path=/';
        }
    }

    // Delete cookie
    function deleteAdminCookie() {
        const date = new Date();
        // Set it expire in -1 days
        date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);
        // Set it
        document.cookie = env.nameAdminCookie + '=; expires=' + date.toUTCString() + '; path=/';
        //reset token
        myAdminJwt.value = '';
        //reset logged
        myAdminHasLogged.value = false;
    }

    // get cookie
    function getAdminCookie() {
        const value = '; ' + document.cookie;
        const parts = value.split('; ' + env.nameAdminCookie + '=');

        if (parts.length == 2) {
            myAdminJwt.value = parts.pop()!.split(';').shift() as string;
        } else {
            myAdminJwt.value = '';
        }
    }

    //method
    async function tryAuthOnce() {
        if (myAdminJwt.value) {
            //call request
            const response = await AdminNoOpService.noOpRequest(myAdminJwt.value);
            if (response.data) {
                const responseData: ResponseData = response.data;
                if (!responseData.values.error) {
                    // Set giá trị
                    const bodyResponse = responseData.values as any;
                    myAdminHasLogged.value = !!(bodyResponse && bodyResponse._jsns);
                    if(!myAdminHasLogged.value){
                        deleteAdminCookie();
                    }
                } else {
                    deleteAdminCookie();
                    showToastMessage(responseData.values.error, true);
                }
            }
        }
    }

    async function getAdminCompanyUser() {
        if(myAdminJwt.value){
            //call request
            const response = await AdminUserService.getCompanyUser(myAdminJwt.value);
            if (response.data) {
                const responseData: ResponseData = response.data;
                if (!responseData.values.error) {
                    // Set giá trị
                    const bodyResponse = responseData.values as IAdminCompanyUser;
                    if(bodyResponse.adminEmail){
                        myAdminCompanyUser.value = bodyResponse;
                    }
                } else {
                    showToastMessage(responseData.values.error, true);
                }
            }
        }
    }

    function setAdminCompanyUser(data: Company){
        myAdminCompanyUser.value.companyTitle = data.title;
        myAdminCompanyUser.value.companyLogo = data.logo;
        myAdminCompanyUser.value.companyLogoDarkMode = data.logoDarkMode;
    }

    return{
        myAdminJwt,
        myAdminHasLogged,
        myAdminCompanyUser,
        setAdminCookie,
        deleteAdminCookie,
        getAdminCookie,
        tryAuthOnce,
        getAdminCompanyUser,
        setAdminCompanyUser,
    }
});