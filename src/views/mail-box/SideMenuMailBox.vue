<template>
  <div class="grid grid-cols-12 gap-3 mb-1 md:mb-0" id="mail-box-toggle">
    <div class="backdrop-menu-control md:hidden inset-0 fixed z-[1059] bg-dark/80" @click="closeMailBoxMenu()">
      <XIcon class="w-4 h-4 absolute right-3 top-24"/>
    </div>
    <!-- BEGIN: SIDE MENU MAIL BOX -->
    <div class="col-span-12 md:col-span-3 2xl:col-span-2 z-[58] min-h-screen menu-control" :class="{'mouse-hover': mailBoxToggle}">
      <!--      <h2 class="intro-y text-lg font-medium mr-auto mt-2">Inbox</h2>-->
      <!-- BEGIN: Inbox Menu -->
      <div class="intro-y box dark:bg-black/40 md:mt-5" @mouseover="mailBoxToggle = true"
           @mouseleave="mailBoxToggle = false">
        <div class="new-mail p-3 hidden md:block">
          <button
              type="button"
              class="btn bg-violet-600 text-white w-full rounded-full"
              @click="actionAddMailNew()"
          >
            <Edit3Icon class="w-4 h-4 mr-2 shrink-0"/>
            <span class="txt">{{ locale['newMessage'] }}</span>
          </button>
        </div>
        <div class="list-action flex flex-col pt-20 md:pt-0 px-3 overflow-y-auto lg:overflow-y-none">
          <div class="mb-3 pb-3 border-b border-white-500 dark:border-slate-700/50 text-gray-700 dark:text-white grow">
            <Tree
                v-model:nodes="folderList" @nodeClick="onNodeClick" :id-selected="folderSelected.folderId" :use-icon="true"
            />
            <a
               @click="actionCreateNewFolder"
               href="javascript:"
               class="add-folder flex items-center p-3 rounded-full mt-2 hover:bg-gray-300/30 dark:hover:bg-white/10"
            >
              <PlusIcon class="w-4 h-4 mr-2 shrink-0"/>
              <span class="truncate txt grow">{{ locale.createFolder }}</span>
            </a>
          </div>
          <div class="text-gray-700 dark:text-white">
            <Tags/>
          </div>
          <div class="group-action lg:p-3">
            <a href="javascript:" class="btn btn-secondary w-full rounded-full" @click="$router.push('/contacts')">
              <UserIcon class="w-4 h-4 shrink-0 mr-1"/>
              <span class="truncate">
                {{locale.contact}}
              </span>
            </a>
          </div>
        </div>
      </div>
      <!-- END: Inbox Menu -->
    </div>
    <!-- END: SIDE MENU MAIL BOX -->
    <!-- BEGIN: MAIN MAIL BOX -->
    <div class="col-span-12 md:col-span-9 2xl:col-span-10">
      <router-view/>
    </div>
    <!-- END: MAIN MAIL BOX -->
  </div>
  <new-mail-button @newMail="actionAddMailNew()"/>
  <!--  BEGIN: Mobile footer mailbox-->
  <div class="bar-footer-mail-box fixed bg-gray-200 dark:bg-darkmode-900 z-50 bottom-0 inset-x-0 md:hidden">
    <div class="flex justify-center px-3 py-2">
      <a href="/" class="btn btn-secondary rounded-full w-14 relative">
        <MailIcon class="w-5 h-5"/>
        <sup class="absolute bottom-full right-0 rounded-full bg-red-600 text-white inline-block px-1.5 py-2">
          {{folderSelected.unreadCount}}
        </sup>
      </a>
    </div>
  </div>
  <!--  END: Mobile footer mailbox-->
  <!--    BEGIN: Mail New-->
  <div id="mail-compose-new" v-if="composeMessageList.length > 0">
    <mail-new v-for="mail in composeMessageList"
              :key="mail.id" :mail-data="mail"
              @fullscreen="actionFullScreenMessage(mail.id)"
              @minimizeScreen="actionMinimizeScreenMessage(mail.id)"
              @closeMailNew="actionCloseMessage(mail.id)">
    </mail-new>
  </div>
  <!--    END: Mail New-->
  <!-- BEGIN: Modal Add new folder -->
  <modal-create-folder/>
  <!-- END: Modal Add new folder -->
  <!-- BEGIN: SETTING ON FOLDER -->
  <modal-edit-folder/>
  <setting-on-modal-create-folder/>
  <modal-delete-folder/>
  <modal-share-folder/>
  <modal-edit-name-folder/>
  <modal-move-folder/>
  <!-- END: SETTING ON FOLDER -->
  <!--  BEGIN: Modal OUT OF OFFICE-->
  <modal-out-of-office/>
  <!--  END: Modal OUT OF OFFICE-->
