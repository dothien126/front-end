<template>
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalBody class="px-5">
      <div class="col-span-12">
        <h3 class="mb-5 text-base pb-3 border-b border-gray-300 dark:border-slate-700">
          {{ locale.editFolder }} <span
            class="py-0.5 px-3 bg-white dark:bg-slate-600 rounded inline-block">{{ locale[folderSelected.label.toLowerCase()] }}</span>
        </h3>
        <div class="mb-3">
          <label for="frm-rename-folder" class="form-label">{{ locale.RENAME_FOLDER }}:</label>
          <div class="input-group">
            <input id="frm-rename-folder" type="text" class="form-control" v-model="folderSelected.name"
                   :disabled="!folderSelected.deletable"/>
          </div>
        </div>
        <div v-if="folderSelected.deletable" class="mb-3 flex items-center">
          <fieldset class="border dark:border-slate-600 p-2 w-full">
            <legend class="px-2">{{ locale.folderColor }}</legend>
            <colors-picker :color-folder="folderSelected.rgb" @update:color-folder="actionChangeColor"></colors-picker>
          </fieldset>
        </div>
        <div class="mb-3">
          <fieldset class="border dark:border-slate-600 my-2 p-2 w-full">
            <legend class="px-2">{{ locale.infoFolder }}</legend>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <p>{{ locale.message }}</p>
                <b>{{ folderSelected.items || 0 }}</b>
              </div>
              <div>
                <p>{{ locale.unread }}</p>
                <b>{{ folderSelected.unreadCount || 0 }}</b>
              </div>
              <div>
                <p>{{ locale.size }}</p>
                <b>{{ prettyBytes(folderSelected.size) || 0 }}</b>
              </div>
            </div>
          </fieldset>
        </div>
        <div class="mb-3">
          <fieldset class="border dark:border-slate-600 my-2 p-2 w-full">
            <legend class="px-2">{{ locale.retention }}</legend>
            <div class="mb-5 retention-group">
              <div class="form-check">
                <input id="msg-retention" class="form-check-input" type="checkbox" v-model="hasEnableRetentionKeep"/>
                <label class="form-check-label" for="msg-retention">{{ locale.enableMessageRetention }}</label>
              </div>
              <p class="dark:text-slate-500">{{ locale.messageRetentionDetail }}</p>
              <p class="mb-1">{{ locale.retentionRange }}:</p>
              <div class="grid grid-cols-12 gap-2">
                <select class="form-select col-span-4" aria-label="custom" :disabled="!hasEnableRetentionKeep">
                  <option>{{ locale.custom }}</option>
                </select>
                <input type="number" class="form-control col-span-4" aria-label="Input time"
                       v-model="retentionKeepInput"
                       :disabled="!hasEnableRetentionKeep"/>
                <select class="form-select col-span-4" v-model="folderSelected.retentionTypeKeep"
                        :disabled="!hasEnableRetentionKeep">
                  <option :value="item.value" v-for="item in typeTimeList" :key="item.value">{{ item.text }}</option>
                </select>
              </div>
            </div>
            <div class="disposal-group">
              <div class="form-check">
                <input id="msg-disposal" class="form-check-input" type="checkbox" v-model="hasEnableRetentionPurge"/>
                <label class="form-check-label" for="msg-disposal">{{ locale.enableMessageDisposal }}</label>
              </div>
              <p class="dark:text-slate-500">{{ locale.messageDisposalDetail }}</p>
              <p class="mb-1">{{ locale.disposalThreshold }}:</p>
              <div class="grid grid-cols-12 gap-2">
                <select class="form-select col-span-4" aria-label="custom" :disabled="!hasEnableRetentionPurge">
                  <option>{{ locale.custom }}</option>
                </select>
                <input type="number" class="form-control col-span-4" aria-label="Input time"
                       v-model="retentionPurgeInput"
                       :disabled="!hasEnableRetentionPurge"/>
                <select class="form-select col-span-4" v-model="folderSelected.retentionTypePurge"
                        :disabled="!hasEnableRetentionPurge">
                  <option :value="item.value" v-for="item in typeTimeList" :key="item.value">{{ item.text }}</option>
                </select>
              </div>
            </div>
          </fieldset>
        </div>
        <div class="mb-3" v-if="folderSelected.grantList.length > 0">
          <fieldset class="border dark:border-slate-600 my-2 p-2 w-full">
            <legend class="px-2">{{ locale.SHARE_FOLDER }}</legend>
            <div class="flex flex-col md:flex-row" v-for="(grant) in folderSelected.grantList">
              <div class="grow max-w-[142px] truncate md:py-1">
                <span :title="grant.emailShared">{{ grant.emailShared }}</span>
              </div>
              <div class="grow p-3 md:py-1 text-right">
                <small class="bg-white dark:bg-slate-600 px-1 rounded inline-block whitespace-nowrap">
                  {{ grant.display }}
                </small>
              </div>
              <div class="shrink-0 min-w-[162px]">
                <div class="-mx-1">
                  <button class="btn btn-sm btn-secondary m-1"
                          @click="actionEditShareFolder(true, grant)">{{ locale.custom }}
                  </button>
                  <button class="btn btn-sm btn-secondary m-1"
                          @click="revokeShareModal = true; revokeMailSelected = grant.emailShared">{{ locale.revoke }}
                  </button>
                  <button class="btn btn-sm btn-secondary m-1" @click="actionResendShareFolderNotification(grant.emailShared)">{{ locale.resend }}</button>
                </div>
              </div>
            </div>
          </fieldset>
        </div>
        <div class="flex items-center mt-5 -mx-1">
          <button type="button" class="btn btn-secondary shrink-0"
                  @click="actionEditShareFolder(false);">
            {{ locale.add + ' ' + locale.share }}...
          </button>
          <div class="text-right grow">
            <button type="button" class="btn btn-secondary min-w-[7em] m-1" @click="actionCloseModal">{{
                locale.cancel
              }}
            </button>
            <button type="button" class="btn btn-primary min-w-[8em] m-1" @click="actionSaveChange">{{
                locale.saveChange
              }}
            </button>
          </div>
        </div>
      </div>
      <!-- BEGIN: Revoke Modal Share -->
      <Modal :show="revokeShareModal" @hidden="revokeShareModal = false">
        <ModalBody>
          <div>
            <h4 class="text-base mb-2">{{ locale.areYouSure }} {{ locale.revoke }} {{ locale.shareWith }}
              {{ revokeMailSelected }}?</h4>
            <select class="form-select mb-2" aria-label="Message selecte" v-model="shareMsgSelected">
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
          </div>
        </ModalBody>
        <ModalFooter>
          <button class="btn btn-sm btn-primary w-24 mr-3"
                  @click="actionRevokeMail(revokeMailSelected); revokeShareModal = false">{{ locale.apply }}
          </button>
          <button class="btn btn-sm btn-secondary w-24" @click="revokeShareModal = false">{{ locale.cancel }}</button>
        </ModalFooter>
      </Modal>
      <!-- END: Revoke Modal Share -->
    </ModalBody>
  </Modal>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, ref, watch} from "vue";
