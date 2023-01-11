<template>
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalBody class="px-5">
      <div class="col-span-12">
        <h3 class="mb-5 text-base pb-3 border-b border-gray-300 dark:border-slate-700">
          {{ locale.SHARE_FOLDER }} 
          <span class="py-0.5 px-3 bg-white dark:bg-slate-600 rounded inline-block">
            {{ locale[folderProperties.label.toLowerCase()] }}
          </span>
        </h3>
        <div class="share-with-group">
          <h4 class="text-base mb-2">{{ locale.shareWith }}:</h4>
          <div class="form-check">
            <input id="radio-share-1" class="form-check-input" type="radio" name="radio_share"
                   :value="shareWithData.zimbraUser"
                   :disabled="hasDisableByEditFolderCall"
                   v-model="shareWithSelected"/>
            <label class="form-check-label" for="radio-share-1">{{ locale.shareInternalUserOrGroup }}</label>
          </div>
          <div class="form-check mt-2">
            <input id="radio-share-2" class="form-check-input" type="radio" name="radio_share"
                   :value="shareWithData.guest"
                   :disabled="hasDisableByEditFolderCall"
                   v-model="shareWithSelected"/>
            <label class="form-check-label" for="radio-share-2">{{ locale.shareExternalGuest }}</label>
          </div>
          <div class="form-check mt-2">
            <input id="radio-share-3" class="form-check-input" type="radio" name="radio_share"
                   :value="shareWithData.public"
                   v-model="shareWithSelected"
                   disabled/>
            <label class="form-check-label" for="radio-share-3">{{ locale.sharePublic }}</label>
          </div>
          <div class="mt-2">
            <label for="email-address">{{ locale.emailAddresses }} <small
                v-if="emailInputShareList.length > 0">({{ emailInputShareList.length }})</small></label>
            <!-- BEGIN: MailInputAutoComplete-->
            <div class="mb-2 flex flex-wrap items-center -mx-1" v-if="emailInputShareList.length > 0">
              <div v-for="email in emailInputShareList" :key="email"
                   class="overflow-hidden text-xs inline-flex items-center bg-gray-200 dark:bg-slate-600/50 rounded-full m-1"
              >
                <span class="py-0 pl-2 pr-1 dark:text-slate-300/80">{{ email }}</span>
                <button
                    type="button"
                    class="py-1 pl-1 pr-2 dark:text-slate-500 dark:hover:bg-slate-600"
                    @click="actionRemoteEmailShared(email)"
                >
                  <XIcon class="w-3 h-3"/>
                </button>
              </div>
            </div>
            <MailInputAutoComplete :mail-list="emailInputShareList" :disabled="hasDisableByEditFolderCall"/>
            <!-- BEGIN: MailInputAutoComplete-->
          </div>
        </div>
        <div class="role-share mb-5" v-if="shareWithSelected === shareWithData.zimbraUser">
          <fieldset class="border dark:border-slate-600 my-2 p-2 w-full">
            <legend class="px-2">{{ locale.role }}</legend>
            <div class="form-check">
              <input id="radio-none" class="form-check-input" type="radio" name="vertical_radio_button"
                     :disabled="hasDisableByEditFolderCall"
                     :value="ROLE_DATA.none" v-model="roleSelected"/>
              <label class="form-check-label" for="radio-none">{{ locale.none }}</label>
            </div>
            <div class="form-check mt-2">
              <input id="radio-viewer" class="form-check-input" type="radio" name="vertical_radio_button"
                     :disabled="hasDisableByEditFolderCall"
                     :value="ROLE_DATA.read" v-model="roleSelected"/>
              <label class="form-check-label" for="radio-viewer">{{ locale.viewer }}</label>
            </div>
            <div class="form-check mt-2">
              <input id="radio-manager" class="form-check-input" type="radio" name="vertical_radio_button"
                     :disabled="hasDisableByEditFolderCall"
                     :value="ROLE_DATA.readEditAddRemove" v-model="roleSelected"/>
              <label class="form-check-label mr-2" for="radio-manager">
                {{ locale.manager }}
                <small class="m-2">({{ locale.viewEditAddRemove }})</small>
              </label>
            </div>
            <div class="form-check mt-2">
              <input id="radio-admin" class="form-check-input" type="radio" name="vertical_radio_button"
                     :disabled="hasDisableByEditFolderCall"
                     :value="ROLE_DATA.readEditAddRemoveAdmin" v-model="roleSelected"/>
              <label class="form-check-label" for="radio-admin">
                {{ locale.admin }}
                <small class="m-2">({{ locale.viewEditAddRemoveAdmin }})</small>
              </label>
            </div>
          </fieldset>
        </div>
        <div class="message-group">
          <fieldset class="border dark:border-slate-600 my-2 p-2 w-full">
            <legend class="px-2">{{ locale.message }}</legend>
            <select class="form-select mb-2" aria-label="Message selecte" v-model="shareMsgSelected">
              <option :value="sendNotification.noSend">
                {{ locale.notSendMailAboutThisShare }}
              </option>
              <option :value="sendNotification.send">
                {{ locale.sendStandardMessage }}
              </option>
              <option :value="sendNotification.sendWithNote">
                {{ locale.addNoteToStandardMessage }}
              </option>
            </select>
            <div v-if="shareMsgSelected === sendNotification.send">
              <b class="mr-1">{{ locale.note }}:</b>
              <span class="dark:text-slate-400 text-xs">{{ locale.shareNoteDetail }}</span>
            </div>
            <div v-else-if="shareMsgSelected === sendNotification.sendWithNote">
              <div class="mb-1">
                <b class="mr-1">{{ locale.note }}:</b>
                <span class="dark:text-slate-400 text-xs">{{ locale.shareNoteDetail }}</span>
              </div>
              <textarea cols="3" rows="2" class="resize-none form-control"
                        v-model="notesWhenSendShareNotification"></textarea>
            </div>
          </fieldset>
        </div>
        <div class="text-right mt-5">
          <button type="button" class="btn btn-secondary mr-2 w-20" @click="actionCloseModal"> {{
              locale.cancel
            }}
          </button>
          <button type="button" class="btn btn-primary min-w-[8em]" @click="actionShareFolder"
                  :disabled="emailInputShareList.length <= 0 || hasDisableByEditFolderCall">
            {{ locale.share }}
          </button>
        </div>
      </div>
    </ModalBody>
  </Modal>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {Folder, IGrant} from "@/model/Folder";
