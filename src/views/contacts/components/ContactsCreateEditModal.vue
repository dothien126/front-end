<template>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalBody>
      <div class="flex mb-3">
        <div class="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-600/50 flex items-center justify-center">
          <i icon-name="user" class="w-5 h-5 stroke-slate-500/70"/>
        </div>
        <div class="grow pl-5">
          <div class="form-group mb-3">
            <label class="form-label text-slate-500" for="contact-name">{{ locale.firstName }}</label>
            <input type="text" class="form-control" name="contact-name" id="contact-name" v-model="formData.firstName"/>
          </div>
          <div class="form-group">
            <label class="form-label text-slate-500" for="id2">{{ locale.lastName }}</label>
            <input type="text" class="form-control" id="id2" v-model="formData.lastName"/>
          </div>
        </div>
      </div>
      <div class="flex mb-3">
        <div class="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-600/50 flex items-center justify-center">
          <i icon-name="building-2" class="w-5 h-5 stroke-slate-500/70"/>
        </div>
        <div class="grow pl-5">
          <div class="form-group mb-3">
            <label class="form-label text-slate-500" for="id3">{{ locale.company }}</label>
            <input type="text" class="form-control" id="id3" v-model="formData.company"/>
          </div>
          <div class="form-group">
            <label class="form-label text-slate-500" for="id4">{{ locale.position }}</label>
            <input type="text" class="form-control" id="id4" v-model="formData.position"/>
          </div>
        </div>
      </div>
      <!--        BEGIN: Email-->
      <div class="flex mb-3">
        <div class="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-600/50 flex items-center justify-center">
          <i icon-name="mail" class="w-5 h-5 stroke-slate-500/70"/>
        </div>
        <div class="grow pl-5">
          <div class="form-group">
            <label class="form-label text-slate-500" for="id5">{{ locale.email }}</label>
            <input type="text" class="form-control" id="id5" v-model="formData.email" />
          </div>
        </div>
      </div>
      <!--        END: Email-->
      <div class="flex mb-3">
        <div class="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-600/50 flex items-center justify-center">
          <i icon-name="phone" class="w-5 h-5 stroke-slate-500/70"/>
        </div>
        <div class="grow pl-5">
          <div class="form-group">
            <label class="form-label text-slate-500" for="id6">{{ locale.phone }}</label>
            <input type="text" class="form-control" title="Vui lòng nhập định dạng số điện thoại" pattern="\d*"
                   id="id6" v-model="formData.phone"/>
          </div>
        </div>
      </div>
      <div class="flex mb-3">
        <div class="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-600/50 flex items-center justify-center">
          <i icon-name="cake" class="w-5 h-5 stroke-slate-500/70"/>
        </div>
        <div class="grow pl-5">
          <div class="form-group mb-1">
            <label class="form-label text-slate-500" for="id7">{{ locale.birthDay }}</label>
            <v-date-picker v-model="formData.birthDay.value" :masks="formData.birthDay.masks">
              <template v-slot="{ inputValue, togglePopover }">
                <input
                    type="text"
                    class="form-control" id="id7"
                    :value="inputValue"
                    @focus="togglePopover()"
                />
              </template>
            </v-date-picker>
          </div>
        </div>
      </div>
      <div class="flex mb-5">
        <div class="h-10 w-10 rounded-full bg-slate-300 dark:bg-slate-600/50 flex items-center justify-center">
          <i icon-name="sticky-note" class="w-5 h-5 stroke-slate-500/70"/>
        </div>
        <div class="grow pl-5">
          <div class="form-group">
            <label class="form-label text-slate-500" for="id8">{{ locale.description }}</label>
            <textarea rows="2" cols="3" class="form-control" id="id8" v-model="formData.description"></textarea>
          </div>
        </div>
      </div>
      <div class="flex">
        <div>
          <button type="button" class="btn btn-secondary" @click="actionShowModalSelectContactFolder">
            <i icon-name="contact" class="w-4 h-4 stroke-slate-500/70 mr-1"></i> {{ locale.addressIn }}
          </button>
        </div>
        <div class="grow text-right">
          <button type="button" class="btn btn-secondary mr-3" @click="showModal = false">
            {{ locale.cancel }}
          </button>
          <button class="btn btn-primary" @click="actionCreateContact">
            {{ locale.saveAndClose }}
          </button>
        </div>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Modal Content -->
  <contacts-folder-modal/>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, reactive, ref} from "vue";
import {createIcons, icons} from "lucide";
import ContactsFolderModal from "@/views/contacts/components/ContactsFolderModal.vue";
import {MyStore} from "@/stores/my-store";
import {
  AFieldOfCnFieldOfCreateContactRequest,
  CnFieldOfCreateContactRequest,
  ICreateContactRequest
} from "@/model/interface/ICreateContactRequest";
import {helper} from "@/utils/helper";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import ContactService from "@/service/ContactService";
import {Folder} from "@/model/Folder";
import {MyContactStore} from "@/stores/contact-store/contact-store";
import t from "typy";
import {ItemContact} from "@/model/Contact";
import {RequestNoResponse} from "@/model/RequestNoResponse";

