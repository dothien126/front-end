<template>
  <div class="flex items-center my-3" v-if="userManager && userManager.pagination.totalElements">
    <div class="grow pr-3 text-slate-600 dark:text-white/50">
      {{ localeAdmin.totalAccount }} <b>{{ userManager.pagination.totalElements }}</b>
    </div>
    <div class="flex">
      <div class="mr-2">
        <select class="form-select dark:bg-darkmode-200" aria-label="Filter status"
                @change="actionReloadDataByStatusAccount" v-model="statusSelected">
          <option class="dark:text-darkmode-600" v-for="item in statusUser" :key="item" :value="item.value">{{ localeAdmin[item.name] }}</option>
        </select>
      </div>
      <div class="min-w-[220px] max-w-sm relative">
        <input
            class="form-control shadow-none border-none dark:bg-darkmode-200 pr-11"
            type="search" :placeholder="localeAdmin.searchMore" v-model="nameAccountSearch"/>
        <button class="btn absolute inset-y-0 right-0 border-none" @click="actionReloadDataBySearchAccount">
          <SearchIcon class="w-4 h-4"/>
        </button>
      </div>
      <Dropdown v-slot="{ dismiss }" class="ml-2">
        <DropdownToggle class="btn border-slate-200 dark:border-darkmode-100 h-full" :title="localeAdmin.displayFormat">
          <i icon-name="more-vertical" class="w-4 h-4"></i>
        </DropdownToggle>
        <DropdownMenu class="w-56">
          <DropdownContent>
            <DropdownItem :class="{'bg-slate-200 dark:bg-white/10': viewType === 'TableView'}" data-tw-toggle="pill"
                          data-tw-target="#table-view" type="button" role="tab" aria-controls="table-view" aria-selected="false"
            @click="viewType = 'TableView'; dismiss()">
              <i icon-name="table" class="w-4 h-4 shrink-0 mr-2"></i>
              {{ localeAdmin.tabularView }}
            </DropdownItem>
            <DropdownItem :class="{'bg-slate-200 dark:bg-white/10': viewType === 'GridView'}" data-tw-toggle="pill"
                          data-tw-target="#grid-view-1" type="button" role="tab" aria-controls="grid-view-1"
                          aria-selected="false"
                          @click="viewType = 'GridView'; dismiss()">
              <i icon-name="layout-list" class="w-4 h-4 shrink-0 mr-2"></i>
              {{ localeAdmin.gridView1 }}
            </DropdownItem>
            <DropdownItem :class="{'bg-slate-200 dark:bg-white/10': viewType === 'GridView2'}" data-tw-toggle="pill"
                          data-tw-target="#grid-view-2" type="button" role="tab" aria-controls="grid-view-2"
                          aria-selected="false"
                          @click="viewType = 'GridView2'; dismiss()">
              <i icon-name="layout-grid" class="w-4 h-4 shrink-0 mr-2"></i>
              {{ localeAdmin.gridView2 }}
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
    </div>
  </div>
  <div class="flex items-center my-3" v-else-if="distribution && distribution.pagination.totalElements">
    <div class="grow pr-3">
      {{ localeAdmin.totalGroup }} <b>{{ distribution.pagination.totalElements }}</b>
    </div>
    <div class="flex items-center">
      <div class="mr-2">
        <select class="form-select dark:bg-darkmode-600" aria-label="Filter status"
                @change="actionReloadDataDistributionByStatus" v-model="statusDistributionSelected">
          <option class="dark:text-darkmode-400" v-for="item in statusDistribution" :key="item" :value="item.value">{{
              localeAdmin[item.name]
            }}
          </option>
        </select>
      </div>
      <div class="min-w-[220px] max-w-sm relative">
        <input
            class="form-control shadow-none border-none dark:bg-darkmode-600 pr-11"
            type="search" :placeholder="localeAdmin.exFindGroup" v-model="nameDistributionSearch"/>
        <button class="btn absolute inset-y-0 right-0 border-none" @click="actionReloadDataDistributionBySearch">
          <SearchIcon class="w-4 h-4"/>
        </button>
      </div>
    </div>
  </div>
  <div class="flex items-center my-3" v-else-if="userTrash && userTrash.length > 0">
    <div class="grow pr-3">
      {{ localeAdmin.totalAccount }} <b>{{ userTrash.length }}</b>
    </div>
    <div class="flex items-center">
      <div class="min-w-[17rem] max-w-sm relative">
        <input
            class="form-control shadow-none border-none bg-white dark:bg-darkmode-600 pr-11"
            type="search" :placeholder="localeAdmin.exFindEmail" v-model="nameUserTrashSearch"/>
        <button class="btn absolute inset-y-0 right-0 border-none" @click="actionReloadDataUserTrashBySearch">
          <SearchIcon class="w-4 h-4"/>
        </button>
      </div>
    </div>
  </div>
  <iNETComponent
      v-else
      name="AlertNotFound" class="mt-4"
      :message="localeAdmin.exNoAccount"/>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref} from "vue";
