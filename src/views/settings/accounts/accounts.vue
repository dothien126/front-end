<template>
  <div class="account-content py-3 h-full">
    <h1 class="text-base mb-3 px-5">{{ locale.account }}</h1>
    <div class="setting-gr-item border-t border-gray-20 dark:border-gray-500/30 px-5 relative">
      <sent-message class="py-5 min-h-[40vh]"></sent-message>
      <!--      <mail-setting-account-list class="border-b border-slate-300/50 dark:border-gray-600/50 pb-3 mb-3"></mail-setting-account-list>-->
      <div class="text-center sticky z-10 bottom-0 md:-bottom-[20px] inset-x-0 bg-light dark:bg-[#373a41]">
        <button class="btn btn-secondary m-2" @click="emitter.emit('on-active-folder-default')">
          {{ locale.cancel }}
        </button>
        <button class="btn text-white bg-violet-600 m-2" @click="actionSaveChange">
          {{ locale.saveChange }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import MailSettingAccountList from "@/views/settings/accounts/partial/AccountList.vue";
import {MyStore} from "@/stores/my-store";
import SentMessage from "@/views/settings/accounts/partial/SentMessage.vue";
import {User} from "@/model/User";
import {IPrefs, RequestNoResponse} from "@/model/RequestNoResponse";
import UserService from "@/service/UserService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "MailSettingAccounts",
  components: {
    MailSettingAccountList,
    SentMessage,
  },
  setup() {
    //init value
    const myStore = MyStore();
    const router = useRouter();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);
    const myUser = computed(() => myStore.myUser as User);

    async function actionSaveChange() {
      //init request
      const requestNoResponse = new RequestNoResponse();
      //init value
      const zimbraPrefFromDisplay: IPrefs = {name: 'zimbraPrefFromDisplay', value: myUser.value.zimbraPrefFromDisplay ? myUser.value.zimbraPrefFromDisplay : ''};
      const zimbraPrefFromAddress: IPrefs = {name: 'zimbraPrefFromAddress', value: myUser.value.account};
      const zimbraPrefFromAddressType: IPrefs = {
        name: 'zimbraPrefFromAddressType',
        value: 'sendAs'
      };
      const zimbraPrefReplyToEnabled: IPrefs = {
        name: 'zimbraPrefReplyToEnabled',
        value: myUser.value.zimbraPrefReplyToEnabled ? 'TRUE' : 'FALSE'
      };
      const zimbraPrefReplyToDisplay: IPrefs = {
        name: 'zimbraPrefReplyToDisplay',
        value: myUser.value.zimbraPrefReplyToDisplay && myUser.value.zimbraPrefReplyToEnabled ? myUser.value.zimbraPrefReplyToDisplay : ''
      };
      const zimbraPrefReplyToAddress: IPrefs = {
        name: 'zimbraPrefReplyToAddress',
        value: myUser.value.account
      };
      //add value to list
      requestNoResponse.prefs.push(zimbraPrefFromDisplay, zimbraPrefFromAddress, zimbraPrefFromAddressType, zimbraPrefReplyToEnabled, zimbraPrefReplyToDisplay, zimbraPrefReplyToAddress);
      //call request
      const response = await UserService.modifyPrefs(requestNoResponse, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          showToastMessage();
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    return {
      locale,
      router,
      emitter,
      actionSaveChange,
    }
  }
})

</script>

<style lang="scss"></style>