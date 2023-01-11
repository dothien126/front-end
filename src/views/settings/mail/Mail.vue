<template>
  <div class="mail-content py-3 h-full">
    <h1 class="text-base mb-3 px-5">{{ locale.mailSetting }}</h1>
    <div class="setting-gr-item border-t border-gray-20 dark:border-gray-500/30 px-5 relative h-full flex flex-col">
      <send-later class="border-b border-slate-300/50 dark:border-gray-600/50 py-5"></send-later>
      <receiving-message class="border-b border-slate-300/50 dark:border-gray-600/50 py-5"></receiving-message>
      <mail-setting-spam-option class="py-5" :white-black-list="whiteBlackList"></mail-setting-spam-option>
      <div class="text-center mt-5 sticky z-10 bottom-0 inset-x-0 bg-white dark:bg-[#373a41]">
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
import {computed, defineComponent, ref} from "vue";
import MailSettingSpamOption from "@/views/settings/mail/partial/MailSpamOptions.vue";
import {MyStore} from "@/stores/my-store";
import {WhiteBlackList} from "@/model/WhiteBlackList";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import MailOptionService from "@/service/MailOptionService";
import ReceivingMessage from "@/views/settings/mail/partial/ReceivingMessage.vue";
import SendLater from "@/views/settings/mail/partial/SendLater.vue";
import {IPrefs, RequestNoResponse} from "@/model/RequestNoResponse";
import UserService from "@/service/UserService";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "MailSettingMail",
  components: { MailSettingSpamOption, ReceivingMessage, SendLater },
  setup(){
    //init value
    const myStore = MyStore();
    const router = useRouter();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);
    const myUser = computed(() => myStore.myUser);
    const whiteBlackList = ref<WhiteBlackList>(new WhiteBlackList());

    async function actionSaveChange() {
      //init request Receiving message
      const requestNoResponse = new RequestNoResponse();
      //init value
      const zimbraPrefMailForwardingAddress: IPrefs = {name: 'zimbraPrefMailForwardingAddress', value: myUser.value.zimbraPrefMailForwardingAddress ? myUser.value.zimbraPrefMailForwardingAddress : ''};
      const zimbraPrefMailLocalDeliveryDisabled: IPrefs = {name: 'zimbraPrefMailLocalDeliveryDisabled', value: myUser.value.zimbraPrefMailLocalDeliveryDisabled ? 'TRUE' : 'FALSE'};
      const zimbraPrefNewMailNotificationAddress: IPrefs = {
        name: 'zimbraPrefNewMailNotificationAddress',
        value: myUser.value.zimbraPrefNewMailNotificationAddress ? myUser.value.zimbraPrefNewMailNotificationAddress : ''
      };
      const zimbraPrefNewMailNotificationEnabled: IPrefs = {
        name: 'zimbraPrefNewMailNotificationEnabled',
        value: myUser.value.zimbraPrefNewMailNotificationEnabled ? 'TRUE' : 'FALSE'
      };
      //add value to list
      requestNoResponse.prefs.push(zimbraPrefMailForwardingAddress, zimbraPrefMailLocalDeliveryDisabled, zimbraPrefNewMailNotificationAddress, zimbraPrefNewMailNotificationEnabled);
      //call request
      const responseReceivingMessage = await UserService.modifyPrefs(requestNoResponse, myStore.token);
      if (responseReceivingMessage.data) {
        const responseData: ResponseData = responseReceivingMessage.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        }
      } else {
        showToastMessage(undefined, true);
      }
      //call request modify Spam mail options
      const response = await MailOptionService.modifyWhiteBlackList(whiteBlackList.value, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        }
      } else {
        showToastMessage(undefined, true);
      }
      //call request modify send later
      const responseSendLater = await UserService.update(myUser.value, myStore.token);
      if (responseSendLater.data) {
        const responseData: ResponseData = responseSendLater.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        }
        else{
          showToastMessage();
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    return{
      locale,
      router,
      myUser,
      emitter,
      whiteBlackList,
      actionSaveChange,
    }
  }
})

</script>

<style lang="scss">

</style>