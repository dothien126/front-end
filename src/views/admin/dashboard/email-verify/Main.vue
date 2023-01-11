<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
    <div class="lg:col-span-6">
      <div class="bg-white dark:bg-darkmode-600 rounded p-5">
        <p class="text-base mb-3">{{ locale.informationConfig }}</p>
        <ul>
          <li class="py-2">
            <h5>{{ locale.domain }}</h5>
            <p class="font-medium ml-1 px-2 py-1 border-l-2 dark:border-slate-300 break-words">
              {{ myAdminCompanyUser.domain }}
            </p>
          </li>
          <li class="py-2">
            <h5>{{ locale.serverSendMail }}</h5>
            <p class="font-medium ml-1 px-2 py-1 border-l-2 dark:border-slate-300 break-words">
              {{ myAdminCompanyUser.zimbraHost }}
            </p>
          </li>
          <li class="py-2">
            <h5>{{ locale.serverReceiveMail }}</h5>
            <p class="font-medium ml-1 px-2 py-1 border-l-2 dark:border-slate-300 break-words">
              {{ myAdminCompanyUser.zimbraHost }}
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="lg:col-span-6">
      <div class="bg-white rounded p-5 dark:bg-darkmode-600 h-full">
        <div class="flex flex-col md:flex-row items-center mb-3">
          <p class="text-base grow">{{ locale.informationResource }}</p>
<!--  TODO: ẩn tạm phần này        <a class="ml-2 btn btn-outline-primary btn-sm shrink-0" href="https://inet.vn/email-theo-ten-mien" target="_blank">
            Nâng cấp gói <ArrowUpRightIcon class="ml-2 w-4 h-4"/>
          </a>-->
        </div>
        <div class="grid grid-cols-1 gap-6">
          <div>
            <div class="mb-1 flex items-center">
              <b class="grow">{{ locale.capacity }}</b>
              <p class="text-gray-500 pl-3">{{ myAdminCompanyUser.dataUse ? prettyBytes(myAdminCompanyUser.dataUse * 980 * 1000): 0 }} / {{ myAdminCompanyUser.dataMax ? prettyBytes(myAdminCompanyUser.dataMax * 980 * 1000): 0 }}</p>
            </div>
            <div>
              <iNETComponent name="ProgressBar" :per-progress="(myAdminCompanyUser.dataUse*100)/myAdminCompanyUser.dataMax"/>
            </div>
          </div>
          <div>
            <div class="mb-1 flex items-center">
              <b class="grow">{{ locale.account }}</b>
              <p class="text-gray-500 pl-3">{{ myAdminCompanyUser.accountUse }} / {{ myAdminCompanyUser.accountMax }}</p>
            </div>
            <div>
              <iNETComponent name="ProgressBar" :per-progress="(myAdminCompanyUser.accountUse*100)/myAdminCompanyUser.accountMax"/>
            </div>
          </div>
          <div>
            <div class="mb-1 flex items-center">
              <b class="grow">{{ locale.mailgroup }}</b>
              <p class="text-gray-500 pl-3">{{ myAdminCompanyUser.groupUse }} / {{ myAdminCompanyUser.groupMax }}</p>
            </div>
            <div>
              <iNETComponent name="ProgressBar" :per-progress="(myAdminCompanyUser.groupUse*100)/myAdminCompanyUser.groupMax"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {computed, defineComponent} from "vue";
  import {MyAdminStore} from "@/stores/admin-store/admin-store";
  import {MyStore} from "@/stores/my-store";
import {IAdminCompanyUser} from "@/model/admin/dto/IAdminCompanyUser";
import { prettyBytes } from "@/utils/pretty-bytes-function/PrettyBytes";

  export default defineComponent({
    name: 'AdminEmailVerify',
    setup() {
      // locale language
      const myStore = MyStore();
      const locale = computed(() => myStore.locale);
      const adminStore = MyAdminStore();
      const myAdminCompanyUser = computed(() => adminStore.myAdminCompanyUser as IAdminCompanyUser);
      return {
        locale,
        prettyBytes,
        myAdminCompanyUser
      }
    }
  })
</script>