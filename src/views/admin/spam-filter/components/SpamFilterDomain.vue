<template>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <modal-header>
      <h3 class="text-xl">{{ localeAdmin.addDomainToFilter }}</h3>
      <Tippy :options="{zIndex: 10001}" tag="a" href="javascript:;" class="ml-auto" :content="localeAdmin.filterDomain">
          <HelpCircleIcon class="w-4 h-4"/>
      </Tippy>
    </modal-header>
    <ModalBody>
      <div class="mb-5">
        <div class="mb-3">
          <label for="frm-1" class="form-label">{{ localeAdmin.enterEmail }}</label>
          <input id="frm-1" type="text" class="form-control" v-model="formData.value" :placeholder="localeAdmin.exDomain"/>
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
import {domain} from "@/utils/MyVariables";
import AdminWhoService from "@/service/admin/mail-gateway/AdminWhoService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
  export default defineComponent({
    name: 'SpamFilterDomain',
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
          type: domain
        } as FieldOfWhoDetail;
        //call request (nếu id tồn tại là đang sửa, ngược lại là thêm mới)
        const response = formData.id ? await AdminWhoService.editWhoDetail(itemCreateUpdate, myJwt.value) : await AdminWhoService.addWhoDetail(itemCreateUpdate, myJwt.value);
        if (response.data) {
          const responseData: ResponseData = response.data;
          if (!responseData.values.error) {
            //Dong modal
            showModal.value = false;
            //reload data
            emitter.emit('reload-filter-mail-gateway-domain');
          } else {
            showToastMessage(responseData.values.error, true);
          }
        }
      }

      onMounted(() => {
        //lắng nghe sự kiện nếu thêm mới
        emitter.on('add-filter-mail-gateway-domain', (data: IAdminWhoDetail) => {
          resetFormData();
          formData.whoId = data.whoId;
          showModal.value = true;
        });
        //Lắng nghe sự kiện nếu chỉnh sửa
        emitter.on('edit-filter-mail-gateway-domain', (data: FieldOfWhoDetail) => {
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
        emitter.off('add-filter-mail-gateway-domain');
        emitter.off('edit-filter-mail-gateway-domain');
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