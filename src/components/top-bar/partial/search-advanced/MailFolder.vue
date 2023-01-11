<template>
  <div class="p-2">
    <div class="overflow-y-auto overflow-x-hidden bg-light dark:bg-darkmode-400 rounded max-h-[360px]">
      <Tree v-model:nodes="folder" :is-has-tippy="isHasTippy" @nodeClick="selectForlder"
            :id-selected="folderSelected"/>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import {Folder} from "@/model/Folder";
import {MyStore} from "@/stores/my-store";
import {FolderStore} from "@/stores/folder-store/folder-store";
export default defineComponent({
  name: 'MailFolder',
  setup() {
    const myStore = MyStore();
    const emitter = myStore.useEmitter();
    const folderList = ref<Folder[]>([]);
    const folderIdSelected = ref('');
    const onNodeClick = async (folder: Folder) => {
      folderIdSelected.value = folder.folderId;
    };
    const folderStore = FolderStore();
    const isHasTippy = ref(false);
    const folderSelected = ref('');
    const folder = computed({
      get: () => folderStore.myFolderListHasRoot,
      set: (data) => folderStore.myFolderListHasRoot = data,
    });

    function selectForlder(folder: Folder) {
      if (folder.folderPath) {
        let query: string = `in:"${folder.folderPath}"`.toLowerCase();
        emitter.emit('init-value-filter-advanced', { value: query, type: 'folder:', isRemove: false });
      }
    }

    return {
      folder,
      folderList,
      isHasTippy,
      onNodeClick,
      selectForlder,
      folderSelected,
    }
  }
})
</script>

<style></style>