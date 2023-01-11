<template>
  <div class="admin-acc-mng-mail-group">
    <div class="py-1.5 px-2 bg-white dark:bg-darkmode-600 rounded text-right">
      <button type="button" class="m-1 btn btn-primary" @click="showModalAddGroup">
        <i icon-name="mails" class="w-4 h-4 mr-2"></i>
        {{ locale.createMailGroup }}
      </button>
    </div>
    <acc-manager-list-view-header class="grow mb-5" :distribution="distribution"/>
    <template v-if="distribution && distribution.distributionList && distribution.distributionList.length > 0">
    <div class="overflow-auto bg-white dark:bg-darkmode-600">
      <table class="table">
        <thead>
        <tr>
          <th>{{ locale.nameMailGroup }}</th>
          <th>{{ locale.address }}</th>
          <th>{{ locale.dateCreate }}</th>
          <th class="whitespace-nowrap">{{ locale.status }}</th>
          <th class="whitespace-nowrap max-w-[200px]">{{ locale.account }}</th>
          <th>{{ locale.action }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in distribution.distributionList" :key="item.id">
          <td>
            {{ item.displayName }}
          </td>
          <td>
            {{ item.name }}
          </td>
          <td>
            {{ lastLoginIsValid(item.createdTime) ? timeAgo(item.createdTime) : locale.unclear  }}
          </td>
          <td class="text-xs">
            <iNETComponent name="Status" :s-value="item.status"/>
          </td>
          <td>
            <div class="truncate mb-1" v-if="item.member && item.member.length > 0">
              <span :title="item.member[0]">{{ item.member[0] }}</span>
            </div>
            <Dropdown class="inline-block" v-if="item.member && item.member.length > 1">
              <DropdownToggle class="btn btn-sm border-slate-300 dark:border-darkmode-300 dark:text-white/40">
                {{ locale.and }} <b class="ml-1">{{ item.member.length -1 }}</b>
                <span class="ml-1">{{ locale.otherAccount  }}</span>
              </DropdownToggle>
              <DropdownMenu class="w-64">
                <DropdownContent>
                  <DropdownHeader>
                    <input type="text" class="form-control flex-1" :placeholder="locale.exFindAccount"/>
                  </DropdownHeader>
                  <DropdownDivider/>
                  <div class="list-users">
                    <ul>
                      <li v-for="list in item.member.slice(1, item.member.length)">
                        <a class="p-2 block dark:text-slate-500 dark:hover:text-slate-300">
                          {{ list }}
                        </a>
                      </li>
                    </ul>
                  </div>
                </DropdownContent>
              </DropdownMenu>
            </Dropdown>
          </td>
          <td>
            <div class="-mx-1.5 flex items-center flex-wrap">
              <button type="button" class="btn border-slate-200 dark:border-darkmode-300 btn-sm m-1.5"
                      @click="actionEditDistribution(item)">
                <Edit3Icon class="w-4 h-4"/>
              </button>
              <button type="button" class="btn btn-outline-danger btn-sm m-1.5" @click="actionDeleteDistribution(item)">
                <TrashIcon class="w-4 h-4"/>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
      <admin-pagination :pagination="distribution.pagination"/>
    </template>
  </div>
  <iNETComponent name="ModalDelete"/>
  <account-manager-mail-group-create />
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted} from "vue";
import dayjs from "dayjs";
import AdminPagination from "@/views/admin/share/components/AdminPagination.vue";
import AccManagerListViewHeader from "@/views/admin/account-manager/list-view/ListViewHeader.vue";
import {createIcons, icons} from "lucide";
import AccountManagerMailGroupCreate from "@/views/admin/account-manager/partial/AccountManagerMailGroupCreate.vue";
import {MyStore} from "@/stores/my-store";
import {AdminDistributionStore} from "@/stores/admin-store/distribution/distribution-store";
import {IAdminDistribution, IDistribution} from "@/model/admin/dto/IAdminDistribution";
import { lastLoginIsValid, timeAgo } from "@/utils/MyFunction";

export default defineComponent({
  name: 'AdminAccountManagerMailGroup',
  components: {AccountManagerMailGroupCreate, AccManagerListViewHeader, AdminPagination},
  data() {
    return {
      ListView: 'TableView',
      accMngMailGroupCreate: false,
    }
  },
  mounted() {
    createIcons({icons, nameAttr: 'icon-name'});
  },
  setup() {
    const adminDistributionStore = AdminDistributionStore();
    // locale language
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    const distribution = computed(() => adminDistributionStore.distribution as IAdminDistribution);
    const numberPage = computed({
      get: () => adminDistributionStore.numberPage as number,
      set: (data) => adminDistributionStore.numberPage = data,
    });
    const pageSize = computed({
      get: () => adminDistributionStore.pageSize as number,
      set: (data) => adminDistributionStore.pageSize = data,
    });
    const statusDistribution = computed({
      get: () => adminDistributionStore.statusDistribution as string,
      set: (data) => adminDistributionStore.statusDistribution = data,
    });
    const nameDistribution = computed({
      get: () => adminDistributionStore.nameDistribution as string,
      set: (data) => adminDistributionStore.nameDistribution = data,
    });

    function showModalAddGroup(){
      emitter.emit('add-data-distribution');
    }

    function actionEditDistribution(data: IDistribution) {
      emitter.emit('edit-data-distribution', data);
    }

    function actionDeleteDistribution(data: IDistribution) {
      emitter.emit('delete-data-distribution', data);
    }

    onMounted(async () => {
      //listener reload data by page number
      emitter.on('reload-data-distribution-by-status', async (status: string) => {
        if (status) {
          //change status account
          statusDistribution.value = status === 'all' ? '' : '(zimbraMailStatus=' + status + ')';
          //reload
          await adminDistributionStore.initGetDistributionList();
        }
      });
      //listener reload data by page number
      emitter.on('reload-data-distribution-by-search', async (searchName: string) => {
        //change status account
        nameDistribution.value = !searchName && searchName.length <= 0 ? '' : '(|(mail=*' + searchName + '*)(cn=*' + searchName + '*)(sn=*' + searchName + '*)(gn=*' + searchName + '*)(displayName=*' + searchName + '*)(zimbraMailAlias=*' + searchName + '*)(uid=*' + searchName + '*))';
        //reload
        await adminDistributionStore.initGetDistributionList();
      });
      //listener reload data by page number
      emitter.on('reload-data-user-manager-by-page-number', async (data: number) => {
        if (data > 0) {
          //change page number
          numberPage.value = data;
          //reload
          await adminDistributionStore.initGetDistributionList();
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
          await adminDistributionStore.initGetDistributionList();
        }
      });
      await adminDistributionStore.initGetDistributionList();
    });

    onDeactivated(() => {
      emitter.off('reload-data-distribution-by-status');
      emitter.off('reload-data-distribution-by-search');
      emitter.off('reload-data-user-manager-by-page-number');
      emitter.off('reload-data-user-manager-by-page-size');
    });

    return {
      locale,
      dayjs,
      distribution,
      lastLoginIsValid,
      timeAgo,
      showModalAddGroup,
      actionEditDistribution,
      actionDeleteDistribution,

    }
  }
})
</script>