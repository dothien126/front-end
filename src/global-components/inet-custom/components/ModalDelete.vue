<template>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" :show="modalShowDel" @hidden="modalShowDel = false">
    <ModalBody>
      <div class="text-center">
        <div class="mb-5">
          <p class="text-2xl">{{ locale.areYouSure }} {{ locale.delete.toLowerCase() }} {{ modalTitle }}?</p>
        </div>
        <div class="-mx-2">
          <button type="button" id="close-modal-delete" @click="actionResetValueDelete" class="btn btn-secondary w-24 m-2">
            {{ locale['cancel'] }}
          </button>
          <button type="button" @click="actionDelete" class="btn btn-danger w-24 m-2">
            {{ locale['delete'] }}
          </button>
        </div>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Modal Content -->
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {IUserAccount} from "@/model/admin/dto/IAdminUserManager";
import {ResponseData} from "@/model/ResponseData";
import {actionConversation, showToastMessage} from "@/utils/MyFunction";
import AdminAccountService from "@/service/admin/AdminAccountService";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {AdminUserManagerStore} from "@/stores/admin-store/user-manager/user-manager-store";
import { IDistribution } from "@/model/admin/dto/IAdminDistribution";
import AdminDistributionService from "@/service/admin/AdminDistributionService";
import { IAdminDeleteDistributionListRequest } from "@/model/admin/IAdminDeleteDistributionListRequest";
import {AdminDistributionStore} from "@/stores/admin-store/distribution/distribution-store";
import { FieldOfWhoDetail } from "@/model/admin/dto/IAdminWhoDetail";
import AdminWhoService from "@/service/admin/mail-gateway/AdminWhoService";
import {IFilterRule} from "@/model/interface/IFilterRule";
import {MyFilterRuleStore} from "@/stores/filter-rule-store/filter-rule-store";
import {User} from "@/model/User";
import { Item } from "@/model/Conversation";
import {MyContactStore} from "@/stores/contact-store/contact-store";
import { ItemContact } from "@/model/Contact";
import {RequestNoResponse} from "@/model/RequestNoResponse";