import {MyStore} from "@/stores/my-store";
import ModalShareFolder from "@/views/mail-box/partial/setting-on-folder/ModalShareFolder.vue";
import {Folder, IGrant} from "@/model/Folder";
import {FolderStore} from "@/stores/folder-store/folder-store";
import {BatchRequest, FolderActionRequest, Grant, Keep, RetentionPolicy} from "@/model/BatchRequest";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import BatchService from "@/service/BatchService";
import {BatchResponse} from "@/model/BatchResponse";
import {E, MMp, MMpContent, RequestMessage} from "@/model/RequestMessage";
import RequestMessageService from "@/service/RequestMessageService";
import {SendShareNotificationRequest} from "@/model/SendShareNotificationRequest";
import SendShareNotificationService from "@/service/SendShareNotificationService";
import {ROLE_DATA} from "@/utils/MyVariables";
import { prettyBytes } from "@/utils/pretty-bytes-function/PrettyBytes";

export default defineComponent({
  name: "ModalEditFolder",
  components: {ModalShareFolder},
  data() {
    return {
      revokeShareModal: false,
    }
  },
  setup() {
    const myStore = MyStore();
    const myUser = computed(() => myStore.myUser);
    const folderStore = FolderStore();
    const emitter = myStore.useEmitter();
    const showModal = ref(false);
    const locale = computed(() => myStore.locale);
    const addShareModal = ref(false);
    const folderSelected = ref<Folder>(new Folder());
    const notesWhenSendShareNotification = ref('');
    //display retention data
    const typeTimeList = ref([
      {
        value: "days",
        text: locale.value.day,
      },
      {
        value: "weeks",
        text: locale.value.week,
      },
      {
        value: "months",
        text: locale.value.month,
      },
      {
        value: "years",
        text: locale.value.year,
      }
    ]);
    //retention
    const hasEnableRetentionKeep = ref(false);
    const hasEnableRetentionPurge = ref(false);
    const retentionKeepInput = ref(0);
    const retentionPurgeInput = ref(0);
    //check has change value
    const hasChangeNameFolder = ref(false);
    const hasChangeColorFolder = ref(false);
    const hasChangeRetentionKeep = ref(false);
    const hasChangeRetentionPurge = ref(false);
    //revoke mail
    const revokeMailSelected = ref('');

    // BEGIN: TigerBui
    const sendNotification = {
      send: 'send',
      sendWithNote: 'send-with-note',
    }
    const shareMsgSelected = ref(sendNotification.send);

    // END: TigerBui

    function actionCloseModal() {
      // Đóng modal
      showModal.value = false;
    }

    function actionChangeColor(value) {
      if (value) {
        folderSelected.value.rgb = value;
      }
    }

    async function actionSaveChange() {
      //init request
      const batchRequest = new BatchRequest();
      let requestId = 0;
      //change retention
      if (hasChangeRetentionKeep.value || hasChangeRetentionPurge.value) {
        const folderActionRequest = new FolderActionRequest();
        folderActionRequest.action.op = 'retentionpolicy';
        folderActionRequest.action.id = folderSelected.value.folderId;
        folderActionRequest.requestId = String(requestId);
        const retention = new RetentionPolicy();
        if (hasEnableRetentionKeep.value) {
          retention.keep.policy = new Keep();
          retention.keep.policy.type = 'user';
          retention.keep.policy.lifetime = calculatorSetValueForDataRetentionByTypeTime(folderSelected.value.retentionTypeKeep, retentionKeepInput.value) + "d";
        }
        if (hasEnableRetentionPurge.value) {
          retention.purge.policy = new Keep();
          retention.purge.policy.type = 'user';
          retention.purge.policy.lifetime = calculatorSetValueForDataRetentionByTypeTime(folderSelected.value.retentionTypePurge, retentionPurgeInput.value) + "d";
        }
        folderActionRequest.action.retentionPolicy = retention;
        batchRequest.FolderActionRequest.push(folderActionRequest);
      }
      //check change name folder
      if (hasChangeNameFolder.value) {
        requestId += 1;
        const folderActionRequest = new FolderActionRequest();
        folderActionRequest.action.op = 'rename';
        folderActionRequest.action.id = folderSelected.value.folderId;
        folderActionRequest.action.name = folderSelected.value.name;
        folderActionRequest.requestId = String(requestId);
        batchRequest.FolderActionRequest.push(folderActionRequest);
      }
      //check change color folder
      if (hasChangeColorFolder.value) {
        requestId += 1;
        const folderActionRequest = new FolderActionRequest();
        folderActionRequest.action.op = 'color';
        folderActionRequest.action.id = folderSelected.value.folderId;
        folderActionRequest.action.rgb = folderSelected.value.rgb;
        folderActionRequest.requestId = String(requestId);
        batchRequest.FolderActionRequest.push(folderActionRequest);
      }
      //call request
      const response = await BatchService.request(batchRequest, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          const bodyResponse = responseData.values as [];
          //Nếu có giá trị thì reload
          if (bodyResponse && bodyResponse.length > 0) {
            for (const item of bodyResponse) {
              const checkHasData = item as BatchResponse;
              if (checkHasData.folderId) {
                //reload
                await folderStore.initGetFolder();
                //close modal
                actionCloseModal();
              }
            }
          }
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    function actionEditShareFolder(disabled: boolean, grant?: IGrant){
      const objEmit = {
        show: true,
        folderSelected: folderSelected.value,
        disabled: disabled,
        grant: grant ? grant : {}
      }
      //call emit
      emitter.emit('setting-share-folder', objEmit);
    }

    async function actionResendShareFolderNotification(email: string) {
      //init request
      const itemRequest = new SendShareNotificationRequest();
      itemRequest.item.id = folderSelected.value.folderId;
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
        else{
          showToastMessage();
        }
      }
    }

    async function actionRevokeMail(emailRevoked: string) {
      if (emailRevoked.trim().length > 0) {
        //init request
        const batchRequest = new BatchRequest();
        const folderRequest = new FolderActionRequest();
        folderRequest.requestId = String(0);
        folderRequest.action.op = '!grant';
        folderRequest.action.id = folderSelected.value.folderId;
        folderRequest.action.zid = emailRevoked;
        batchRequest.FolderActionRequest.push(folderRequest);
        //call request
        const response = await BatchService.request(batchRequest, myStore.token);
        if (response.data) {
          const responseData: ResponseData = response.data;
          //Kiểm tra backend có trả error ko
          if (responseData.values.error) {
            // Set thông báo thất bại
            showToastMessage(responseData.values.error, true);
          } else {
            const bodyResponse = responseData.values as [];
            //Nếu có giá trị thì reload
            if (bodyResponse && bodyResponse.length > 0) {
              for (const item of bodyResponse) {
                const checkHasData = item as BatchResponse;
                if (checkHasData.folderId) {
                  //reload list
                  const findIndex = folderSelected.value.grantList.findIndex(value => value.emailShared === emailRevoked);
                  if (findIndex >= 0) {
                    folderSelected.value.grantList.splice(findIndex, 1);
                    //send mail
                    await sendMessageRequestAlfterRevokeMail(emailRevoked);
                  }
                }
              }
            }
          }
        } else {
          showToastMessage(undefined, true);
        }
      }
    }

    async function sendMessageRequestAlfterRevokeMail(emailRevoked: string) {
      //init request
      const itemRequest = new RequestMessage();
      //set uid unique
      itemRequest.suid = Date.now();
      //set to from address
      const from: E = {t: 'f', a: myUser.value.account, p: ''};
      const to: E = {t: 't', a: emailRevoked, p: ''};
      itemRequest.e.push(from, to);
      //set subject theo locale
      itemRequest.su._content = locale.value.shareRevoked + ': ' + folderSelected.value.name + ' ' + locale.value.sharedBy + ' ' + myUser.value.account;
      //content theo locale
      const mmp: MMp = {ct: 'multipart/alternative', part: '', mp: []};
      //type plain
      const contentTypePlain: MMpContent = {
        ct: 'text/plain', content: {
          _content: locale.value.followingShareRevoked + ': ' + folderSelected.value.name + '\n' +
              locale.value.sharedItem + ':\t' + folderSelected.value.name + '\n' +
              locale.value.owner + ':\t' + myUser.value.account + '\n' +
              locale.value.revoke + ':\t' + emailRevoked + '\n' +
              locale.value.notes + ':\t' + notesWhenSendShareNotification.value + '\n'
        }
      };
      mmp.mp.push(contentTypePlain);
      //type html
      const contentTypeHtml: MMpContent = {
        ct: 'text/html', content: {
          _content: "        <div style=\"font-family:sans-serif\">" +
              "            <h1 style=\"font-size:1.3em\">" + locale.value.followingShareRevoked + ": " + folderSelected.value.name + "</h1>" +
              "            <hr>" +
              "                <table style=\"color:#333;font-size:1em\">" +
              "                    <tbody>" +
              "                        <tr>" +
              "                            <th>" + locale.value.sharedItem + ":</th>" +
              "                            <td>" + folderSelected.value.name + "</td>" +
              "                        </tr>" +
              "                        <tr>" +
              "                            <th>" + locale.value.owner + ":</th>" +
              "                            <td>" +
              "                                <a href=\"mailto:" + myUser.value.account + "\" target=\"_blank\">" + myUser.value.account + "</a>" +
              "                            </td>" +
              "                        </tr>" +
              "                        <tr>" +
              "                            <th>" + locale.value.revoke + ":</th>" +
              "                            <td></td>" +
              "                        </tr>" +
              "                    </tbody>" +
              "                </table>" +
              "            </div>" +
              "            <hr>" +
              "                <table style=\"color:#333;font:1em sans-serif\">" +
              "                    <tbody>" +
              "                        <tr>" +
              "                            <th>" + locale.value.notes + ":</th>" +
              "                            <td>" + notesWhenSendShareNotification.value + "</td>" +
              "                        </tr>" +
              "                    </tbody>" +
              "                </table>"
        }
      };
      mmp.mp.push(contentTypeHtml);
      //type zimbra-share
      const contentTypeZimbraShare: MMpContent = {
        ct: 'xml/x-zimbra-share', content: {
          _content: "<share xmlns=\"urn:zimbraShare\" version=\"0.2\" action=\"delete\" >  " +
              "    <grantee id=\"" + myUser.value.account + "\" email=\"" + myUser.value.account + "\" name=\"\" />" +
              "    <grantor id=\"" + myUser.value.zimbraUserId + "\" email=\"donv@triethoc.vn\" name=\"" + myUser.value.account + "\" />" +
              "    <link id=\"" + folderSelected.value.folderId + "\" name=\"" + folderSelected.value.name + "\" view=\"message\" perm=\"\" />" +
              "    <notes>" + notesWhenSendShareNotification.value + "</notes>" +
              "</share>"
        }
      };
      mmp.mp.push(contentTypeZimbraShare);
      //add content to request
      itemRequest.mp.push(mmp);
      //call request
      const response = await RequestMessageService.send(itemRequest, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          const requestMessageResponse: RequestMessage = responseData.values;
          if (requestMessageResponse.id) {
            showToastMessage(locale.value.sendMessageSuccess, false);
          } else {
            showToastMessage(locale.value.sendMessageFail, false);
          }
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    function calculatorDisplayRetentionTime(typeTime: string) {
      let retentionTime = 0;
      if (typeTime === 'keep') {
        retentionTime = Number(folderSelected.value.retentionPolicy.keep.lifeTime.split("d")[0]);
        if (folderSelected.value.retentionTypeKeep === 'weeks') {
          retentionTime = Math.round(retentionTime / 7);
        }
        if (folderSelected.value.retentionTypeKeep === 'months') {
          retentionTime = Math.round(retentionTime / 31);
        }
        if (folderSelected.value.retentionTypeKeep === 'years') {
          retentionTime = Math.round(retentionTime / 366);
        }
      } else if (typeTime === 'purge') {
        retentionTime = Number(folderSelected.value.retentionPolicy.purge.lifeTime.split("d")[0]);
        if (folderSelected.value.retentionTypePurge === 'weeks') {
          retentionTime = Math.round(retentionTime / 7);
        }
        if (folderSelected.value.retentionTypePurge === 'months') {
          retentionTime = Math.round(retentionTime / 31);
        }
        if (folderSelected.value.retentionTypePurge === 'years') {
          retentionTime = Math.round(retentionTime / 366);
        }
      }
      return retentionTime;
    }

    function calculatorSetValueForDataRetentionByTypeTime(typeTime: string, dataInput: number) {
      if (typeTime === 'weeks') {
        dataInput = dataInput * 7;
      } else if (typeTime === 'months') {
        dataInput = dataInput * 31;
      } else if (typeTime === 'years') {
        dataInput = dataInput * 366;
      }
      return dataInput;
    }

    function displayPermissonShareFolder(data: IGrant){
      if(data.permission === ROLE_DATA.none){
        data.display = locale.value.none;
      }
      else if(data.permission === ROLE_DATA.read){
        data.display = locale.value.view;
      }
      else if(data.permission === ROLE_DATA.readEditAddRemove){
        data.display = locale.value.manager;
      }
      else if(data.permission === ROLE_DATA.readEditAddRemoveAdmin){
        data.display = locale.value.admin;
      }
    }

    onMounted(() => {
      emitter.on('setting-edit-folder', (data: { show: boolean, folderSelected: Folder }) => {
        //reload data
        showModal.value = data.show;
        folderSelected.value = data.folderSelected;
        //set display permission
        if(folderSelected.value.grantList && folderSelected.value.grantList.length > 0){
          for(const item of folderSelected.value.grantList){
            displayPermissonShareFolder(item);
          }
        }
        //set default type time
        folderSelected.value.retentionTypeKeep = folderSelected.value.retentionTypeKeep ? folderSelected.value.retentionTypeKeep : 'years';
        folderSelected.value.retentionTypePurge = folderSelected.value.retentionTypePurge ? folderSelected.value.retentionTypePurge : 'years';
        hasEnableRetentionKeep.value = false;
        hasEnableRetentionPurge.value = false;
        retentionKeepInput.value = 0;
        retentionPurgeInput.value = 0;
        if (folderSelected.value.retentionPolicy.keep.lifeTime) {
          hasEnableRetentionKeep.value = true;
          retentionKeepInput.value = calculatorDisplayRetentionTime('keep');
        }
        if (folderSelected.value.retentionPolicy.purge.lifeTime) {
          hasEnableRetentionPurge.value = true;
          retentionPurgeInput.value = calculatorDisplayRetentionTime('purge');
        }
      });
      //thêm grant khi người dùng add
      emitter.on('add-grant-by-add-share-folder', (grant: Grant) => {
        if(grant.d){
          const data: IGrant = {permission: grant.perm, emailShared: grant.d, role: grant.gt, password: grant.pw};
          displayPermissonShareFolder(data);
          //Kiểm tra đã tồn tại trong danh sách chưa, nếu tồn tại thì update
          const findGrant = folderSelected.value.grantList.find(value => value.emailShared === data.emailShared);
          if(findGrant){
            findGrant.display = data.display;
            findGrant.role = data.role;
            findGrant.password = data.password;
            findGrant.permission = data.permission;
          }
          else{
            folderSelected.value.grantList.push(data);
          }
        }
      });
    });

    onDeactivated(() => {
      emitter.off('setting-edit-folder');
      emitter.off('add-grant-by-add-share-folder');
    });

    watch(() => folderSelected.value.name, (value, oldValue) => {
      hasChangeNameFolder.value = value !== oldValue;
    });

    watch(() => folderSelected.value.rgb, (value, oldValue) => {
      hasChangeColorFolder.value = value !== oldValue;
    });

    watch(() => [hasEnableRetentionKeep.value, hasEnableRetentionPurge.value], (value, oldValue) => {
      hasChangeRetentionKeep.value = value[0] !== oldValue[0];
      hasChangeRetentionPurge.value = value[1] !== oldValue[1];
    });

    return {
      locale,
      prettyBytes,
      showModal,
      addShareModal,
      folderSelected,
      typeTimeList,
      hasEnableRetentionKeep,
      retentionKeepInput,
      hasEnableRetentionPurge,
      retentionPurgeInput,
      revokeMailSelected,
      actionCloseModal,
      actionChangeColor,
      actionSaveChange,
      actionEditShareFolder,
      actionRevokeMail,
      actionResendShareFolderNotification,
      shareMsgSelected,
      sendNotification,
      notesWhenSendShareNotification,
    }
  }
})
</script>

<style scoped>

</style>
