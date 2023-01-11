<template>
  <div class="admin-spam-filter-input-deny">
    <div class="bg-white dark:bg-darkmode-600 rounded p-2 mb-5">
      <div class="flex flex-row-reverse items-center">
        <Dropdown placement="bottom-start" class="inline-block shrink-0">
          <DropdownToggle class="btn border-violet-600 dark:border-violet-600 text-violet-500 dark:text-violet-400">
            {{ locale.add }}
            <ChevronDownIcon class="w-4 h-4 ml-2"/>
          </DropdownToggle>
          <DropdownMenu class="w-56">
            <DropdownContent>
              <DropdownItem @click="actionShowModalAddFilter(mailAddress)">
                <MailIcon class="w-4 h-4 mr-2"/>
                {{ mailAddress }}
              </DropdownItem>
              <DropdownItem @click="actionShowModalAddFilter(domain)">
                <GlobeIcon class="w-4 h-4 mr-2"/>
                {{ domain }}
              </DropdownItem>
              <DropdownItem @click="actionShowModalAddFilter(ipAddress)">
                <ItalicIcon class="w-4 h-4 mr-2"/>
                {{ ipAddress }}
              </DropdownItem>
              <DropdownItem @click="actionShowModalAddFilter(regularExpression)">
                <FilterIcon class="w-4 h-4 mr-2"/>
                {{ regularExpression }}
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
        <div class="grow">
          <div class="relative inline-block">
            <input type="search" class="form-control dark:bg-darkmode-300 shadow-none pr-12" v-model="filterText"
                   :placeholder="locale.search"/>
            <button type="button" class="absolute btn text-slate-500 right-0 inset-y-0 border-none" @click="findByValue">
              <SearchIcon class="w-4 h-4"/>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="overflow-x-auto bg-white dark:bg-darkmode-600">
      <table class="table table-hover" v-if="whoDetailDisplay.whoDetail.length > 0">
        <thead>
          <tr>
            <th class="cursor-pointer hover:bg-slate-200/50 dark:hover:bg-darkmode-400" @click="sortBy('type')">
              <div class="flex items-center">
                <span class="grow">{{ locale.type }}</span>
                <ChevronUpIcon class="w-4 h-4" v-if="filter.type"/>
                <ChevronDownIcon class="w-4 h-4" v-else/>
              </div>
            </th>
            <th class="whitespace-nowrap cursor-pointer hover:bg-slate-200/50 dark:hover:bg-darkmode-400" @click="sortBy('value')">
              <div class="flex items-center">
                <span class="grow">{{ locale.value }}</span>
                <ChevronUpIcon class="w-4 h-4" v-if="filter.value"/>
                <ChevronDownIcon class="w-4 h-4" v-else/>
              </div>
            </th>
            <th class="w-40 text-right">
              {{ locale.action }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in whoDetailDisplay.whoDetail" :key="item.id">
            <td>
              <div class="flex items-center">
                <FilterIcon class="w-4 h-4 mr-2" v-if="item.type === regularExpression"/>
                <GlobeIcon class="w-4 h-4 mr-2" v-else-if="item.type === domain"/>
                <ItalicIcon class="w-4 h-4 mr-2" v-else-if="item.type === ipAddress"/>
                <MailIcon class="w-4 h-4 mr-2" v-else/>
                {{ item.type }}
              </div>
            </td>
            <td>
              {{ item.value }}
            </td>
            <td class="text-right">
              <div class="-mx-1.5">
                <Tippy tag="button" :content="locale.modify" type="button"
                       class="btn btn-sm border-slate-300 dark:border-darkmode-200 m-1.5" @click="actionShowModalEditFilter(item)">
                  <Edit3Icon class="w-4 h-4"/>
                </Tippy>
                <Tippy tag="button" :content="locale.delete" type="button" class="btn btn-sm btn-outline-danger m-1.5"
                       @click="actionShowModalDeleteFilter(item)">
                  <TrashIcon class="w-4 h-4"/>
                </Tippy>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <template v-else>
        <iNETComponent name="AlertNotFound" :message="'<b>' + locale[$route.name] + '</b> ' + locale.notCreated"/>
      </template>
    </div>
  </div>
  <spam-filter-regular-expression />
  <spam-filter-email />
  <spam-filter-domain />
  <spam-filter-ip-adress />
  <iNETComponent name="ModalDelete" />
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, ref, watch} from "vue";
import SpamFilterRegularExpression from "@/views/admin/spam-filter/components/SpamFilterRegularExpression.vue";
import AdminPagination from "@/views/admin/share/components/AdminPagination.vue";
import SpamFilterEmail from "@/views/admin/spam-filter/components/SpamFilterEmail.vue";
import SpamFilterDomain from "@/views/admin/spam-filter/components/SpamFilterDomain.vue";
import SpamFilterIpAdress from "@/views/admin/spam-filter/components/SpamFilterIpAdress.vue";
import {MyStore} from "@/stores/my-store";
import {AdminMailGatewayStore} from "@/stores/admin-store/mail-gateway/mail-gateway-store";
import {FieldOfWhoDetail, IAdminWhoDetail} from "@/model/admin/dto/IAdminWhoDetail";
import {domain, inDeny, inWhitelist, ipAddress, mailAddress, outDeny, regularExpression} from "@/utils/MyVariables";
import {useRoute} from "vue-router";

