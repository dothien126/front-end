<template>
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalBody class="px-5">
      <div class="col-span-12">
        <div class="mb-5">
          <h3>{{ locale.RENAME_FOLDER }}:</h3>
          <p class="text-xl">{{ folderSelected.name }}</p>
        </div>
        <div class="mb-3">
          <div class="input-group">
            <input id="modal-edit-name-folder" type="text" class="form-control"
                   v-model="vuelidate.name.$model" />
          </div>
          <template v-if="vuelidate.name.$error">
            <div v-for="(error, index) in vuelidate.name.$errors" :key="error" class="mt-2 text-sm text-red-600">* {{ error.$message }}</div>
          </template>
        </div>
        <div class="text-right mt-5 -mx-1">
          <button type="button" class="btn btn-secondary min-w-[7em] m-1" @click="actionCloseModal">{{ locale.cancel }}</button>
          <button type="button" class="btn btn-primary min-w-[8em] m-1" @click="actionSaveChange">{{ locale.apply }}</button>
        </div>
      </div>
    </ModalBody>
  </Modal>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, reactive, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {FolderStore} from "@/stores/folder-store/folder-store";
import {Folder} from "@/model/Folder";
import {BatchRequest, FolderActionRequest} from "@/model/BatchRequest";
import BatchService from "@/service/BatchService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {BatchResponse} from "@/model/BatchResponse";
import {Fault} from "@/model/Fault";
import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {MyContactStore} from "@/stores/contact-store/contact-store";

export default defineComponent({
  name: "ModalEditNameFolder",
  setup() {
    const myStore = MyStore();
    const folderStore = FolderStore();
    const contactStore = MyContactStore();
    const emitter = myStore.useEmitter();
    const showModal = ref(false);
    const locale = computed(() => myStore.locale);
    const folderSelected = ref<Folder>(new Folder());
    const faultResponse = ref<Fault[]>([]);

    // validate
    const formFolder = reactive({
      name: "",
    })

    const rules = {
      name: {
        required: helpers.withMessage(locale.value.INVALID_FOLDER, required),
      },
    }
    const vuelidate = useVuelidate(rules, formFolder);

    function actionCloseModal() {
      // Đóng modal
      showModal.value = false;
    }

    async function actionSaveChange() {
      //Valid before submit
      vuelidate.value.$touch();
      //Init object
      if (!vuelidate.value.$invalid) {
        //init request
        faultResponse.value = [];
        const batchRequest = new BatchRequest();
        const folderActionRequest = new FolderActionRequest();
        folderActionRequest.action.op = 'rename';
        folderActionRequest.action.id = folderSelected.value.folderId;
        folderActionRequest.action.name = formFolder.name;
        batchRequest.FolderActionRequest.push(folderActionRequest);
        //call request
        const response = await BatchService.request(batchRequest, myStore.token);
        if (response.data) {
          const responseData: ResponseData = response.data;
          //Kiểm tra backend có trả error ko
          if (responseData.values.error) {
            // Set thông báo thất bại
            showToastMessage(responseData.values.error, true);
          } else {
            const bodyResponse = responseData.values as [];
            //Nếu thành công có response thì check 2 trường hợp là đã gửi share chưa
            if (bodyResponse && bodyResponse.length > 0) {
              for (const item of bodyResponse) {
                const checkHasData = item as BatchResponse;
                if (!checkHasData.folderId) faultResponse.value.push(item);
              }
            }
            //Bắn thông báo sau khi hoàn tất
            if (faultResponse.value.length > 0) {
              showToastMessage('', true, faultResponse.value);
            } else {
              //reload
              await folderStore.initGetFolder();
              await contactStore.initGetContactList();
              showToastMessage();
              // Đóng modal
              actionCloseModal();
            }
          }
        } else {
          showToastMessage(undefined, true);
        }
      }
    }

    onMounted(() => {
      emitter.on('setting-rename-folder', (data: { show: boolean, folderSelected: Folder }) => {
        //reload data
        showModal.value = data.show;
        folderSelected.value = data.folderSelected;
        formFolder.name = folderSelected.value.name;
      })
    });

    onDeactivated(() => {
      emitter.off('setting-rename-folder');
    });

    return {
      locale,
      vuelidate,
      showModal,
      folderSelected,
      actionCloseModal,
      actionSaveChange,
    }
  }
})
</script>

<style scoped>

</style>
