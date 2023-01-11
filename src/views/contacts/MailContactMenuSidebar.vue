<template>
  <div class="mail-contact-sidebar w-80 fixed right-0 inset-y-0 z-[120] transition-all" v-if="showSideBar">
    <div class="h-full w-full absolute z-[55] bg-light dark:bg-black/80 flex items-center" v-if="loading">
      <div class="w-full h-full m-auto">
        <loading-icon :icon="'puff'"/>
      </div>
    </div>
    <div class="intro-x bg-white dark:bg-gray-800 h-full">
      <div class="pt-3 pb-2 px-3 border-b border-gray-400 dark:border-gray-500/20 h-[52px]">
        <div class="flex items-center justify-between" v-if="!showSearch">
          <div class="action-l pr-1" v-if="!showContactData">
            <button type="button" class="btn rounded-full hover:bg-gray-500/50 p-[5px]"
                    @click="showContactData = true">
              <ArrowLeftIcon class="w-4 h-4"/>
            </button>
          </div>
          <div class="mct-heading" v-else>
            <button class="font-medium" @click="showContactData = false">{{ locale.back }}</button>
          </div>
          <div class="action-r text-right pl-1">
            <button type="button" class="btn rounded-full hover:bg-gray-500/50 p-[5px] mr-2"
                    @click="showSearch = true; showContactData = true">
              <SearchIcon class="w-4 h-4"/>
            </button>
            <button type="button" class="btn rounded-full hover:bg-gray-500/50 p-[5px]" @click="closeContactSn()">
              <XIcon class="w-4 h-4"/>
            </button>
          </div>
        </div>
        <div class="flex w-full items-center" v-else>
          <SearchIcon class="w-4 h-4" @click="actionFindContactByInput"/>
          <div class="grow px-2">
            <input v-model="findContactInput" @change="actionFindContactByInput" type="text"
                   class="w-full bg-transparent text-sm border-none border-0"
                   style="box-shadow: none;" :placeholder="locale.findContacts +'...'"/>
          </div>
          <button class="shrink-0 rounded-full btn hover:bg-gray-500/50 p-[5px]"
                  @click="showSearch = false; findContactInput = ''; actionFindContactByInput()">
            <XIcon class="w-4 h-4"/>
          </button>
        </div>
      </div>
      <div class="mct-item overflow-y-auto" v-if="!showContactData">
        <div class="mct-body">
          <div class="flex items-center m-3">
            <div class="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
              <iNETComponent name="Avatar" :avt-json="sender" :key-str="'sender'"/>
            </div>
            <div class="pl-2 grow">
              <h3 class="font-medium text-base">{{ sender.fullName }}</h3>
            </div>
          </div>
          <div class="mct-action px-3 py-1.5 my-3 flex items-center justify-center bg-white/50 dark:bg-gray-500/25">
            <Tippy tag="button" :content="locale.newMessage"
                   class="btn rounded-full hover:bg-neutral-500/50 p-[5px] mr-2"
                   @click="emitter.emit('mail-contact-new-to', sender)">
              <MailIcon class="w-4 h-4"/>
            </Tippy>
            <Tippy tag="a" :content="locale.chats" class="btn rounded-full hover:bg-neutral-500/50 p-[5px]"
                   href="https://chat.inet.vn/" target="_blank">
              <MessageCircleIcon class="w-4 h-4"/>
            </Tippy>
          </div>
          <div class="mct-mail p-3 my-5 mx-3 bg-light dark:bg-gray-600/75 rounded-md">
            <h3 class="font-medium">{{ locale.emailAddresses }}</h3>
            <div>
              <MailIcon class="w-4 h-4 inline-block mr-2"/>
              <a :href="'mailto:' + sender.sender" class="text-blue-400 hover:text-blue-300 transition-colors">
                {{ sender.sender }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="mct-list" style="height: calc(100vh - 52px)" v-else>
        <div class="flex items-center px-3 py-2">
          <h3 class="font-mono uppercase grow">{{ locale.contacts }}
            <span>({{ contactData.itemList ? contactData.itemList.length : 0 }})</span></h3>
          <div class="shrink-0 w-44">
            <TomSelect v-model="typeContactSelected" :options="{
                      placeholder: locale.chooseTypeContacts,
                    }" class="w-full ts-input-sm">
              <optgroup :label="locale.list">
                <option :value="item.folderPath" v-for="item in contactList.filter(value => !value.folderPath.startsWith('/DistributionList'))" :key="item.folderId">{{ locale[item.name.toLowerCase()] ? locale[item.name.toLowerCase()] : item.name }}</option>
              </optgroup>
            </TomSelect>
          </div>
        </div>
        <div class="overflow-y-auto" style="height: calc(100% - 51px)">
          <div class="p-3" v-if="contactData.itemList.length === 0 && findContactInput">
            {{ localeAdmin.emailNotFound }} <b>{{ findContactInput }}</b>
          </div>
          <a v-for="item in contactData.itemList"
             :key="item"
             :title="item.email"
             class="intro-y block p-3 transition-colors hover:bg-gray-500/20 dark:hover:bg-gray-500/50"
             @click="actionContactSelected(item)"
          >
            <div class="flex items-center">
              <div class="w-10 h-10 flex-none image-fit rounded-full">
                <iNETComponent name="Avatar" :avt-json="item" :key-str="'email'"/>
              </div>
              <div class="truncate pl-3 grow">
                <p class="font-medium truncate text-gray-600 dark:text-slate-300/75">{{ item.fullName }}</p>
                <p class="truncate text-xs text-gray-600 dark:text-slate-500">{{ item.email }}</p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, onUpdated, ref, watch} from "vue";
