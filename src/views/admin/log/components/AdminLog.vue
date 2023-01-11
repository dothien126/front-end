<template>
  <div class="admin-log">
    <div class="flex items-center mb-5 p-3 rounded bg-white dark:bg-darkmode-600">
      <div class="grow">
        {{ locale.totalLog }}: <b>{{ logList && logList.pagination.totalElements > 0 ? logList.pagination.totalElements : 0 }}</b>
      </div>
      <div class="shrink-0">
        <div class="relative">
          <input
              class="form-control min-w-[17rem] dark:bg-darkmode-300 pr-10"
              type="search" :placeholder="locale.find.split('...')[0] + ' ' + locale.byAccount.toLowerCase() + '...'"
              v-model="filterTracking" @focus="actionSelected = ''"/>
          <button type="button" class="btn border-none absolute right-0 inset-y-0">
            <SearchIcon class="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>
    <div class="table-view" v-if="logList.adminLog.length > 0">
      <div class="overflow-x-auto overflow-y-hidden bg-white dark:bg-darkmode-600 scroll-gray-400">
        <table class="table table-hover">
          <thead>
          <tr>
            <th>
              {{ locale.byAccount }}
            </th>
            <th>
              {{ locale.data }}
            </th>
            <th>
              <div class="flex items-center">
                {{ locale.action }}
                <Dropdown v-slot="{ dismiss }">
                  <DropdownToggle class="btn btn-sm shadow-none py-1 px-1.5 ml-2">
                    <ChevronDownIcon class="w-4 h-5"/>
                  </DropdownToggle>
                  <DropdownMenu class="min-w-[220px]">
                    <DropdownContent>
                      <DropdownItem @click="actionSelected = ''; filterTracking = ''; dismiss()">
                        {{locale.allStatus}}
                      </DropdownItem>
                      <DropdownItem v-for="(key) in actionList" :key="key" @click="actionSelected = key[1]; filterTracking = ''; dismiss()">
                        {{ locale[key[1]] }}
                      </DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </th>
            <th>
              {{ locale.detail }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in filterList" :key="item._id">
            <td>
              <div class="flex items-center">
                <iNETComponent name="Avatar" avt-class="w-8 h-8 text-xs shrink-0" :avt-json="item" key-str="byAccount"/>
                <div class="grow pl-2">
                  <p class="mb-0.5">{{ item.byAccount }}</p>
                  <p class="text-slate-600 dark:text-white/40 text-xs">{{helper.formatDate(item.createdAt, env.dateTimeFormat)}}</p>
                </div>
              </div>
            </td>
            <td>
              {{ locale[item.name] }}
            </td>
            <td>
              <inet-status :s-value="item.action" :s-options="{type: 'dot', text: true}"/>
            </td>
            <td>
              <div class="-mx-1.5">
                <Tippy tag="button" :content="locale.detail" type="button"
                       class="btn btn-sm border-slate-200 dark:border-darkmode-300 m-1.5"
                       @click="actionViewObject(item.data)">
                  <NewspaperIcon class="w-4 h-4"/>
                </Tippy>
              </div>
            </td>
          </tr>
          <tr v-if="filterList.length === 0">
            <td colspan="4">
              <iNETComponent name="AlertNotFound" :message="locale.notfoundinsystemsfor + ' ' + (filterTracking || locale[actionSelected].toLowerCase())"/>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <admin-pagination :pagination="logList.pagination"/>
    </div>
    <div v-else>
      <iNETComponent name="AlertNotFound" :message="locale.notifyNoMail"/>
    </div>
  </div>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" size="modal-lg" :slideOver="true" :show="buttonSlideOverPreview"
         @hidden="buttonSlideOverPreview = false">
    <a @click="buttonSlideOverPreview = false" class="absolute top-0 left-0 right-auto mt-4 -ml-12">
      <XIcon class="w-8 h-8 text-slate-400"/>
    </a>
    <ModalHeader class="p-5">
      <h2 class="font-medium text-base mr-auto">
        {{ locale.detail }}
      </h2>
    </ModalHeader>
    <ModalBody>
      <Alert class="alert-secondary flex items-center mb-2" style="word-break: break-word;">
        <div v-html="viewObject"/>
      </Alert>
    </ModalBody>
  </Modal>
  <!-- END: Modal Content -->
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, ref} from "vue";
import {helper} from "@/utils/helper";
import {env} from "@/utils/MyVariables";
import InetStatus from "@/global-components/inet-custom/components/Status.vue";
import {MyStore} from "@/stores/my-store";
import {AdminLogStore} from "@/stores/admin-store/log/log-store";
import {ActionFieldOfAdminLog, IAdminLog, IAdminLogByPage} from "@/model/admin/IAdminLog";
import AdminPagination from "@/views/admin/share/components/AdminPagination.vue";

export default defineComponent({
  name: 'AdminLog',
  components: {InetStatus, AdminPagination},
  setup() {
    // locale language
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    const buttonSlideOverPreview = ref(false);
    const adminLogStore = AdminLogStore();
    const logList = computed(() => adminLogStore.logList as IAdminLogByPage);
    const filterTracking = ref('');
    const filterList = computed(() => {
      const data = logList.value.adminLog as IAdminLog[];
      return data.filter(({action, byAccount}) => [action, byAccount].some(val => val.toLowerCase().includes(filterTracking.value.toLowerCase() || actionSelected.value)))
    });
    const numberPage = computed({
      get: () => adminLogStore.numberPage as number,
      set: (data) => adminLogStore.numberPage = data,
    });
    const pageSize = computed({
      get: () => adminLogStore.pageSize as number,
      set: (data) => adminLogStore.pageSize = data,
    });
    const actionSelected = ref('');
    const actionList = ref(Object.entries(ActionFieldOfAdminLog));
    const viewObject = ref();

    function actionViewObject(item: any) {
      buttonSlideOverPreview.value = true;
      viewObject.value = '<pre><code class="json">' + JSON.stringify(item, null, 2,) + '</code></pre>';
    }

    onMounted(async () => {
      await adminLogStore.initFindAdminLog();
      //listener reload data by page number
      emitter.on('reload-data-user-manager-by-page-number', async (data: number) => {
        if (data > 0) {
          //change page number
          numberPage.value = data;
          //reload
          await adminLogStore.initFindAdminLog();
        }
      });
      //listener reload data by page size
      emitter.on('reload-data-user-manager-by-page-size', async (data: number) => {
        if (data > 0) {
          //change page size
          pageSize.value = data;
          //Mỗi lần change page size thì reset số page = 1
          numberPage.value = 1;
          //reload
          await adminLogStore.initFindAdminLog();
        }
      });
    });

    onDeactivated(() => {
      emitter.off('reload-data-user-manager-by-page-number');
      emitter.off('reload-data-user-manager-by-page-size');
    });

    return {
      locale,
      env,
      helper,
      buttonSlideOverPreview,
      logList,
      actionViewObject,
      viewObject,
      filterTracking,
      actionList,
      filterList,
      actionSelected,
    }
  }
})
</script>