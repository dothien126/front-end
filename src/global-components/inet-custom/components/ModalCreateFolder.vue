<template>
  <!-- BEGIN: Modal Add new folder Content -->
  <Modal backdrop="static" class="create-folder-modal" v-if="showModalAddNewFolder" :show="showModalAddNewFolder"
         @hidden="showModalAddNewFolder = false">
    <!-- BEGIN: Modal Header -->
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto"> {{ locale.createFolder }} </h2>
    </ModalHeader>
    <!-- END: Modal Header -->
    <!-- BEGIN: Modal Body -->
    <ModalBody class="grid grid-cols-12 gap-4 gap-y-3">
      <div class="col-span-12">
        <div class="mb-3">
          <label for="modal-create-new-folder-side-menu" class="form-label">{{ locale.nameNewCreateFolder }}:</label>
          <div class="input-group">
            <input id="modal-create-new-folder-side-menu" type="text" class="form-control" v-model="createFolderName"/>
          </div>
        </div>
        <div class="mb-3 flex items-center">
          <fieldset class="border border-slate-200 dark:border-slate-600 my-2 p-2 w-full">
            <legend class="px-2">{{ locale.folderColor }}</legend>
            <colors-picker :color-folder="createFolderColor" @update:color-folder="actionChangeColor"/>
          </fieldset>
        </div>
        <h4 class="mb-2">{{ locale.placeCreateFolder }}:</h4>
        <div class="overflow-y-auto overflow-x-hidden py-3 px-2 bg-light dark:bg-darkmode-400 rounded max-h-[360px]">
          <Tree v-model:nodes="createFolderList" :is-has-tippy="isHasTippy" @nodeClick="actionSelectFolderWhenCreate"
                :id-selected="createFolderIdSelected"/>
        </div>
      </div>
    </ModalBody>
    <!-- END: Modal Body -->
    <!-- BEGIN: Modal Footer -->
    <ModalFooter>
      <button
          type="button"
          @click="showModalAddNewFolder = false"
          class="btn btn-outline-secondary w-20 mr-3"
      >
        {{ locale.cancel }}
      </button>
      <button type="button" class="btn btn-primary w-20" @click="actionCreateNewFolder"> {{ locale.add }}</button>
    </ModalFooter>
    <!-- END: Modal Footer -->
  </Modal>
  <!-- END: Modal Add new folder Content -->
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {FolderStore} from "@/stores/folder-store/folder-store";
import {Folder} from "@/model/Folder";
import Tree from "@/global-components/tree-view/lib";
import FolderService from "@/service/FolderService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";

export default defineComponent({
  name: "ModalCreateFolder",
  components: {Tree},
  setup() {
    //init value
    const myStore = MyStore();
    const folderStore = FolderStore();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);
    const isHasTippy = ref(false);
    const folderList = computed({
      get: () => folderStore.myFolderList,
      set: (data) => folderStore.myFolderList = data,
    });
    const showModalAddNewFolder = ref(false);
    //create new folder
    const createFolderName = ref('');
    const createFolderList = computed({
      get: () => folderStore.myFolderListHasRoot,
      set: (data) => folderStore.myFolderListHasRoot = data,
    });
    const createFolderIdSelected = ref('');
    const createFolderColor = ref('');

    function actionChangeColor(value) {
      if (value) {
        createFolderColor.value = value;
      }
    }

    function actionSelectFolderWhenCreate(folder: Folder) {
      createFolderIdSelected.value = folder.folderId;
    }

    async function actionCreateNewFolder() {
      //init request
      const itemRequest = new Folder();
      itemRequest.parentId = createFolderIdSelected.value;
      itemRequest.name = createFolderName.value;
      itemRequest.rgb = createFolderColor.value;
      itemRequest.view = 'message';
      //call request
      const response = await FolderService.createFolder(itemRequest, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          const folderResponse: Folder = responseData.values;
          //Nếu có giá trị thì reload
          if (folderResponse.parentId) {
            await folderStore.initGetFolder();
            await folderStore.initGetFolderHasRoot();
            // Set thông báo thành công
            showToastMessage();
            // Đóng modal
            showModalAddNewFolder.value = false;
          }
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    onMounted(() => {
      emitter.on('show-modal-create-folder', () => {
        showModalAddNewFolder.value = true;
      });
    });

    onDeactivated(() => {
      emitter.off('show-modal-create-folder');
    })

    return {
      locale,
      isHasTippy,
      folderList,
      showModalAddNewFolder,
      createFolderName,
      createFolderList,
      createFolderIdSelected,
      createFolderColor,
      actionChangeColor,
      actionSelectFolderWhenCreate,
      actionCreateNewFolder,
    }
  }
})
</script>