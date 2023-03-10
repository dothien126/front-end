<template>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" class="acc-manager-add" :show="accMngToogle" @hidden="accMngToogle = false">
    <ModalBody>
      <div>
        <div class="mb-3">
          <label class="form-label flex items-center">
            {{ localeAdmin.nameDisplay }}
            <Tippy tag="span" :options="{zIndex: 10001}" :content="localeAdmin.shortDescription" class="ml-2">
              <InfoIcon class="w-4 h-4"/>
            </Tippy>
          </label>
          <input type="text" class="form-control" v-model="formData.displayName"
                 :placeholder="localeAdmin.exName"/>
        </div>
        <div class="mb-3">
          <label class="form-label mb-1">{{ localeAdmin.account }}</label>
          <div class="input-group">
            <input type="text" class="form-control" v-model="formData.account" :disabled="hasDisabledInputAccount"
                   :placeholder="localeAdmin.exAccount" aria-label="Price"
                   aria-describedby="input-group-domain"/>
            <div class="input-group-text">@{{ myAdminCompanyUser.domain }}</div>
          </div>
        </div>
        <div class="mb-3">
          <label class="mb-1">{{ localeAdmin.password }}</label>
          <div class="input-group mt-2">
            <input :type="passShowHide ? 'text' : 'password'" class="form-control" v-model="formData.password"
                   :placeholder="localeAdmin.exPassword"
                   aria-label="Price" aria-describedby="input-group-password"/>
            <div class="input-group-btn">
              <button type="button" class="btn btn-secondary h-full rounded-l-none"
                      @click="passShowHide = !passShowHide">
                <EyeIcon v-if="passShowHide" class="w-4 h-4"/>
                <EyeOffIcon v-else class="w-4 h-4"/>
              </button>
            </div>
          </div>
          <div class="mt-3">
            <button type="button" class="btn btn-secondary btn-sm" @click="actionGenPass">
              {{ localeAdmin.selfGenPassword }}
            </button>
          </div>
        </div>
        <div class="mb-3">
          <label class="flex items-center mb-1">
            {{ localeAdmin.capacity }}
            <Tippy tag="span" :options="{zIndex: 10001}" :content="localeAdmin.contentCapacity"
                   class="ml-2">
              <InfoIcon class="w-4 h-4"/>
            </Tippy>
          </label>
          <div class="input-group">
            <input type="number" minlength="0" class="form-control" v-model="formData.quota"
                   :placeholder="localeAdmin.exCapacity" :aria-label="localeAdmin.capacity" aria-describedby="input-group-storage"/>
            <div class="input-group-text">MB</div>
          </div>
        </div>
        <div class="mb-3">
          <label class="flex items-center mb-1">
            {{ localeAdmin.forwardTo }}
            <Tippy tag="span" :options="{zIndex: 10001}" :content="localeAdmin.contentMailForward" class="ml-2">
              <InfoIcon class="w-4 h-4"/>
            </Tippy>
          </label>
          <vue3-tags-input :tags="formData.forwardMailSelected" class="form-control"
                           :validate="emailValidate"
                           @on-tags-changed="handleChangeTag"
                           :placeholder="localeAdmin.exEmail" />
        </div>
        <div class="mb-3">
          <label class="flex items-center mb-1">
            {{ localeAdmin.mailgroup }}
            <Tippy tag="span" :options="{zIndex: 10001}" :content="localeAdmin.contentGroupMail" class="ml-2">
              <InfoIcon class="w-4 h-4"/>
            </Tippy>
          </label>
          <TomSelect v-model="formData.distributionSelected" :options="{
                  create: false,
                  placeholder: localeAdmin.exGroup,
                }" class="w-full" multiple>
            <option v-for="item in distributionAllList.distributionList" :value="item.id" :key="item">
              {{ item.displayName ? item.displayName : item.name }}
            </option>
          </TomSelect>
        </div>
        <div class="mb-3">
          <label class="mb-1">{{ localeAdmin.status }}</label>
          <select class="form-select" :aria-label="localeAdmin.status" v-model="formData.status">
            <option v-for="item in valueNoAllStatusAccount" :key="item" :value="item.value">{{ localeAdmin[item.name] }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="mb-1">{{ localeAdmin.description }}</label>
          <textarea rows="3" cols="3" v-model="formData.description" :placeholder="localeAdmin.exDesMore"
                    class="form-control"></textarea>
        </div>
      </div>
      <div class="text-right -mx-2">
        <button type="button" @click="accMngToogle = false" class="btn btn-secondary my-1 mx-2">
          {{ localeAdmin['cancel'] }}
        </button>
        <button type="button" @click="saveAndClose()" class="btn btn-primary my-1 mx-2">
          {{ localeAdmin['saveAndClose'] }}
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Modal Content -->
  <!-- BEGIN: Notification Content -->
  <Notification refKey="saveNotify" class="flex" :options="{
                  duration: 1500,
                }">
    <CheckCircleIcon class="text-success"/>
    <div class="ml-4 mr-4">
      <div class="font-medium">{{ localeAdmin.addAccountSuccess }}</div>
      <div class="text-slate-500 mt-1">
        
      </div>
    </div>
  </Notification>
  <!-- END: Notification Content -->
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, provide, reactive, ref, watch} from "vue";
import {MyStore} from "@/stores/my-store";
import {ResponseData} from "@/model/ResponseData";
import {genPassword, isEmailValid, showToastMessage} from "@/utils/MyFunction";
import AdminDistributionService from "@/service/admin/AdminDistributionService";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {IAdminDistribution, IDistribution} from "@/model/admin/dto/IAdminDistribution";
import {IAdminCompanyUser} from "@/model/admin/dto/IAdminCompanyUser";
import {VALUE_NO_ALL_STATUS_ACCOUNT} from "@/utils/MyVariables";
import {AFieldOfCreateAccountRequest, IAdminCreateAccountRequest} from "@/model/admin/IAdminCreateAccountRequest";
import AdminUserManagerService from "@/service/admin/AdminUserManagerService";
import {IUserAccount} from "@/model/admin/dto/IAdminUserManager";
import {AdminUserManagerStore} from "@/stores/admin-store/user-manager/user-manager-store";
import AdminAccountService from "@/service/admin/AdminAccountService";
import {AFieldOfModifyAccountRequest, IAdminModifyAccountRequest} from "@/model/admin/IAdminModifyAccountRequest";
import Vue3TagsInput from 'vue3-tags-input';
import {AdminDistributionStore} from "@/stores/admin-store/distribution/distribution-store";

