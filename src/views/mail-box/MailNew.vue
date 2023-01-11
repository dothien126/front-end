<template>
  <div
      :id="'reply-' + mailData.id"
      class="mail-compose-item rounded-t overflow-hidden shadow-2xl ml-3"
      v-if="mailData.showHide"
      :class="{
      'is-fullscreen': mailData.fullScreenCompose,
      'is-minus': !mailData.minusCompose,
      'is-fullscreen-active': mailData.fullscreenActive,
      'ml-3': !isReply
    }"
  >
    <div class="w-full">
      <div class="header flex bg-gray-300 dark:bg-gray-700 py-2 px-3 shrink-0 h-[40px]">
        <span class="grow text-base truncate pr-3">{{
            requestSaveDraft.su._content ? requestSaveDraft.su._content : locale.newMessage
          }}</span>
        <div class="shrink-0">
          <Tippy
              v-if="mailData.minusCompose"
              tag="button"
              :content="locale.minimize"
              type="button"
              class="btn p-1 mr-1"
              @click="minusCompose()"
          >
            <MinusIcon class="w-4 h-4"/>
          </Tippy>
          <Tippy
              v-else
              tag="button"
              :content="locale.maximize"
              type="button"
              class="btn p-1 mr-1"
              @click="minusComposeClear()"
          >
            <SquareIcon class="w-4 h-4"/>
          </Tippy>
          <Tippy
              v-if="!mailData.fullScreenCompose"
              tag="button"
              :content="locale.fullScreen"
              type="button"
              class="btn p-1 mr-1"
              @click="
              fullScreenCompose();
              mailData.fullScreenCompose = true;
            "
          >
            <Maximize2Icon class="w-4 h-4"/>
          </Tippy>
          <Tippy
              v-else
              tag="button"
              :content="locale.exitFullScreen"
              type="button"
              class="btn p-1 mr-1"
              @click="
              minimizeScreenCompose();
              mailData.fullScreenCompose = false;
            "
          >
            <Minimize2Icon class="w-4 h-4"/>
          </Tippy>
          <Tippy
              tag="button"
              :content="locale.saveAndClose"
              type="button"
              class="btn p-1"
              @click="actionSaveMail(); actionCloseMail();"
          >
            <XIcon class="w-4 h-4"/>
          </Tippy>
        </div>
      </div>
      <div class="body bg-white" v-if="mailData.minusCompose">
        <div class="px-3 flex flex-col" :class="{ 'min-h-[56vh] max-h-[85vh]': mailData.minusCompose }">
          <div class="mail-info-group text-slate-600 shrink-0">
            <div class="mail-to-ip" v-if="!showTypeMail.to">
              <div class="flex flex-wrap py-2 items-center"
                   v-if="requestSaveDraft.listMailTo.length > 0 || requestSaveDraft.listMailCc.length > 0"
                   @mousedown="showTypeMail.to = true"
              >
                <div>
                  {{ requestSaveDraft.listMailTo[0] }}
                  {{ requestSaveDraft.listMailTo.length > 1 ? ', ' + requestSaveDraft.listMailTo[1] : '' }}
                  <span class="bg-slate-300 rounded px-1 text-xs" v-if="requestSaveDraft.listMailTo.length > 2">
                    {{
                      requestSaveDraft.listMailCc.length +
                      (requestSaveDraft.listMailTo.length - 2) +
                      ' ' + locale.otherRecipient
                    }}
                    <span class="ml-1" v-if="requestSaveDraft.listMailBcc.length > 0"
                    >({{ requestSaveDraft.listMailBcc.length + ' Bcc' }})</span
                    >
                  </span>
                </div>
              </div>
              <input
                  v-else
                  type="text"
                  class="text-sm border-0 px-0 w-full"
                  style="box-shadow: none"
                  :placeholder="locale.recipient"
                  @focus="actionFocusInputTypeMail('to')"
              />
            </div>
            <div class="mail-header-group" v-else>
              <div class="flex items-start mail-to flex-wrap">
                <button
                    class="btn border-none shrink-0 px-0 shadow-none py-1.5"
                    @click="actionChangeTypeMailByShowListContact('to')"
                >
                  {{ locale.to }}
                </button>
                <div class="grow basis-0 px-2 flex items-center flex-row flex-wrap relative" @click="focusIp">
                  <span v-if="requestSaveDraft.listMailTo.length > 0"
                        v-for="(mt, index) in requestSaveDraft.listMailTo"
                        class="m-1 text-xs inline-flex items-center px-2 py-1 bg-slate-200 rounded-full"
                  >
                    {{ mt }}
                    <button
                        type="button"
                        class="ml-1"
                        @click="removeContactItemMail(requestSaveDraft.listMailTo, index)"
                    >
                      <XIcon class="w-3 h-3"/>
                    </button>
                  </span>
                  <!-- BEGIN: MailInputAutoComplete-->
                  <MailInputAutoComplete class="basis-0 shrink-0 grow" :mail-list="requestSaveDraft.listMailTo"/>
                  <!-- BEGIN: MailInputAutoComplete-->
                </div>
                <div
                    class="text-right"
                    :class="{'basis-full': requestSaveDraft.listMailTo.length > 0, 'py-1': requestSaveDraft.listMailTo.length === 0}"
                    v-if="
                    !showTypeMail.cc &&
                    !showTypeMail.bcc &&
                    requestSaveDraft.listMailCc.length === 0 &&
                    requestSaveDraft.listMailBcc.length === 0
                  "
                >
                  <button
                      type="button"
                      class="btn border-none shadow-none inline-block px-2 py-1"
                      @click="actionFocusInputTypeMail('cc')"
                  >
                    Cc
                  </button>
                  <button type="button" class="btn border-none shadow-none inline-block px-2 py-1"
                          @click="actionFocusInputTypeMail('bcc')"
                  >
                    Bcc
                  </button>
                </div>
              </div>
              <div class="flex mail-cc items-start flex-wrap"
                   v-if="showTypeMail.cc || requestSaveDraft.listMailCc.length > 0" @click="focusIp">
                <button class="btn border-none shrink-0 px-0 shadow-none"
                        @click="actionChangeTypeMailByShowListContact('cc')"
                >
                  CC
                </button>
                <div class="grow basis-0 px-2 flex items-center flex-row flex-wrap relative">
                  <span v-if="requestSaveDraft.listMailCc.length > 0"
                        v-for="(mt, index) in requestSaveDraft.listMailCc"
                        class="m-1 text-xs inline-flex items-center px-2 py-1 bg-slate-200 rounded-full">
                    {{ mt }}
                    <button type="button" class="ml-1"
                            @click="removeContactItemMail(requestSaveDraft.listMailCc, index)">
                      <XIcon class="w-3 h-3"/>
                    </button>
                  </span>
                  <!-- BEGIN: MailInputAutoComplete-->
                  <MailInputAutoComplete class="basis-0 shrink-0 grow" :mail-list="requestSaveDraft.listMailCc"/>
                  <!-- BEGIN: MailInputAutoComplete-->
                </div>
                <div class="text-right"
                     :class="{'basis-full': requestSaveDraft.listMailCc.length > 0, 'py-1': requestSaveDraft.listMailCc.length === 0}"
                     v-if="!showTypeMail.bcc && requestSaveDraft.listMailBcc.length === 0">
                  <button type="button"
                          class="btn border-none shadow-none shrink-0 px-2 py-1"
                          @click="actionFocusInputTypeMail('bcc')"
                  >
                    Bcc
                  </button>
                </div>
              </div>
              <div class="flex mail-bcc items-start flex-wrap"
                   v-if="showTypeMail.bcc || requestSaveDraft.listMailBcc.length > 0" @click="focusIp">
                <button class="btn border-none shrink-0 px-0 shadow-none"
                        @click="actionChangeTypeMailByShowListContact('bcc')"
                >
                  BCC
                </button>
                <div class="grow basis-0 px-2 flex items-center flex-row flex-wrap relative">
                  <span v-if="requestSaveDraft.listMailBcc.length > 0"
                        v-for="(mt, index) in requestSaveDraft.listMailBcc"
                        class="m-1 text-xs inline-flex items-center px-2 py-1 bg-slate-200 rounded-full">
                    {{ mt }}
                    <button type="button" class="ml-1"
                            @click="removeContactItemMail(requestSaveDraft.listMailBcc, index)">
                      <XIcon class="w-3 h-3"/>
                    </button>
                  </span>
                  <!-- BEGIN: MailInputAutoComplete-->
                  <MailInputAutoComplete class="basis-0 shrink-0 grow" :mail-list="requestSaveDraft.listMailBcc"/>
                  <!-- BEGIN: MailInputAutoComplete-->
                </div>
                <button v-if="!showTypeMail.cc && requestSaveDraft.listMailCc.length === 0"
                        type="button" class="btn border-none shadow-none shrink-0"
                        @click="actionFocusInputTypeMail('cc')">
                  CC
                </button>
              </div>
            </div>
            <div class="mail-subject border-t border-slate-200 dark:border-t dark:border-slate-200" v-if="!isReply">
              <input type="text" v-model="requestSaveDraft.su._content"
                     class="text-sm border-0 px-0 w-full"
                     style="box-shadow: none" :placeholder="locale.subject"
                     @change="actionSaveMail"
                     @focus="actionResetTypeMail"
              />
            </div>
          </div>
          <div
              class="mail-content overflow-y-overlay py-1 overflow-x-hidden grow"
              :class="{ 'is-cc': showTypeMail.cc, 'is-bcc': showTypeMail.bcc }"
          >
            <ClassicEditor
                class="dark:bg-white"
                v-model="contentInCkEditor.content"
                :config="{
                  extraPlugins: [MyCustomUploadAdapterPlugin],
                  toolbar: toolBarEditor,
                  }"
                @focus="actionResetTypeMail"
            />

          </div>
          <div class="attact-group" v-if="requestSaveDraft.fileAttachmentList.length > 0">
            <div class="mt-2 flex text-slate-600">
              <PaperclipIcon class="w-4 h-4 mr-1"/>
              {{ requestSaveDraft.fileAttachmentList.length }} {{ locale.attachment }}
            </div>
            <div class="scroll-track-rounded scroll-gray-400 overflow-x-auto overflow-y-hidden flex flex-row">
              <div class="flex items-center bg-black/10 text-black my-1.5 mx-1 rounded py-1 px-3"
                   v-for="(file, fIdx) in requestSaveDraft.fileAttachmentList" :key="file"
              >
                <div class="grow pr-2">
                  <a :title="file.name"
                     :href="myCompany.zimbraHostInfo.downloadUrl + '&id=' + file.messageId + '&part=' + file.part"
                     target="_blank" class="flex items-center text-gray-700">
                    <span class="truncate grow">{{ file.name }}</span>
                    <span class="text-gray-600 text-xs shrink-0">({{ prettySize(file.size) }})</span>
                  </a>
                </div>
                <button type="button" class="shrink-0 text-gray-600"
                        @click="actionRemoveFileUploaded(fIdx)">
                  &times;
                </button>
              </div>
            </div>
          </div>
          <div class="footer bg-white py-3 shrink-0">
            <div class="flex items-center">
              <div class="shrink-0">
                <div class="flex">
                  <button type="button" class="btn border-none text-white bg-violet-600 rounded-r-none min-w-[80px]"
                          :disabled="isSending" @click="actionInitSendMessage">
                    {{ locale.send }}
                  </button>
                  <Dropdown v-if="!isSending">
                    <DropdownToggle tag="button" class="btn text-white border-none bg-violet-700 rounded-l-none h-full">
                      <ChevronDownIcon class="w-4 h-4"/>
                    </DropdownToggle>
                    <DropdownMenu class="w-44">
                      <DropdownContent>
                        <DropdownItem @click="acitonShowModalSendScheduled">
                          <SendIcon class="w-4 h-4 mr-2"/>
                          {{ locale.scheduledDelivery }}
                        </DropdownItem>
                      </DropdownContent>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
              <div class="grow px-3">
                <div class="flex">
                  <Tippy tag="button" class="btn text-slate-600 relative overflow-hidden" :content="locale.attachment">
                    <label class="label-input-file absolute inset-0 cursor-pointer">
                      <input :id="'file-upload-' + requestSaveDraft.id"
                             type="file" class="hidden" multiple
                             @change="chooseFiles($event)"
                      />
                    </label>
                    <PaperclipIcon class="w-4 h-4"/>
                  </Tippy>
                </div>
              </div>
              <div class="shrink-0">
                <Tippy tag="button" type="button" class="btn btn-secondary"
                       :content="locale.removeDrafts" @click="actionDeleteMessageDraft">
                  <TrashIcon class="w-4 h-4"/>
                </Tippy>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- BEGIN: Modal mail contact -->
  <Modal size="modal-lg" backdrop="static" :show="modalMailContact" @hidden="modalMailContact = false">
    <ModalBody class="p-5">
      <div class="contact-group">
        <div class="flex items-start md:items-center mb-5">
          <div class="grow mr-5 flex flex-col md:flex-row relative">
            <div class="min-w-[200px] w-full relative">
              <input v-model="findContactInput" @change="actionFindContactByInput"
                     type="search" class="form-control dark:border dark:border-slate-700 h-full pr-8"
                     :placeholder="locale['findEmail'] + '...'" />
              <button class="absolute right-2 top-1/2 -mt-2 dark:text-slate-600 dark:hover:text-slate-500 transition-colors" type="button">
                <SearchIcon class="w-4 h-4"/>
              </button>
            </div>
            <TomSelect v-model="typeContactSelected" :options="{
                placeholder: locale['chooseTypeContacts'],
              }"
                       class="w-full mt-2 md:mt-0 md:ml-2">
              <optgroup :label="locale['list']">
                <option value='in:\"contacts\"'>{{ locale['contacts'] }}</option>
                <option value='in:\"Emailed Contacts\"'>{{ locale['emailedContacts'] }}</option>
                <option value='in:\"trash\"'>{{ locale['trash'] }}</option>
              </optgroup>
            </TomSelect>
          </div>
          <button type="button" @click="modalMailContact = false"
                  class="btn btn-secondary-soft shrink-0">
            <XIcon class="w-4 h-4"/>
          </button>
        </div>
        <div class="mb-5 max-h-[60vh] overflow-y-auto overflow-x-hidden mail-contact-list">
          <div v-if="contactData.itemList.length === 0 && findContactInput">
            {{ locale.emailNotFound }} <b>{{ findContactInput }}</b>
          </div>
          <div v-for="item in contactData.itemList" :key="item"
               class="item flex items-center hover:bg-slate-600/30 py-3 px-2">
            <div class="form-check items-center justify-center mr-1">
              <input id="horizontal-form-3" class="form-check-input"
                     type="checkbox" v-model="item.checked"
                     @change="actionAddDataByShowListContact(item.checked, item.email)"
              />
            </div>
            <h3 class="pl-5 shrink-0 truncate w-44" :title="item.fullName">
              {{ item.fullName }}
            </h3>
            <h3 class="grow text-right truncate px-3 text-slate-500" :title="item.email">
              {{ item.email }}
            </h3>
          </div>
          <button class="btn btn-primary w-32 mr-2 mb-2"
                  v-if="contactData.hasMore" @click="
                offsetContact++;
                actionGetContactData();
              ">
            <ActivityIcon class="w-4 h-4 mr-2"/>
            {{ locale.showMore }}
          </button>
        </div>
      </div>
    </ModalBody>
    <ModalFooter v-if="countContactSelected[typeListContactSelected] && countContactSelected[typeListContactSelected].length > 0">
      <div class="flex">
        <div class="grow pr-3 flex items-center">
          <button type="button" class="mr-2" @click="actionResetContactDataSelected">
            <XIcon class="w-4 h-4"/>
          </button>
          <span>{{ locale.selected }} {{ countContactSelected[typeListContactSelected].length }}</span>
        </div>
        <button class="btn bg-violet-600 shrink-0 min-w-[120px] shrink-0" @click="modalMailContact = false">
          {{ locale.add }}
        </button>
      </div>
    </ModalFooter>
  </Modal>
  <!-- END: Modal mail contact -->
  <!-- BEGIN: Modal SEND SCHEDULED -->
  <div class="msg-send-time specify">
    <Modal backdrop="static" :show="showModalSendScheduled" @hidden="showModalSendScheduled = false">
      <ModalHeader class="text-base">
        {{ locale.specifySendTimeMessage }}
      </ModalHeader>
      <ModalBody>
        <div class="mb-5">
          <h3 class="mb-3">{{ locale.selectSendDateTimeMessage }}</h3>
          <div class="form-group mb-3">
            <label for="frm-time" class="form-label">{{ locale.time }}</label>
            <v-date-picker is24hr is-expanded is-dark v-model="sendTimeSelected.sendTime"
                           :timezone="sendTimeSelected.timeZone" mode="dateTime">
              <template v-slot="{ inputValue, inputEvents }">
                <input id="frm-time" class="form-control form-check-input py-2 px-3 focus:outline-none focus:border-blue-300"
                       :value="inputValue" v-on="inputEvents"
                />
              </template>
            </v-date-picker>
          </div>
          <div class="form-group">
            <label class="form-label">{{ locale.timeZone }}</label>
            <TomSelect v-model="sendTimeSelected.timeZone" :options="{
                      placeholder: locale.timeZoneSelected,
                      maxOptions: 100,
                    }" class="w-full">
              <option v-for="(item) in timeZoneList" :key="item" :value="item.name">
                {{ item.value }}
              </option>
            </TomSelect>
          </div>
        </div>
        <div class="text-right -mx-2">
          <button type="button" class="btn btn-secondary min-w-[100px] m-2"
                  @click="showModalSendScheduled = false">
            {{ locale.cancel }}
          </button>
          <button type="button" @click="actionSendScheduled"
                  class="btn bg-blue-6 dark:bg-violet-600 min-w-[100px] m-2">
            {{ locale.scheduledDelivery }}
          </button>
        </div>
      </ModalBody>
    </Modal>
    <!-- BEGIN: MODAL CONFIRM SEND LATER IS PAST-->
    <Modal size="modal-lg" :show="showConfirmSendScheduledBeforeNow"
           @hidden="showConfirmSendScheduledBeforeNow = false">
      <ModalBody>
        <div class="flex items-center">
          <h3 class="grow text-base">{{ textDisplayDateSendScheduled }}</h3>
          <div class="text-right shrink-0 flex items-center">
            <button type="button" class="btn btn-secondary min-w-[7em] mr-2"
                    @click="showConfirmSendScheduledBeforeNow = false;">{{ locale.cancelSend }}
            </button>
            <button type="button" class="btn" @click="actionConfirmSendScheduledBeforeNow">
              {{ locale.send }}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: MODAL CONFIRM SEND LATER IS PAST -->
    <!-- BEGIN: MODAL SUCCESS SEND SCHEDULED -->
    <Modal size="modal-lg" :show="showSuccessSendScheduled" @hidden="showSuccessSendScheduled = false">
      <ModalBody>
        <div class="flex items-center">
          <h3 class="grow text-base">{{ locale.scheduledSendIn }} <u>{{ textDisplayDateSendScheduled }}</u></h3>
          <div class="text-right shrink-0 flex items-center">
            <button type="button" class="btn btn-secondary min-w-[7em] mr-2" @click="showSuccessSendScheduled = false;">
              {{ locale.close }}
            </button>
            <button type="button" class="btn" @click="actionCancelSendMessage">
              {{ locale.cancelSend }}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: MODAL SUCCESS SEND SCHEDULED -->
  </div>
  <!-- END: Modal SEND SCHEDULED -->
  <!-- BEGIN: Modal CHANGE ROUTE -->
  <Modal :show="alertReplyMail.showAlert" @hidden="alertReplyMail.showAlert = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <div class="mb-5">
          <div class="text-xl">{{ locale.youWantToLeaveRoute }}...?</div>
        </div>
        <div>
          <button type="button" @click="actionConfirmChangeRoute" class="btn mr-2 w-24 btn-danger">
            {{ locale.exit }}
          </button>
          <button type="button" @click="alertReplyMail.showAlert = false" class="btn w-24 btn-secondary">
            {{ locale.stay }}
          </button>
        </div>
      </div>
    </ModalBody>
  </Modal>
  <!-- BEGIN: Modal SEND LATER -->
  <div class="fixed bottom-3 left-3 bg-gray-500 dark:bg-light z-[890] px-5 py-3 rounded min-w-[13rem]"
       :style="{bottom: mailData.indexRender + 'px'}"
       :id="'div-send-later-' + mailData.id" :ref="refData => mailData.divSendLater = refData"
       v-show="mailData.showModalSendLater">
    <div class="flex items-center justify-center h-full">
      <div class="flex items-center" v-if="!mailData.cancelSendLater && !mailData.sendLaterSuccess">
        <p class="text-slate-300 dark:text-slate-700">
          {{ locale.mail }} {{ requestSaveDraft.su._content }} {{ locale.sendLater }}: <b class="ml-1">
          {{ mailData.timeDisplaySendLater }} {{ locale.second }}</b>
        </p>
        <button class="btn bg-blue-500 btn-sm ml-2" @click="actionRevokeSendLater">{{ locale.revoke }}</button>
        <button class="btn bg-blue-500 btn-sm ml-2" @click="actionSendLaterNow">{{ locale.sent }}</button>
      </div>
      <div class="flex items-center" v-else>
        <p class="text-slate-300 dark:text-slate-700">
          {{ mailData.sendLaterSuccess ? locale.sendMessageSuccess : locale.drafts }}</p>
        <button class="btn btn-outline-secondary btn-sm ml-2 dark:text-slate-600" @click="actionCloseModalSendLater">
          <XIcon class="w-4 h-4"/>
        </button>
      </div>
    </div>
  </div>
  <!-- END: Modal SEND LATER -->
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, PropType, reactive, ref, watch} from 'vue';
import MailInputAutoComplete from '@/views/mail-box/partial/MailInputAutoComplete.vue';
import {MyStore} from '@/stores/my-store';
import fileAttachmentService from '@/service/FileAttachmentService';
import {FileAttachment} from '@/model/FileAttachment';
import {ResponseData} from '@/model/ResponseData';
import {actionConversationDetail, showToastMessage} from '@/utils/MyFunction';
import {E, PartAttachFile, RequestMessage} from '@/model/RequestMessage';
import RequestMessageService from '@/service/RequestMessageService';
import {MessageDetail} from '@/model/MessageDetail';
import {ComposeMessageDto} from '@/model/dto/ComposeMessageDto';
import {env, NOT_VALUES, toolBarEditor} from '@/utils/MyVariables';
import {SignatureStore} from "@/stores/signature-store/signature-store";
import {Company} from "@/model/Company";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {TimeZoneDto} from "@/model/dto/TimeZoneDto";
import {timeZone} from "@/utils/time-zone";
import {User} from "@/model/User";
import {prettyBytes} from '@/utils/pretty-bytes-function/PrettyBytes';
import {helper} from '@/utils/helper';
import {ClassicEditor} from "@/global-components/ckeditor";
import { MyCustomUploadAdapterPlugin } from '@/utils/ckeditor-custom-plugin/MyUploadAdapter';
import {onBeforeRouteLeave, useRoute} from "vue-router";
import router from "@/router";
import { MyContactStore } from '@/stores/contact-store/contact-store';
import {ItemConversationDetail} from "@/model/ConversationDetail";

