<template>
  <div class="general-content py-3">
    <h1 class="text-base mb-3 px-5">{{ locale.general }}</h1>
    <div class="setting-gr-item border-t border-gray-20 dark:border-gray-500/30 p-5 relative">
      <mail-setting-general-sigin
          class="border-b border-slate-300/50 dark:border-gray-600/50 pb-3 mb-3"></mail-setting-general-sigin>
      <mail-setting-time-zone-and-language
          class="border-b border-slate-300/50 dark:border-gray-600/50 pb-3 mb-3"></mail-setting-time-zone-and-language>
      <mail-seting-general-search/>
<!--      <mail-seting-general-other-->
<!--          class="border-b border-slate-300/50 dark:border-gray-600/50 pb-3 mb-3"></mail-seting-general-other>-->
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
import {computed, defineComponent} from "vue";
import MailSettingGeneralSigin from "@/views/settings/general/partial/Signin.vue";
import MailSettingTimeZoneAndLanguage from "@/views/settings/general/partial/TimeZoneAndLanguage.vue";
import MailSetingGeneralSearch from "@/views/settings/general/partial/Search.vue";
import MailSetingGeneralOther from "@/views/settings/general/partial/Other.vue";
import {MyStore} from "@/stores/my-store";
import {IPrefs, RequestNoResponse} from "@/model/RequestNoResponse";
import UserService from "@/service/UserService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "MailSettingGeneral",
  components: {
    MailSetingGeneralOther,
    MailSetingGeneralSearch, MailSettingGeneralSigin, MailSettingTimeZoneAndLanguage
  },
  setup() {
    //init value
    const myStore = MyStore();
    const router = useRouter();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);
    const myUser = computed(() => myStore.myUser);

    async function actionSaveChange() {
      //init request
      const requestNoResponse = new RequestNoResponse();
      //init value
      const clientType: IPrefs = {name: 'zimbraPrefClientType', value: myUser.value.clientType};
      const timeZone: IPrefs = {name: 'zimbraPrefTimeZoneId', value: myUser.value.timeZone};
      const language: IPrefs = {name: 'zimbraPrefLocale', value: myUser.value.language};
      const composeDirection: IPrefs = {name: 'zimbraPrefComposeDirection', value: myUser.value.composeDirection};
      const showDirectionButtonInCompose: IPrefs = {
        name: 'zimbraPrefShowComposeDirection',
        value: myUser.value.showDirectionButtonInCompose ? 'TRUE' : 'FALSE'
      };
      const includeSpamFolder: IPrefs = {
        name: 'zimbraPrefIncludeSpamInSearch',
        value: myUser.value.includeSpamFolderInSearch ? 'TRUE' : 'FALSE'
      };
      const includeTrashFolder: IPrefs = {
        name: 'zimbraPrefIncludeTrashInSearch',
        value: myUser.value.includeTrashFolderInSearch ? 'TRUE' : 'FALSE'
      };
      const includeSharedFolder: IPrefs = {
        name: 'zimbraPrefIncludeSharedItemsInSearch',
        value: myUser.value.includeSharedFolderInSearch ? 'TRUE' : 'FALSE'
      };
      const showSelectCheckbox: IPrefs = {
        name: 'zimbraPrefShowSelectionCheckbox',
        value: myUser.value.displayCheckboxInSelectedItem ? 'TRUE' : 'FALSE'
      };
      const displayName: IPrefs = {
        name: 'zimbraPrefShortEmailAddress',
        value: myUser.value.displayNameInEmailAddress ? 'TRUE' : 'FALSE'
      };
      //add value to list
      requestNoResponse.prefs.push(clientType, timeZone, language, composeDirection, showDirectionButtonInCompose, includeSpamFolder, includeTrashFolder, includeSharedFolder, showSelectCheckbox, displayName);
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
      myUser,
      emitter,
      actionSaveChange,
    }
  }
})

</script>

<style lang="scss">

</style>