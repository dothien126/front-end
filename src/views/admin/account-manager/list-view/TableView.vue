<template>
  <div v-if="$route.path === '/admin/dashboard'">
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-4">
        <div class="h-full bg-violet-100 p-5 min-h-[5rem] rounded-md text-center">
          <strong class="text-5xl text-violet-600 mb-1">{{ userManager.userList.length }}</strong>
          <h3 class="text-base text-violet-500">{{ localeAdmin.accountCreated }}</h3>
        </div>
      </div>
      <div class="col-span-4">
        <div class="h-full bg-blue-100 p-5 min-h-[5rem] rounded-md text-center">
          <strong class="text-5xl text-blue-600 mb-1">{{ countGroup }}</strong>
          <h3 class="text-base text-blue-500">{{ localeAdmin.groupCreated }}</h3>
        </div>
      </div>
      <div class="col-span-4">
        <div class="h-full bg-green-100 p-5 min-h-[5rem] rounded-md text-center">
          <strong class="text-5xl text-green-600 mb-1">{{ prettyBytes(dataMaxTotal, {binary: true}) }}</strong>
          <h3 class="text-base text-green-500">{{ localeAdmin.grantedCapacity }}</h3>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="overflow-x-auto overflow-y-hidden dark:scroll-dark bg-white dark:bg-darkmode-600" v-if="userManager.userList.length > 0">
      <table class="table table-hover" id="headerTable">
        <thead>
        <tr>
          <th class="whitespace-nowrap">{{ localeAdmin.nameDisplay }}</th>
          <th>{{ localeAdmin.group }}</th>
          <th class="whitespace-nowrap">{{ localeAdmin.capacity }}</th>
          <th>{{ localeAdmin.forward }}</th>
          <th class="whitespace-nowrap">{{ localeAdmin.status }}</th>
          <th class="whitespace-nowrap text-right">{{ localeAdmin.action }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(acc) in userManager.userList" :key="acc">
          <td class="whitespace-nowrap max-w-[280px]">
            <div class="flex items-center">
              <div class="w-8 h-8 image-fit shrink-0">
                <iNETComponent name="Avatar" :avt-json="acc" :key-str="'account,displayName'"/>
              </div>
              <div class="pl-3">
                {{ acc.account }}
                <p class="text-xs" v-if="acc.lastLogin">
                  <span class="text-slate-600 dark:text-white/50">{{ localeAdmin.lastDateAccess }}</span>
                  {{ lastLoginIsValid(acc.lastLogin) ? timeAgo(acc.lastLogin) : localeAdmin.unclear }}
                </p>
              </div>
            </div>
            <div class="flex items-center mt-2"
                 :class="{'py-1 px-2 rounded border border-slate-300 border-dashed dark:border-darkmode-100 w-full': acc.description}">
              <template v-if="acc.description">
                <span class="truncate grow">{{ acc.description }}</span>
                <Dropdown>
                  <DropdownToggle class="btn-sm ml-2">
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
              </template>
            </div>
          </td>
          <td class="whitespace-nowrap max-w-[200px]">
            <template v-if="acc.groupMailList.length > 1">
              <p class="truncate mb-1" :title="acc.groupMailList[0].displayName">{{
                  acc.groupMailList[0].displayName
                }}</p>
              <Dropdown class="inline-block">
                <DropdownToggle class="btn btn-sm border-slate-200 dark:border-darkmode-100 dark:text-white/40">
                  {{ acc.groupMailList.length - 1 }}
                  <span class="ml-1">{{ localeAdmin.otherGroup }}</span>
                </DropdownToggle>
                <DropdownMenu class="w-64">
                  <DropdownContent>
                    <DropdownHeader>
                      <input type="text" class="form-control flex-1" :placeholder="localeAdmin.findGroup"/>
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
            </template>
            <template v-else-if="acc.groupMailList.length === 1">
              <Tippy tag="p" class="truncate" :content="acc.groupMailList[0].displayName">
                {{ acc.groupMailList[0].displayName }}
              </Tippy>
            </template>
            <template v-else>
              <div class="flex items-center text-xs text-slate-500">
                <MaximizeIcon class="w-4 h-4 mr-2 shrink-0"/>
                {{ localeAdmin.noGroup }}
              </div>
            </template>
          </td>
          <td class="whitespace-nowrap">
          <span class="grow text-right text-xs">
                {{
              prettyBytes(acc.dataUse, {binary: true})
            }} / {{ acc.dataMax > 0 ? prettyBytes(acc.dataMax, {binary: true}) : localeAdmin.unlimited }}
          </span>
            <iNETComponent name="ProgressBar"
                           :per-progress="acc.dataMax > 0 ? percentageUse(acc.dataUse, acc.dataMax) : 0"/>
          </td>
          <td class="max-w-[150px]">
            <template v-if="acc.forwardAddressList.length > 1">
              <div class="truncate">
                <a href="javascript:"
                   :title="acc.forwardAddressList[0]">{{ acc.forwardAddressList[0] }}</a>
              </div>
              <div class="mt-1">
                <Dropdown class="inline-block">
                  <DropdownToggle class="btn btn-sm btn-outline-secondary dark:text-slate-600 whitespace-nowrap">
                    {{ acc.forwardAddressList.length - 1 }}
                    <span class="ml-1">{{ localeAdmin.otherRecipients }}</span>
                  </DropdownToggle>
                  <DropdownMenu class="max-w-[32rem] min-w-[16rem]">
                    <DropdownContent>
                      <DropdownHeader>
                        <input type="text" class="form-control flex-1" :placeholder="localeAdmin.exFindEmailForward"/>
                      </DropdownHeader>
                      <DropdownDivider/>
                      <div class="list-users">
                        <ul>
                          <li v-for="forward in acc.forwardAddressList.slice(1, acc.forwardAddressList.length)">
                            <a href="javascript:"
                               class="p-2 block dark:text-slate-500 dark:hover:text-slate-300 whitespace-nowrap">
                              {{ forward }}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </template>
            <template v-else-if="acc.forwardAddressList.length === 1">
              <Tippy tag="p" :content="acc.forwardAddressList[0]" class="truncate">
                {{ acc.forwardAddressList[0] }}
              </Tippy>
            </template>
          </td>
          <td class="whitespace-nowrap">
            <iNETComponent name="Status" :s-value="acc.status"/>
          </td>
          <td class="text-right whitespace-nowrap">
            <Dropdown class="inline-block" v-slot="{ dismiss }" v-if="acc.status !== 'deleting'">
              <DropdownToggle class="btn btn-sm btn-outline-secondary dark:text-slate-500">
                {{ localeAdmin.action }}
                <ChevronDownIcon class="w-4 h-4 ml-2"/>
              </DropdownToggle>
              <DropdownMenu class="w-40">
                <DropdownContent>
                  <DropdownItem @click="actionEditUser(acc)">
                    <EditIcon class="w-4 h-4 mr-2"/>
                    {{ localeAdmin.modify }}
                  </DropdownItem>
                  <DropdownItem @click="actionDeleteUser(acc)">
                    <TrashIcon class="w-4 h-4 mr-2"/>
                    {{ localeAdmin.delete }}
                  </DropdownItem>
                </DropdownContent>
              </DropdownMenu>
            </Dropdown>
            <a class="btn btn-sm btn-outline-secondary dark:text-slate-500"
               @click="$router.push('/admin/account-manager/trash')" v-else>
              {{ localeAdmin.detail }}
            </a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import AccManagerListViewHeader from "@/views/admin/account-manager/list-view/ListViewHeader.vue";
import {IAdminUserManager, IUserAccount} from "@/model/admin/dto/IAdminUserManager";
import {lastLoginIsValid, percentageUse, timeAgo} from "@/utils/MyFunction";
import {AdminUserManagerStore} from "@/stores/admin-store/user-manager/user-manager-store";
import {useRoute} from "vue-router";
import {prettyBytes} from "@/utils/pretty-bytes-function/PrettyBytes";

export default defineComponent({
  components: {AccManagerListViewHeader},
  setup() {
    const myStore = MyStore();
    const route = useRoute();
    const adminUserManagerStore = AdminUserManagerStore();
    // locale language
    const locale = computed(() => myStore.locale);
    const localeAdmin = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    const userManager = computed(() => adminUserManagerStore.userManager as IAdminUserManager);
    const countGroup = ref<number>(0);
    const dataMaxTotal = ref<number>(0);

    function actionEditUser(user: IUserAccount) {
      emitter.emit('edit-data-user-manager', user);
    }

    function actionDeleteUser(user: IUserAccount) {
      emitter.emit('delete-data-user-manager', user);
    }

    onMounted(async () => {
      if (route.path == '/admin/dashboard') {
        await adminUserManagerStore.initGetUserManagerList();

        userManager.value.userList.forEach((item) => {
          if (item.groupMailList.length > 0) {
            countGroup.value++;
          }
          dataMaxTotal.value += item.dataMax;
        })
      }
    });
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
      countGroup,
      dataMaxTotal,
    }
  }
})
</script>