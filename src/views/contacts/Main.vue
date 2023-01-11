<template>
  <top-bar/>
  <div class="lg:h-screen mt-6 md:my-0 bg-light dark:bg-darkmode-700">
    <div class="grid grid-cols-12">
      <div class="hidden md:block md:col-span-4 lg:col-span-3">
        <div class="p-5">
          <div class="flex items-center mb-3">
            <router-link :title="locale.backHome" class="btn btn-secondary mr-3" to="/">
              <MailIcon class="w-4 h-4"/>
            </router-link>
            <button class="btn btn-primary w-full overflow-hidden" :title="locale.addContact"
                    @click="actionShowCreateContactData">
              <UserPlusIcon class="w-4 h-4 shrink-0 mr-2"/>
              <span class="truncate">
              {{ locale.addContact }}
            </span>
            </button>
          </div>
          <Tree v-model:nodes="contactFolderList" :is-has-tippy="false" @nodeClick="onNodeClickItemFolder"
                :id-selected="contactFolderSelected.folderId"/>
          <div>
            <a href="javascript:"
               @click="actionCreateNewFolder"
               class="flex items-center py-3 px-3 rounded-full mt-2 dark:hover:bg-white/10"
            >
              <FolderPlusIcon class="w-4 h-4 mr-2 shrink-0"/>
              <span class="truncate txt grow">{{ locale.createFolder }} {{ locale.contacts }}</span>
            </a>
          </div>
        </div>
      </div>
      <div class="col-span-12 md:col-span-8 lg:col-span-9">
        <div class="px-3 pt-3 md:pt-5 md:px-5 rounded">
          <contacts-list v-if="contactFolderSelected.folderPath !== '/DistributionList'"/>
          <ContactsDistributionList v-else/>
        </div>
      </div>
    </div>
    <button class="btn btn-primary fixed right-3 bottom-3 rounded-full h-12 w-12 z-10" :title="locale.addContact"
            @click="actionShowCreateContactData">
      <UserPlusIcon class="w-6 h-6"/>
    </button>
  </div>
  <contact-create-edit-modal/>
  <!-- BEGIN: Modal Add new folder contact -->
  <ModalCreateFolderContact/>
  <!-- END: Modal Add new folder contact -->
  <ModalDeleteFolder/>
  <ModalEditNameFolder/>
</template>

<script lang="ts">
import TopBar from "@/components/top-bar/Main.vue";
import ContactsList from "@/views/contacts/components/ContactsList.vue";
import ContactsDistributionList from "@/views/contacts/components/ContactsDistributionList.vue";
import ContactCreateEditModal from "@/views/contacts/components/ContactsCreateEditModal.vue";
import {createIcons, icons} from "lucide";
import {computed, defineComponent, onDeactivated, onMounted} from "vue";
import {Folder} from "@/model/Folder";
import {MyStore} from "@/stores/my-store";
import {MyContactStore} from "@/stores/contact-store/contact-store";
import ModalDeleteFolder from "@/views/mail-box/partial/setting-on-folder/ModalDeleteFolder.vue";
import ModalEditNameFolder from "@/views/mail-box/partial/setting-on-folder/ModalEditNameFolder.vue";
import ModalCreateFolderContact from "@/global-components/inet-custom/components/ModalCreateFolderContact.vue";
import t from "typy";
import {SeoTitleStore} from "@/stores/seo-title-store/seo-title-store";

export default defineComponent({
  name: "MainContact",
  components: {
    ContactCreateEditModal, ModalDeleteFolder, ModalCreateFolderContact,
    ModalEditNameFolder, ContactsList, ContactsDistributionList, TopBar
  },
  data() {
    return {
      tgMobileMn: false
    }
  },
  mounted() {
    createIcons({icons, nameAttr: 'icon-name'});
  },
  setup() {
    const myStore = MyStore();
    const contactStore = MyContactStore();
    const seoTitleStore = SeoTitleStore();
    const locale = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    const contactFolderList = computed({
      get: () => contactStore.myContactList as Folder[],
      set: (data) => contactStore.myContactList = data,
    });
    const contactFolderSelected = computed({
      get: () => t(contactStore.contactFolderSelected).isObject ? contactStore.contactFolderSelected : {} as Folder,
      set: (data) => contactStore.contactFolderSelected = data,
    });

    const onNodeClickItemFolder = (folder: Folder) => {
      contactFolderSelected.value = folder;
    };

    function onSelectedSettingOnFolder() {
      emitter.on('selected-setting-on-folder', (data: { show: boolean, menu: string }) => {
        const objEmit = {
          show: data.show,
          folderSelected: contactFolderSelected.value
        }
        if (data.menu === 'RENAME_FOLDER') {
          emitter.emit('setting-rename-folder', objEmit);
        } else if (data.menu === 'DELETE_FOLDER') {
          emitter.emit('setting-delete-folder', objEmit);
        }
      });
    }

    function actionShowCreateContactData() {
      emitter.emit('show-modal-create-contact-data');
    }

    function actionCreateNewFolder() {
      emitter.emit('show-modal-create-folder-contact');
    }

    onMounted(() => {
      onSelectedSettingOnFolder();
      //Default active
      onNodeClickItemFolder(contactFolderList.value[0]);
      //reload seo title
      seoTitleStore.initGetSeoTitle();
      //lắng nghe sự kiện active folder default
      emitter.on('on-active-folder-contact-default', () => {
        onNodeClickItemFolder(contactFolderList.value[0]);
      });
    });

    onDeactivated(() => {
      emitter.off('on-active-folder-contact-default');
    });

    return {
      locale,
      contactFolderList,
      actionCreateNewFolder,
      actionShowCreateContactData,
      onNodeClickItemFolder,
      contactFolderSelected,
    }
  }
})
</script>