export default defineComponent({
  name: 'AdminSpamFilterInputDeny',
  components: {SpamFilterIpAdress, SpamFilterDomain, SpamFilterEmail, AdminPagination, SpamFilterRegularExpression},
  setup() {
    //init value
    const route = useRoute();
    // locale language
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const adminMailGatewayStore = AdminMailGatewayStore();
    const emitter = myStore.useEmitter();
    const whoDetailStore = computed(() => getDataStoreByPath() as IAdminWhoDetail);
    const whoDetailDisplay = ref<IAdminWhoDetail>({
      whoId: '',
      objectName: inDeny,
      whoDetail: [] as FieldOfWhoDetail[]
    } as IAdminWhoDetail);
    const namePath = computed(() => getPathValueOfRoute() as string);
    const filterText = ref('');
    const filter = ref({
      type: false,
      value: false
    });

    function actionShowModalAddFilter(type: string){
      if(type === regularExpression){
        emitter.emit('add-filter-mail-gateway-regular-expression', whoDetailStore.value);
      }
      else if(type === mailAddress){
        emitter.emit('add-filter-mail-gateway-mail-address', whoDetailStore.value);
      }
      else if(type === domain){
        emitter.emit('add-filter-mail-gateway-domain', whoDetailStore.value);
      }
      else if(type === ipAddress){
        emitter.emit('add-filter-mail-gateway-ipaddress', whoDetailStore.value);
      }
    }

    function actionShowModalEditFilter(item: FieldOfWhoDetail){
      if(item.type === regularExpression){
        emitter.emit('edit-filter-mail-gateway-regular-expression', item);
      }
      else if(item.type === mailAddress){
        emitter.emit('edit-filter-mail-gateway-mail-address', item);
      }
      else if(item.type === domain){
        emitter.emit('edit-filter-mail-gateway-domain', item);
      }
      else if(item.type === ipAddress){
        emitter.emit('edit-filter-mail-gateway-ipaddress', item);
      }
    }

    function actionShowModalDeleteFilter(item: FieldOfWhoDetail) {
      emitter.emit('delete-data-who-detail', item);
    }

    function sortBy(sortBy) {
      if(filter.value[sortBy]){
        whoDetailStore.value.whoDetail.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        filter.value[sortBy] = false;
      }
      else{
        whoDetailStore.value.whoDetail.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        filter.value[sortBy] = true;
      }
    }

    function findByValue() {
      whoDetailDisplay.value.whoDetail = [];
      if(filterText.value){
        const findInData = whoDetailStore.value.whoDetail.filter(vl => vl.value.toLowerCase().includes(filterText.value.toLowerCase()));
        whoDetailDisplay.value.whoDetail.push(...findInData);
      }
      else{
        whoDetailDisplay.value.whoDetail.push(...whoDetailStore.value.whoDetail);
      }
    }

    async function setDataInStoreToDisplay() {
      if(namePath.value === 'input-deny'){
        await adminMailGatewayStore.initGetWhoDetailInDeny();
        whoDetailDisplay.value.objectName = inDeny;
      }
      else if(namePath.value === 'out-deny'){
        await adminMailGatewayStore.initGetWhoDetailOutDeny();
        whoDetailDisplay.value.objectName = outDeny;
      }
      else if(namePath.value === 'white-list'){
        await adminMailGatewayStore.initGetWhoDetailInWhitelist();
        whoDetailDisplay.value.objectName = inWhitelist;
      }
      else{
        await adminMailGatewayStore.initGetWhoDetailInDeny();
        whoDetailDisplay.value.objectName = inDeny;
      }
      whoDetailDisplay.value.whoId = whoDetailStore.value.whoId;
      whoDetailDisplay.value.whoDetail = [];
      whoDetailDisplay.value.whoDetail.push(...whoDetailStore.value.whoDetail);
    }

    function getPathValueOfRoute(){
      const findIndex = route.path.lastIndexOf("/");
      if(findIndex){
        return route.path.substring(findIndex + 1);
      }
      return '';
    }

    function getDataStoreByPath(){
      if(namePath.value === 'input-deny'){
        return adminMailGatewayStore.whoDetailInDeny;
      }
      else if(namePath.value === 'out-deny'){
        return adminMailGatewayStore.whoDetailOutDeny;
      }
      else if(namePath.value === 'white-list'){
        return adminMailGatewayStore.whoDetailInWhitelist;
      }
      else{
        return adminMailGatewayStore.whoDetailInDeny;
      }
    }

    watch(() => namePath.value, async value => {
      if (value) {
        await setDataInStoreToDisplay();
      }
    });

    onMounted(async () => {
      await setDataInStoreToDisplay();
      //lang nghe su kien reload data
      emitter.on('reload-filter-mail-gateway-regular-expression', async () => {
        await setDataInStoreToDisplay();
      });
      //lang nghe su kien reload data
      emitter.on('reload-filter-mail-gateway-mail-address', async () => {
        await setDataInStoreToDisplay();
      });
      //lang nghe su kien reload data
      emitter.on('reload-filter-mail-gateway-domain', async () => {
        await setDataInStoreToDisplay();
      });
      //lang nghe su kien reload data
      emitter.on('reload-filter-mail-gateway-ipaddress', async () => {
        await setDataInStoreToDisplay();
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
      filterText,
      regularExpression,
      mailAddress,
      domain,
      ipAddress,
      whoDetailDisplay,
      actionShowModalAddFilter,
      actionShowModalEditFilter,
      actionShowModalDeleteFilter,
      sortBy,
      findByValue,
      filter,
    }
  }
})
</script>