export default defineComponent({
  name: 'MailReply',
  components: {MailInputAutoComplete, ClassicEditor},
  props: {
    mailData: {
      type: Object as PropType<ComposeMessageDto>,
      default: () => new ComposeMessageDto(),
    },
    message: {
      type: Object as PropType<ItemConversationDetail>,
      default: () => new ItemConversationDetail()
    }
  },
  methods: {
    focusIp(_evt) {
      const findIp = _evt.target.querySelector('.ip-email');
      if (findIp) {
        findIp.focus();
      }
    }
  },
  emits: ['closeMailNew', 'fullscreen', 'minimizeScreen', 'reloadConversationDetail'], // các event cho new mail
  setup(props, {emit}) {
    const myStore = MyStore();
    const contactStore = MyContactStore();
    const route = useRoute();
    const myUser = computed(() => myStore.myUser as User);
    dayjs.extend(timezone);
    dayjs.extend(utc);
    dayjs.extend(localizedFormat);
    const signatureStore = SignatureStore();
    const mySignatureForNewMail = computed(() => signatureStore.mySignatureForNewMail);
    const mySignatureForReply = computed(() => signatureStore.mySignatureForReply);
    const locale = computed(() => myStore.locale);
    const prettySize = prettyBytes;
    const emitter = myStore.useEmitter();
    const isReply = ref(false);
    const isModify = ref(false);
    const isSending = ref(false);
    const alertReplyMail = computed(() => myStore.alertReplyMail);
    const myCompany = computed(() => myStore.myCompany as Company);
    const mailData = computed(() => props.mailData as ComposeMessageDto);
    const message = computed(() => props.message as ItemConversationDetail);
    const showTypeMail = ref({
      to: false,
      cc: false,
      bcc: false,
    });
    const modalMailContact = ref<boolean>(false);
    const typeListContactSelected = ref('');
    const requestSaveDraft = ref<RequestMessage>(new RequestMessage());
    const countUploadFile = ref(0);
    const checkUploadMore = ref(false);
    const typeContactSelected = ref('in:"contacts"');
    const findContactInput = ref('');
    const offsetContact = ref(0);
    const countContactSelected = ref<any>({});
    const dataTypeContact = {
      to: requestSaveDraft.value.listMailTo,
      cc: requestSaveDraft.value.listMailCc,
      bcc: requestSaveDraft.value.listMailBcc,
    };
    const contactData = computed(() => contactStore.contactData);
    const contentInCkEditor = ref({
      content: "",
      signature: "",
      quote: "",
    });
    //variable send scheduled
    const showModalSendScheduled = ref(false);
    const sendTime = ref(0);
    const timeZoneSelect = ref<string>(myUser.value.timeZone);
    const timeZoneList = ref<TimeZoneDto[]>([]);
    const sendTimeSelected = reactive({
      sendTime: new Date(),
      timeZone: myUser.value.timeZone,
    });
    const showConfirmSendScheduledBeforeNow = ref(false);
    const showSuccessSendScheduled = ref(false);
    const textDisplayDateSendScheduled = ref('');

    //method
    function bodyFullscreenCompose(_status) {
      const getBody = document.getElementsByTagName('body');
      if (_status == 'remove') {
        getBody[0].classList.remove('fullscreen-compose');
      } else if (_status == 'add') {
        getBody[0].classList.add('fullscreen-compose');
      }
    }

    function minusCompose() {
      if (mailData.value.fullScreenCompose || !mailData.value.fullscreenActive) {
        mailData.value.minusCompose = false;
      }
      if (mailData.value.fullscreenActive) {
        bodyFullscreenCompose('remove');
      }
    }

    function minusComposeClear() {
      mailData.value.minusCompose = true;
      if (mailData.value.fullscreenActive) {
        bodyFullscreenCompose('add');
      } else {
        bodyFullscreenCompose('remove');
      }
    }

    function fullScreenCompose() {
      emit('fullscreen');
      bodyFullscreenCompose('add');
    }

    function minimizeScreenCompose() {
      emit('minimizeScreen');
      minusComposeClear();
    }

    function actionFocusInputTypeMail(typeMail: string) {
      //logic
      showTypeMail.value[typeMail] = true;
    }

    function actionResetTypeMail() {
      showTypeMail.value.to = false;
      showTypeMail.value.cc = false;
      showTypeMail.value.bcc = false;
    }

    function actionAddDataByShowListContact(checked: boolean, data: string) {
      if (typeListContactSelected.value === 'to') {
        if (checked) {
          requestSaveDraft.value.listMailTo.push(data);
        } else {
          const findIndex = requestSaveDraft.value.listMailTo.findIndex((value) => value === data);
          if (findIndex >= 0) {
            requestSaveDraft.value.listMailTo.splice(findIndex, 1);
          }
        }
      } else if (typeListContactSelected.value === 'cc' && data) {
        if (checked) {
          requestSaveDraft.value.listMailCc.push(data);
        } else {
          const findIndex = requestSaveDraft.value.listMailCc.findIndex((value) => value === data);
          if (findIndex >= 0) {
            requestSaveDraft.value.listMailCc.splice(findIndex, 1);
          }
        }
      } else if (typeListContactSelected.value === 'bcc' && data) {
        if (checked) {
          requestSaveDraft.value.listMailBcc.push(data);
        } else {
          const findIndex = requestSaveDraft.value.listMailBcc.findIndex((value) => value === data);
          if (findIndex >= 0) {
            requestSaveDraft.value.listMailBcc.splice(findIndex, 1);
          }
        }
      }
      if (dataTypeContact[typeListContactSelected.value]) {
        countContactSelected.value[typeListContactSelected.value] = dataTypeContact[typeListContactSelected.value];
      }
    }

    function actionResetContactDataSelected() {
      if (dataTypeContact[typeListContactSelected.value]) {
        dataTypeContact[typeListContactSelected.value].length = 0;
        countContactSelected.value[typeListContactSelected.value] = [];
      }
      contactData.value.itemList.forEach(item => item.checked = false);
    }

    function actionChangeTypeMailByShowListContact(typeMail: string) {
      typeListContactSelected.value = typeMail;
      //reset các giá trị đang tick (nếu có)
      const isTicked = contactData.value.itemList.some(value => value.checked);
      if (isTicked) {
        for (const item of contactData.value.itemList) {
          item.checked = false;
        }
      }
      //Kiểm tra đang click type mail nào thì reset các giá trị đã tick và tick lại theo email đã insert (nếu có)
      //BEGIN: TigerBui` - update
      const mData = dataTypeContact[typeListContactSelected.value];
      if (mData) {
        for (const item of mData) {
          //Nếu email có trong contact thì đánh dấu tick
          const findEmail = contactData.value.itemList.find(value => value.email === item);
          if (findEmail) {
            findEmail.checked = true;
          }
        }
      }
      //END: TigerBui` - update
      modalMailContact.value = true;
    }

    async function actionGetContactData() {
      await contactStore.getContactData(offsetContact.value, true, findContactInput.value, typeContactSelected.value);
    }

    async function actionFindContactByInput() {
      await contactStore.actionFindContactByInput(offsetContact.value, findContactInput.value, typeContactSelected.value);
    }

    async function saveDraftMessage() {
      requestSaveDraft.value.clientContent = contentInCkEditor.value.content;
      //call request save draft
      const response = await RequestMessageService.saveDraft(requestSaveDraft.value, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          const messsageDetailResponse: MessageDetail = responseData.values;
          if (messsageDetailResponse.messageId) {
            requestSaveDraft.value.id = messsageDetailResponse.messageId;
            // set part cho file attachment list
            if (messsageDetailResponse.fileAttachmentList && messsageDetailResponse.fileAttachmentList.length > 0) {
              for (const item of requestSaveDraft.value.fileAttachmentList) {
                const fileUpload = messsageDetailResponse.fileAttachmentList.find(f => f.filename === item.name);
                if (fileUpload) item.part = fileUpload.part;
              }
            }
          }
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    async function chooseFiles(event: any) {
      const fileUpload = event.target as HTMLInputElement;
      if (fileUpload && fileUpload.files && fileUpload.files.length > 0) {
        let formData = new FormData();
        for (let i = 0; i <= fileUpload.files.length; i++) {
          formData.append(myUser.value._id, fileUpload.files[i]);
        }
        //Xử lý part trong file đính kèm
        if (countUploadFile.value > 0 && checkUploadMore.value) {
          let i = 1;
          do {
            const partAttachFile: PartAttachFile = {
              part: String(requestSaveDraft.value.attach.mp.length + i + 1),
              mid: requestSaveDraft.value.id,
            };
            requestSaveDraft.value.attach.mp.push(partAttachFile);
          } while (i <= requestSaveDraft.value.fileAttachmentList.length - requestSaveDraft.value.attach.mp.length);
          if (countUploadFile.value % 2 === 0 || requestSaveDraft.value.attach.aid) {
            requestSaveDraft.value.attach.aid = '';
          }
        }
        //call save draft trước khi upload file
        await saveDraftMessage();
        //call request upload file
        const response = await fileAttachmentService.initUpload(formData, myStore.token);
        if (response.data) {
          const responseData: ResponseData = response.data;
          //Kiểm tra backend có trả error ko
          if (responseData.values.error) {
            // Set thông báo thất bại
            showToastMessage(responseData.values.error, true);
          } else {
            const fileAttachmentResponse: FileAttachment[] = responseData.values;

            if (fileAttachmentResponse && fileAttachmentResponse.length > 0) {
              //Duyet tung phan tu trong danh sach item de gan gia tri message id
              let i: number = 1;
              for (const item of fileAttachmentResponse) {
                item.messageId = requestSaveDraft.value.id; i++;
                if (countUploadFile.value > 0 && checkUploadMore.value) {
                  item.part =  String(requestSaveDraft.value.fileAttachmentList.length + i);
                }
              }
              requestSaveDraft.value.fileAttachmentList.push(...fileAttachmentResponse);
              //tăng biến đếm lên để xử lý trường hợp người dùng gọi upload 1 lần nữa
              countUploadFile.value++;
              checkUploadMore.value = true;
              //logic kiểm tra nếu file đính kèm chỉ có 1 phần tử (được upload 1 lần/1 file)
              if (fileAttachmentResponse.length == 1) {
                requestSaveDraft.value.attach.aid = fileAttachmentResponse[0].aid;
              } else if (fileAttachmentResponse.length > 1) {
                requestSaveDraft.value.attach.aid = fileAttachmentResponse
                    .map((value) => value.aid)
                    .join(',');
              }
              //call request save draft lần nữa
              await saveDraftMessage();
            } else {
              showToastMessage(NOT_VALUES, true);
            }
          }
        } else {
          showToastMessage(undefined, true);
        }
      }
    }

    async function actionInitSendMessage() {
      //validate to email
      if (requestSaveDraft.value.listMailTo.length <= 0) {
        showToastMessage(locale.value.invalidEmailTo, true);
      } else {
        if (myUser.value.sendLater) {
          //init render div send later
          await initShowModalSendLater();
          //minizime khung soan thao
          minusCompose();
        } else {
          isSending.value = true; // Disabled nút gửi tránh KH bấm gửi mail 2 lần
          //save mail truoc
          await actionSaveMail();
          //Send mail
          await actionSendMessage();
          //xóa compose mail
          actionCloseMail();
        }
      }
    }

    async function actionSendMessage() {
      //call request
      const response = await RequestMessageService.send(requestSaveDraft.value, myStore.token);
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
            // Nếu là reply, thì load lại conversation detail
            if (isReply.value) {
              emit('reloadConversationDetail');
              // action lại send mail
              isSending.value = false;
            }
          } else {
            showToastMessage(locale.value.sendMessageFail, true);
          }
        }
      } else {
        showToastMessage(undefined, true);
      }
      myStore.alertReplyMail.replyMail = false;
    }

    async function actionSaveMail() {
      //Nếu dữ liệu upload file đính kèm có thì loại bỏ aid và đánh dấu trạng thái gửi về backend có đính kèm file
      if (requestSaveDraft.value.attach.aid || (requestSaveDraft.value.fileAttachmentList && requestSaveDraft.value.fileAttachmentList.length > 0)) {
        requestSaveDraft.value.attach.aid = '';
        requestSaveDraft.value.hasFileAttachment = true;
      }
      //save draft truoc de lay id
      await saveDraftMessage();
    }

    function actionCloseMail() {
      //delete components
      emit('closeMailNew', mailData.value.id);
    }

    async function actionRemoveFileUploaded(index: number) {
      requestSaveDraft.value.fileAttachmentList.splice(index, 1);
      if (requestSaveDraft.value.attach.aid) {
        await actionSaveMail();
      }
    }

    function removeContactItemMail(_mailList, _idx) {
      _mailList.splice(_idx, 1);
    }

    function acitonShowModalSendScheduled() {
      //validate
      if (requestSaveDraft.value.listMailTo.length <= 0) {
        showToastMessage(locale.value.invalidEmailTo, true);
      } else if (!requestSaveDraft.value.clientContent) {
        showToastMessage(locale.value.invalidContentMessage, true);
      } else {
        showModalSendScheduled.value = true;
      }
    }

    async function actionSendScheduled() {
      //Xử lý thời gian theo timezone
      const timeConvertedToLocale = dayjs.tz(sendTimeSelected.sendTime, sendTimeSelected.timeZone);
      //check valid
      if (timeConvertedToLocale.isValid()) {
        //format date
        const timeFormated = timeConvertedToLocale.format('YYYY-MM-DDTHH:mm:ss');
        const dateConvertedByTimeZone = new Date(timeFormated);
        //tính toán timestamp theo millisecond
        const timezoneOffset = new Date(dateConvertedByTimeZone).getTimezoneOffset();
        //set kết quả trả về
        sendTime.value = dateConvertedByTimeZone.getTime() + timezoneOffset;
        //Check thời gian gửi có ít hơn thời gian hiện tại hay ko
        if (sendTime.value <= Date.now()) {
          showConfirmSendScheduledBeforeNow.value = true;
          textDisplayDateSendScheduled.value = locale.value.specifySendTimeMessageIsPast;
        } else {
          textDisplayDateSendScheduled.value = timeConvertedToLocale.format(env.dateTimeFormat);
          requestSaveDraft.value.autoSendTime = sendTime.value;
          //call request
          await actionSaveMail();
          //thông báo
          showSuccessSendScheduled.value = true;
        }
        //đòng modal
        showModalSendScheduled.value = false;
      }
    }

    async function actionCancelSendMessage() {
      requestSaveDraft.value.autoSendTime = 0;
      showSuccessSendScheduled.value = false;
      await actionSaveMail();
      //close compose mail
      actionCloseMail();
    }

    async function actionDeleteMessageDraft() {
      if (!isReply.value && requestSaveDraft.value.id) {
        //call zimbra
        await actionConversationDetail(requestSaveDraft.value.id, 'delete');
      } else {
        // reset lai
        myStore.alertReplyMail.showAlert = false;
        myStore.alertReplyMail.replyMail = false;
      }
      //delete components
      emit('closeMailNew', mailData.value.id);
    }

    async function actionConfirmSendScheduledBeforeNow() {
      //đóng modal trước
      showConfirmSendScheduledBeforeNow.value = false;
      //send message
      await actionSendMessage();
      //xóa compose mail
      actionCloseMail();
    }

    //Cần xác nhận để thoát route
    async function actionConfirmChangeRoute() {
      myStore.alertReplyMail.showAlert = false;
      myStore.alertReplyMail.replyMail = false;
      // Change route
      await router.push(myStore.alertReplyMail.router);
      // Xử lý khi user click cùng một folder
      if (myStore.alertReplyMail.router === route.fullPath || myStore.alertReplyMail.router === decodeURI(route.fullPath.slice(route.fullPath.indexOf("tags") + 5))) {
        emitter.emit('show-conversation');
      }
    }

    //init method
    function initRequestSaveDraft() {
      //set idnt
      requestSaveDraft.value.idnt = myUser.value.zimbraUserId;
      //set email sender
      const e: E = {a: myStore.myUser.account, t: 'f', p: myUser.value.displayName};
      requestSaveDraft.value.e.push(e);
    }

    // Lấy chữ ký chủ sở hữu
    async function initGetSignature() {
      //call store
      await signatureStore.initGetSignatureList();
      signatureStore.initGetSignatureForNewMailOrReply();
      //lay chu ky khi new mail (neu goi tu conversation detail se rewrite lai)
      if (!isReply.value) {
        contentInCkEditor.value.signature = mySignatureForNewMail.value.contentDisplay ? mySignatureForNewMail.value.contentDisplay : '';
      }
    }

    function initGetTimeZoneList() {
      const timeZoneKeys = Object.entries(timeZone);
      for (const item of timeZoneKeys) {
        const timeZoneDto = new TimeZoneDto();
        timeZoneDto.name = item[0];
        timeZoneDto.value = item[1];
        timeZoneList.value.push(timeZoneDto);
      }
    }

    //Lắng nghe thay đổi kiểu contact
    watch(
        () => typeContactSelected.value,
        async (value) => {
          if (value) {
            //reset value
            offsetContact.value = 0;
            findContactInput.value = '';
            //reload data
            await contactStore.getContactData(offsetContact.value, false, findContactInput.value, typeContactSelected.value);
            //reload tick chọn trong contact list
            actionChangeTypeMailByShowListContact(typeListContactSelected.value);
          }
        },
    );

    async function initDataWhenComposeMail() {
      //init request save draft
      initRequestSaveDraft();
      //init contact data
      await contactStore.getContactData(offsetContact.value, false, findContactInput.value, typeContactSelected.value);
      await initGetSignature();
      //init time zone list
      initGetTimeZoneList();
    }

    async function calculatorTimeSendLater() {
      const {seconds} = helper.diffTimeByNow(mailData.value.timeCalculatorSendLater);
      //Neu thoi gian het thi set time display = 0 va thay doi cac gia tri khac (khong dung method sendlaternow boi vi khi save draft se bi loi vi mail da duoc gui di roi)
      if (seconds <= 0 && !mailData.value.sendLaterSuccess) {
        //reset value
        mailData.value.timeDisplaySendLater = 0;
        //SHOW VALUE SUCCESS
        mailData.value.sendLaterSuccess = true;
        //set value time send now
        requestSaveDraft.value.autoSendTime = new Date().getTime();
        //save mail
        await actionSaveMail();
        //REMOVE INTERVAL DISPLAY TIME
        clearInterval(mailData.value.interValDisplayTime);
        //INTERVAL 3 SENCONDS CLOSE ALL MODAL SEND LATER
        mailData.value.interValCloseSendLater = setInterval(actionCloseModalSendLater, 3000);
      } else {
        mailData.value.timeDisplaySendLater = Number(seconds);
      }
    }

    async function initShowModalSendLater() {
      //REMOVE INTERVAL
      clearInterval(mailData.value.interValDisplayTime);
      clearInterval(mailData.value.interValCloseSendLater);
      //RENDER DOM MOI
      document.body.appendChild(mailData.value.divSendLater);
      //Calculator time send message
      mailData.value.timeCalculatorSendLater = new Date();
      mailData.value.timeCalculatorSendLater.setSeconds(mailData.value.timeCalculatorSendLater.getSeconds() + myUser.value.timeSendLater);
      //interval
      mailData.value.interValDisplayTime = setInterval(calculatorTimeSendLater, 1000);
      //show modal send later
      mailData.value.cancelSendLater = false;
      mailData.value.sendLaterSuccess = false;
      mailData.value.showModalSendLater = true;
    }

    async function actionRevokeSendLater() {
      //SHOW VALUE CANCEL
      mailData.value.cancelSendLater = true;
      //RESET TIME
      mailData.value.timeDisplaySendLater = myUser.value.timeSendLater && myUser.value.timeSendLater > 0 ? myUser.value.timeSendLater : 0;
      //reset auto send time in request
      requestSaveDraft.value.autoSendTime = 0;
      //save mail
      await actionSaveMail();
      //RESTORE WINDOW COMPOSE
      minusComposeClear();
      //REMOVE INTERVAL DISPLAY TIME
      clearInterval(mailData.value.interValDisplayTime);
      //INTERVAL 3 SENCONDS CLOSE ALL MODAL SEND LATER
      mailData.value.interValCloseSendLater = setInterval(actionCloseModalSendLater, 3000);
    }

    async function actionSendLaterNow() {
      //SHOW VALUE SUCCESS
      mailData.value.sendLaterSuccess = true;
      //set value time send now
      requestSaveDraft.value.autoSendTime = new Date().getTime();
      //save mail
      await actionSaveMail();
      //REMOVE INTERVAL DISPLAY TIME
      clearInterval(mailData.value.interValDisplayTime);
      //INTERVAL 3 SENCONDS CLOSE ALL MODAL SEND LATER
      mailData.value.interValCloseSendLater = setInterval(actionCloseModalSendLater, 3000);
    }

    function actionCloseModalSendLater() {
      //CLOSE MODAL
      mailData.value.showModalSendLater = false;
      //REMOVE DOM
      document.body.removeChild(mailData.value.divSendLater);
      //REMOVE INTERVAL
      clearInterval(mailData.value.interValCloseSendLater);
      //xóa compose mail neu send later success
      if (mailData.value.sendLaterSuccess) {
        actionCloseMail();
      }
    }

    onMounted(async () => {
      //init value
      await initDataWhenComposeMail();
      //init listener add list mail to from contact
      emitter.on('add-sender-to-mail-new', async (sender: string) => {
        isReply.value = false;
        isModify.value = false;
        requestSaveDraft.value.listMailTo.push(sender);
      });
      //init listener reply in conversation detail
      emitter.on('reply-in-conversation-detail' + message.value.messageId, async (data: { requestMessage: RequestMessage, isReply: boolean, isModify: boolean }) => {
        const newLine = '<p></p><p></p>';
        isReply.value = data.isReply;
        isModify.value = data.isModify;
        if (isReply.value) {
          //set data
          requestSaveDraft.value = data.requestMessage;
          //set signature
          contentInCkEditor.value.signature = mySignatureForReply.value.contentDisplay ? mySignatureForReply.value.contentDisplay : '';
          // Kiểm tra chữ ký ở vị trí trên hay dưới
          if (myUser.value.mailSignatureStyle === 'outlook') {
            contentInCkEditor.value.content = newLine + contentInCkEditor.value.signature + data.requestMessage.clientContent;
          } else {
            contentInCkEditor.value.content = newLine + data.requestMessage.clientContent + contentInCkEditor.value.signature;
          }
        } else if (isModify.value) {
          //set data
          requestSaveDraft.value = data.requestMessage;
          //set signature
          contentInCkEditor.value.signature = mySignatureForReply.value.contentDisplay ? mySignatureForReply.value.contentDisplay : '';
          if (!requestSaveDraft.value.idnt) {
            await initDataWhenComposeMail();
          }
          contentInCkEditor.value.content = data.requestMessage.clientContent;
        }
      });
      if (!isReply.value) {
        contentInCkEditor.value.content = '<p></p><p></p>' + contentInCkEditor.value.signature;
      }
    });

    onDeactivated(() => {
      emitter.off('add-sender-to-mail-new');
      emitter.off('reply-in-conversation-detail' + message.value.messageId);
      clearInterval(mailData.value.interValDisplayTime);
      clearInterval(mailData.value.interValCloseSendLater);
    });

    onBeforeRouteLeave((_to, _from, next) => {
      if (myStore.alertReplyMail.replyMail) {
        next(false);
        myStore.alertReplyMail.showAlert = true;
        myStore.alertReplyMail.router = _to.fullPath;
      }
    })

    return {
      env,
      locale,
      toolBarEditor,
      MyCustomUploadAdapterPlugin,
      isModify,
      isReply,
      isSending,
      myStore,
      showTypeMail,
      offsetContact,
      typeContactSelected,
      countContactSelected,
      contactData,
      mailData,
      modalMailContact,
      showConfirmSendScheduledBeforeNow,
      requestSaveDraft,
      findContactInput,
      typeListContactSelected,
      myCompany,
      alertReplyMail,
      contentInCkEditor,
      actionGetContactData,
      chooseFiles,
      removeContactItemMail,
      fullScreenCompose,
      minimizeScreenCompose,
      minusCompose,
      minusComposeClear,
      actionConfirmChangeRoute,
      actionInitSendMessage,
      prettySize,
      actionFocusInputTypeMail,
      actionResetTypeMail,
      actionFindContactByInput,
      actionChangeTypeMailByShowListContact,
      actionAddDataByShowListContact,
      actionResetContactDataSelected,
      actionSaveMail,
      actionCloseMail,
      actionRemoveFileUploaded,
      acitonShowModalSendScheduled,
      showModalSendScheduled,
      timeZoneList,
      timeZoneSelect,
      sendTimeSelected,
      actionSendScheduled,
      showSuccessSendScheduled,
      textDisplayDateSendScheduled,
      actionCancelSendMessage,
      actionDeleteMessageDraft,
      actionConfirmSendScheduledBeforeNow,
      actionRevokeSendLater,
      actionSendLaterNow,
      actionCloseModalSendLater,
    };
  },
});
</script>

