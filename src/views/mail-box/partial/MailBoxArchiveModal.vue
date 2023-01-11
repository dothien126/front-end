<template>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" :show="conversationSelected.mbArchiveModalShowHide" @hidden="conversationSelected.mbArchiveModalShowHide = false">
    <ModalBody class="p-5">
      <h3 class="text-lg mb-3">{{ locale['archiveEmail'] }}</h3>
      <div class="my-5 w-4 h-4 m-auto" v-if="archiveModalLoading">
        <LoadingIcon icon="three-dots"/>
      </div>
      <Tree
          v-model:nodes="folderList" :is-has-tippy="isHasTippy" @nodeClick="onNodeClickItemFolder" :id-selected="folderIdSelected" id="archive-data"
      />
      <div class="mt-5 text-right">
        <button type="button" @click="conversationSelected.mbArchiveModalShowHide = false" class="btn btn-secondary mr-3">
          {{locale.cancel}}
        </button>
        <button type="button" @click="archiveMailSelected()" class="btn bg-blue-600 text-white dark:bg-violet-600 min-w-[120px]">
          {{locale.archive}}
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Modal Content -->
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref} from "vue";
import {Folder} from "@/model/Folder";
import Tree from '@/global-components/tree-view/lib';
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {MyStore} from "@/stores/my-store";
import {RequestNoResponse} from "@/model/RequestNoResponse";
import UserService from "@/service/UserService";
import ConversationService from "@/service/ConversationService";
import { FolderStore } from "@/stores/folder-store/folder-store";
import {ConversationDetail} from "@/model/ConversationDetail";
import {ConversationStore} from "@/stores/conversation-store/conversation-store";

export default defineComponent({
  name: 'MailBoxArchiveModal',
  props: {
    conversationSelected: {
      type: Object as PropType<ConversationDetail>,
      default: () => new ConversationDetail(),
    },
    isConversationDetail: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:conversation-selected'],
  components: {
    Tree
  },
  setup(props, {emit}) {
    const conversationSelected = computed({
      get: () => props.conversationSelected as ConversationDetail,
      set: (data) => emit('update:conversation-selected', data),
    });
    const folderList = computed({
      get: () => folderStore.myFolderList,
      set: (data) => folderStore.myFolderList = data,
    });
    const myStore = MyStore();
    const folderStore = FolderStore();
    const conversationStore = ConversationStore();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);
    const folderIdSelected = ref('');
    const archiveMailSave = ref();
    const isHasTippy = ref(false);
    const onNodeClickItemFolder = async function (folder: Folder) {
      folderIdSelected.value = folder.folderId;
      archiveMailSave.value = folder;
    }
    const archiveModalLoading = ref<Boolean>(false);

    const archiveMailSelected = async function () {
      await actionArchiveConversation(conversationSelected.value.conversationId, folderIdSelected.value);
      showToastMessage(myStore.locale.archiveEmailTo + ' ' + archiveMailSave.value.folderPath);
      conversationSelected.value.mbArchiveModalShowHide = false;
      // Nếu Archive trong Conversation Detail -> Callback Conversation
      if (props.isConversationDetail) {
        setTimeout(() => { emitter.emit('show-conversation') }, 100);
      } else {
        emitter.emit('reset-conversation');
      }
    }

    //Action
    const actionArchiveConversation = async function (itemID: string, folderId: string) {
      //init request
      const itemFind = new RequestNoResponse();
      itemFind.itemId = itemID;
      itemFind.operation = 'move';
      itemFind.folderId = folderId;
      //call request
      const response = await ConversationService.action(itemFind, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          emitter.emit('reset-conversation');
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    return {
      myStore,
      locale,
      isHasTippy,
      conversationSelected,
      folderList,
      onNodeClickItemFolder,
      archiveModalLoading,
      folderIdSelected,
      archiveMailSelected,
    }
  }
})
</script>