export default defineComponent({
  name: 'ContactCreateEditModal',
  components: {ContactsFolderModal},
  mounted() {
    createIcons({icons, nameAttr: 'icon-name'})
  },
  setup() {
    const myStore = MyStore();
    const contactStore = MyContactStore();
    const locale = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    const showModal = ref(false);
    const formData = reactive({
      id: '',
      firstName: '',
      lastName: '',
      company: '',
      position: '',
      email: '',
      phone: '',
      birthDay: {
        value: '',
        masks: {
          input: 'DD/MM/YYYY'
        }
      },
      description: '',
      folderId: '',
    });
    const createContactFolderSelected = computed(() => contactStore.createContactFolderSelected as Folder);

    function actionShowModalSelectContactFolder() {
      emitter.emit('show-modal-select-contact-folder');
    }

    function resetItemContact(){
      formData.id = '';
      formData.firstName = '';
      formData.lastName = '';
      formData.company = '';
      formData.position = '';
      formData.email = '';
      formData.phone = '';
      formData.birthDay.value = '';
      formData.description = '';
    }

    async function modifyFolderIdItemConTact() {
      //init request
      const itemFind = new RequestNoResponse();
      itemFind.itemId = formData.id;
      itemFind.folderId = createContactFolderSelected.value.folderId;
      itemFind.operation = 'move';
      //call request
      await contactStore.actionContactRequest(itemFind, true);
    }

    async function actionCreateContact() {
      //init value
      const firstName: AFieldOfCnFieldOfCreateContactRequest = {
        n: 'firstName',
        _content: formData.firstName,
      };
      const lastName: AFieldOfCnFieldOfCreateContactRequest = {
        n: 'lastName',
        _content: formData.lastName,
      };
      const company: AFieldOfCnFieldOfCreateContactRequest = {
        n: 'company',
        _content: formData.company,
      };
      const position: AFieldOfCnFieldOfCreateContactRequest = {
        n: 'jobTitle',
        _content: formData.position,
      };
      const email: AFieldOfCnFieldOfCreateContactRequest = {
        n: 'email',
        _content: formData.email,
      };
      const phone: AFieldOfCnFieldOfCreateContactRequest = {
        n: 'mobilePhone',
        _content: formData.phone,
      };
      const birthDay: AFieldOfCnFieldOfCreateContactRequest = {
        n: 'birthday',
        _content: formData.birthDay.value ? helper.formatDate(formData.birthDay.value, 'YYYY-MM-DD') : '',
      };
      const description: AFieldOfCnFieldOfCreateContactRequest = {
        n: 'notes',
        _content: formData.description,
      };
      //init request
      const itemRequest = {
        cn: {
          a: [] as AFieldOfCnFieldOfCreateContactRequest[],
        } as CnFieldOfCreateContactRequest,
      } as ICreateContactRequest;
      //add value to list
      itemRequest.cn.a.push(firstName, lastName, company, position, email, phone, birthDay, description);
      //logic modify
      if(formData.id){
        itemRequest.cn.id = formData.id;
      }
      //logic add
      else{
        itemRequest.cn.l = t(createContactFolderSelected.value.folderId) ? createContactFolderSelected.value.folderId : '';
      }
      //call request
      const response = await ContactService.createModifyContact(itemRequest, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          showToastMessage();
          //Nếu dang modify thì check folder id có thay đổi ko, nếu có ===> update
          if(formData.id && formData.folderId !== createContactFolderSelected.value.folderId){
            await modifyFolderIdItemConTact();
          }
          //close modal
          showModal.value = false;
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    onMounted(() => {
      emitter.on('show-modal-create-contact-data', () => {
        showModal.value = true;
        //reset value
        resetItemContact();
      });
      emitter.on('show-modal-modify-contact-data', (item: ItemContact) => {
        if(item){
          showModal.value = true;
          //set new value
          formData.id = item.id;
          formData.firstName = item.firstName;
          formData.lastName = item.lastName;
          formData.company = item.company;
          formData.position = item.position;
          formData.email = item.email;
          formData.phone = item.phone;
          formData.birthDay.value = item.birthDay;
          formData.description = item.description;
          formData.folderId = item.folderId;
        }
      });
    });

    onDeactivated(() => {
      emitter.off('show-modal-create-contact-data');
      emitter.off('show-modal-modify-contact-data');
    });

    return {
      locale,
      formData,
      showModal,
      actionShowModalSelectContactFolder,
      actionCreateContact,
    }
  }
})
</script>