import {Action, BatchRequest, FolderActionRequest} from "@/model/BatchRequest";
import MailInputAutoComplete from '@/views/mail-box/partial/MailInputAutoComplete.vue';
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import BatchService from "@/service/BatchService";
import {BatchResponse} from "@/model/BatchResponse";
import {Fault} from "@/model/Fault";
import {SendShareNotificationRequest} from "@/model/SendShareNotificationRequest";
import SendShareNotificationService from "@/service/SendShareNotificationService";
import {ROLE_DATA} from "@/utils/MyVariables";

export default defineComponent({
  name: "ModalShareFolder",
  components: {MailInputAutoComplete},
  setup() {
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    const showModal = ref(false);
    const folderProperties = ref<Folder>(new Folder());
    //các data trong form
    const sendNotification = {
      noSend: 'no-send',
      send: 'send',
      sendWithNote: 'send-with-note',
    }
    const shareMsgSelected = ref(sendNotification.send);
    const shareWithData = {
      zimbraUser: "usr",
      guest: "guest",
      public: "public"
    };

    //các value trên form
    const emailInputShareList = ref<string[]>([]);
    const shareWithSelected = ref(shareWithData.zimbraUser);
    const roleSelected = ref(ROLE_DATA.read);
    const notesWhenSendShareNotification = ref('');
    //Các value xử lý sau khi gọi request
    const hasData = ref(false);
    const shareFolderResponse = ref<BatchResponse[]>([]);
    const faultResponse = ref<Fault[]>([]);
    //Các value được lắng nghe khi được gọi từ modal edit folder
    const hasDisableByEditFolderCall = ref(false);

    function actionCloseModal() {
      // Đóng modal
      showModal.value = false;
    }

    function actionRemoteEmailShared(email: string){
      const findIndex = emailInputShareList.value.findIndex(value => value === email);
      if(findIndex >= 0){
        emailInputShareList.value.splice(findIndex, 1);
      }
    }

    async function actionShareFolder() {
      if (emailInputShareList.value.length > 0) {
        //reset value
        shareFolderResponse.value = [];
        faultResponse.value = [];
        //init request
        const itemRequest = new BatchRequest();
        //Duyệt từng email được share
        emailInputShareList.value.forEach((email, index) => {
          const folderActionRequest = new FolderActionRequest();
          folderActionRequest.requestId = String(index);
          folderActionRequest.action = new Action();
          folderActionRequest.action.id = folderProperties.value.folderId;
          folderActionRequest.action.op = "grant";
          folderActionRequest.action.grant.gt = shareWithSelected.value;
          folderActionRequest.action.grant.inh = "1";
          folderActionRequest.action.grant.d = email;
          folderActionRequest.action.grant.perm = roleSelected.value;
          folderActionRequest.action.grant.pw = "";
          itemRequest.FolderActionRequest.push(folderActionRequest);
          // Gọi emit cho những components đang lắng nghe data grant
          emitter.emit('add-grant-by-add-share-folder', folderActionRequest.action.grant);
        });
        //call request
        const response = await BatchService.request(itemRequest, myStore.token);
        if (response.data) {
          const responseData: ResponseData = response.data;
          //Kiểm tra backend có trả error ko
          if (responseData.values.error) {
            // Set thông báo thất bại
            showToastMessage(responseData.values.error, true);
          } else {
            const bodyResponse = responseData.values as [];
            //Nếu thành công có response thì check 2 trường hợp là đã gửi share chưa
            if (bodyResponse && bodyResponse.length > 0) {
              for (const item of bodyResponse) {
                const checkHasData = item as BatchResponse;
                if (checkHasData.folderId) hasData.value = true;
                if (hasData.value) {
                  shareFolderResponse.value.push(item);
                } else {
                  faultResponse.value.push(item);
                }
              }
            }
            //Gửi thông báo đến mail nếu có
            if (shareMsgSelected.value === sendNotification.send || shareMsgSelected.value === sendNotification.sendWithNote && emailInputShareList.value.length > 0) {
              for (const email of emailInputShareList.value) {
                //init request
                const itemRequest = new SendShareNotificationRequest();
                if (notesWhenSendShareNotification.value && sendNotification.sendWithNote) itemRequest.notes._content = notesWhenSendShareNotification.value;
                itemRequest.item.id = folderProperties.value.folderId;
                itemRequest.e.a = email;
                //call request
                const response = await SendShareNotificationService.sendShareNotification(itemRequest, myStore.token);
                if (response.data) {
                  const responseData: ResponseData = response.data;
                  //Kiểm tra backend có trả error ko
                  if (responseData.values.error) {
                    // Set thông báo thất bại
                    showToastMessage(responseData.values.error, true);
                  }
                }
              }
            }
            //Bắn thông báo sau khi hoàn tất
            if(faultResponse.value.length > 0){
              showToastMessage('', true, faultResponse.value);
            }
            else{
              showToastMessage();
            }
            // Đóng modal
            actionCloseModal();
          }
        } else {
          showToastMessage(undefined, true);
        }
      }
    }

    onMounted(() => {
      emitter.on('setting-share-folder', (data: { show: boolean, folderSelected: Folder, disabled?: boolean, grant?: IGrant }) => {
        //reload data
        showModal.value = data.show;
        folderProperties.value = data.folderSelected;
        emailInputShareList.value = [];
        shareWithSelected.value = data.grant && data.grant.emailShared ? data.grant.role : shareWithData.zimbraUser;
        roleSelected.value = data.grant && data.grant.emailShared ? data.grant.permission : ROLE_DATA.read;
        hasDisableByEditFolderCall.value = data.disabled ? data.disabled : false;
        if(data.grant && data.grant.emailShared){
          emailInputShareList.value.push(data.grant.emailShared);
        }
      });
    });

    onDeactivated(() => {
      emitter.off('setting-share-folder');
    });

    return {
      locale,
      showModal,
      actionCloseModal,
      hasDisableByEditFolderCall,
      folderProperties,
      emailInputShareList,
      shareWithSelected,
      roleSelected,
      shareMsgSelected,
      shareWithData,
      ROLE_DATA,
      sendNotification,
      notesWhenSendShareNotification,
      actionShareFolder,
      actionRemoteEmailShared,
    }
  }
})
</script>

<style scoped>

</style>