<template>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" class="acc-manager-add" :show="accMngToogle" @hidden="accMngToogle = false">
    <ModalBody>
      <div>
        <div class="mb-3">
          <label class="form-label flex items-center">
            {{ localeAdmin.nameMailGroup }}
            <Tippy tag="span" :options="{zIndex: 10001}" :content="localeAdmin.contentNameGroup" class="ml-2">
              <InfoIcon class="w-4 h-4"/>
            </Tippy>
          </label>
          <input type="text" class="form-control" v-model="formData.displayName" :placeholder="locale.exNameGroup"/>
        </div>
        <div class="mb-3">
          <label class="flex items-center mb-1">
            {{ localeAdmin.accountInGroup }}
            <Tippy tag="span" :options="{zIndex: 10001}" :content="localeAdmin.exAddAccount" class="ml-2">
              <InfoIcon class="w-4 h-4"/>
            </Tippy>
          </label>
          <TomSelect v-model="formData.accountSelected" :options="{
                  create: false,
                  placeholder: localeAdmin.exSelectEmail,
                }" class="w-full" multiple>
            <option v-for="item in accountList.userList" :value="item.account">
              {{ item.account }}
            </option>
          </TomSelect>
        </div>
        <div class="mb-3">
          <label class="form-label mb-1">Email</label>
          <div class="input-group">
            <input type="text" class="form-control" v-model="formData.account" :disabled="hasDisabledInputName" :placeholder="localeAdmin.exGroupDomain" aria-label="Price"
                   aria-describedby="input-group-domain"/>
            <div id="input-group-domain" class="input-group-text">@{{ myAdminCompanyUser.domain }}</div>
          </div>
        </div>
        <div class="mb-3">
          <label class="mb-1">{{ localeAdmin.status }}</label>
          <select class="form-select" :aria-label="localeAdmin.status" v-model="formData.status">
            <option v-for="item in valueStatusDistribution" :key="item" :value="item.value">{{ item.name }}</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="mb-1">{{ localeAdmin.groupDescription }}</label>
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
      <div class="font-medium">{{ localeAdmin.updateGroupSuccess }}</div>
    </div>
  </Notification>
  <!-- END: Notification Content -->
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, provide, reactive, ref, watch} from "vue";
import {MyStore} from "@/stores/my-store";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {IAdminCompanyUser} from "@/model/admin/dto/IAdminCompanyUser";
import {VALUE_STATUS_DISTRIBUTION} from "@/utils/MyVariables";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {
  AFieldOfCreateDistributionListRequest,
  IAdminCreateDistributionListRequest
} from "@/model/admin/IAdminCreateDistributionListRequest";
import AdminDistributionService from "@/service/admin/AdminDistributionService";
import {IAdminDistribution, IDistribution} from "@/model/admin/dto/IAdminDistribution";
import { AdminUserManagerStore } from "@/stores/admin-store/user-manager/user-manager-store";
import {AdminDistributionStore} from "@/stores/admin-store/distribution/distribution-store";
import {AFieldOfModifyDistributionListRequest, IAdminModifyDistributionListRequest} from "@/model/admin/IAdminModifyDistributionListRequest";

