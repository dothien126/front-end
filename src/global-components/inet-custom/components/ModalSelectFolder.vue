<template>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader class="text-base" v-if="modalTitle">
      {{ modalTitle }}
    </ModalHeader>
    <ModalBody>
      <p class="mb-2 dark:text-slate-500 text-gray-600" v-if="modalNote" v-html="modalNote"></p>
      <div class="mb-2">
        <input type="search" class="form-control" :placeholder="locale.searchFolders + '...'" v-model="searchText"/>
      </div>
      <Tree
          v-model:nodes="folderList" :is-has-tippy="isHasTippy" @nodeClick="onNodeClickItemFolder"
          :useCheckbox="useCheckbox" :searchText="searchText" :id-selected="folderIdSelected"
      />
    </ModalBody>
    <ModalFooter class="py-2 flex items-center">
      <button type="button" class="btn btn-secondary"
              @click="actionCreateNewFolder">
        {{ locale.add }} {{ locale.folder }}
      </button>
      <div class="-mx-1.5 grow">
        <button type="button" class="btn btn-secondary m-1.5" @click="resetAllData">
          {{ locale['cancel'] }}
        </button>
        <button type="button" class="btn btn-primary m-1.5" @click="actionGetFolderSelected">
          {{ locale['saveAndClose'] }}
        </button>
      </div>
    </ModalFooter>
  </Modal>
  <!-- END: Modal Content -->
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {FolderStore} from "@/stores/folder-store/folder-store";
import {Folder} from "@/model/Folder";

export default defineComponent({
  name: "ModalSelectFolder",
  setup() {
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    const folderStore = FolderStore();
    const folderList = computed({
      get: () => typeRootList.value ? folderStore.myFolderListHasRoot : folderStore.myFolderList,
      set: (data) => typeRootList.value ? folderStore.myFolderListHasRoot = data : folderStore.myFolderList = data,
    });
    const folderIdSelected = ref('');
    const folderSelected = ref<Folder>(new Folder());
    const showModal = ref(false);
    const searchText = ref('');
    const folderSelectedByCheckbox = ref<Folder[]>([]);
    //option
    const useCheckbox = ref(true);
    const typeRootList = ref(false);
    const isHasTippy = ref(false);
    const modalTitle = ref('');
    const modalNote = ref('');

    function resetAllData(){
      folderIdSelected.value = '';
      folderSelected.value = new Folder();
      showModal.value = false;
      searchText.value = '';
    }

    const onNodeClickItemFolder = function (folder: Folder) {
      folderIdSelected.value = folder.folderId;
      folderSelected.value = folder;
      //add by checkbox
      if (folder.checked) {
        folderSelectedByCheckbox.value.push(folder);
      } else {
        const findIndex = folderSelectedByCheckbox.value.findIndex(value => value.folderId === folder.folderId && !folder.checked);
        if (findIndex >= 0) {
          folderSelectedByCheckbox.value.splice(findIndex, 1);
        }
      }
    }

    function actionCreateNewFolder() {
      emitter.emit('show-modal-create-folder');
    }

    function actionGetFolderSelected() {
      let data: any;
      if (!useCheckbox.value) {
        data = {
          folderIdSelected: folderIdSelected.value,
          folderSelected: folderSelected.value,
        }
      } else {
        data = {folderSelectedByCheckbox: folderSelectedByCheckbox.value};
      }
      //reset all data
      resetAllData();
      emitter.emit('data-select-folder', data);
    }

    onMounted(() => {
      emitter.on('show-modal-select-folder', (data: { useCheckbox?: boolean, typeRootList?: boolean, isHasTippy?: boolean, modalTitle?: string, modalNote?: string }) => {
        showModal.value = true;
        useCheckbox.value = data.useCheckbox ? data.useCheckbox : false;
        typeRootList.value = data.typeRootList ? data.typeRootList : false;
        isHasTippy.value = data.isHasTippy ? data.isHasTippy : false;
        modalTitle.value = data.modalTitle ? data.modalTitle : '';
        modalNote.value = data.modalNote ? data.modalNote : '';
      });
    });

    onDeactivated(() => {
      emitter.off('show-modal-select-folder');
    });

    return {
      locale,
      showModal,
      modalTitle,
      modalNote,
      isHasTippy,
      useCheckbox,
      folderList,
      folderIdSelected,
      searchText,
      resetAllData,
      onNodeClickItemFolder,
      actionCreateNewFolder,
      actionGetFolderSelected,
    }
  }
})
</script>