import {IAdminUserManager} from "@/model/admin/dto/IAdminUserManager";
import {VALUE_STATUS_ACCOUNT, VALUE_STATUS_DISTRIBUTION} from "@/utils/MyVariables";
import {MyStore} from "@/stores/my-store";
import {IAdminDistribution} from "@/model/admin/dto/IAdminDistribution";
import {User} from "@/model/User";
import {createIcons, icons} from "lucide";

export default defineComponent({
  name: 'AccManagerListViewHeader',
  data() {
    return {
      ListView: ''
    }
  },
  props: {
    userManager: {
      type: Object as PropType<IAdminUserManager>,
    },
    distribution: {
      type: Object as PropType<IAdminDistribution>,
    },
    userTrash: {
      type: Object as PropType<User[]>,
    }
  },
  methods: {
    viewChange(_view) {
      localStorage.setItem('accMngView', _view);
    }
  },
  mounted() {
    createIcons({icons, nameAttr: 'icon-name'});
    this.ListView = localStorage.getItem('accMngView') || 'TableView';
  },

  updated() {
    createIcons({icons, nameAttr: 'icon-name'});
  },
  setup(props) {
    const myStore = MyStore();
    // locale language
    const localeAdmin = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    //user manager
    const userManager = computed(() => props.userManager as IAdminUserManager);
    const statusUser = VALUE_STATUS_ACCOUNT;
    const statusSelected = ref(statusUser[0].value);
    const nameAccountSearch = ref('');
    //distribution
    const distribution = computed(() => props.distribution as IAdminDistribution);
    const statusDistribution = VALUE_STATUS_DISTRIBUTION;
    const statusDistributionSelected = ref(statusDistribution[0].value);
    const nameDistributionSearch = ref('');
    //user trash
    const userTrash = computed(() => props.userTrash as User[]);
    const nameUserTrashSearch = ref('');
    const viewType = ref('TableView')

    function actionReloadDataByStatusAccount() {
      emitter.emit('reload-data-user-manager-by-status-account', statusSelected.value);
    }

    function actionReloadDataBySearchAccount() {
      emitter.emit('reload-data-user-manager-by-search-account', nameAccountSearch.value);
    }

    function actionReloadDataDistributionByStatus() {
      emitter.emit('reload-data-distribution-by-status', statusDistributionSelected.value);
    }

    function actionReloadDataDistributionBySearch() {
      emitter.emit('reload-data-distribution-by-search', nameDistributionSearch.value);
    }

    function actionReloadDataUserTrashBySearch() {
      emitter.emit('reload-data-user-trash-by-search', nameUserTrashSearch.value);
    }

    return {
      localeAdmin,
      userManager,
      statusUser,
      statusSelected,
      nameAccountSearch,
      actionReloadDataByStatusAccount,
      actionReloadDataBySearchAccount,
      distribution,
      statusDistribution,
      statusDistributionSelected,
      nameDistributionSearch,
      actionReloadDataDistributionByStatus,
      actionReloadDataDistributionBySearch,
      userTrash,
      nameUserTrashSearch,
      actionReloadDataUserTrashBySearch,
      viewType
    }
  }
})
</script>