<style lang="scss">
@import 'v-calendar/dist/style.css';
@import './src/assets/scss/colors';

$grey-32: #323232;
.fr-second-toolbar {
  display: none !important;
}

body.fullscreen-compose {
  overflow: hidden;
  .top-bar-boxed {
    z-index: 0;
  }
  #mail-compose-new {
    visibility: visible;
    background-color: rgba(black, 0.58);

    > .mail-compose-item {
      &.is-fullscreen-active {
        width: 80vw;
        position: absolute;
        top: 45px;
        left: calc(50% - 40vw);
      }

      .body {
        .mail-content {
          height: 70vh;
        }
      }
    }

    .ck-editor {
      height: auto;
    }
  }
}

#mail-compose-new {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
  z-index: 889;
  display: flex;
  flex-flow: row nowrap;
  overflow: hidden;
  visibility: hidden;
  align-items: flex-end;
  justify-content: flex-end;

  > .mail-compose-item {
    @media screen and (min-width: 768px) {
      width: 605px;
    }
    width: 100%;
    visibility: initial;
    flex-shrink: 0;
    position: relative;

    .btn {
      &:focus {
        box-shadow: none;
      }
    }

    &.is-minus {
      width: 300px;
    }
  }

  .overflow-y-overlay {
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(black, 0.45);
    }
  }
}

