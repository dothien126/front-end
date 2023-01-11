<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
    <!-- BEGIN: Users Layout -->
    <div
        v-for="(acc) in userManager.userList"
        :key="acc.zimbraUserId"
        class="intro-y"
    >
      <div class="bg-white dark:bg-darkmode-600 rounded drop-shadow-lg h-full">
        <div class="flex items-start px-5 pt-5">
          <div class="w-full flex flex-col lg:flex-row items-center">
            <iNETComponent name="Avatar" :avt-json="acc" :key-str="'account,displayName'"/>
            <div class="lg:ml-4 text-center lg:text-left mt-3 lg:mt-0">
              <a href="" class="font-medium">{{ acc.account }}</a>
              <div class="text-slate-500 text-xs mt-0.5">
                {{ localeAdmin.lastDateAccess }} {{ lastLoginIsValid(acc.lastLogin) ? timeAgo(acc.lastLogin) : localeAdmin.unclear }}
              </div>
            </div>
          </div>
        </div>
        <div class="text-center lg:text-left p-5">
          <div class="mb-3">
            <div class="flex items-center text-slate-700 dark:text-white/50" v-if="acc.description">
              <span class="truncate grow">{{ acc.description }}</span>
              <Dropdown>
                <DropdownToggle class="btn btn-sm ml-2 border-none">
                  <FileTextIcon class="w-4 h-4"/>
                </DropdownToggle>
                <DropdownMenu class="w-40">
                  <DropdownContent tag="div">
                    <div class="p-2">
                      {{ acc.description }}
                    </div>
                  </DropdownContent>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div v-else class="text-slate-500 text-xs border border-dashed border-slate-200 dark:border-darkmode-300 text-center py-1 px-2 h-[28px]">
              --------- {{ localeAdmin.noDescription }} ---------
            </div>
          </div>
          <div class="flex items-center text-slate-600 dark:text-white/50 mb-3 h-[30px]">
            <DropletIcon class="w-4 h-4 mr-2"/>
            <b class="shrink-0 mr-2 grow">{{ localeAdmin.status }}</b>
            <iNETComponent name="Status" s-class="max-w-[80px] h-4" :s-value="acc.status"/>
          </div>
          <div
              class="flex items-center justify-center lg:justify-start text-slate-600 dark:text-white/50 mb-3 h-[30px]"
          >
            <MailIcon class="w-4 h-4 mr-2"/>
            {{ acc.account }}
          </div>
          <div class="flex items-center justify-center lg:justify-start text-slate-600 dark:text-white/50 mb-3 h-[30px]">
            <UsersIcon class="w-4 h-4 mr-2"/>
            <b class="grow mr-2">{{ localeAdmin.group }}</b>
            <div class="h-[30px]" v-if="acc.groupMailList.length === 0">
              <span class="rounded-full text-slate-500 bg-white dark:bg-darkmode-300 border border-slate-300 dark:border-darkmode-300 block p-1.5 w-7 h-7 flex items-center justify-center">
                {{acc.groupMailList.length}}
              </span>
            </div>
            <div class="flex" :class="{'mr-1.5': acc.groupMailList.length > 2}" v-if="acc.groupMailList.length > 1">
              <iNETComponent name="Avatar" :title="acc.groupMailList[0].name" :avt-json="acc.groupMailList[0]" key-str="displayName" avt-class="w-7 h-7 text-xs"/>
            </div>
            <div class="shrink-0 ml-1" v-if="acc.groupMailList.length > 2">
              <Dropdown>
                <DropdownToggle class="btn btn-sm btn-outline-secondary dark:text-slate-600 dark:text-white/50">
                  {{ acc.groupMailList.length - 1 }}
                  <span class="ml-1">{{ localeAdmin.otherGroup }}</span>
                </DropdownToggle>
                <DropdownMenu class="w-64">
                  <DropdownContent>
                    <DropdownHeader>
                      <input type="text" class="form-control flex-1" :placeholder="localeAdmin.exFindGroup"/>
                    </DropdownHeader>
                    <DropdownDivider/>
                    <div class="list-users">
                      <ul>
                        <li v-for="group in acc.groupMailList.slice(1, acc.groupMailList.length)">
                          <button class="p-2 block dark:text-slate-500 dark:hover:text-slate-300">
                            {{ group.displayName }}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </DropdownContent>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div class="text-slate-600 dark:text-white/50 mb-3 h-[30px]">
            <div class="flex items-center justify-center lg:justify-start mb-1">
              <div class="shrink-0 flex items-center">
                <CornerUpRightIcon class="w-4 h-4 shrink-0 mr-2"/>
                <b class="grow">{{ localeAdmin.forward }}</b>
              </div>
              <div class="flex items-center" v-if="acc.forwardAddressList.length > 1">
                <div class="-ml-1">
                  <Tippy
                      tag="a"
                      href="javascript:"
                      class="rounded-full bg-white border border-slate-300 dark:border-slate-300 block p-1.5"
                      :content="acc.forwardAddressList[0]">
                    <UserIcon class="w-4 h-4"/>
                  </Tippy>
                </div>
                <Dropdown class="inline-block -ml-1">
                  <DropdownToggle :title="localeAdmin.exOtherReceiver" class="btn btn-sm btn-outline-secondary bg-white px-2.5 dark:text-slate-600 dark:text-white/50 rounded-full">
                    {{acc.forwardAddressList.length - 1}}
                  </DropdownToggle>
                  <DropdownMenu class="min-w-[5rem]">
                    <DropdownContent>
                      <DropdownHeader>
                        <input type="text" class="form-control flex-1" :placeholder="localeAdmin.exFindGroup" />
                      </DropdownHeader>
                      <DropdownDivider />
                      <div class="list-users">
                        <ul>
                          <li v-for="forward in acc.forwardAddressList.splice(1, acc.forwardAddressList.length)">
                            <a href="javascript:" class="p-2 block whitespace-nowrap dark:text-slate-500 dark:hover:text-slate-300">
                              {{forward}}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div v-else-if="acc.forwardAddressList.length === 1" class="overflow-hidden grow text-right pl-3">
                <Tippy tag="p" :content="acc.forwardAddressList[0]" class="truncate">
                  {{acc.forwardAddressList[0]}}
                </Tippy>
              </div>
              <div class="grow text-right" v-else>
                <span class="rounded-full text-slate-500 bg-white dark:bg-darkmode-300 border border-slate-300 dark:border-darkmode-300 block p-1.5 w-7 h-7 inline-flex items-center justify-center">
                  {{acc.forwardAddressList.length}}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-center lg:justify-start text-slate-600 dark:text-white/50 mb-1">
              <DatabaseIcon class="w-4 h-4 mr-2"/>
              <b class="grow">{{ localeAdmin.capacity }}</b>
              <span class="shrink-0 text-xs">
                {{
                  prettyBytes(acc.dataUse, {binary: true})
                }} / {{ acc.dataMax > 0 ? prettyBytes(acc.dataMax, {binary: true}) : localeAdmin.unlimited }}
              </span>
            </div>
            <iNETComponent name="ProgressBar"
                           :per-progress="acc.dataMax > 0 ? percentageUse(acc.dataUse, acc.dataMax) : 0"
                           per-class="h-3"/>
          </div>
        </div>
        <div
            class="text-center lg:text-right py-3 px-5 border-t border-slate-200/60 dark:border-darkmode-300"
        >
          <template v-if="acc.status !== 'deleting'">
          <button :title="localeAdmin.modify"
                  class="btn dark:text-slate-600 dark:text-white/50 btn-outline-secondary inline-flex items-center btn-sm mr-2"
                  @click="actionEditUser(acc)">
            <EditIcon class="w-4 h-4"/>
          </button>
          <button :title="localeAdmin.delete" class="btn btn-outline-danger inline-flex items-center btn-sm"
                  @click="actionDeleteUser(acc)">
            <TrashIcon class="w-4 h-4"/>
          </button>
          </template>
          <template v-else>
            <button :title="localeAdmin.detail" class="btn btn-outline-secondary inline-flex items-center btn-sm"
                    @click="$router.push('/admin/account-manager/trash')">
              <MoreHorizontalIcon class="w-4 h-4"/>
            </button>
          </template>
        </div>
      </div>
    </div>
    <!-- END: Users Layout -->
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {MyStore} from "@/stores/my-store";
import AccManagerListViewHeader from "@/views/admin/account-manager/list-view/ListViewHeader.vue";
import {IAdminUserManager, IUserAccount} from "@/model/admin/dto/IAdminUserManager";
import {AdminUserManagerStore} from "@/stores/admin-store/user-manager/user-manager-store";
import {lastLoginIsValid, percentageUse, timeAgo} from "@/utils/MyFunction";
import { prettyBytes } from "@/utils/pretty-bytes-function/PrettyBytes";

export default defineComponent({
  components: {AccManagerListViewHeader},
  setup() {
    const myStore = MyStore();
    const adminUserManagerStore = AdminUserManagerStore();
    // locale language
    const locale = computed(() => myStore.locale);
    const localeAdmin = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    const userManager = computed(() => adminUserManagerStore.userManager as IAdminUserManager);

    function actionEditUser(user: IUserAccount) {
      emitter.emit('edit-data-user-manager', user);
    }

    function actionDeleteUser(user: IUserAccount) {
      emitter.emit('delete-data-user-manager', user);
    }

    return {
      timeAgo,
      lastLoginIsValid,
      percentageUse,
      prettyBytes,
      locale,
      localeAdmin,
      userManager,
      actionEditUser,
      actionDeleteUser,
    }
  }
})
</script>