export default defineComponent({
  name: 'ModalDelete',
  setup() {
    const myStore = MyStore();
    const adminStore = MyAdminStore();
    const adminUserManagerStore = AdminUserManagerStore();
    const adminDistributionStore = AdminDistributionStore();
    const myFilterRuleStore = MyFilterRuleStore();
    const contactStore = MyContactStore();
    const myJwt = computed(() => adminStore.myAdminJwt);
    const locale = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    const modalTitle = ref('');
    const modalShowDel = ref(false);
    const valueDelete = ref({
      id: '',
      type: '',
      whoId: '',
      account: '',
      filterRuleSelected: {} as IFilterRule,
      outgoingFilter: false,
      selectedBox: [] as string[],
      forever: false,
    });

    function actionResetValueDelete() {
      valueDelete.value.id = '';
      valueDelete.value.type = '';
      valueDelete.value.whoId = '';
      valueDelete.value.account = '';
      valueDelete.value.filterRuleSelected = {} as IFilterRule;
      valueDelete.value.outgoingFilter = false;
      valueDelete.value.forever = false;
      modalShowDel.value = false;
    }

    async function actionDelete() {
      //Nếu action kiểu user manager thì chỉ xóa data trong user manager
      if (valueDelete.value.type === 'user-manager') {
        //init request
        const userAccount = {zimbraUserId: valueDelete.value.id, account: modalTitle.value} as IUserAccount;
        //call request
        const response = await AdminAccountService.moveAccountToTrash(userAccount, myJwt.value);
        if (response.data) {
          const responseData: ResponseData = response.data;
          if (!responseData.values.error) {
            //reload data
            actionResetValueDelete();
            await adminUserManagerStore.initGetUserManagerList();
          } else {
            showToastMessage(responseData.values.error, true);
          }
        }
      }
      //xóa data trong user manager ngay
      else if (valueDelete.value.type === 'confirm-delete-user-manager') {
        //init request
        const itemRequest = {
          account: valueDelete.value.account,
          zimbraUserId: valueDelete.value.id,
        } as IUserAccount;
        //call request
        const response = await AdminAccountService.deleteAccount(itemRequest, myJwt.value);
        if (response.data) {
          const responseData: ResponseData = response.data;
          if (!responseData.values.error) {
            //reload data
            actionResetValueDelete();
            await adminUserManagerStore.initGetAllUserTrash();
          } else {
            showToastMessage(responseData.values.error, true);
          }
        }
      }
      //Nếu action kiểu distribution thì chỉ xóa data trong distribution
      else if (valueDelete.value.type === 'distribution') {
        //init request
        const distribution = {id: valueDelete.value.id} as IAdminDeleteDistributionListRequest;
        //call request
        const response = await AdminDistributionService.deleteDistributionList(distribution, myJwt.value);
        if (response.data) {
          const responseData: ResponseData = response.data;
          if (!responseData.values.error) {
            //reload data
            actionResetValueDelete();
            await adminDistributionStore.initGetAllDistribution();
            await adminDistributionStore.initGetDistributionList();
          } else {
            showToastMessage(responseData.values.error, true);
          }
        }
      }
      //Nếu action kiểu who detail thì chỉ xóa data trong who detail
      else if (valueDelete.value.type === 'who-detail') {
        //init request
        const itemDelete = {id: valueDelete.value.id, whoId: valueDelete.value.whoId} as FieldOfWhoDetail;
        //call request
        const response = await AdminWhoService.deleteWhoDetail(itemDelete, myJwt.value);
        if (response.data) {
          const responseData: ResponseData = response.data;
          if (!responseData.values.error) {
            //reload data
            actionResetValueDelete();
            emitter.emit('reload-filter-mail-gateway-regular-expression');
            emitter.emit('reload-filter-mail-gateway-mail-address');
            emitter.emit('reload-filter-mail-gateway-domain');
            emitter.emit('reload-filter-mail-gateway-ipaddress');
          } else {
            showToastMessage(responseData.values.error, true);
          }
        }
      }
      //Nếu action kiểu filter rule
      else if (valueDelete.value.type === 'filter-rule') {
        //remove in list
        myFilterRuleStore.removeFilterRuleSelected(valueDelete.value.filterRuleSelected, valueDelete.value.outgoingFilter);
        //call request
        await myFilterRuleStore.modifyFilterRule(valueDelete.value.outgoingFilter, true);
        //close modal
        actionResetValueDelete();
        //delected filter
        emitter.emit('modify-success-filter');
      }
      // Nếu action kiểu mail conversation
      else if (valueDelete.value.type === 'mail-conversation') {
        const op = valueDelete.value.forever ? 'delete' : 'trash';
        if (valueDelete.value.selectedBox.length > 0) {
          await actionConversation(valueDelete.value.selectedBox.join(','), op);
        } else if (valueDelete.value.id) { // id = conversationId
          await actionConversation(valueDelete.value.id, op);
        } else {
          showToastMessage(locale.value.noConversationSelected, true);
        }
        //reload data
        actionResetValueDelete();
        emitter.emit('reset-conversation');
      }
      // Nếu action kiểu contact
      else if (valueDelete.value.type === 'contact-data') {
        const op = valueDelete.value.forever ? 'delete' : 'trash';
        if (valueDelete.value.id) {
          //init request
          const itemFind = new RequestNoResponse();
          itemFind.itemId = valueDelete.value.id;
          itemFind.operation = op;
          //call request
          await contactStore.actionContactRequest(itemFind, true);
          //close modal
          actionResetValueDelete();
        } else {
          showToastMessage(locale.value.noConversationSelected, true);
        }
      }
    }

    onMounted(() => {
      //Lắng nghe sự kiện nếu xóa user
      emitter.on('delete-data-user-manager', (data: IUserAccount) => {
        if (data) {
          //set value
          modalTitle.value = data.account;
          valueDelete.value.id = data.zimbraUserId;
          valueDelete.value.type = 'user-manager';
          //show modal
          modalShowDel.value = true;
        }
      });
      //Lắng nghe sự kiện nếu xóa user ngay
      emitter.on('confirm-delete-data-user-manager', (user: User) => {
        if (user) {
          //set value
          modalTitle.value = user.account;
          valueDelete.value.account = user.account
          valueDelete.value.id = user.hasDeleted.zimbraUserId
          valueDelete.value.type = 'confirm-delete-user-manager';
          //show modal
          modalShowDel.value = true;
        }
      });
      //Lắng nghe sự kiện nếu xóa nhom
      emitter.on('delete-data-distribution', (data: IDistribution) => {
        if (data) {
          //set value
          modalTitle.value = data.name;
          valueDelete.value.id = data.id;
          valueDelete.value.type = 'distribution';
          //show modal
          modalShowDel.value = true;
        }
      });
      //Lắng nghe sự kiện nếu xóa filter who in deny
      emitter.on('delete-data-who-detail', (data: FieldOfWhoDetail) => {
        if (data) {
          //set value
          modalTitle.value = data.value;
          valueDelete.value.id = data.id;
          valueDelete.value.whoId = data.whoId;
          valueDelete.value.type = 'who-detail';
          //show modal
          modalShowDel.value = true;
        }
      });
      //Lắng nghe sự kiện nếu xóa filter rule (webmail)
      emitter.on('show-modal-delete-filter', (data: {filterRule: IFilterRule, outgoingFilter: boolean}) => {
        if (data.filterRule) {
          //set value
          modalTitle.value = data.filterRule.name;
          valueDelete.value.filterRuleSelected = data.filterRule;
          valueDelete.value.outgoingFilter = data.outgoingFilter;
          valueDelete.value.type = 'filter-rule';
          //show modal
          modalShowDel.value = true;
        }
      });
      //Lắng nghe sự kiện xoá mail convesation
      emitter.on('show-modal-delete-mail-conversation', (data: { item: Item, selectedBox: string[], forever: boolean }) => {
        if (data) {
          if (data.item) modalTitle.value = data.item.fullName ? data.item.fullName : data.item.sortName;
          if (data.item) valueDelete.value.id = data.item.conversationId;
          valueDelete.value.selectedBox = data.selectedBox;
          valueDelete.value.forever = data.forever; // Nếu là true thì xoá vĩnh viễn
          valueDelete.value.type = 'mail-conversation';
          modalShowDel.value = true;
        }
      });
      //Lắng nghe sự kiện xoá contact
      emitter.on('show-modal-delete-contact-data', (data: { item: ItemContact, forever: boolean }) => {
        if (data) {
          if (data.item) modalTitle.value = data.item.email ? data.item.email : data.item.fullName;
          if (data.item) valueDelete.value.id = data.item.id;
          valueDelete.value.forever = data.forever; // Nếu là true thì xoá vĩnh viễn
          valueDelete.value.type = 'contact-data';
          modalShowDel.value = true;
        }
      });
    });

    onDeactivated(() => {
      emitter.off('delete-data-user-manager');
      emitter.off('confirm-delete-data-user-manager');
      emitter.off('delete-data-distribution');
      emitter.off('delete-data-who-detail');
      emitter.off('delete-data-filter-rule');
      emitter.off('show-modal-delete-mail-conversation');
      emitter.off('show-modal-delete-contact-data');
    });

    return {
      locale,
      modalTitle,
      modalShowDel,
      actionResetValueDelete,
      actionDelete,
    }
  }
})
</script>