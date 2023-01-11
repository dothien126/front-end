<template>
  <div>
    <DarkModeSwitcher class="dark-mode-switcher"/>
    <div class="container">
      <!-- BEGIN: Login Form -->
      <div class="h-screen flex flex-col justify-center items-center">
        <div class="-intro-x flex items-center justify-center email-logo mb-8 max-w-[384px]"
             :class="{'flex-row': !myCompany.verticalMode, 'flex-col': myCompany.verticalMode}"
             v-if="myCompany.logo || myCompany.title">
          <iNETComponent name="AdminLogoBrandView" :alt="myCompany.title" frame-size="h-[60px] max-w-[147px] shrink-0" img-size="h-full max-h-[90px]"/>
          <div class="grow pl-3 word-break">
            <span class="text-gray-600 dark:text-slate-500 text-lg"> {{ myCompany.title }} </span>
          </div>
        </div>
        <div class="intro-x w-full sm:w-96 mx-auto py-7 px-5 bg-white dark:bg-slate-700/70 shadow-lg rounded">
          <div class="form-group">
            <input
                type="text"
                class="login__input form-control py-3 px-4 block"
                placeholder="Nhập email"
                v-model="vuelidate.email.$model"
            />
            <template v-if="vuelidate.email.$error">
              <div v-for="(error) in vuelidate.email.$errors" :key="error" class="mt-2 text-sm text-red-600">*
                {{ error.$message }}
              </div>
            </template>
            <input
                type="password"
                class="login__input form-control py-3 px-4 block mt-4"
                placeholder="Nhập mật khẩu"
                v-model="vuelidate.password.$model"
            />
            <template v-if="vuelidate.password.$error">
              <div v-for="(error) in vuelidate.password.$errors" :key="error" class="mt-2 text-sm text-red-600">*
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div class="mt-5 xl:mt-8 text-center xl:text-left">
            <button
                :disabled="isLoading"
                class="btn btn-primary py-3 px-4 w-full"
                @click="actionLogin"
            >
              {{ locale.login }} <LoadingIcon v-show="isLoading" icon="three-dots" class="ml-1 pt-1.5 w-4 h-4" />
            </button>
          </div>
        </div>
<!--        <div class="mt-10 xl:mt-24 text-slate-600 dark:text-slate-500 text-center">-->
<!--          By signin up, you agree to our-->
<!--          <a class="text-primary dark:text-slate-200" href="">Terms and Conditions</a>-->
<!--          &-->
<!--          <a class="text-primary dark:text-slate-200" href="">Privacy Policy</a>-->
<!--        </div>-->
      </div>
    </div>
  </div>
  <!-- BEGIN: Notification Toastify -->
  <NotificationToastify/>
  <!-- END: Notification Toastify -->
  <logo-and-favicon :router-path="$route.path"/>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, reactive} from 'vue';
import DarkModeSwitcher from '@/components/dark-mode-switcher/Main.vue';
import dom from '@left4code/tw-starter/dist/js/dom';
import {User} from '@/model/User';
import {showToastMessage} from '@/utils/MyFunction';
import UserService from '@/service/UserService';
import {ResponseData} from '@/model/ResponseData';
import {MyStore} from '@/stores/my-store';
import {useRouter} from 'vue-router';
import {Company} from '@/model/Company';
import {required, helpers} from "@vuelidate/validators";
import {REQUIRED} from "@/utils/MyVariables";
import useVuelidate from "@vuelidate/core";
import LogoAndFavicon from "@/components/top-bar/partial/LogoAndFavicon.vue";
import {SeoTitleStore} from "@/stores/seo-title-store/seo-title-store";

export default defineComponent({
  name: 'Login',
  components: {LogoAndFavicon, DarkModeSwitcher},
  created() {
    document.body.classList.add('login');
  },
  beforeDestroy() {
    document.body.classList.remove('login');
  },
  setup() {
    //init value
    const user = ref<User>(new User());
    const myStore = MyStore();
    const seoTitleStore = SeoTitleStore();
    const locale = computed(() => myStore.locale);
    const myCompany = computed(() => myStore.myCompany as Company);
    const router = useRouter();
    const isLoading = ref(false);
    const formData = reactive({
      email: "",
      password: "",
      persisAuth: true
    });

    // Rules
    const rules = {
      email: {
        required: helpers.withMessage(REQUIRED, required),
      },
      password: {
        required: helpers.withMessage(REQUIRED, required),
      },
    };

    // Validate
    const vuelidate = useVuelidate(rules, formData);

    async function actionLogin() {
      //Valid before submit
      vuelidate.value.$touch();
      //Init object
      if (!vuelidate.value.$invalid) {
        isLoading.value = true;
        //init request
        const itemRequest = new User();
        itemRequest.account = formData.email;
        itemRequest.password = formData.password;
        //call request
        const response = await UserService.login(itemRequest);
        setTimeout(() => {
          isLoading.value = false;
          if (response.data) {
            const responseData: ResponseData = response.data;
            //Kiểm tra backend có trả error ko
            if (responseData.values.error) {
              // Set thông báo thất bại
              showToastMessage(responseData.values.error, true);
            } else {
              const userResponse: User = responseData.values;
              if(userResponse && userResponse.jwt){
                //set cookie
                myStore.setCookie(userResponse);
                //reload page
                router.push('/');
              }
            }
          } else {
            showToastMessage(undefined, true);
          }
        }, 400);
      }
    }

    onMounted(async () => {
      dom('body').removeClass('main').removeClass('error-page').addClass('login');
      //reload seo title
      seoTitleStore.initGetSeoTitle();
    });

    return {
      user,
      locale,
      isLoading,
      myCompany,
      vuelidate,
      formData,
      actionLogin,
    };
  },
});
</script>

<style lang="scss">
html {
  &.dark {
    &.inet-mail-themes {
      .login {
        background-color: rgb(40, 51, 78);
      }

      @media screen and (max-width: 1279px) {
        .login {
          background-color: rgb(40, 51, 78);
        }
      }
    }
  }

  &.inet-mail-themes {
    .login {
      background-color: #e2e2e2;

      &:after,
      &:before {
        visibility: hidden;
      }

      .dark-mode-switcher {
        top: 1rem;
        right: 1.5rem;
        left: inherit;
        bottom: inherit;
        position: fixed;
      }
    }

    @media screen and (max-width: 1279px) {
      .login {
        background-color: #e2e2e2;
      }
    }
  }
}
</style>
