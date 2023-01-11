<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
    <!-- BEGIN: Users Layout -->
    <div
        v-for="acc in userManager.userList"
        :key="acc.zimbraUserId"
        class="intro-y"
    >
      <div class="bg-white rounded drop-shadow h-full flex flex-col">
        <div class="flex items-start px-5 pt-5">
          <div class="w-full flex flex-col lg:flex-row items-center mt-2">
            <div class="w-12 h-12 image-fit shrink-0">
              <iNETComponent name="Avatar" :avt-json="acc" :key-str="'account,displayName'"/>
            </div>
            <div class="grow pl-3">
              <div class="acc-info">
                <a href="" class="font-medium">{{ acc.account }}</a>
                <div class="text-slate-500 text-xs mt-0.5">
                  {{ localeAdmin.lastDateAccess }} {{ lastLoginIsValid(acc.lastLogin) ? timeAgo(acc.lastLogin) : localeAdmin.unclear }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center lg:text-left p-5 grow">
          <div class="mb-3">
            <div class="flex items-center text-slate-700" v-if="acc.description">
              <span class="truncate">{{acc.description}}</span>
              <Dropdown>
                <DropdownToggle class="btn btn-sm ml-2 btn-outline-secondary-sort dark:border-slate-300">
                  <FileTextIcon class="w-4 h-4"/>
                </DropdownToggle>
                <DropdownMenu class="w-40">
                  <DropdownContent tag="div">
                    <div class="p-2">
                      {{acc.description}}
                    </div>
                  </DropdownContent>
                </DropdownMenu>
              </Dropdown>
            </div>
            <div v-else>
              <div class="text-slate-500 text-xs border border-dashed border-slate-200 dark:border-slate-200 text-center py-1 px-2">
                --------- {{ localeAdmin.noDescription }} ---------
              </div>
            </div>
          </div>
          <div class="flex items-center text-slate-600 mb-3">
            <DropletIcon class="w-4 h-4 mr-2 shrink-0"/>
            <b class="shrink-0 grow mr-2">{{ localeAdmin.status }}</b>
            <iNETComponent name="Status" :s-value="acc.status" :s-options="{type: 'tippy'}"/>
          </div>
          <div class="flex items-center justify-center lg:justify-start text-slate-600 mb-3">
            <UsersIcon class="w-4 h-4 mr-2 shrink-0"/>
            <b class="grow">{{ localeAdmin.group }}</b>
            <div v-if="acc.groupMailList.length === 0">
              <span class="rounded-full text-slate-500 bg-white border border-slate-300 dark:border-slate-300 block p-1.5 w-7 h-7 flex items-center justify-center">
                {{acc.groupMailList.length}}
              </span>
            </div>
            <div class="flex" :class="{'mr-1.5': acc.groupMailList.length > 2}" v-if="acc.groupMailList.length > 1">
              <iNETComponent name="Avatar" :title="acc.groupMailList[0].name" :avt-json="acc.groupMailList[0]" key-str="displayName" avt-class="w-7 h-7 text-xs"/>
            </div>
            <div v-if="acc.groupMailList.length > 2">
              <Dropdown>
                <DropdownToggle class="btn btn-sm btn-outline-secondary dark:text-slate-600">
                  {{acc.groupMailList.length - 1}}
                  <span class="ml-1">{{ localeAdmin.otherGroup }}</span>
                </DropdownToggle>
                <DropdownMenu class="w-64">
                  <DropdownContent>
                    <DropdownHeader>
                      <input type="text" class="form-control flex-1" :placeholder="localeAdmin.exFindGroup" />
                    </DropdownHeader>
                    <DropdownDivider />
                    <div class="list-users">
                      <ul>
                        <li v-for="group in acc.groupMailList.slice(1, 3)">
                          <button class="p-2 block dark:text-slate-500 dark:hover:text-slate-300">
                            {{group.displayName}}
                          </button>
                        </li>
                      </ul>
                    </div>
                  </DropdownContent>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div class="text-slate-600 mb-3">
            <div class="flex items-center justify-center lg:justify-start mb-1">
              <CornerUpRightIcon class="w-4 h-4 mr-2"/>
              <b class="grow">{{ localeAdmin.forward }}</b>
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
                  <DropdownToggle :title="localeAdmin.exOtherReceiver" class="btn btn-sm btn-outline-secondary bg-white px-2.5 dark:text-slate-600 rounded-full">
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
              <div v-else-if="acc.forwardAddressList.length === 1">
                <Tippy tag="p" :content="acc.forwardAddressList[0]" class="truncate">
                  {{acc.forwardAddressList[0]}}
                </Tippy>
              </div>
              <div v-else>
                <span class="rounded-full text-slate-500 bg-white border border-slate-300 dark:border-slate-300 block p-1.5 w-7 h-7 flex items-center justify-center">
                  {{acc.forwardAddressList.length}}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div class="flex items-center justify-center lg:justify-start text-slate-600 mb-1">
              <DatabaseIcon class="w-4 h-4 mr-2"/>
              <b class="grow">{{ localeAdmin.capacity }}</b>
              <span class="shrink-0 text-xs">
                {{
                  prettyBytes(acc.dataUse, {binary: true})
                }} / {{ acc.dataMax > 0 ? prettyBytes(acc.dataMax, {binary: true}) : localeAdmin.unlimited }}
              </span>
            </div>
            <iNETComponent name="ProgressBar"
                           :per-progress="acc.dataMax > 0 ? percentageUse(acc.dataUse, acc.dataMax) : 0"/>
          </div>
        </div>
        <div
            class="text-center lg:text-right p-5 border-t border-slate-200/60 dark:border-slate-200"
        >
          <template v-if="acc.status !== 'deleting'">
          <button :title="localeAdmin.modify" class="btn dark:text-slate-600 btn-outline-secondary inline-flex items-center btn-sm mr-2" @click="actionEditUser(acc)">
            <EditIcon class="w-4 h-4"/>
          </button>
          <button :title="localeAdmin.delete" class="btn btn-outline-danger inline-flex items-center btn-sm" @click="actionDeleteUser(acc)" >
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
  import {lastLoginIsValid, percentageUse, timeAgo} from "@/utils/MyFunction";
  import {AdminUserManagerStore} from "@/stores/admin-store/user-manager/user-manager-store";
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