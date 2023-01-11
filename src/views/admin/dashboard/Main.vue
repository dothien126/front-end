<template>
  <div class="admin-dashboard">
    <div class="mb-6 bg-white dark:bg-darkmode-600 rounded p-3">
      <div class="flex items-center">
        <h3 class="text-xl pr-3">{{locale.brandConfig}}</h3>
        <router-link :title="locale.modifyInformation" class="btn btn-outline-secondary text-slate-600 rounded-full px-2 shrink-0" to="/admin/organization">
          <EditIcon class="w-4 h-4"/>
        </router-link>
      </div>
      <admin-organization></admin-organization>
    </div>
    <div class="mb-6">
      <admin-email-verify />
    </div>
    <div class="mb-6 bg-white dark:bg-darkmode-600 p-5 rounded shadow">
      <div class="flex items-center mb-3">
        <h3 class="mb-3 text-xl grow">{{locale.manageAccount}}</h3>
        <div class="flex items-center -mx-2">
          <router-link class="btn btn-sm btn-primary my-1.5 mx-2" to="/admin/account-manager">
            {{locale.detail}} <ChevronsRightIcon class="w-4 h-4 ml-2"/>
          </router-link>
<!--          <Dropdown class="inline-block my-1.5">
            <DropdownToggle class="btn btn-outline-secondary dark:text-slate-600 btn-sm">
              <MoreVerticalIcon class="w-4 h-4"/>
            </DropdownToggle>
            <DropdownMenu class="w-40">
              <DropdownContent>
                <DropdownItem>New Dropdown</DropdownItem>
                <DropdownItem>Delete Dropdown</DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>-->
        </div>
      </div>
      <acc-mng-table-view></acc-mng-table-view>
    </div>
    <div>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div class="lg:col-span-6">
          <div>
            <h3 class="mb-3 text-xl">{{locale.mailFilter}}</h3>
            <admin-spam-filter></admin-spam-filter>
          </div>
        </div>
        <div class="lg:col-span-6">
          <div class="h-full flex flex-col">
            <div class="flex items-center mb-3">
              <h3 class="text-xl grow">{{locale.sendReceiveMail}}</h3>
              <div class="flex items-center">
                <router-link class="flex items-center text-blue-600 dark:text-blue-400 hover:underline" to="/admin/email-tracker">
                  {{locale.detail}} <ChevronsRightIcon class="w-4 h-4 ml-2"/>
                </router-link>
                <!--            <Dropdown class="inline-block my-1.5">
                              <DropdownToggle class="btn btn-outline-secondary dark:text-slate-600 btn-sm">
                                <MoreVerticalIcon class="w-4 h-4"/>
                              </DropdownToggle>
                              <DropdownMenu class="w-40">
                                <DropdownContent>
                                  <DropdownItem>New Dropdown</DropdownItem>
                                  <DropdownItem>Delete Dropdown</DropdownItem>
                                </DropdownContent>
                              </DropdownMenu>
                            </Dropdown>-->
              </div>
            </div>
            <div class="bg-white dark:bg-darkmode-600 p-5 rounded grow">
              <admin-email-tracker></admin-email-tracker>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {computed, defineComponent} from "vue";
  import AdminOrganization from "@/views/admin/organization/Main.vue";
  import AdminSpamFilter from "@/views/admin/spam-filter/components/AdminSpamFilter.vue";
  import AccMngTableView from "@/views/admin/account-manager/list-view/TableView.vue";
  import AdminEmailTracker from "@/views/admin/email-tracker/components/AdminEmailTracker.vue";
  import AdminInstallSsl from "@/views/admin/ssl/components/AdminInstallSsl.vue";
  import AdminEmailVerify from "@/views/admin/dashboard/email-verify/Main.vue";
  import {MyAdminStore} from "@/stores/admin-store/admin-store";
  import { MyStore } from "@/stores/my-store";

  export default defineComponent({
    name: 'AdminDashboard',
    components: {
      AdminEmailVerify,
      AdminInstallSsl, AdminSpamFilter, AdminOrganization, AccMngTableView, AdminEmailTracker },
    setup() {
      //init value
      const adminStore = MyAdminStore();
      // locale language
      const myStore = MyStore();
      const locale = computed(() => myStore.locale);
      const myAdminCompanyUser = computed(() => adminStore.myAdminCompanyUser);

      return {
        locale,
        myAdminCompanyUser,
      }
    }
  })

</script>

<style lang="scss"></style>