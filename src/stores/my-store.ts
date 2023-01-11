import {defineStore} from 'pinia';
import {getCurrentInstance, ref} from 'vue';
import {ToastMessageDto} from '@/model/dto/ToastMessageDto';
import {User} from '@/model/User';
import {env} from '@/utils/MyVariables';
import {dict_en} from '@/locales/dict.en';
import {dict_vn} from '@/locales/dict.vn';
import UserService from "@/service/UserService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {Company} from "@/model/Company";
import {AlertReplyMail} from "@/model/dto/AlertReplyMail";
import CompanyService from "@/service/CompanyService";
import NoOpService from "@/service/NoOpService";

export const MyStore = defineStore('myStore', () => {
    //Init value
    const myUserHasLogged = ref(false);
    const token = ref('');
    const toastMessageDto = ref<ToastMessageDto>(new ToastMessageDto());
    const toastMessageHtml = ref<HTMLElement | any>();
    const locale = ref(dict_vn);
    const myUser = ref<User>(new User());
    const myCompany = ref<Company>(new Company());
    const showMessage = ref<ToastMessageDto>(new ToastMessageDto());
    const alertReplyMail = ref<AlertReplyMail>(new AlertReplyMail());
    const logoLightMode = ref(env.hostServer + 'api/company/show-logo/light-mode');
    const logoDarkMode = ref(env.hostServer + 'api/company/show-logo/dark-mode');
    //init method
    setLocale();
    reloadLogo();

    //Logo
    function reloadLogo() {
        logoDarkMode.value = env.hostServer + 'api/company/show-logo/dark-mode?cache=' + new Date().getTime();
        logoLightMode.value = env.hostServer + 'api/company/show-logo/light-mode?cache=' + new Date().getTime();
    }

    //Locale
    function setLocale() {
        //get store
        const localStorageLocale = localStorage.getItem('localeZimbraWebmail');
        //init set value dict
        localStorage.setItem('localeZimbraWebmail', localStorageLocale ? localStorageLocale : 'vn');

        //check
        if (localStorageLocale === 'vn') {
            locale.value = dict_vn;

        } else if (localStorageLocale === 'en') {
            // @ts-ignore
            locale.value = dict_en;

        }
    }

    //Cookie
    function setCookie(user: User) {
        if (user.jwt) {
            const d = new Date();
            d.setTime(user.lifetime);
            const expires = d.toUTCString();
            // Set it
            document.cookie = env.nameCookie + '=' + user.jwt + '; expires=' + expires + '; path=/';
        }
    }

    function deleteCookie() {
        const date = new Date();
        // Set it expire in -1 days
        date.setTime(date.getTime() + -1 * 24 * 60 * 60 * 1000);
        // Set it
        document.cookie = env.nameCookie + '=; expires=' + date.toUTCString() + '; path=/';
        //reset token
        token.value = '';
        //reset logged
        myUserHasLogged.value = false;
    }

    // get cookie
    function getCookie() {
        const value = '; ' + document.cookie;
        const parts = value.split('; ' + env.nameCookie + '=');

        if (parts.length == 2) {
            token.value = parts.pop()!.split(';').shift() as string;
        } else {
            token.value = '';
        }
    }

    //method
    async function tryUserAuthOnce() {
        if (token.value) {
            //call request
            const response = await NoOpService.noOpRequest(token.value);
            if (response.data) {
                const responseData: ResponseData = response.data;
                if (!responseData.values.error) {
                    // Set giá trị
                    const bodyResponse = responseData.values as any;
                    myUserHasLogged.value = !!(bodyResponse && bodyResponse._jsns);
                    if (!myUserHasLogged.value) {
                        deleteCookie();
                    }
                } else {
                    deleteCookie();
                    showToastMessage(responseData.values.error, true);
                }
            }
        }
    }

    function setUser(user: User) {
        myUser.value = user;
    }

    async function getUser() {
        //logic
        if (token.value) {
            //init request
            const itemRequest = new User();
            //call request
            const response = await UserService.findOneByToken(itemRequest, token.value);
            if (response.data) {
                const responseData: ResponseData = response.data;
                if (!responseData.values.error) {
                    // Set giá trị
                    myUser.value = responseData.values;
                } else {
                    deleteCookie();
                    showToastMessage(responseData.values.error, true);
                }
            }
        }
    }

    async function updateUser(user: User, token: string) {
        //call request
        const response = await UserService.update(user, token);
        if (response.data) {
            const responseData: ResponseData = response.data;
            if (!responseData.values.error) {
                // Set giá trị
                myUser.value = responseData.values as User;
            } else {
                // Set thông báo thất bại
                showToastMessage(responseData.values.error, true);
            }
        }
    }

    //Company
    async function getCompany() {
        //init request
        const itemRequest = new Company();
        itemRequest.webmail = location.hostname;
        //call request
        const response = await CompanyService.findOne(itemRequest);
        if (response.data) {
            const responseData: ResponseData = response.data;
            if (!responseData.values.error) {
                // Set giá trị
                myCompany.value = responseData.values;
            } else {
                // Set thông báo thất bại
                showToastMessage(responseData.values.error, true);
            }
        }
    }

    //conversation
    function useEmitter() {
        const internalInstance = getCurrentInstance();
        if (internalInstance) {
            return internalInstance.appContext.config.globalProperties.emitter;
        } else {
            return '';
        }
    }

    return {
        logoDarkMode,
        logoLightMode,
        showMessage,
        tryUserAuthOnce,
        myUserHasLogged,
        setCookie,
        deleteCookie,
        getCookie,
        token,
        toastMessageDto,
        toastMessageHtml,
        locale,
        reloadLogo,
        setLocale,
        setUser,
        getUser,
        getCompany,
        myUser,
        myCompany,
        useEmitter,
        alertReplyMail,
        updateUser,
    };
});
