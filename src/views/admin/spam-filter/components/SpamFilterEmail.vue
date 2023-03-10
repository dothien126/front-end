<template>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <modal-header>
      <h3 class="text-xl">{{ localeAdmin.addDomainToFilter }}</h3>
      <Tippy :options="{zIndex: 10001}" tag="a" href="javascript:;" class="ml-auto" :content="localeAdmin.filterEmail">
          <HelpCircleIcon class="w-4 h-4"/>
      </Tippy>
    </modal-header>
    <ModalBody>
      <div class="mb-5">
        <div class="mb-3">
          <label class="form-label">{{ localeAdmin.enterEmail }}</label>
          <input type="text" class="form-control" :placeholder="localeAdmin.exEmailPattern" v-model="formData.value"/>
        </div>
      </div>
      <div class="-mx-2 text-right">
        <button type="button" class="btn btn-secondary m-2" @click="showModal = false">
          {{localeAdmin['cancel']}}
        </button>
        <button type="button" class="btn btn-primary m-2" @click="actionAddFilter">
          {{localeAdmin['saveAndClose']}}
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Modal Content -->
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, reactive, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {FieldOfWhoDetail, IAdminWhoDetail} from "@/model/admin/dto/IAdminWhoDetail";
import {mailAddress} from "@/utils/MyVariables";
import AdminWhoService from "@/service/admin/mail-gateway/AdminWhoService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
  export default defineComponent({
    name: 'SpamFilterEmail',
    setup() {
      const myStore = MyStore();
      const adminStore = MyAdminStore();
      // locale language
      const locale = computed(() => myStore.locale);
      const localeAdmin = computed(() => myStore.locale);
      const emitter = myStore.useEmitter();
      const myJwt = computed(() => adminStore.myAdminJwt);
      const showModal = ref(false);
      const formData = reactive({
        id: '',
        value: '',
        whoId: '',
      } as FieldOfWhoDetail);

      function resetFormData() {
        formData.value = '';
        formData.id = '';
        formData.whoId = '';
      }

      async function actionAddFilter() {
        const itemCreateUpdate = {
          id: formData.id,
          value: formData.value,
          whoId: formData.whoId,
          type: mailAddress
        } as FieldOfWhoDetail;
        //call request (n???u id t???n t???i l?? ??ang s???a, ng?????c l???i l?? th??m m???i)
        const response = formData.id ? await AdminWhoService.editWhoDetail(itemCreateUpdate, myJwt.value) : await AdminWhoService.addWhoDetail(itemCreateUpdate, myJwt.value);
        if (response.data) {
          const responseData: ResponseData = response.data;
          if (!responseData.values.error) {
            //Dong modal
            showModal.value = false;
            //reload data
            emitter.emit('reload-filter-mail-gateway-mail-address');
          } else {
            showToastMessage(responseData.values.error, true);
          }
        }
      }

      onMounted(() => {
        //l???ng nghe s??? ki???n n???u th??m m???i
        emitter.on('add-filter-mail-gateway-mail-address', (data: IAdminWhoDetail) => {
          resetFormData();
          formData.whoId = data.whoId;
          showModal.value = true;
        });
        //L???ng nghe s??? ki???n n???u ch???nh s???a
        emitter.on('edit-filter-mail-gateway-mail-address', (data: FieldOfWhoDetail) => {
          if (data) {
            //form data
            formData.id = data.id;
            formData.value = data.value;
            formData.whoId = data.whoId;
            //show modal
            showModal.value = true;
          }
        });
      });

      onDeactivated(() => {
        emitter.off('add-filter-mail-gateway-mail-address');
        emitter.off('edit-filter-mail-gateway-mail-address');
      });

      return {
        locale,
        localeAdmin,
        showModal,
        formData,
        actionAddFilter,
      }
    }
  })
</script>