</template>

<script lang="ts">
import {MyStore} from '@/stores/my-store';
import {computed, defineComponent, onDeactivated, onMounted, ref} from 'vue';
import {Folder} from '@/model/Folder';
import {helper} from '@/utils/helper';
import Tree from '@/global-components/tree-view/lib';
import MailNew from "@/views/mail-box/MailNew.vue";
import {ComposeMessageDto} from "@/model/dto/ComposeMessageDto";
import {useRoute, useRouter} from "vue-router";
import Tags from "@/views/mail-box/tags/Main.vue";
import {Item} from "@/model/Conversation";
import {FolderStore} from '@/stores/folder-store/folder-store';
import SettingOnModalCreateFolder from "@/views/mail-box/partial/setting-on-folder/ModalCreateFolder.vue";
import ModalShareFolder from "@/views/mail-box/partial/setting-on-folder/ModalShareFolder.vue";
import ModalEditFolder from "@/views/mail-box/partial/setting-on-folder/ModalEditFolder.vue";
import ModalEditNameFolder from "@/views/mail-box/partial/setting-on-folder/ModalEditNameFolder.vue";
import ModalDeleteFolder from "@/views/mail-box/partial/setting-on-folder/ModalDeleteFolder.vue";
import ModalMoveFolder from './partial/setting-on-folder/ModalMoveFolder.vue';
import {Company} from "@/model/Company";
import iNETmailLogo from '@/assets/images/mail-iNET-logo-circle.svg';
import NewMailButton from '@/views/mail-box/partial/NewMailButton.vue';
import {sidebarMenuToggle} from "@/views/mail-box/partial/SidebarMenuToggle";
import ModalCreateFolder from "@/global-components/inet-custom/components/ModalCreateFolder.vue";
import { prettyBytes } from '@/utils/pretty-bytes-function/PrettyBytes';
import { ConversationStore } from '@/stores/conversation-store/conversation-store';
import ModalOutOfOffice from "@/views/mail-box/partial/out-of-office/ModalOutOfOffice.vue";
import { User } from '@/model/User';
import {useDarkModeStore} from "@/stores/dark-mode";
import { toSlug } from '@/utils/MyFunction';
import { SearchRequest } from '@/model/SearchRequest';

