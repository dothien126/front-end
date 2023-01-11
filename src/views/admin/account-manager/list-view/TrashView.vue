<template>
  <div>
    <acc-manager-list-view-header :user-trash="userTrashList"/>
    <div class="overflow-x-auto overflow-y-hidden bg-white dark:bg-darkmode-600 dark:scroll-dark" v-if="userTrashList.length > 0">
      <table class="table table-hover" id="headerTable">
        <thead>
        <tr>
          <th class="whitespace-nowrap">{{ localeAdmin.account }}</th>
          <th class="whitespace-nowrap">{{ localeAdmin.permanentDateDelete }}</th>
          <th class="whitespace-nowrap text-right">{{ localeAdmin.action }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in userTrashList" :key="item._id">
          <td class="whitespace-nowrap max-w-[280px]">
            <div class="flex items-center">
              <div class="w-8 h-8 image-fit shrink-0">
                <iNETComponent name="Avatar" :avt-json="item" :key-str="'account,displayName'"/>
              </div>
              <div class="pl-3">
                {{ item.account }}
              </div>
            </div>
          </td>
          <td class="whitespace-nowrap">
          <span class="grow text-right text-xs">
            {{ helper.formatDate(item.hasDeleted.timeDeleted, env.dateTimeFormat)}}
            ({{ localeAdmin.still }} {{ item.hasDeleted.dayDiffTime }} {{ localeAdmin.date }} {{ item.hasDeleted.hourDiffTime }} {{ localeAdmin.hour }} {{ item.hasDeleted.minuteDiffTime }} {{ localeAdmin.minute }} {{ item.hasDeleted.secondDiffTime }} {{ localeAdmin.second }})
          </span>
          </td>
          <td class="text-right whitespace-nowrap">
            <a class="btn btn-sm btn-outline-warning mr-2" @click="actionRevokeUserTrash(item)">
              <UndoIcon class="w-4 h-4"/>
              {{ localeAdmin.undo }}
            </a>
            <a class="btn btn-sm btn-outline-danger" @click="actionDeleteUser(item)">
              <TrashIcon class="w-4 h-4"/>
              {{ localeAdmin.clearNow }}
            </a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import AccManagerListViewHeader from "@/views/admin/account-manager/list-view/ListViewHeader.vue";
import {AdminUserManagerStore} from "@/stores/admin-store/user-manager/user-manager-store";
import { User } from "@/model/User";
import { helper } from '@/utils/helper';
import AdminUserManagerService from "@/service/admin/AdminUserManagerService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import { env } from "@/utils/MyVariables";

export default defineComponent({
  components: {AccManagerListViewHeader},
  setup() {
    const myStore = MyStore();
    const adminStore = MyAdminStore();
    const adminUserManagerStore = AdminUserManagerStore();
    const emitter = myStore.useEmitter();
    // locale language
    const locale = computed(() => myStore.locale);
    const localeAdmin = computed(() => myStore.locale);
    const myJwt = computed(() => adminStore.myAdminJwt);
    const userTrashList = computed(() => adminUserManagerStore.userTrashList as User[]);
    const interValDisplayTime = ref();

    function convertDateToTime(){
      for(const item of userTrashList.value){
        if(item.hasDeleted.timeDeleted){
          const {days, hours, minutes, seconds} = helper.diffTimeByNow(item.hasDeleted.timeDeleted);
          if(days <= 0 && hours <= 8 && minutes <= 0 && seconds <= 0){
            item.hasDeleted.dayDiffTime = 0;
            item.hasDeleted.hourDiffTime = 0;
            item.hasDeleted.minuteDiffTime = 0;
            item.hasDeleted.secondDiffTime = 0;
          }
          else{
            item.hasDeleted.dayDiffTime = Number(days);
            item.hasDeleted.hourDiffTime = Number(hours);
            item.hasDeleted.minuteDiffTime = Number(minutes);
            item.hasDeleted.secondDiffTime = Number(seconds);
          }
        }
      }
    }

    async function actionRevokeUserTrash(user: User) {
      //init request
      const itemRequest = new User();
      itemRequest._id = user._id;
      itemRequest.hasDeleted = {zimbraUserId: user.hasDeleted.zimbraUserId, timeDeleted: user.hasDeleted.timeDeleted, dayDiffTime: 0, hourDiffTime: 0, minuteDiffTime: 0, secondDiffTime: 0};
      //call request
      const response = await AdminUserManagerService.revokeUserTrashByDomain(itemRequest, myJwt.value);
      if (response.data) {
        const responseData: ResponseData = response.data;
        if (!responseData.values.error) {
          //reload data
          await adminUserManagerStore.initGetAllUserTrash();
        } else {
          showToastMessage(responseData.values.error, true);
        }
      }
    }

    function actionDeleteUser(user: User) {
      emitter.emit('confirm-delete-data-user-manager', user);
    }

    onMounted(() => {
      interValDisplayTime.value = setInterval(convertDateToTime, 1000);
    });

    onDeactivated(() => {
      clearInterval(interValDisplayTime.value);
    });

    return {
      env,
      locale,
      localeAdmin,
      userTrashList,
      helper,
      actionRevokeUserTrash,
      actionDeleteUser,
    }
  }
})
</script>