import {MyStore} from "@/stores/my-store";
import {Item} from "@/model/Conversation";
import {ItemContact} from "@/model/Contact";
import {MyContactStore} from "@/stores/contact-store/contact-store";
import { Folder } from "@/model/Folder";
import t from "typy";

export default defineComponent({
  name: 'MailContactMenuSidebar',
  setup() {
    const myStore = MyStore();
    const contactStore = MyContactStore();
    const locale = computed(() => myStore.locale);
    const localeAdmin = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    const offsetContact = ref(0);
    const findContactInput = ref('');
    const showContactData = ref(false);
    const showSideBar = ref<boolean>(false);
    const showSearch = ref<boolean>(false);
    const sender = ref<Item>(new Item());
    const contactData = computed(() => contactStore.contactData);
    const contactList = computed(() => contactStore.myContactList as Folder[]);
    const typeContactSelected = ref(t(contactList.value[0]).isObject ? contactList.value[0].folderPath : 'Contacts');
    const loading = ref<boolean>(true);
    const actionFindContactByInput = async () => {
      //set new value
      const contactSelected = 'in:\"' + typeContactSelected.value + '\"';
      await contactStore.actionFindContactByInput(offsetContact.value, findContactInput.value, contactSelected);
    }

    function closeContactSn() {
      showSideBar.value = false;
      showContactData.value = false;
      loading.value = true;
    }

    function actionContactSelected(_item: ItemContact) {
      //reset các giá trị
      showSearch.value = false;
      showContactData.value = false;
      sender.value = new Item();
      sender.value.fullName = _item.fullName;
      sender.value.sender = _item.email;
    }

    function timeoutLoading() {
      setTimeout(() => {
        loading.value = false;
      }, 1200);
    }

    onUpdated(() => {
      const body = document.getElementsByTagName('body')[0];
      if (!loading.value) {
        body.style.cssText = "overflow: hidden;"
      } else {
        body.removeAttribute('style');
      }
    });

    //Lắng nghe thay đổi kiểu contact
    watch(
        () => typeContactSelected.value,
        async (value) => {
          if (value) {
            //reset value
            offsetContact.value = 0;
            findContactInput.value = '';
            //set new value
            const contactSelected = 'in:\"' + value + '\"';
            //reload data
            await contactStore.getContactData(offsetContact.value, false, '', contactSelected);
          }
        },
    );

    onMounted(async () => {
      emitter.on('mail-contact-menu-sidebar', async (_evt: Item) => {
        timeoutLoading();
        showSideBar.value = true;
        //set giá trị người gửi
        sender.value = _evt;
        //set new value
        const contactSelected = 'in:\"' + typeContactSelected.value + '\"';
        //set contact
        await contactStore.getContactData(offsetContact.value, false, findContactInput.value, contactSelected);
      })
    });

    onDeactivated(() => {
      emitter.off('mail-contact-menu-sidebar');
    });

    return {
      locale,
      localeAdmin,
      loading,
      showSideBar,
      contactList,
      emitter,
      findContactInput,
      showSearch,
      sender,
      showContactData,
      contactData,
      closeContactSn,
      actionContactSelected,
      actionFindContactByInput,
      typeContactSelected
    }
  }
})

</script>

<style lang="scss">
html.inet-mail-themes {
  .mail-contact-sidebar {
    box-shadow: 0 -6px 10px 0 rgba(black, .25);
  }
}
</style>