export default defineComponent({
  name: 'AccountManagerAdd',
  components: {Vue3TagsInput},
  data() {
    return {
      passShowHide: false,
    }
  },
  setup() {
    const myStore = MyStore();
    const adminStore = MyAdminStore();
    const adminUserManagerStore = AdminUserManagerStore();
    const adminDistributionStore = AdminDistributionStore();
    const emitter = myStore.useEmitter();
    // locale language
    const localeAdmin = computed(() => myStore.locale);
    const myJwt = computed(() => adminStore.myAdminJwt);
    const myAdminCompanyUser = computed(() => adminStore.myAdminCompanyUser as IAdminCompanyUser);
    const accMngToogle = ref(false);
    const hasDisabledInputAccount = ref(false);
    // Success notification
    const saveNotify = ref();
    provide("bind[saveNotify]", (el) => {
      saveNotify.value = el;
    });

    const valueNoAllStatusAccount = VALUE_NO_ALL_STATUS_ACCOUNT;
    const distributionAllList = computed(() => adminDistributionStore.distributionAllList as IAdminDistribution);
    const forwardMailList = ref<string[]>([]);
    const distributionWhenEditOrigin = ref<string[]>([]);
    const distributionRemoveSelected = ref<string[]>([]);
    const formData = reactive({
      id: '',
      displayName: '',
      account: '',
      password: '',
      quota: 512,
      status: valueNoAllStatusAccount[0].value,
      description: '',
      forwardMailSelected: [] as string[],
      distributionSelected: [] as string[],
    });

    async function actionGenPass() {
      //gen pass
      formData.password = genPassword();
    }

    function resetValueFormData() {
      formData.id = '';
      formData.displayName = '';
      formData.account = '';
      formData.password = '';
      formData.quota = 512;
      formData.status = valueNoAllStatusAccount[0].value;
      formData.description = '';
      formData.forwardMailSelected = [] as string[];
      formData.distributionSelected = [] as string[];
      hasDisabledInputAccount.value = false;
    }

    function emailValidate(value) {
      return isEmailValid(value);
    }

    function handleChangeTag(tags){
      formData.forwardMailSelected = tags;
    }

    async function saveAndClose() {
      //init value account
      const account = formData.account + "@" + myAdminCompanyUser.value.domain;
      //init request
      let itemCreateUpdate;
      if(formData.id){
        itemCreateUpdate = {
          id: formData.id,
          a: [] as AFieldOfModifyAccountRequest[]
        } as IAdminModifyAccountRequest;
      }
      else{
        itemCreateUpdate = {
          name: account,
          password: formData.password,
          a: [] as AFieldOfCreateAccountRequest[]
        } as IAdminCreateAccountRequest;
      }
      //init value displayName
      const displayName = {n: 'displayName', _content: formData.displayName};
      //init value quota
      const quota = {n: 'zimbraMailQuota', _content: String(formData.quota)};
      //init value status
      const status = {n: 'zimbraAccountStatus', _content: formData.status};
      //init value description
      const description = {n: 'description', _content: formData.description};
      //init value forward mail
      const forwardMail = {
        n: 'zimbraPrefMailForwardingAddress',
        _content: formData.forwardMailSelected.join(',')
      };
      //set to value request
      itemCreateUpdate.a.push(displayName, quota, status, description, forwardMail);
      //call request (n???u id t???n t???i l?? ??ang s???a, ng?????c l???i l?? th??m m???i)
      const response = formData.id ? await AdminAccountService.modifyAccount(itemCreateUpdate, myJwt.value) : await AdminUserManagerService.createAccount(itemCreateUpdate, myJwt.value);
      if (response.data) {
        const responseData: ResponseData = response.data;
        if (!responseData.values.error) {
          //Ti???p t???c add member v??o distribution n???u c?? gi?? tr???
          if (formData.distributionSelected.length > 0) {
            await addMemberDistributionByUserManager(account);
          }
          //Ti???p t???c remove member n???u c?? gi?? tr???
          if(distributionRemoveSelected.value.length > 0){
            await removeMemberDistributionByUserManager(account);
          }
          //Th??ng b??o th??nh c??ng
          accMngToogle.value = false;
          saveNotify.value.showToast();
          //reload data
          await adminUserManagerStore.initGetUserManagerList();
        } else {
          showToastMessage(responseData.values.error, true);
        }
      }
    }

    async function removeMemberDistributionByUserManager(account: string) {
      //init value
      const datasOfDistribution = [] as IDistribution[];
      for (const item of distributionRemoveSelected.value) {
        const data = {id: item, member: [account] as string[]} as IDistribution;
        datasOfDistribution.push(data);
      }
      //init request
      const itemCreate = {distributionList: datasOfDistribution} as IAdminDistribution;
      //call request no response
      await AdminDistributionService.removeMemberDistributionByUserManager(itemCreate, myJwt.value);
    }

    async function addMemberDistributionByUserManager(account: string) {
      //init value
      const datasOfDistribution = [] as IDistribution[];
      for (const item of formData.distributionSelected) {
        const data = {id: item, member: [account] as string[]} as IDistribution;
        datasOfDistribution.push(data);
      }
      //init request
      const itemCreate = {distributionList: datasOfDistribution} as IAdminDistribution;
      //call request no response
      await AdminDistributionService.addMemberDistributionByUserManager(itemCreate, myJwt.value);
    }

    //L???ng nghe s??? thay ?????i data (distribution), ch??? y???u x??? l?? logic khi remove gi?? tr??? trong danh s??ch g???c
    watch(() => formData.distributionSelected, (values) => {
      if(formData.id && values){
        const dataHasRemoved: string[] = [];
        for(const item of distributionWhenEditOrigin.value){
          const findInListChange = values.find(value => value === item);
          if(!findInListChange){
            dataHasRemoved.push(item);
          }
        }
        distributionRemoveSelected.value = dataHasRemoved;
      }
    });

    onMounted(async () => {
      await adminDistributionStore.initGetAllDistribution();
      //l???ng nghe s??? ki???n n???u th??m m???i
      emitter.on('add-data-user-manager', () => {
        resetValueFormData();
        accMngToogle.value = true;
      });
      //L???ng nghe s??? ki???n n???u ch???nh s???a
      emitter.on('edit-data-user-manager', (data: IUserAccount) => {
        if (data) {
          //form data
          formData.id = data.zimbraUserId;
          formData.displayName = data.displayName;
          formData.account = data.account.replace("@" + myAdminCompanyUser.value.domain, "");
          formData.password = '';
          formData.status = data.status;
          formData.quota = Math.floor(data.dataMax / 1048576); //v?? response l?? ki???u bytes, n??n c???n chuy???n v??? megabytes
          formData.description = data.description;
          //forward mail
          forwardMailList.value = data.forwardAddressList;
          formData.forwardMailSelected = data.forwardAddressList;
          //group mail
          formData.distributionSelected = data.groupMailList.map(value => value.id);
          distributionWhenEditOrigin.value = data.groupMailList.map(value => value.id); // l??u v??o bi???n temp ????? ki???m tra khi user remove
          //show modal
          accMngToogle.value = true;
          //disable input account
          hasDisabledInputAccount.value = true;
        }
      });
    });

    onDeactivated(() => {
      emitter.off('add-data-user-manager');
      emitter.off('edit-data-user-manager');
    });

    return {
      localeAdmin,
      myAdminCompanyUser,
      formData,
      valueNoAllStatusAccount,
      forwardMailList,
      actionGenPass,
      emailValidate,
      handleChangeTag,
      saveAndClose,
      accMngToogle,
      hasDisabledInputAccount,
      distributionAllList,
    }
  }
})
</script>
<style lang="css">
.v3ti .v3ti-tag {
  background: #a4b1d0;
  /*border: 1px solid #222222;*/
  /*border-radius: 0;*/
}

.v3ti .v3ti-tag .v3ti-remove-tag {
  color: #000000;
  transition: color .3s;
}

.v3ti .v3ti-tag .v3ti-remove-tag:hover {
  color: #ffffff;
}
</style>