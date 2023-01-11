<template>
  <div class="admin-spam-filter">
    <div class="grid gap-6" :class="{'grid-cols-1': $route.path === '/admin/dashboard', 'grid-cols-3': $route.path !== '/admin/dashboard'}">
      <div class="bg-white dark:bg-darkmode-600 px-5 py-3 rounded flex items-center" v-for="(data, index) in whoDetailListStore">
        <div class="shrink-0 text-3xl w-16 h-16 bg-slate-200 text-slate-600 dark:bg-darkmode-200 dark:text-white/50 rounded-full flex items-center justify-center">
          <span class="truncate block">
            {{ data.whoDetail.length }}
          </span>
        </div>
        <div class="grow py-2 pl-5 flex items-start">
          <div class="grow">
            <h4 class="text-base mb-2">
              {{ locale[filterList[index].title] }}
            </h4>
            <router-link :to="filterList[index].path" class="btn btn-sm dark:bg-primary">
              {{ locale.setting }}
              <ChevronsRightIcon class="w-4 h-4"/>
            </router-link>
          </div>
          <Dropdown class="inline-block">
            <DropdownToggle class="btn px-2 dark:border-darkmode-200" :title="locale.addFilter">
              <MoreVerticalIcon class="w-4 h-4"/>
            </DropdownToggle>
            <DropdownMenu class="w-56">
              <DropdownContent>
                <DropdownItem @click="actionShowModalAddFilter(mailAddress, data)">
                  <MailIcon class="w-4 h-4 mr-2"/>
                  {{ locale['mailAddress'] }}
                </DropdownItem>
                <DropdownItem @click="actionShowModalAddFilter(domain, data)">
                  <GlobeIcon class="w-4 h-4 mr-2"/>
                  {{ locale['domain'] }}
                </DropdownItem>
                <DropdownItem @click="actionShowModalAddFilter(regularExpression, data)">
                  <FilterIcon class="w-4 h-4 mr-2"/>
                  {{ locale['regularExpression'] }}
                </DropdownItem>
                <DropdownItem @click="actionShowModalAddFilter(ipAddress, data)">
                  <ItalicIcon class="w-4 h-4 mr-2"/>
                  {{ locale['ipAddress'] }}
                </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  </div>
  <spam-filter-regular-expression/>
  <spam-filter-email/>
  <spam-filter-domain/>
  <spam-filter-ip-adress/>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted} from "vue";
import SpamFilterRegularExpression from "@/views/admin/spam-filter/components/SpamFilterRegularExpression.vue";
import SpamFilterEmail from "@/views/admin/spam-filter/components/SpamFilterEmail.vue";
import SpamFilterDomain from "@/views/admin/spam-filter/components/SpamFilterDomain.vue";
import SpamFilterIpAdress from "@/views/admin/spam-filter/components/SpamFilterIpAdress.vue";
import {AdminMailGatewayStore} from "@/stores/admin-store/mail-gateway/mail-gateway-store";
import {IAdminWhoDetail} from "@/model/admin/dto/IAdminWhoDetail";
import {domain, ipAddress, mailAddress, regularExpression} from "@/utils/MyVariables";
import {MyStore} from "@/stores/my-store";

export default defineComponent({
  name: 'AdminSpamFilter',
  components: {SpamFilterIpAdress, SpamFilterDomain, SpamFilterEmail, SpamFilterRegularExpression},
  setup() {
    //init value
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const adminMailGatewayStore = AdminMailGatewayStore();
    const emitter = myStore.useEmitter();
    const whoDetailListStore = computed(() => adminMailGatewayStore.whoDetailList as IAdminWhoDetail[]);
    const filterList = [
      {
        title: 'filterBlockIncoming',
        path: '/admin/spam-filter/input-deny',
      },
      {
        title: 'filterBlockOutgoing',
        path: '/admin/spam-filter/out-deny',
      },
      {
        title: 'filterAllowReceive',
        path: '/admin/spam-filter/white-list',
      }
    ];

    function actionShowModalAddFilter(type: string, whoDetail: IAdminWhoDetail){
      if(type === regularExpression){
        emitter.emit('add-filter-mail-gateway-regular-expression', whoDetail);
      }
      else if(type === mailAddress){
        emitter.emit('add-filter-mail-gateway-mail-address', whoDetail);
      }
      else if(type === domain){
        emitter.emit('add-filter-mail-gateway-domain', whoDetail);
      }
      else if(type === ipAddress){
        emitter.emit('add-filter-mail-gateway-ipaddress', whoDetail);
      }
    }

    onMounted(async () => {
      await adminMailGatewayStore.initGetAllWhoDetail();
      //lang nghe su kien reload data
      emitter.on('reload-filter-mail-gateway-regular-expression', async () => {
        await adminMailGatewayStore.initGetAllWhoDetail();
      });
      //lang nghe su kien reload data
      emitter.on('reload-filter-mail-gateway-mail-address', async () => {
        await adminMailGatewayStore.initGetAllWhoDetail();
      });
      //lang nghe su kien reload data
      emitter.on('reload-filter-mail-gateway-domain', async () => {
        await adminMailGatewayStore.initGetAllWhoDetail();
      });
      //lang nghe su kien reload data
      emitter.on('reload-filter-mail-gateway-ipaddress', async () => {
        await adminMailGatewayStore.initGetAllWhoDetail();
      });
    });

    onDeactivated(() => {
      emitter.off('reload-filter-mail-gateway-regular-expression');
      emitter.off('reload-filter-mail-gateway-mail-address');
      emitter.off('reload-filter-mail-gateway-domain');
      emitter.off('reload-filter-mail-gateway-ipaddress');
    });

    return {
      locale,
      filterList,
      whoDetailListStore,
      actionShowModalAddFilter,
      regularExpression,
      mailAddress,
      domain,
      ipAddress,
    }
  }
})
</script>