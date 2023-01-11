<template>
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader>
      <h2 class="text-base">{{ locale.chooseTypeContacts }}</h2>
    </ModalHeader>
    <ModalBody>
      <div class="text-slate-500 mb-2">
        {{ locale.chooseFolderToApplyFilterDetail }}
      </div>
      <div class="form-group mb-3">
        <input type="text" class="form-control" :placeholder="locale.findContacts" v-model="inputSearchContactFolder"/>
      </div>
      <Tree v-model:nodes="contactCreateFolderList" :id-selected="createContactFolderSelected.folderId"
            @nodeClick="onNodeClick" :searchText="inputSearchContactFolder"/>
    </ModalBody>
    <ModalFooter>
      <button type="button" class="btn btn-secondary mr-3" @click="showModal = false">
        {{ locale.cancel }}
      </button>
      <button type="button" class="btn btn-primary" @click="showModal = false">
        {{ locale.saveAndClose }}
      </button>
    </ModalFooter>
  </Modal>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {Folder} from "@/model/Folder";
import {MyContactStore} from "@/stores/contact-store/contact-store";
import t from "typy";

export default defineComponent({
  name: 'ContactsFolderModal',
  setup() {
    const myStore = MyStore();
    const contactStore = MyContactStore();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);
    const showModal = ref(false);
    const createContactFolderSelected = computed({
      get: () => t(contactStore.createContactFolderSelected).isObject ? contactStore.createContactFolderSelected : {} as Folder,
      set: (data) => contactStore.createContactFolderSelected = data,
    });
    const contactCreateFolderList = computed({
      get: () => contactStore.myCreateContactList as Folder[],
      set: (data) => contactStore.myCreateContactList = data,
    });
    const inputSearchContactFolder = ref('');
    const onNodeClick = (folder: Folder) => {
      createContactFolderSelected.value = folder;
    };

    onMounted(() => {
      //default active contact folder
      onNodeClick(contactCreateFolderList.value[0]);
      //listen
      emitter.on('show-modal-select-contact-folder', () => {
        showModal.value = true;
      });
    });

    onDeactivated(() => {
      emitter.off('show-modal-select-contact-folder');
    });

    return {
      locale,
      showModal,
      onNodeClick,
      contactCreateFolderList,
      createContactFolderSelected,
      inputSearchContactFolder
    }
  }
})
</script>