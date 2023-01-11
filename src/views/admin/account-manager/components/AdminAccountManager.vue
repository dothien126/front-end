<template>
  <div class="admin-acc-manager-list">
    <!--    BEGIN: main page-->
    <div class="content-group">
      <div class="header-page py-1 px-2 bg-white dark:bg-darkmode-600 rounded flex items-center flex-col lg:flex-row">
        <div class="grow mb-2 lg:mb-0 pr-0 lg:pr-3">
          <div class="-mx-1">
            <button type="button" class="m-1 btn btn-primary" @click="showModalAddAccount">
              <i icon-name="user-plus" class="w-4 h-4 mr-2"></i>
              {{ locale.addAccount }}
            </button>
          </div>
        </div>
         <div class="flex flex-wrap items-center -mx-1">
           <button type="button" class="btn border border-slate-200 dark:border-darkmode-200 m-1" @click="accAsyncHandler">
             <i icon-name="users" class="w-4 h-4 mr-2"></i>
             {{ locale.syncAccount }}
           </button>
           <Dropdown class="m-1 inline-block" placement="bottom-start">
             <DropdownToggle class="btn border border-slate-200 dark:border-darkmode-200 py-2.5">
               <MoreVerticalIcon class="w-4 h-4"/>
             </DropdownToggle>
             <DropdownMenu class="w-56">
               <DropdownContent>
                 <DropdownItem @click="ModalImportExcel = true">
                   <i icon-name="file-input" class="w-4 h-4 mr-2"></i>
                   {{ locale.importFormExcelFile }}
                 </DropdownItem>
                 <DropdownItem @click="exportExcel()">
                   <svg-icons name="excel" class="w-4 h-4 mr-2"/>
                   {{ locale.exportToExcelFile }}
                 </DropdownItem>
               </DropdownContent>
             </DropdownMenu>
           </Dropdown>
<!--            <button type="button" class="m-1 btn btn-secondary" @click="showModalAddGroup">
              <i icon-name="mails" class="w-4 h-4 mr-2"></i>
              Tạo nhóm mail
            </button>-->
        </div>
      </div>
      <div class="body-page my-5">
        <div class="min-h-[10vh]">
          <acc-manager-list-view-header :user-manager="userManager"/>
          <div class="tab-content">
            <table-view id="table-view" class="tab-pane active" role="tabpanel" aria-labelledby="table-view-tab"
                        :component-name="ListView"/>

            <grid-view id="grid-view-1" class="tab-pane" role="tabpanel" aria-labelledby="grid-view-1-tab"/>

            <grid-view2 id="grid-view-2" class="tab-pane" role="tabpanel" aria-labelledby="grid-view-2-tab"/>
          </div>
        </div>
        <template v-if="userManager && userManager.userList.length > 0">
          <admin-pagination :pagination="userManager.pagination"/>
        </template>
      </div>
      <iNETComponent name="ModalDelete"/>
      <iNETComponent name="ModalImportFileExcel" :modal-show="ModalImportExcel"
                     @update:modal-show="ModalImportExcel = false"/>
      <account-manager-add/>
      <account-manager-mail-group-create/>
      <!--      BEGIN: Basic Non Sticky Notification Content-->
      <Notification refKey="accAsync" :options="{
                  duration: 3000,
                }" class="flex flex-col sm:flex-row">
        <div class="font-medium">
          <div class="w-12 h-12 mx-auto">
            <svg
                width="25"
                viewBox="0 0 120 30"
                xmlns="http://www.w3.org/2000/svg"
                fill="white"
                class="w-full h-full"
            >
              <circle cx="15" cy="15" r="15">
                <animate
                    attributeName="r"
                    from="15"
                    to="15"
                    begin="0s"
                    dur="0.8s"
                    values="15;9;15"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="fill-opacity"
                    from="1"
                    to="1"
                    begin="0s"
                    dur="0.8s"
                    values="1;.5;1"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
              </circle>
              <circle cx="60" cy="15" r="9" fill-opacity="0.3">
                <animate
                    attributeName="r"
                    from="9"
                    to="9"
                    begin="0s"
                    dur="0.8s"
                    values="9;15;9"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="fill-opacity"
                    from="0.5"
                    to="0.5"
                    begin="0s"
                    dur="0.8s"
                    values=".5;1;.5"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
              </circle>
              <circle cx="105" cy="15" r="15">
                <animate
                    attributeName="r"
                    from="15"
                    to="15"
                    begin="0s"
                    dur="0.8s"
                    values="15;9;15"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
                <animate
                    attributeName="fill-opacity"
                    from="1"
                    to="1"
                    begin="0s"
                    dur="0.8s"
                    values="1;.5;1"
                    calcMode="linear"
                    repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
          {{ locale.accountSyncing }}
        </div>
      </Notification>
      <!-- END: Basic Non Sticky Notification Content -->
    </div>
    <!--    END: main page-->
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, provide, ref} from "vue";
import {createIcons, icons} from "lucide";
import AccountManagerAdd from "@/views/admin/account-manager/partial/AccountManagerAdd.vue";
import AccountManagerMailGroupCreate from "@/views/admin/account-manager/partial/AccountManagerMailGroupCreate.vue";
import GridView from "@/views/admin/account-manager/list-view/GridView.vue";
import GridView2 from "@/views/admin/account-manager/list-view/GridView2.vue";
import TableView from "@/views/admin/account-manager/list-view/TableView.vue";
import {IAdminUserManager} from "@/model/admin/dto/IAdminUserManager";
import {AdminUserManagerStore} from "@/stores/admin-store/user-manager/user-manager-store";
import {MyStore} from "@/stores/my-store";
import AdminPagination from "@/views/admin/share/components/AdminPagination.vue";
import SvgIcons from "@/global-components/svg-icons/Main.vue";
import AccManagerListViewHeader from "@/views/admin/account-manager/list-view/ListViewHeader.vue";