export default defineComponent({
  name: 'AccountManagerMailGroupCreate',
  setup() {
    const myStore = MyStore();
    // locale language
    const locale = computed(() => myStore.locale);
    const localeAdmin = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    const adminStore = MyAdminStore();
    const adminUserManagerStore = AdminUserManagerStore();
    const adminDistributionStore = AdminDistributionStore();
    const myJwt = computed(() => adminStore.myAdminJwt);
    const myAdminCompanyUser = computed(() => adminStore.myAdminCompanyUser as IAdminCompanyUser);
    const accMngToogle = ref(false);
    const hasDisabledInputName = ref(false);
    // Success notification
    const saveNotify = ref();
    provide("bind[saveNotify]", (el) => {
      saveNotify.value = el;
    });
    const valueStatusDistribution = VALUE_STATUS_DISTRIBUTION;
    const accountList = computed(() => adminUserManagerStore.allAccountList);
    const memberWhenEditOrigin = ref<string[]>([]);
    const memberRemoveSelected = ref<string[]>([]);
    const formData = reactive({
      id: '',
      displayName: '',
      account: '',
      status: valueStatusDistribution[0].value,
      description: '',
      accountSelected: [] as string[],
    });

    function resetValueFormData() {
      formData.id = '';
      formData.displayName = '';
      formData.account = '';
      formData.status = valueStatusDistribution[0].value;
      formData.description = '';
      formData.accountSelected = [];
      hasDisabledInputName.value = false;
    }

    async function saveAndClose() {
      //init value account
      const account = formData.account + "@" + myAdminCompanyUser.value.domain;
      //init request
      let itemCreateUpdate;
      if(formData.id){
        itemCreateUpdate = {
          id: formData.id,
          a: [] as AFieldOfModifyDistributionListRequest[]
        } as IAdminModifyDistributionListRequest;
      }
      else{
        itemCreateUpdate = {
          name: account,
          a: [] as AFieldOfCreateDistributionListRequest[]
        } as IAdminCreateDistributionListRequest;
      }
      //init value displayName
      const displayName = {n: 'displayName', _content: formData.displayName};
      //init value status
      const status = {n: 'zimbraMailStatus', _content: formData.status};
      //init value status
      const description = {n: 'description', _content: formData.description};
      //set to value request
      itemCreateUpdate.a.push(displayName, status, description);
      //call request (nếu id tồn tại là đang sửa, ngược lại là thêm mới)
      const response = formData.id ? await AdminDistributionService.modifyDistributionList(itemCreateUpdate, myJwt.value) : await AdminDistributionService.createDistributionList(itemCreateUpdate, myJwt.value);
      if (response.data) {
        const responseData: ResponseData = response.data;
        if (!responseData.values.error) {
          //Tiếp tục add member vào distribution nếu có giá trị
          if (formData.accountSelected.length > 0) {
            //Lấy giá trị id để check nếu có add member thì set vào
            const bodyResponse = responseData.values as IAdminDistribution;
            if(bodyResponse.distributionList && bodyResponse.distributionList.length > 0){
              const distribution = bodyResponse.distributionList[0];
              if(distribution && distribution.id){
                //Tiếp tục add member vào distribution nếu có giá trị
                if (formData.accountSelected.length > 0) {
                  await addMemberDistributionByMailGroup(distribution.id);
                }
                //Tiếp tục remove member nếu có giá trị
                if(memberRemoveSelected.value.length > 0){
                  await removeMemberDistributionByMailGroup(distribution.id);
                }
              }
            }
          }
          //Thông báo thành công
          accMngToogle.value = false;
          saveNotify.value.showToast();
          //reload data
          await adminDistributionStore.initGetAllDistribution();
          await adminDistributionStore.initGetDistributionList();
        } else {
          showToastMessage(responseData.values.error, true);
        }
      }
    }

    async function addMemberDistributionByMailGroup(distributionId: string) {
      //init value
      const datasOfDistribution = [] as IDistribution[];
      const data = {id: distributionId, member: formData.accountSelected} as IDistribution;
      datasOfDistribution.push(data);
      //init request
      const itemCreate = {distributionList: datasOfDistribution} as IAdminDistribution;
      //call request no response
      await AdminDistributionService.addMemberDistributionByUserManager(itemCreate, myJwt.value);
    }

    async function removeMemberDistributionByMailGroup(distributionId: string) {
      //init value
      const datasOfDistribution = [] as IDistribution[];
      for (const item of memberRemoveSelected.value) {
        const data = {id: distributionId, member: [item] as string[]} as IDistribution;
        datasOfDistribution.push(data);
      }
      //init request
      const itemCreate = {distributionList: datasOfDistribution} as IAdminDistribution;
      //call request no response
      await AdminDistributionService.removeMemberDistributionByUserManager(itemCreate, myJwt.value);
    }

    //Lắng nghe sự thay đổi data (member), chủ yếu xử lý logic khi remove giá trị trong danh sách gốc
    watch(() => formData.accountSelected, (values) => {
      if(formData.id && values){
        const dataHasRemoved: string[] = [];
        for(const item of memberWhenEditOrigin.value){
          const findInListChange = values.find(value => value === item);
          if(!findInListChange){
            dataHasRemoved.push(item);
          }
        }
        memberRemoveSelected.value = dataHasRemoved;
      }
    });

    onMounted(async () => {
      await adminUserManagerStore.initGetAllAccount();
      //lắng nghe sự kiện nếu thêm mới
      emitter.on('add-data-distribution', () => {
        resetValueFormData();
        accMngToogle.value = true;
      });
      //Lắng nghe sự kiện nếu chỉnh sửa
      emitter.on('edit-data-distribution', (data: IDistribution) => {
        if (data) {
          //form data
          formData.id = data.id;
          formData.displayName = data.displayName;
          formData.account = data.name.replace("@" + myAdminCompanyUser.value.domain, "");
          formData.status = data.status;
          formData.description = data.description;
          formData.accountSelected = data.member;
          memberWhenEditOrigin.value = data.member;
          //show modal
          accMngToogle.value = true;
          //disable input account
          hasDisabledInputName.value = true;
        }
      });
    })

    onDeactivated(() => {
      emitter.off('add-data-distribution');
      emitter.off('edit-data-distribution');
    });

    return {
      locale,
      localeAdmin,
      myAdminCompanyUser,
      valueStatusDistribution,
      formData,
      accountList,
      saveAndClose,
      accMngToogle,
      hasDisabledInputName,
    }
  }
})
</script>