export default defineComponent({
  name: 'SideMenuMailBox',
  components: {
    Tree,
    Tags,
    MailNew,
    ModalDeleteFolder,
    ModalEditNameFolder,
    ModalEditFolder,
    ModalShareFolder,
    ModalCreateFolder,
    SettingOnModalCreateFolder,
    ModalMoveFolder,
    NewMailButton,
    ModalOutOfOffice,
  },
  mounted() {
    window.addEventListener('resize', this.getDimensions);
  },
  setup() {
    //init value
    const myStore = MyStore();
    const conversationStore = ConversationStore();
    const folderStore = FolderStore();
    const darkModeStore = useDarkModeStore();
    const darkMode = computed(() => darkModeStore.darkMode);
    const emitter = myStore.useEmitter();
    const route = useRoute();
    const router = useRouter();
    const locale = computed(() => myStore.locale);
    const conversation = computed(() => conversationStore.conversation);
    const myUser = computed(() => myStore.myUser as User);
    const folderSelected = computed({
      get: () => folderStore.folderSelected as Folder,
      set: (data) => folderStore.folderSelected = data,
    })
    const isHasTippy = ref(false);
    //toggle
    const mailBoxToggle = ref(false);
    //folder
    const folderList = computed({
      get: () => folderStore.myFolderList,
      set: (data) => folderStore.myFolderList = data,
    });
    const showModalAddNewFolder = ref(false);
    //compose message
    const composeMessageList = ref<ComposeMessageDto[]>([]);
    //vi tri send later
    const indexRenderModalSendLater = ref(0);

    function onSelectedSettingOnFolder() {
      emitter.on('selected-setting-on-folder', (data: { show: boolean, menu: string }) => {
        const objEmit = {
          show: data.show,
          folderSelected: folderSelected.value
        }
        if(data.menu === 'EDIT_FOLDER'){
          emitter.emit('setting-edit-folder', objEmit);
        }
        else if(data.menu === 'NEW_FOLDER'){
          emitter.emit('setting-create-folder', objEmit);
        }
        else if(data.menu === 'SHARE_FOLDER'){
          emitter.emit('setting-share-folder', objEmit);
        }
        else if(data.menu === 'RENAME_FOLDER'){
          emitter.emit('setting-rename-folder', objEmit);
        }
        else if(data.menu === 'MOVE_FOLDER'){
          emitter.emit('setting-move-folder', objEmit);
        }
        else if(data.menu === 'DELETE_FOLDER'){
          emitter.emit('setting-delete-folder', objEmit);
        }
      });
    }

    const onNodeClick = async (folder: Folder) => {
      folderSelected.value = folder;
      //change filter
      const searchRequest = new SearchRequest();
      searchRequest.filter = 'inid:' + folder.folderId;
      conversationStore.setFilterForFindConversation(searchRequest);
      //convert folder name
      const folderName = locale.value[folderSelected.value.label.toLowerCase()] ? locale.value[folderSelected.value.label.toLowerCase()] : folderSelected.value.label;
      if (!myStore.alertReplyMail.replyMail) {
        // call new component
        await router.push('/mail-box/' + toSlug(folderName));
        // Show lai conversation
        emitter.emit('reset-conversation');
        // screen
        if(screenW.value < 600) {
          new sidebarMenuToggle().removeClassToMbId();
        }
      } else {
        myStore.alertReplyMail.showAlert = true;
        myStore.alertReplyMail.router = '/mail-box/' + toSlug(folderName);
      }
    };

    function initListenerMailContactNewTo() {
      emitter.on('mail-contact-new-to', (_evt: Item) => {
        setTimeout(() => {
          actionAddMailNew();
          //call emit to mailnew
          emitter.emit('add-sender-to-mail-new', _evt.sender);
        }, 500);
      });
    }

    function actionCreateNewFolder() {
      emitter.emit('show-modal-create-folder');
    }

    function actionAddMailNew() {
      const composeMessageDto = new ComposeMessageDto();
      composeMessageDto.id = Math.random().toString(36).substring(2, 9);
      //init value send later
      composeMessageDto.indexRender = indexRenderModalSendLater.value;
      indexRenderModalSendLater.value += 70;
      composeMessageDto.cancelSendLater = false;
      composeMessageDto.sendLaterSuccess = false;
      composeMessageDto.timeDisplaySendLater = myUser.value.timeSendLater && myUser.value.timeSendLater > 0 ? myUser.value.timeSendLater : 0;
      //add to list
      composeMessageList.value.push(composeMessageDto);
    }

    function actionCloseMessage(id: string) {
      const findIndex = composeMessageList.value.findIndex(value => value.id === id);
      if (findIndex >= 0) {
        composeMessageList.value.splice(findIndex, 1);
        //reset index render send later
        indexRenderModalSendLater.value = 0;
      }
    }

    function actionFullScreenMessage(id: string) {
      composeMessageList.value.forEach(item => {
        if (item.id == id) {
          item.fullscreenActive = true;
          item.minusCompose = true;
        } else {
          item.fullscreenActive = false;
          item.minusCompose = false;
        }
      });
    }

    function actionMinimizeScreenMessage(id: string) {
      composeMessageList.value.forEach(item => {
        if (item.id == id) {
          item.fullscreenActive = false;
          item.minusCompose = true;
        } else {
          item.minusCompose = false;
        }
      });
    }

    onMounted(async () => {
      //default active folder nếu truy cập route mail-box
      if (route.path.startsWith('/mail-box') && folderList.value.length > 0) {
        await onNodeClick(folderList.value[0]);
      }
      initListenerMailContactNewTo();
      onSelectedSettingOnFolder();
      //lắng nghe sự kiện active folder default
      emitter.on('on-active-folder-default', async () => {
        await onNodeClick(folderList.value[0]);
      });
      //lắng nghe sự kiện edit compose from conversation detail
      emitter.on('modify-compose-in-conversation-detail', (composeMessageDto: ComposeMessageDto) => {
        composeMessageList.value.push(composeMessageDto);
      });
    });

    // BEGIN: TigerBui` - thêm logo responsive
    const screenW = ref(window.innerWidth);
    const myCompany = computed(() => myStore.myCompany as Company);
    const closeMailBoxMenu = () => {
      new sidebarMenuToggle().addClassToMbId();
    };
    const getDimensions = () => {
      screenW.value = window.innerWidth;
      if(screenW.value > 600) {
        window.removeEventListener('resize', getDimensions);
      }
    }
    // END: TigerBui`

    onDeactivated(() => {
      emitter.off('selected-setting-on-folder');
      emitter.off('mail-contact-new-to');
      emitter.off('on-active-folder-default');
    });

    return {
      // firstBy,
      helper,
      darkMode,
      prettyBytes,
      locale,
      router,
      mailBoxToggle,
      folderSelected,
      showModalAddNewFolder,
      folderList,
      onNodeClick,
      folderStore,
      composeMessageList,
      actionCloseMessage,
      actionFullScreenMessage,
      actionMinimizeScreenMessage,
      actionAddMailNew,
      actionCreateNewFolder,
      myCompany,
      iNETmailLogo,
      closeMailBoxMenu,
      getDimensions,
      isHasTippy,
      conversation,
    };
  },
});
</script>
<style lang="scss">
  @import "@/assets/scss/_colors.scss";
  @import "@/assets/scss/mixin/_media-screen.scss";

  html.inet-mail-themes {
    .mail {
      &-list {
        .mail-group {
          @include mediaScreenWidth(min, md) {
            max-height: calc(100vh - 225px);
          }
          @include mediaScreenWidth(min, lg) {
            max-height: calc(100vh - 178px);
          }
        }
      }
    }
    .new-mail[style="display: none;"] {
      + .bar-footer-mail-box {
        display: none;
      }
    }
    .list-action {
      $mt: 1.25rem;
      height: calc(100vh - (198px + #{$mt}));
      @include mediaScreenWidth(min, lg) {
        height: calc(100vh - (149px + #{$mt}));
      }
      @include mediaScreenWidth(max, md) {
        height: 100vh;
        padding-bottom: 1rem;
      }
    }

    @include mediaScreenWidth(max, md) {
      .content {
        padding: 0;
        margin-top: -2px;
      }
      .top-bar-boxed {
        height: 56px;
        .mobile-top-bar {
          padding: 10px 12px;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
        }
      }
      #mail-box-toggle {
        &.menu-minus {
          .menu-control,
          .backdrop-menu-control {
            display: none;
          }
          .menu-control {
            + .col-span-12 {
              grid-column: span 12 / span 12;
            }
          }
        }
      }
    }
    &.dark {
      .create-folder-modal {
        .modal-dialog {
          .tree {
            background-color: transparent;
          }
        }

        .tree {
          &-list {
            .tree-row {
              > .tree-row-item {
                &:before {
                  background-color: transparent;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