export default defineComponent({
  name: 'AdminAccountManager',
  data() {
    return {
      ListView: '',
      ModalImportExcel: false
    }
  },
  components: {
    SvgIcons,
    AdminPagination,
    TableView,
    GridView,
    GridView2,
    AccountManagerMailGroupCreate,
    AccountManagerAdd,
    AccManagerListViewHeader
  },
  mounted() {
    createIcons({icons, nameAttr: 'icon-name'});
    this.ListView = localStorage.getItem('accMngView') || 'TableView';
  },
  methods: {
    exportExcel() {
      var tab_text = "<table border='2px'><tr bgcolor='#87AFC6'>";
      var textRange, j = 0, sa;
      let tab = document.getElementById('headerTable'); // id of table

      for (j = 0; j < tab.rows.length; j++) {
        tab_text = tab_text + tab.rows[j].innerHTML + "</tr>";
      }

      tab_text = tab_text + "</table>";
      tab_text = tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
      tab_text = tab_text.replace(/<img[^>]*>/gi, ""); // remove if u want images in your table
      tab_text = tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

      var dataType = 'application/vnd.ms-excel';
      // Create download link element
      let downloadLink = document.createElement("a");
      let filename = 'excel_data.xls';

      document.body.appendChild(downloadLink);

      if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tab_text], {
          type: dataType
        });
        navigator.msSaveOrOpenBlob(blob, filename);
      } else {
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + encodeURIComponent(tab_text);

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();
      }
    }
  },
  setup() {
    const adminUserManagerStore = AdminUserManagerStore();
    const myStore = MyStore();
    const emitter = myStore.useEmitter();
    const userManager = computed(() => adminUserManagerStore.userManager as IAdminUserManager);
    const numberPage = computed({
      get: () => adminUserManagerStore.numberPage as number,
      set: (data) => adminUserManagerStore.numberPage = data,
    });
    const pageSize = computed({
      get: () => adminUserManagerStore.pageSize as number,
      set: (data) => adminUserManagerStore.pageSize = data,
    });
    const statusAccount = computed({
      get: () => adminUserManagerStore.statusAccount as string,
      set: (data) => adminUserManagerStore.statusAccount = data,
    });
    const nameAccount = computed({
      get: () => adminUserManagerStore.nameAccount as string,
      set: (data) => adminUserManagerStore.nameAccount = data,
    });
    const accAsync = ref();
    provide("bind[accAsync]", (el) => {
      accAsync.value = el;
    });
    // locale language
    const locale = computed(() => myStore.locale);

    async function accAsyncHandler() {
      accAsync.value.showToast();
      await adminUserManagerStore.initGetUserManagerList();
    }

    function showModalAddAccount() {
      emitter.emit('add-data-user-manager');
    }

    function showModalAddGroup() {
      emitter.emit('add-data-distribution');
    }

    onMounted(async () => {
      //listener reload data by status account
      emitter.on('reload-data-user-manager-by-status-account', async (status: string) => {
        if (status) {
          //change status account
          statusAccount.value = status === 'all' ? '' : '(zimbraAccountStatus=' + status + ')';
          //reload
          await adminUserManagerStore.initGetUserManagerList();
        }
      });
      //listener reload data by search account
      emitter.on('reload-data-user-manager-by-search-account', async (searchName: string) => {
        //change status account
        nameAccount.value = !searchName && searchName.length <= 0 ? '' : '(|(mail=*' + searchName + '*)(cn=*' + searchName + '*)(sn=*' + searchName + '*)(gn=*' + searchName + '*)(displayName=*' + searchName + '*)(zimbraMailDeliveryAddress=*' + searchName + '*))';
        //reload
        await adminUserManagerStore.initGetUserManagerList();
      });
      //listener reload data by page number
      emitter.on('reload-data-user-manager-by-page-number', async (data: number) => {
        if (data > 0) {
          //change page number
          numberPage.value = data;
          //reload
          await adminUserManagerStore.initGetUserManagerList();
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
          await adminUserManagerStore.initGetUserManagerList();
        }
      });
      //init method without emit
      await adminUserManagerStore.initGetUserManagerList();
    });

    onDeactivated(() => {
      emitter.off('reload-data-user-manager-by-status-account');
      emitter.off('reload-data-user-manager-by-search-account');
      emitter.off('reload-data-user-manager-by-page-number');
      emitter.off('reload-data-user-manager-by-page-size');
    });

    return {
      locale,
      accAsync,
      userManager,
      accAsyncHandler,
      showModalAddAccount,
      showModalAddGroup,
    }
  }
})
</script>