.modal-dialog {
  .mail-contact-list {
    > .item {
      &:hover {
        .image-fit.show {
          display: none;
        }

        .ip-check.hidden {
          display: flex;
        }
      }
    }
  }
}

html.inet-mail-themes {
  .mail-compose-item {
    .mail {
      &-header-group {
        .mail-auto-complete-group {
          input {
            &.ip-email {
              background: none;
              border: none;
              border-radius: 0;
              box-shadow: none;
            }

            &:focus {
              box-shadow: none;
            }
          }
        }
      }
    }

    .mail-content {
      position: relative;
    }

    .ck-editor {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      .ck {
        &.ck-toolbar {
          background-color: #f2f2f2;
          color: $grey-32;
          border-color: rgba(black, .1);

          .ck-icon {
            :not([fill]) {
              fill: lighten($grey-32, 10%);
            }
          }

          .ck-button {
            color: $grey-32 !important;

            &.ck-on {
              background-color: rgba(black, .2);
            }
          }

          .ck-toolbar__separator {
            background-color: rgba(black, .1);
          }
        }

        &-editor__main {
          height: calc(100% - 40px);
          overflow-y: auto;
          overflow-x: hidden;

          > .ck-content {
            &::-webkit-scrollbar {
              width: 6px;
            }

            &::-webkit-scrollbar-track {
              background: transparent;
            }

            &::-webkit-scrollbar-thumb {
              background: rgba(black, .45);
            }

            height: 100%;
            background-color: white;
            color: $grey-32;
            box-shadow: none;
            border-color: rgba(black, .1);

            blockquote {
              border-color: get-color(gray, 300);
            }
          }
        }
      }
    }
  }

  &.dark {
    .mail-compose-item {
      .ck-editor {
        .ck-editor__main {
          > .ck-content {
            color: $grey-32;
          }
        }
      }
    }
  }
}
</style>
