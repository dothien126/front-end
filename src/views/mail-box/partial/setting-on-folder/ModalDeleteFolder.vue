<template>
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalBody>
      <div class="flex items-center">
        <div class="w-12 h-12 shrink-0 rounded-full bg-danger flex items-center justify-center">
          <Trash2Icon class="w-8 h-8"/>
        </div>
        <div class="grow pl-3">
          <h3 class="mb-1 text-base">{{ locale.areYouSure  + locale.DELETE_FOLDER.toLowerCase() }}?</h3>
          <p class="text-xl">
            {{ deleteFolderName }}
          </p>
        </div>
      </div>
    </ModalBody>
    <ModalFooter>
      <div class="-mx-1 text-right">
        <button type="button" class="btn btn-secondary min-w-[7em] m-1" @click="actionCloseModal">{{ locale.cancel }}</button>
        <button type="button" class="btn btn-danger min-w-[8em] m-1" @click="actionDeleteFolder">{{ locale.delete }}</button>
      </div>
    </ModalFooter>
  </Modal>
  <!-- BEGIN: UNDO DELETE FOLDER -->
  <Modal backdrop="static" size="modal-lg" :show="showModalUndo" @hidden="showModalUndo = false">
    <ModalBody>
      <div class="flex items-center">
        <h3 class="grow text-base">{{ locale.folder }} <u>{{ deleteFolderName }}</u> {{ locale.movedTo.toLowerCase() }} "{{ locale.trash }}"</h3>
        <div class="text-right shrink-0 flex items-center">
          <button type="button" class="btn btn-secondary min-w-[7em] mr-2" @click="actionUndoDeleteFolder">{{ locale.undo }}</button>
          <button type="button" class="btn" :title="locale.cancel" @click="showModalUndo = false;">
            <XIcon class="w-4 h-5"/>
          </button>
        </div>
      </div>
    </ModalBody>
  </Modal>
  <!-- END:UNDO DELETE FOLDER -->
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {FolderStore} from "@/stores/folder-store/folder-store";
import {Folder} from "@/model/Folder";
import {Fault} from "@/model/Fault";
import {BatchRequest, FolderActionRequest} from "@/model/BatchRequest";
import BatchService from "@/service/BatchService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {BatchResponse} from "@/model/BatchResponse";
import {MyContactStore} from "@/stores/contact-store/contact-store";
import {useRoute} from "vue-router";

export default defineComponent({
  name: "ModalDeleteFolder",
  setup() {
    const myStore = MyStore();
    const folderStore = FolderStore();
    const contactStore = MyContactStore();
    const hasPathTrash = ref(false);
    const emitter = myStore.useEmitter();
    const showModal = ref(false);
    const showModalUndo = ref(false);
    const locale = computed(() => myStore.locale);
    const folderSelected = ref<Folder>(new Folder());
    const deleteFolderName = ref('');
    const faultResponse = ref<Fault[]>([]);
    const route = useRoute();
    const isPathContact = computed(() => {
      const path = route.path as string;
      return !!(path && path.startsWith('/contacts'));
    });

    function actionCloseModal() {
      // Đóng modal
      showModal.value = false;
    }

    async function actionDeleteFolder() {
      //init request
      faultResponse.value = [];
      const batchRequest = new BatchRequest();
      const folderActionRequest = new FolderActionRequest();
      folderActionRequest.action.op = hasPathTrash.value ? 'delete' : 'trash';
      folderActionRequest.action.id = folderSelected.value.folderId;
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
            if(isPathContact.value){
              await contactStore.initGetContactList();
              //active default folder
              emitter.emit('on-active-folder-contact-default');
            }
            else{
              await folderStore.initGetFolder();
              //active default folder
              emitter.emit('on-active-folder-default');
            }
            // Đóng modal
            actionCloseModal();
            // Show modal undo
            if(!hasPathTrash.value){
              showModalUndo.value = true;
            }
          }
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    async function actionUndoDeleteFolder() {
      //init request
      faultResponse.value = [];
      const batchRequest = new BatchRequest();
      const folderActionRequest = new FolderActionRequest();
      folderActionRequest.action.op = 'move';
      folderActionRequest.action.id = folderSelected.value.folderId;
      folderActionRequest.action.l = folderSelected.value.parentId;
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
            if(isPathContact.value){
              await contactStore.initGetContactList();
            }
            else{
              await folderStore.initGetFolder();
            }
            // Đóng modal
            showModalUndo.value = false;
            // Thông báo thành công
            showToastMessage();
          }
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    onMounted(() => {
      emitter.on('setting-delete-folder', (data: { show: boolean, folderSelected: Folder }) => {
        //reload data
        showModal.value = data.show;
        folderSelected.value = data.folderSelected;
        deleteFolderName.value = folderSelected.value.name;
        //Kiểm tra có trong path trash ko, nếu có đổi trạng thái sang delete thực tế
        hasPathTrash.value = String(folderSelected.value.folderPath).startsWith("/Trash/"); //có dấu xuyệt phía cuối chỉ để check các phần tử bên trong folder Trash
      })
    });

    return {
      locale,
      showModal,
      showModalUndo,
      folderSelected,
      deleteFolderName,
      actionCloseModal,
      actionDeleteFolder,
      actionUndoDeleteFolder,
    }
  }
})
</script>

<style scoped>

</style>