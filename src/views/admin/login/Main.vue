<template>
  <div class="admin-login flex flex-col items-center justify-center h-screen">
    <div class="w-96">
      <div class="login-content w-full">
        <div class="bg-slate-700 p-5 rounded shadow-lg">
          <div class="form-inline">
            <label for="email" class="form-label sm:w-20">{{ locale.account }}</label>
            <input id="email" type="text" v-model="formInput.account" class="form-control"/>
          </div>
          <div class="form-inline mt-5">
            <label for="horizontal-form-2" class="form-label sm:w-20">{{ locale.password }}</label>
            <input id="horizontal-form-2" type="password" v-model="formInput.password" class="form-control"/>
          </div>
          <div class="sm:ml-20 sm:pl-5 mt-5">
            <button class="btn btn-primary w-full" @click="actionLogin">{{ locale.login }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- BEGIN: Notification Toastify -->
  <NotificationToastify/>
  <!-- END: Notification Toastify -->
  <logo-and-favicon :router-path="$route.path"/>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import iNETLogo from '@/assets/images/logo-demo.png';
import {IAdminUser} from "@/model/admin/IAdminUser";
import AdminUserService from "@/service/admin/AdminUserService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {useRouter} from "vue-router";
import {MyStore} from "@/stores/my-store";
import LogoAndFavicon from "@/components/top-bar/partial/LogoAndFavicon.vue";

export default defineComponent({
  name: 'AdminLogin',
  components: {LogoAndFavicon},
  setup() {
    //init value
    const myAdminStore = MyAdminStore();
    const router = useRouter();
    // locale language
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const formInput = ref({
      account: '',
      password: '',
    });

    async function actionLogin() {
      //validate
      if (formInput.value.account && formInput.value.password) {
        //init value
        const myAdmin = {password: '', account: ''} as IAdminUser;
        myAdmin.account = formInput.value.account;
        myAdmin.password = formInput.value.password;
        //call request
        const response = await AdminUserService.authRequest(myAdmin);
        if (response.data) {
          const responseData: ResponseData = response.data;
          if (!responseData.values.error) {
            // Set giá trị
            const bodyResponse = responseData.values as IAdminUser;
            if(bodyResponse && bodyResponse.jwt){
              //set cookie
              myAdminStore.setAdminCookie(bodyResponse);
              //reload page
              await router.push('/admin/dashboard');
            }
          } else {
            showToastMessage(responseData.values.error, true);
          }
        }
      }
    }

    return {
      locale,
      iNETLogo,
      formInput,
      actionLogin
    }
  }
})
</script>

<style lang="scss">
@import "src/assets/scss/colors";

html.inet-mail-themes {
  &.dark {
    .admin-login {
      background-color: get-color(slate, 800);
      background-image: url("/src/assets/images/admin-login-bg.jpg");
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-blend-mode: overlay;
    }
  }
}
</style>