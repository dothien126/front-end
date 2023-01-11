<template>
  <div class="forgot-password flex flex-col items-center justify-center h-screen">
    <div class="w-96">
      <div class="bg-slate-700 p-5 rounded shadow-lg">
        <template v-if="stepFg === 1">
          <h1 class="text-xl mb-3">{{ locale.forgotPassword }}</h1>
          <div>
            <label for="mail-forgot" class="form-label">{{ locale.emailRetrievalPassword }}</label>
            <input id="mail-forgot" type="text" class="form-control" :placeholder="locale.enterMailGetPassword" v-model="emailForgot"/>
          </div>
          <button class="btn btn-primary mt-5 min-w-[5rem] w-full" @click="stepFg = 2">{{ locale.sendRequest }}</button>
        </template>
        <template v-else-if="stepFg === 2">
          <div class="text-center">
            <MailIcon class="w-12 h-12 mb-3 mx-auto text-slate-500"/>
            <h1 class="text-xl mb-3">{{ locale.checkYourEmail }}</h1>
            <p class="text-orange-300 mb-2">
              {{ locale.notifySendLink }}
            </p>
            <p class="text-base"><strong><b>{{emailForgot ? emailForgot : 'your-email@mail-forgot.vn'}}</b></strong></p>
            <div class="my-5">
              {{ locale.notifyNotReceiveEmail }} <a href="javascript:;" class="text-blue-400 hover:underline">
              {{ locale.clickResend }}</a>
            </div>
            <router-link to="/admin/login" class="btn btn-primary">
              <ArrowLeftIcon class="w-4 h-4 mr-2"/>
              {{ locale.backLoginPage }}
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import {MyStore} from "@/stores/my-store";
  export default defineComponent({
    name: 'AdminForgotPassword',
    setup() {
      // locale language
      const myStore = MyStore();
      const locale = computed(() => myStore.locale);
      const stepFg = ref(1);
      const emailForgot = ref('');
      return {
        locale,
        stepFg,
        emailForgot
      }
    }
  })
</script>

<style lang="scss">
  @import "src/assets/scss/colors";

  html.inet-mail-themes {
    &.dark {
      .forgot-password {
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