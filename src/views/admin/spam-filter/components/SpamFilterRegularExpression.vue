<template>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <modal-header>
      <h3 class="text-xl">{{ localeAdmin.regex }}</h3>
      <Tippy :options="{zIndex: 10001}" tag="a" href="javascript:;" class="ml-auto"
             :content="localeAdmin.exReg">
        <HelpCircleIcon class="w-4 h-4"/>
      </Tippy>
    </modal-header>
    <ModalBody>
      <div class="mb-5">
        <div class="mb-3">
          <label class="form-label">{{ localeAdmin.regex }}:</label>
          <input type="text" class="form-control" v-model="formData.value"/>
        </div>
        <div class="mb-3">
          <label class="form-label">{{ localeAdmin.testValue }}</label>
          <div class="relative">
            <input type="text" class="form-control pr-14" v-model="regexTest.text"/>
            <button type="button" class="btn btn-primary-soft text-violet-500 dark:text-violet-200 absolute right-0 top-0" @click="actionRegexTest">
              {{ localeAdmin.check }}
            </button>
          </div>
          <div
              class="error-test-string flex items-center mt-3 border border-red-500 dark:border-red-600/50 rounded py-2"
              v-if="regexTest.result">
            <div class="text-slate-500 px-3 grow">
              {{ regexTest.result }}
            </div>
            <button type="button" class="btn bg-none border-0 text-danger" @click="resetRegexTest">
              <XOctagonIcon class="w-10 h-10"/>
            </button>
          </div>
        </div>
      </div>
      <div class="-mx-2 text-right">
        <button type="button" class="btn btn-secondary m-2" @click="showModal = false">
          {{ localeAdmin['cancel'] }}
        </button>
        <button type="button" class="btn btn-primary m-2" @click="actionAddFilter">
          {{ localeAdmin['saveAndClose'] }}
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Modal Content -->
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, reactive, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {IAdminRegexTest} from "@/model/admin/dto/IAdminRegexTest";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {FieldOfWhoDetail, IAdminWhoDetail} from "@/model/admin/dto/IAdminWhoDetail";
import {regularExpression} from "@/utils/MyVariables";
import AdminWhoService from "@/service/admin/mail-gateway/AdminWhoService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";

export default defineComponent({
  name: 'SpamFilterRegularExpression',
  setup() {
    const myStore = MyStore();
    const adminStore = MyAdminStore();
    const locale = computed(() => myStore.locale);
    const localeAdmin = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    const myJwt = computed(() => adminStore.myAdminJwt);
    const showModal = ref(false);
    const regexTest = ref<IAdminRegexTest>({regex: '', text: '', result: ''} as IAdminRegexTest);
    const formData = reactive({
      id: '',
      value: '',
      whoId: '',
    } as FieldOfWhoDetail);

    function resetRegexTest() {
      regexTest.value.regex = '';
      regexTest.value.text = '';
      regexTest.value.result = '';
    }

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
        type: regularExpression
      } as FieldOfWhoDetail;
      //call request (nếu id tồn tại là đang sửa, ngược lại là thêm mới)
      const response = formData.id ? await AdminWhoService.editWhoDetail(itemCreateUpdate, myJwt.value) : await AdminWhoService.addWhoDetail(itemCreateUpdate, myJwt.value);
      if (response.data) {
        const responseData: ResponseData = response.data;
        if (!responseData.values.error) {
          //Dong modal
          showModal.value = false;
          //reload data
          emitter.emit('reload-filter-mail-gateway-regular-expression');
        } else {
          showToastMessage(responseData.values.error, true);
        }
      }
    }

    async function actionRegexTest() {
      const itemRegextest = {
        regex: formData.value,
        text: regexTest.value.text,
        result: ''
      } as IAdminRegexTest;
      //call request
      const response = await AdminWhoService.regexTestWhoDetail(itemRegextest, myJwt.value);
      if (response.data) {
        const responseData: ResponseData = response.data;
        if (!responseData.values.error) {
          showToastMessage(String(responseData.values.data));
        } else {
          regexTest.value.result = responseData.values.error;
        }
      }
    }

    onMounted(() => {
      //lắng nghe sự kiện nếu thêm mới
      emitter.on('add-filter-mail-gateway-regular-expression', (data: IAdminWhoDetail) => {
        resetRegexTest();
        resetFormData();
        formData.whoId = data.whoId;
        showModal.value = true;
      });
      //Lắng nghe sự kiện nếu chỉnh sửa
      emitter.on('edit-filter-mail-gateway-regular-expression', (data: FieldOfWhoDetail) => {
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
      emitter.off('add-filter-mail-gateway-regular-expression');
      emitter.off('edit-filter-mail-gateway-regular-expression');
    });

    return {
      locale,
      localeAdmin,
      showModal,
      regexTest,
      formData,
      resetRegexTest,
      actionAddFilter,
      actionRegexTest,
    }
  }
})
</script>