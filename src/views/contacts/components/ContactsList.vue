<template>
  <div class="grid grid-cols-12 gap-6">
    <div class="col-span-12 md:col-span-7">
      <div class="flex flex-col md:flex-row items-center">
        <h3 class="font-mono uppercase grow mb-3 md:mb-0">{{ locale.contacts }}
          <span>({{ contactData.itemList ? contactData.itemList.length : 0 }})</span>
        </h3>
        <div class="grow pl-3 text-right">
          <div class="form-group relative">
            <input type="search" :placeholder="locale.contactSearch" class="form-control pr-8"
                   v-model="findContactInput"/>
            <button class="absolute px-3 inset-y-0 right-0 text-slate-500">
              <SearchIcon class="w-4 h-4"/>
            </button>
          </div>
        </div>
      </div>
      <div class="py-3 contacts-list">
        <div class="overflow-y-auto h-full bg-white dark:bg-slate-900 rounded">
          <div class="py-5 px-3 text-center" v-if="contactData.itemList && contactData.itemList.length === 0">
            {{ locale.emailNotFound }}
            <b>{{
                contactFolderSelected.name && locale[contactFolderSelected.name.toLowerCase()] ? locale[contactFolderSelected.name.toLowerCase()] : contactFolderSelected.name
              }}</b>
          </div>
          <a v-for="item in findContacts()"
             href="javascript:;"
             :key="item.id"
             :title="item.email"
             :class="{'bg-gray-300/70 dark:bg-gray-500/50': ctDetail.id === item.id}"
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
    <div v-if="ctDetail.id"
         class="min-w-[15rem] fixed right-0 top-14 bg-light dark:bg-slate-700 bottom-0 md:bg-transparent md:dark:bg-transparent md:static z-50 md:z-0 px-3 md:px-0 md:col-span-5">
      <div class="py-12">
        <button type="button"
                class="absolute right-3 top-3 rounded-full btn px-2 bg-light dark:bg-slate-500/30 hover:dark:bg-slate-500/50 md:hidden"
                @click="actionResetItemContact">
          <XIcon class="w-4 h-4"/>
        </button>
        <div class="flex mb-5">
          <div class="w-12 h-12 flex-none">
            <iNETComponent name="Avatar" :avt-json="ctDetail" :key-str="'email'" avt-class="w-12 h-12"/>
          </div>
          <div class="pl-3 grow">
            <div class="mb-3">
              <h3 class="font-medium text-base mb-1">{{ ctDetail.fullName }}</h3>
              <div class="flex items-center word-break">
                <MailIcon class="w-4 h-4 shrink-0 text-slate-500/70 mr-1.5"/>
                <a class="text-blue-500 hover:text-blue-400 transition-colors" :href="'mailto:' + ctDetail.email">
                  {{ ctDetail.email }}
                </a>
              </div>
            </div>
            <div class="flex">
              <button class="btn btn-secondary btn-sm mr-2" @click="actionModifyItemContact(ctDetail)">
                {{ locale.modify }}
              </button>
              <button class="btn btn-danger-soft btn-sm" @click="actionDeleteItemContact(ctDetail)">
                {{ locale.delete }}
              </button>
            </div>
          </div>
        </div>
        <div class="p-3 border border-slate-200 dark:border-slate-600/50 rounded overflow-y-auto overflow-x-hidden"
             style="max-height: calc(100vh - 262px)">
          <h3 class="text-base mb-3">{{ locale.contactInformation }}</h3>
          <div class="flex mb-3" v-for="(vl, k) in ctDetail" v-show="locale[k]">
            <div
                class="h-10 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-slate-600/50 flex items-center justify-center">
              <i :icon-name="contactIconMap[k]" class="w-5 h-5 stroke-slate-600/70"/>
            </div>
            <div class="grow overflow-hidden pl-5">
              <p class="text-slate-500">{{ locale[k] }}</p>
              <p class="truncate" v-if="vl">
                {{ vl }}
              </p>
              <!-- Nếu có thể thì thêm phần này -->
              <p class="text-blue-600 dark:text-blue-400 text-xs" v-else>
                {{ locale.none }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="fixed inset-0 z-[49] bg-white/50 dark:bg-slate-900/70 md:hidden" @click="actionResetItemContact"
       v-if="ctDetail.id"></div>
  <!-- BEGIN: MODAL DELETE -->
  <iNETComponent name="ModalDelete"/>
  <!-- END: MODAL DELETE -->
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch} from "vue";
import {MyStore} from "@/stores/my-store";
import {createIcons, icons} from "lucide";
import {MyContactStore} from "@/stores/contact-store/contact-store";
import {Folder} from "@/model/Folder";
import {ItemContact} from "@/model/Contact";
import t from "typy";

export default defineComponent({
  name: "ContactsList",
  updated() {
    createIcons({icons, nameAttr: 'icon-name'});
  },
  setup() {
    const myStore = MyStore();
    const contactStore = MyContactStore();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);
    const contactData = computed(() => contactStore.contactData);
    const findContactInput = ref('');
    const offsetContact = ref(0);
    const ctDetail = ref<ItemContact>(new ItemContact());
    const modalShowDel = ref(false);
    const contactFolderSelected = computed(() => t(contactStore.contactFolderSelected).isObject ? contactStore.contactFolderSelected : {} as Folder);

    function findContacts() {
      return contactData.value.itemList.filter(({
                                                  email,
                                                  fullName
                                                }) => [email, fullName].some(val => val ? val.toLowerCase().includes(findContactInput.value.toLowerCase()) : ''));
    }

    function actionResetItemContact() {
      ctDetail.value = new ItemContact();
    }

    function actionModifyItemContact(item: ItemContact) {
      if (item.id) {
        emitter.emit('show-modal-modify-contact-data', item);
      }
    }

    function actionDeleteItemContact(item: ItemContact) {
      if (item.id) {
        emitter.emit('show-modal-delete-contact-data', {item: item, forever: contactFolderSelected.value.folderPath.startsWith('/Trash')});
      }
    }

    //Lắng nghe thay đổi kiểu contact
    watch(
        () => contactFolderSelected.value,
        async (value) => {
          if (t(value.folderPath).isDefined && value.folderPath !== '/DistributionList') {
            //reset value
            offsetContact.value = 0;
            findContactInput.value = '';
            //set new value
            const contactSelected = 'in:\"' + value.folderPath + '\"';
            //reload data
            await contactStore.getContactData(offsetContact.value, false, '', contactSelected);
          }
        },
    );

    const actionContactSelected = (_item) => {
      ctDetail.value = _item;
    }

    const contactIconMap = {
      email: 'mail',
      fullName: 'user',
      firstName: 'user',
      lastName: 'user',
      phone: 'phone',
      position: 'network',
      company: 'building-2',
      description: 'form-input',
      birthDay: 'cake'
    }

    return {
      locale,
      ctDetail,
      findContacts,
      contactData,
      modalShowDel,
      contactIconMap,
      findContactInput,
      contactFolderSelected,
      actionContactSelected,
      actionResetItemContact,
      actionModifyItemContact,
      actionDeleteItemContact,
    }
  }
})
</script>

<style lang="scss">
@import "@/assets/scss/mixin/media-screen";
.inet-mail-themes {
  .contacts-list {
    height: calc(100vh - 175px);
    @include mediaScreenWidth(min, lg) {
      height: calc(100vh - 130px);
    }
  }
}
</style>