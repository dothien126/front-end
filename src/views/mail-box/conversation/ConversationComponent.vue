<template>
  <!-- BEGIN: TigerBui` - Reloading -->
  <div class="reloading-mail flex items-center justify-center bg-light dark:bg-black/75 fixed inset-0 z-[1050]"
       v-if="tgExport.reloadMail.value">
    <div class="flex flex-col items-center">
      <p class="text-xs text-orange-300">{{ locale.loadingConversation }}...</p>
      <div class="w-12 h-8">
        <loading-icon :icon="'three-dots'"></loading-icon>
      </div>
    </div>
  </div>
  <!-- END: TigerBui` - Reloading -->
  <!-- BEGIN: Inbox Content -->
  <div class="inbox box md:mt-5 dark:bg-black/40 mail-list" v-if="viewConversation">
    <div
        class="p-3 md:p-5 flex flex-col md:flex-row dark:text-slate-300 rounded-t border-b border-slate-200/60 bg-white dark:bg-darkmode-400">
      <div class="flex items-center grow">
        <label class="rounded flex-none item-hover-border relative z-[5] label-check-ip">
          <input class="form-check-input item-hover-border check-all" type="checkbox"
                 @change="actionMailCheckAllChange(mailCheckAll)" v-model="mailCheckAll"
                 :indeterminate.prop="selectedBox.length > 0 && mailCheckHalf"/>
        </label>
        <Dropdown class="ml-1" placement="bottom-start" v-slot="{dismiss}">
          <DropdownToggle class="w-5 h-5 block" href="javascript:">
            <ChevronDownIcon class="w-5 h-5"/>
          </DropdownToggle>
          <DropdownMenu class="min-w-[10em]">
            <DropdownContent class="whitespace-nowrap">
              <DropdownItem @click="actionMailCheckAllChange(true); dismiss();">{{ locale.selectedAll }}</DropdownItem>
              <DropdownItem @click="actionMailCheckAllChange(false); dismiss();">{{
                  locale.unSelectedAll
                }}
              </DropdownItem>
              <DropdownItem @click="actionSelectedReadConversationSelected(false); dismiss();">
                {{ locale.readConversation }}
              </DropdownItem>
              <DropdownItem @click="actionSelectedReadConversationSelected(true); dismiss();">
                {{ locale.unReadConversation }}
              </DropdownItem>
              <DropdownItem @click="actionSelectedFlagConversationSelected(true); dismiss();">{{
                  locale.flagConversation
                }}
              </DropdownItem>
              <DropdownItem @click="actionSelectedFlagConversationSelected(false); dismiss();">
                {{ locale.unFlagConversation }}
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
        <div class="md:hidden font-medium ml-5 grow">{{ mailCheckAll }}</div>
        <div class="inline-flex group-action ml-5" v-if="mailCheckAll">
          <div class="group-item flex items-center">
            <Tippy tag="a" href="javascript:;" :content="locale.archive" class="mr-5"
                   @click="actionArchiveMailSelected()">
              <ArchiveIcon class="w-4 h-4"/>
            </Tippy>
            <!-- BEGIN: Đánh dấu thư rác  -->
            <Tippy tag="a" href="javascript:;" :content="locale.spam" class="mr-5 hidden md:inline-block"
                   v-if="String(folderSelected.folderPath).toLowerCase() !== '/junk'"
                   @click="actionSpamConversationSelected('spam')">
              <AlertOctagonIcon class="w-4 h-4"/>
            </Tippy>
            <!-- END: Đánh dấu thư rác  -->
            <!-- BEGIN: Đánh dấu không phải thư rác  -->
            <Tippy tag="a" href="javascript:;" :content="locale.reportConversationNoSpam"
                   class="mr-5 hidden md:inline-block"
                   @click="actionSpamConversationSelected('!spam')"
                   v-else-if="String(folderSelected.folderPath).toLowerCase() !== '/trash'">
              <ShareIcon class="w-4 h-4"/>
            </Tippy>
            <!-- END: Đánh dấu không phải thư rác  -->
            <!-- BEGIN: Xoá vào thùng rác  -->
            <Tippy tag="a" href="javascript:;" :content="locale.deleteConversation" class="mr-4"
                   @click="actionDeleteConversationSelected(false)"
                   v-if="String(folderSelected.folderPath).toLowerCase() !== '/trash' && String(folderSelected.folderPath).toLowerCase() !== '/junk'">
              <TrashIcon class="w-4 h-4"/>
            </Tippy>
            <!-- END: Xoá vào thùng rác  -->
            <!-- BEGIN: Xoá vào vĩnh viễn  -->
            <Tippy tag="a" href="javascript:;" :content="locale.deletePermanentlyConversation"
                   class="mr-4 hidden md:inline-block"
                   @click="actionDeleteConversationSelected(true)" v-else>
              <DeleteIcon class="w-4 h-4"/>
            </Tippy>
            <!-- END: Xoá vào vĩnh viễn  -->
            <!-- BEGIN: TAG ITEM LIST -->
            <mail-box-tag class-name="mr-4" :is-conversation="true" :selected-box="selectedBox"/>
            <!-- END: TAG ITEM LIST -->
            <Tippy tag="a" href="javascript:;" :content="locale.markRead"
                   @click="actionActiveReadConversationSelected()">
              <MailOpen class="w-4 h-4"/>
            </Tippy>
          </div>
        </div>
        <div class="group-item flex items-center ml-5">
          <Tippy tag="a" :content="locale.reload" class="w-5 h-5 flex items-center justify-center"
                 @click="tgExport.refreshMail()"
                 v-if="!mailCheckAll">
            <RefreshCwIcon class="w-4 h-4"/>
          </Tippy>
          <TippyContent to="add-dropdown" :options="{trigger: 'mouseenter focus'}">
            <p>{{ locale.add }}</p>
          </TippyContent>
          <Dropdown :class="{'ml-5': !mailCheckAll}" placement="bottom-start" v-slot="{dismiss}">
            <DropdownToggle class="w-5 h-5 block" name="add-dropdown">
              <MoreHorizontalIcon class="w-4 h-4"/>
            </DropdownToggle>
            <DropdownMenu class="min-w-[220px] whitespace-nowrap">
              <DropdownContent v-if="!mailCheckAll">
                <DropdownItem @click="actionActiveAllReadConversation(); dismiss();">{{
                    locale.markAllRead
                  }}
                </DropdownItem>
                <DropdownDivider/>
                <DropdownFooter>
                  <p class="text-slate-400">{{ locale.selectedConversationWhatSee }}</p>
                </DropdownFooter>
              </DropdownContent>
              <DropdownContent v-else>
                <DropdownItem @click="actionActiveReadConversationSelected(); dismiss();">{{
                    locale.markRead
                  }}
                </DropdownItem>
                <DropdownItem @click="actionActiveUnReadConversationSelected(); dismiss();">{{
                    locale.markUnread
                  }}
                </DropdownItem>
                <DropdownItem v-if="String(folderSelected.folderPath).toLowerCase() !== '/junk'"
                              @click="actionSpamConversationSelected('spam'); dismiss()">
                  <!-- BEGIN: Đánh dấu thư rác  -->
                  {{ locale.spam }}
                  <!-- END: Đánh dấu thư rác  -->
                </DropdownItem>
                <DropdownItem v-else-if="String(folderSelected.folderPath).toLowerCase() !== '/trash'"
                              @click="actionSpamConversationSelected('!spam'); dismiss()">
                  {{ locale.reportConversationNoSpam }}
                  <!-- END: Đánh dấu không phải thư rác  -->
                </DropdownItem>
                <DropdownItem class="md:hidden" @click="actionDeleteConversationSelected(true); dismiss()">
                  {{ locale.deletePermanentlyConversation }}
                </DropdownItem>
                <DropdownItem @click="actionActiveFlagConversationSelected(); dismiss();">
                  {{ locale.markFlagConversationSelected }}
                </DropdownItem>
                <DropdownItem @click="actionActiveUnFlagConversationSelected(); dismiss();">
                  {{ locale.markUnFlagConversationSelected }}
                </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <div class="flex items-center mt-2 md:mt-0">
        <button
            class="relative z-50 py-1 px-2 hover:bg-gray-500/20 dark:hover:bg-gray-500/30 transition-colors rounded grow text-left"
            @mouseover="dropdownPageShowHide = true"
            @mouseleave="dropdownPageShowHide = false">
          <span>{{ locale.numberConversation }}: {{ countMinOfOffsetPage }} - {{ countMaxOfOffsetPage }}</span>
          <ul class="absolute top-full left-0 right-0 bg-white text-gray-600 dark:bg-gray-700 rounded shadow-md dark:text-gray-300"
              v-if="dropdownPageShowHide">
            <li>
              <button type="button"
                      class="btn disabled:text-slate-500 rounded-none w-full justify-start border-none dark:border-none"
                      :disabled="!changeViewOldestOrNewestConversation"
                      @click="actionChangeViewOldestOrNewestConversation('dateDesc')">
                {{ locale.newest }}
              </button>
            </li>
            <li>
              <button type="button"
                      class="btn rounded-none w-full justify-start border-none dark:border-none hover:bg-gray-500/30"
                      :disabled="changeViewOldestOrNewestConversation"
                      @click="actionChangeViewOldestOrNewestConversation('dateAsc')">
                {{ locale.oldest }}
              </button>
            </li>
          </ul>
        </button>
        <button @click="actionChangePageForConversation(false)"
                class="w-5 h-5 ml-5 flex items-center justify-center"
        >
          <ChevronLeftIcon class="w-4 h-4"/>
        </button>
        <button @click="actionChangePageForConversation(true)"
                class="w-5 h-5 ml-5 flex items-center justify-center"
        >
          <ChevronRightIcon class="w-4 h-4"/>
        </button>
        <Tippy tag="a" href="javascript:" :content="locale.settingMail"
               @click="$router.push('/mail-box/setting/general')"
               class="w-5 h-5 ml-5 flex items-center justify-center">
          <SettingsIcon class="w-4 h-4"/>
        </Tippy>
      </div>
    </div>
    <div
        class="mail-group grow relative overflow-y-auto overflow-x-hidden md:overflow-auto bg-light dark:bg-slate-900 rounded-b">
      <div class="text-center text-slate-500 p-5" v-if="conversation.itemList.length === 0">
        <p class="mb-3">{{ locale.noMessageInFolder }}</p>
        <i icon-name="package-open" stroke="#9ca3af" class="w-12 h-12 mx-auto"></i>
      </div>
      <div v-for="(item, index) in conversation.itemList"
           :key="item.conversationId"
           :id="`mail-item-${index}`"
           class="px-3 md:px-0">
        <div class="inbox__item border-b border-gray-600/10"
             :class="{ 'inbox__item--active': item.unread, 'bg-blue-600/20 dark:bg-violet-500/50 dark:text-white': item.checked }"
        >
          <div class="flex flex-wrap md:flex-nowrap items-center md:px-5 py-3 md:h-14 relative">
            <div class="md:w-72 grow md:grow-0 flex-none flex items-center">
              <label class="rounded flex-none item-hover-border relative z-[5] label-check-ip">
                <input class="form-check-input" v-model="item.checked" type="checkbox" :checked="item.checked"
                       @change="actionMailCheck(item)"/>
              </label>
              <div class="flex items-center relative z-[5] ml-2">
                <TippyContent :to="'flag-email' + index" :options="{trigger: 'mouseenter focus'}">
                  {{ item.flag ? locale.markUnFlagConversationSelected : locale.markFlagConversationSelected }}
                </TippyContent>
                <button :name="'flag-email' + index"
                        @click="actionChangeFlag(item)"
                        :class="item.flag ? 'flag-active' : ''"
                        class="mx-1 p-1 text-slate-500/50 item-hover-color"
                >
                  <FlagIcon class="w-4 h-4"/>
                </button>
                <Dropdown v-if="item.tagList.length > 0" class="inline-block" placement="right-start">
                  <DropdownToggle tag="a" class="rounded-full block p-1 mx-1 item-hover-color flag-active">
                    <TagIcon class="w-4 h-4"/>
                  </DropdownToggle>
                  <DropdownMenu class="w-40">
                    <DropdownContent>
                      <DropdownItem class="flex items-center justify-between" v-for="tag in item.tagList" :key="tag.id">
                        <span>{{ tag.name }}</span>
                        <XIcon class="w-4" @click="actionDeleteTag(item,tag)"></XIcon>
                      </DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
                <ClockIcon class="w-4 h-4" v-if="item.autoSendTime > 0"/>
                <PaperclipIcon class="w-4 h-4" v-if="item.flagName && item.flagName.includes('a')"/>
              </div>
              <button class="inbox__item--sender truncate ml-3 z-[5] relative" :id="item.conversationId"
                      @mouseleave="tgExport.mailContactLeave($event, item)"
                      @mouseover="tgExport.mailContactOver($event, item, index)"
                      @click="actionOpenConversationDetail(item); actionActiveReadConversationSelected(item)"
              >
                {{ item.fullName ? item.fullName : item.sortName }}
                <span class="text-gray-400 dark:text-gray-300/50" v-if="item.countMessage > 1">
                  ({{ item.countMessage }})
                </span>
              </button>
            </div>
            <div class="w-auto md:w-64 truncate pl-8 md:pl-5 grow order-3 md:order-none dark:text-slate-400/80 subject">
              <span>{{ item.subject }}</span>
              - {{ item.contentSort }}
            </div>
            <div class="inbox__item--time md:min-w-[120px] pl-5 md:pl-10 relative z-10">
              <div class="whitespace-nowrap time">
                {{ timeAgo(item.conversationDate) }}
              </div>
              <div class="whitespace-nowrap hidden absolute -top-[6px] right-0">
                <Tippy tag="button" :content="locale.archive"
                       class="btn bg-violet-500 hover:bg-violet-600 btn-sm mr-2" type="button"
                       @click="actionArchiveMailSelected(item)">
                  <ArchiveIcon class="w-4 h-4 text-white/70"/>
                </Tippy>
                <Tippy tag="button" :content="locale.filter"
                       class="btn bg-violet-500 hover:bg-violet-600 btn-sm mr-2" type="button"
                       @click="actionFilterSelected(item)">
                  <FilterIcon class="w-4 h-4 text-white/70"/>
                </Tippy>
                <Tippy tag="button" :content="locale.deleteConversation"
                       class="btn bg-violet-500 hover:bg-violet-600 btn-sm mr-2" type="button"
                       @click="actionDeleteConversationSelected(false, item)"
                       v-if="String(folderSelected.folderPath).toLowerCase() !== '/trash' && String(folderSelected.folderPath).toLowerCase() !== '/junk'">
                  <TrashIcon class="w-4 h-4 text-white/70"/>
                </Tippy>
                <Tippy tag="button" :content="locale.deletePermanentlyConversation"
                       class="btn bg-violet-500 hover:bg-violet-600 btn-sm mr-2" type="button"
                       @click="actionDeleteConversationSelected(true, item)" v-else>
                  <DeleteIcon class="w-4 h-4 text-white/70"/>
                </Tippy>
                <Tippy tag="button" :content="locale.markUnread"
                       v-if="!item.unread"
                       class="btn bg-violet-500 hover:bg-violet-600 btn-sm mr-2" type="button"
                       @click="actionActiveUnReadConversationSelected(item)">
                  <MailIcon class="w-4 h-4 text-white/70"/>
                </Tippy>
                <Tippy tag="button" :content="locale.markRead"
                       v-if="item.unread"
                       class="btn bg-violet-500 hover:bg-violet-600 btn-sm mr-2" type="button"
                       @click="actionActiveReadConversationSelected(item)">
                  <MailIcon class="w-4 h-4 text-white/70"/>
                </Tippy>
              </div>
            </div>
            <div @click="actionOpenConversationDetail(item); actionActiveReadConversationSelected(item);"
                 class="absolute z-0 inset-0"></div>
          </div>
        </div>
      </div>
      <mail-box-archive-modal :conversation-selected="conversationDetail"></mail-box-archive-modal>
      <mail-contact-tippy :mailContactData="mailContactTippyData"
                          @update:mailContactData="mailContactTippyData"></mail-contact-tippy>
      <div class="p-5 flex flex-col sm:flex-row items-center text-center sm:text-left text-slate-500">
        <div class="mb-2">
          <TippyContent to="progressTip" :options="{ trigger: 'mouseenter focus'}">
            {{ percentQuota }}%
          </TippyContent>
          <div class="progress bg-white dark:bg-gray-700 overflow-hidden rounded-full h-2 w-full mb-1 relative">
            <div class="h-full"
                 :class="'progress-bar' + percentQuota >= 90 ? 'bg-danger' : 'bg-blue-600 dark:bg-violet-600'"
                 :style="'width: ' + percentQuota + '%'"
                 role="progressbar"
                 :aria-valuenow="usedQuota"
                 aria-valuemin="0"
                 :aria-valuemax="maxQuota"
                 name="progressTip"
            ></div>
            <span class="absolute inset-0 -mt-[6px] text-center text-[9px]">{{ percentQuota }}%</span>
          </div>
          <div class="truncate text-xs">{{ locale.used }} {{ prettyBytes(usedQuota, {binary: true}) }} {{
              locale.inTotal
            }} {{ prettyBytes(maxQuota, {binary: true}) }}
          </div>
        </div>
        <div class="sm:ml-auto mt-2 sm:mt-0"> {{ locale.lastActivityAccount }}:
          {{ helper.formatDate(myUser.updatedAt, env.dateTimeFormat) }}
        </div>
      </div>
    </div>
  </div>
  <div class="bg-white dark:bg-darkmode-400 text-black rounded overflow-hidden md:mt-5" v-else>
    <ConversationDetailComponent :conversation-detail="conversationDetail" :number-page="countMaxOfOffsetPage"
                                 :sort-by="searchRequest.sortBy"/>
  </div>
  <!-- BEGIN: MODAL DELETE -->
  <iNETComponent name="ModalDelete"/>
  <!-- END: MODAL DELETE -->
  <!-- FILTER -->
  <ModalCreateFilter/>
  <iNETComponent name="ModalSelectFolder"/>
  <!-- FILTER -->
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, onUnmounted, ref, watch} from 'vue';
import {SearchRequest} from '@/model/SearchRequest';
import {Conversation, Item, ItemTag} from '@/model/Conversation';
import {actionConversation, showToastMessage, timeAgo} from '@/utils/MyFunction';
import {MyStore} from '@/stores/my-store';
import {helper} from '@/utils/helper';
import ConversationDetailComponent from '@/views/mail-box/conversation-detail/ConversationDetailComponent.vue';
import MailBoxArchiveModal from "@/views/mail-box/partial/MailBoxArchiveModal.vue";
import MailContactTippy from '@/views/mail-box/partial/MailContactTippy.vue';
import {MailOpen} from "lucide-vue-next";
import {ConversationDetail} from "@/model/ConversationDetail";
import {prettyBytes} from '@/utils/pretty-bytes-function/PrettyBytes';
import {ConversationStore} from "@/stores/conversation-store/conversation-store";
import {SearchConvRequest} from "@/model/SearchConvRequest";
import {ResponseData} from "@/model/ResponseData";
import ConversationDetailService from "@/service/ConversationDetailService";
import MailBoxTag from "@/views/mail-box/partial/MailBoxTag.vue";
import ModalCreateFilter from "@/views/settings/filters/partial/ModalCreateFilter.vue";
import SeoTitleTabBrowser from "@/global-components/inet-custom/components/SeoTitleTabBrowser.vue";
import {env} from "@/utils/MyVariables"
import {FolderStore} from "@/stores/folder-store/folder-store";
import {Folder} from '@/model/Folder';
import {MyTagStore} from "@/stores/tag-store/tag-store";
import {Tag} from "@/model/Tag";
import {MyContactStore} from "@/stores/contact-store/contact-store";

import {SeoTitleStore} from "@/stores/seo-title-store/seo-title-store";
import t from 'typy';

export default defineComponent({
  name: 'ConversationComponent',
  components: {
    SeoTitleTabBrowser,
    ConversationDetailComponent, MailBoxArchiveModal, MailContactTippy, MailOpen, MailBoxTag, ModalCreateFilter
  },
  setup() {
    //init value
    const myStore = MyStore();
    const folderStore = FolderStore();
    const conversationStore = ConversationStore();
    const myTagStore = MyTagStore();
    const seoTitleStore = SeoTitleStore();
    const contactStore = MyContactStore()
    const emitter = myStore.useEmitter();
    const myUser = computed(() => myStore.myUser);
    const locale = computed(() => myStore.locale);
    //folder selected
    const folderSelected = computed(() => folderStore.folderSelected as Folder);
    //tag selected
    const tagSelected = computed(() => myTagStore.tagSelected as Tag);
    //message
    const searchRequest = computed(() => conversationStore.searchRequest);
    const conversation = computed(() => conversationStore.conversation as Conversation);
    const selectedBox = computed(() => conversationStore.selectedBox as string[]);
    //pagination
    const countMinOfOffsetPage = ref(0);
    const countMaxOfOffsetPage = ref(0);
    const offsetPage = ref(0);
    //conversation selected
    const conversationItemSelected = ref<Item>(new Item());
    // Contact search
    const isContactSearch = computed(() => contactStore.isContactSearch)
    //checkbox mail
    const mailCheckAll = ref(false);
    const mailCheckHalf = ref(false);
    //archive, delete, spam...
    const conversationDetail = ref<ConversationDetail>(new ConversationDetail());
    //oldest, newest view conversation
    const changeViewOldestOrNewestConversation = ref(false);
    //quota
    const percentQuota = ref(0);
    const usedQuota = ref(0);
    const maxQuota = ref(0);
    // show hide view conversation
    const viewConversation = ref(true);

    function calculatorCheckBoxAndCheckAll() {
      //calculator checkbox
      const diffItem = conversation.value.itemList.filter(item => {
        item.checked = selectedBox.value.includes(item.conversationId);
        return selectedBox.value.includes(item.conversationId);
      });
      //logic change checkbox
      mailCheckAll.value = diffItem.length > 0;
      mailCheckHalf.value = diffItem.length > 0 && diffItem.length !== conversation.value.itemList.length;
    }

    function initGetQuota() {
      usedQuota.value = myUser.value.used ? myUser.value.used : 0;
      maxQuota.value = myUser.value.maxQuota ? myUser.value.maxQuota : 0;
      percentQuota.value = isNaN((usedQuota.value / maxQuota.value) * 100) ? 0 : Math.round((usedQuota.value / maxQuota.value) * 100);
    }

    function setDefaultMinMaxOffsetOfPage() {
      //set default min - max offset of page
      if (conversation.value.itemList.length > 0) {
        countMinOfOffsetPage.value = countMinOfOffsetPage.value === 0 ? 1 : countMinOfOffsetPage.value;
        countMaxOfOffsetPage.value = conversation.value.itemList.length;
      } else {
        countMinOfOffsetPage.value = countMaxOfOffsetPage.value = 0;
      }
    }

    async function actionChangePageForConversation(next: boolean) {
      // check max next
      if (next && !conversation.value.hasMore && countMaxOfOffsetPage.value >= conversation.value.itemList.length) return;
      // check min previous
      if (!next && offsetPage.value === 0) return;
      // change page
      if (next) offsetPage.value = offsetPage.value + 1;
      else offsetPage.value = offsetPage.value - 1 <= 0 ? 0 : offsetPage.value - 1;
      const resultOffsetCaculator = offsetPage.value * Number(searchRequest.value.limit);
      searchRequest.value.offset = resultOffsetCaculator.toString();
      // change min - max offset of page
      countMinOfOffsetPage.value = resultOffsetCaculator + 1;
      // Tính ra số max offset
      let countMax = countMinOfOffsetPage.value - 1 + Number(searchRequest.value.limit)
      if (countMinOfOffsetPage.value <= conversation.value.itemList.length && conversation.value.itemList.length < countMax) {
        countMax = conversation.value.itemList.length;
      }
      countMaxOfOffsetPage.value = next ? countMax
          : conversation.value.itemList.length - (conversation.value.itemList.length - ((offsetPage.value + 1) * Number(searchRequest.value.limit)));
      //Reload data by new offset
      await conversationStore.getConversation();
      //calculator checkbox
      calculatorCheckBoxAndCheckAll();
    }

    async function actionOpenConversationDetail(item: Item) {
      //init request
      const itemFind = new SearchConvRequest();
      itemFind.cid = item.conversationId ? String(item.conversationId) : '';
      //call request
      const response = await ConversationDetailService.find(itemFind, myStore.token);
      if (response) {
        const responseData: ResponseData = response.data;
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          conversationDetail.value = responseData.values as ConversationDetail;
          viewConversation.value = false;
        }
      }
    }

    async function actionChangeFlag(item: Item) {
      //change value
      item.flag = !item.flag;
      //call action
      await actionConversation(item.conversationId, item.flag ? 'flag' : '!flag');
    }

    async function actionSpamConversationSelected(type: string) {
      if (selectedBox.value.length > 0) {
        //add id - * spam - đánh dấu thư rác - !spam - không phải thư rác
        await actionConversation(selectedBox.value.join(','), type);
        // reset checkbox - checkAll
        resetAllDataConversation();
      } else {
        showToastMessage(locale.value.noConversationSelected, true);
      }
    }

    async function actionDeleteConversationSelected(type: boolean, item?: Item) {
      // Xoá conversation được chọn vào thùng rác
      emitter.emit('show-modal-delete-mail-conversation', {item: item, selectedBox: selectedBox.value, forever: type});
    }

    async function actionActiveAllReadConversation() {
      //init value
      const itemIdList: string[] = [];
      for (const item of conversation.value.itemList) {
        if (item.unread) {
          item.unread = false;
          itemIdList.push(item.conversationId);
        }
      }
      //call action
      if (itemIdList.length > 0) {
        await actionConversation(itemIdList.join(','), 'read');
      }
      //reload unread count data folder list
      folderStore.reloadDataUnreadCountFolder();
    }

    async function actionActiveReadConversationSelected(item?: Item) {
      if (item) {
        item.unread = false;
        await actionConversation(item.conversationId, 'read');
      } else {
        //init value
        for (const item of selectedBox.value) {
          //Tìm từng item trong conversation để cập nhật trạng thái flag
          const findConversation = conversation.value.itemList.find(value => value.conversationId === item);
          if (findConversation) findConversation.unread = false;
        }
        //call action
        if (selectedBox.value.length > 0) {
          await actionConversation(selectedBox.value.join(','), 'read');
        }
      }
      //reload unread count data folder list
      folderStore.reloadDataUnreadCountFolder();
    }

    async function actionActiveUnReadConversationSelected(item?: Item) {
      if (item) {
        item.unread = true;
        await actionConversation(item.conversationId, '!read');
      } else {
        for (const item of selectedBox.value) {
          //Tìm từng item trong conversation để cập nhật trạng thái flag
          const findConversation = conversation.value.itemList.find(value => value.conversationId === item);
          if (findConversation) findConversation.unread = true;
        }
        //call action
        if (selectedBox.value.length > 0) {
          await actionConversation(selectedBox.value.join(','), '!read');
        }
      }
      //reload unread count data folder list
      folderStore.reloadDataUnreadCountFolder();
    }

    async function actionActiveFlagConversationSelected() {
      //init value
      for (const item of selectedBox.value) {
        //Tìm từng item trong conversation để cập nhật trạng thái flag
        const findConversation = conversation.value.itemList.find(value => value.conversationId === item);
        if (findConversation) {
          findConversation.flag = true;
        }
      }
      //call action
      if (selectedBox.value.length > 0) {
        await actionConversation(selectedBox.value.join(','), 'flag');
      }
    }

    async function actionActiveUnFlagConversationSelected() {
      //init value
      for (const item of selectedBox.value) {
        //Tìm từng item trong conversation để cập nhật trạng thái flag
        const findConversation = conversation.value.itemList.find(value => value.conversationId === item);
        if (findConversation) findConversation.flag = false;
      }
      //call action
      if (selectedBox.value.length > 0) {
        await actionConversation(selectedBox.value.join(','), '!flag');
      }
    }

    async function actionChangeViewOldestOrNewestConversation(sortBy: string) {
      searchRequest.value.sortBy = sortBy;
      changeViewOldestOrNewestConversation.value = !changeViewOldestOrNewestConversation.value;
      await conversationStore.getConversation();
    }

    async function actionDeleteTag(item: Item, tag: ItemTag) {
      if (item && tag) {
        //call action
        let main = await actionConversation(item.conversationId, '!tag', '', tag);
        if (main) {
          // reset api data
          await conversationStore.getConversation();
        }
      }
    }

    function actionMailCheck(item: Item) {
      if (item.checked) {
        mailCheckAll.value = true;
        //Check existed
        if (!selectedBox.value.some(value => value === item.conversationId)) {
          selectedBox.value.push(item.conversationId);
        }
      } else {
        //Check existed
        const findIndex = selectedBox.value.findIndex(value => value === item.conversationId);
        if (findIndex >= 0) {
          selectedBox.value.splice(findIndex, 1);
        }
      }
      //calculator checkbox
      calculatorCheckBoxAndCheckAll();
    }

    function actionMailCheckAllChange(isChecked: boolean) {
      //set value
      mailCheckAll.value = isChecked;
      // Lấy khoảng item list từ count min -> count max
      for (const item of conversation.value.itemList) {
        item.checked = mailCheckAll.value;
        if (isChecked) {
          //Check existed
          if (!selectedBox.value.some(value => value === item.conversationId)) {
            selectedBox.value.push(item.conversationId);
          }
        } else {
          const findIndex = selectedBox.value.findIndex(value => value === item.conversationId);
          if (findIndex >= 0) {
            selectedBox.value.splice(findIndex, 1);
          }
        }
      }
      //calculator checkbox
      calculatorCheckBoxAndCheckAll();
    }

    function actionArchiveMailSelected(item?: Item) {
      if (selectedBox.value.length > 0) {
        //show modal
        conversationDetail.value.mbArchiveModalShowHide = true;
        //add id
        conversationDetail.value.conversationId = selectedBox.value.join(',');
      } else if (item) {
        //show modal
        conversationDetail.value.mbArchiveModalShowHide = true;
        //add id
        conversationDetail.value.conversationId = item.conversationId;
      } else {
        showToastMessage(locale.value.noConversationSelected, true);
      }
    }

    function actionFilterSelected(item: Item) {
      emitter.emit('show-modal-add-filter-by-conversation', item);
    }

    function actionSelectedReadConversationSelected(type: boolean) {
      for (const item of conversation.value.itemList) {
        item.checked = item.unread === type; // false - đánh dấu đã đọc - true - đánh dấu chưa đọc
        if (item.checked) {
          actionMailCheck(item);
        }
      }
    }

    function actionSelectedFlagConversationSelected(type: boolean) {
      for (const item of conversation.value.itemList) {
        item.checked = item.flag === type; // true - đánh dấu cờ - false - bỏ đánh dấu cờ
        if (item.checked) {
          actionMailCheck(item);
        }
      }
    }

    async function actionResetConversation(searchRequest: SearchRequest) {
      //set find
      conversationStore.setFilterForFindConversation(searchRequest);
      // gọi lại conversation
      await conversationStore.getConversation();
      //set default min - max offset of page
      offsetPage.value = 0;
      if (conversation.value.itemList.length > 0) {
        countMinOfOffsetPage.value = 1;
        countMaxOfOffsetPage.value = conversation.value.itemList.length;
      } else {
        //reset value number min max
        countMinOfOffsetPage.value = 0;
        countMaxOfOffsetPage.value = 0;
      }
      //show view conversation
      viewConversation.value = true;
    }

    function resetAllDataConversation() {
      //reset sort old new
      changeViewOldestOrNewestConversation.value = false;
      //reset checkbox
      actionMailCheckAllChange(false);
      //reset conversation
      actionResetConversation(conversationStore.searchRequest);
    }

    // Bắt sự kiện thay đổi tags
    watch(() => tagSelected.value, (value) => {
      if (value) {
        conversationStore.searchRequest.filter = 'tag:\"' + value.name + '\"';
        //reset all data
        resetAllDataConversation();
      }
    })

    //Theo dõi các tag trong Input search thay đổi rồi tính giá trị trang cuộc trò chuyện
    watch(() => conversationStore.searchTag, (value) => {
      // Search Tag sẽ bao gồm cả tìm kiếm theo conversation và contact nên chỉ khi giá trị isContactSearch là false thì nó đang tìm theo Conversation
      if(!isContactSearch.value) {
        if (value && value.length > 0) {
          conversationStore.searchRequest.filter = value.join(' ');
          //reset all data
          resetAllDataConversation();
        }

        // Trường hợp nếu xóa sạch hết các tag thì sẽ gọi lại api về hòm thư đang ở
        if (value.length === 0 && folderSelected.value.folderId) {
          const searchRequest = new SearchRequest();
          searchRequest.filter = 'inid:' + folderSelected.value.folderId;
          actionResetConversation(searchRequest);
        }
      }
    })

    onMounted(() => {
      setDefaultMinMaxOffsetOfPage();
      initGetQuota();
      seoTitleStore.initGetSeoTitle();
      // Emit show conversation
      emitter.on("show-conversation", () => {
        viewConversation.value = true
        //reload seo title
        seoTitleStore.initGetSeoTitle();
      });
      // Emit reset conversation
      emitter.on("reset-conversation", () => {
        //reset all data
        resetAllDataConversation();
        //reload unread count data folder list
        folderStore.reloadDataUnreadCountFolder();
        //reload seo title
        seoTitleStore.initGetSeoTitle();
      });
      // Emit show conversation detail
      emitter.on('show-conversation-detail', async (data: { conversationDetail: ConversationDetail }) => {
        if (data.conversationDetail) {
          const item = new Item();
          item.conversationId = data.conversationDetail.conversationId;
          await actionOpenConversationDetail(item);
          //reload seo title
          seoTitleStore.initGetSeoTitle(t(data.conversationDetail.itemList).safeArray.length > 0 ? data.conversationDetail.itemList[0].subject : '');
        }
      });
    });

    onUnmounted(() => {
      emitter.off('show-conversation');
      emitter.off('reset-conversation');
      emitter.off('show-conversation-detail');
    });

    //BEGIN: TigerBui`
    const dropdownPageShowHide = ref<boolean>(false);
    const mailContactTippyData = ref<any>({});
    const mctTippyTimeout = ref();
    let tgConverSation = function () {

    };
    tgConverSation.prototype.reloadMail = ref<boolean>(false);
    tgConverSation.prototype.bodyOverflowHidden = function (_evt) {
      const getBody = document.getElementsByTagName('body')[0];
      if (_evt) {
        getBody.style.cssText = "overflow: hidden";
      } else {
        getBody.removeAttribute('style');
      }
    }
    tgConverSation.prototype.mailContactOver = function (_evt, _mailItem, index: any) {
      _evt.preventDefault();
      clearTimeout(mctTippyTimeout.value);
      const distance = 25;
      const tippyPosition: HTMLElement | null | any = document.getElementById(`mail-item-${index}`)
      if (!_mailItem.modalPlace) {
        _mailItem['modalPlace'] = ref({});
      }
      _mailItem.modalPlace = {};
      _mailItem.modalPlace.top = Math.abs(tippyPosition.offsetTop + distance) + 'px';
      _mailItem.modalPlace.left = Math.abs((_evt.clientX + 20) - 280) + 'px';
      _mailItem.mctTippyShowHide = true;
      mailContactTippyData.value = _mailItem;
    }
    tgConverSation.prototype.mailContactLeave = function (_evt, _mailItem) {
      const mtId = 'mt-id-' + _mailItem.conversationId;
      mctTippyTimeout.value = setTimeout(() => {
        const ckMtId = document.getElementById(mtId);
        if (ckMtId && !ckMtId.classList.contains('is-active')) {
          _mailItem.mctTippyShowHide = false;
        }
      }, 1500);
    }
    tgConverSation.prototype.refreshMail = function () {
      const _self = this;
      this.reloadMail.value = true;
      this.bodyOverflowHidden(this.reloadMail.value);
      setTimeout(async () => {
        _self.reloadMail.value = false;
        _self.bodyOverflowHidden(_self.reloadMail.value);
        //method reload
        //change filter
        const searchRequest = new SearchRequest();
        searchRequest.filter = 'inid:' + folderSelected.value.folderId;
        conversationStore.setFilterForFindConversation(searchRequest);
        //reset all data
        resetAllDataConversation();
      }, 1500);
    }
    watch(() => viewConversation.value, (_vl) => {
      // hiển thị hoặc ẩn nút "Thư mới" trên mobile
      if (!_vl) {
        new bodyCls();
      }
    })

    class bodyCls {
      clsName: string = 'mail-box-detail';

      constructor() {
        const ck = document.body.classList.contains(this.clsName) as boolean;
        if (ck) {
          this.removeCls();
        } else {
          this.addCls();
        }
      }

      addCls() {
        document.body.classList.add(this.clsName)
      }

      removeCls() {
        document.body.classList.remove(this.clsName)
      }
    }

    const tgExport = new tgConverSation();
    //END: TigerBui`

    return {
      helper,
      timeAgo,
      env,
      locale,
      tgExport,
      myUser,
      percentQuota,
      usedQuota,
      maxQuota,
      prettyBytes,
      conversation,
      conversationDetail,
      viewConversation,
      mailCheckAll,
      mailCheckHalf,
      folderSelected,
      selectedBox,
      searchRequest,
      mailContactTippyData,
      dropdownPageShowHide,
      countMinOfOffsetPage,
      countMaxOfOffsetPage,
      conversationItemSelected,
      changeViewOldestOrNewestConversation,
      actionOpenConversationDetail,
      actionChangePageForConversation,
      actionChangeFlag,
      actionMailCheck,
      actionMailCheckAllChange,
      actionArchiveMailSelected,
      actionFilterSelected,
      actionSpamConversationSelected,
      actionDeleteConversationSelected,
      actionSelectedReadConversationSelected,
      actionSelectedFlagConversationSelected,
      actionActiveAllReadConversation,
      actionActiveReadConversationSelected,
      actionActiveUnReadConversationSelected,
      actionActiveFlagConversationSelected,
      actionActiveUnFlagConversationSelected,
      actionChangeViewOldestOrNewestConversation,
      actionDeleteTag
    };
  },
});
</script>

<style lang="scss">
@import "./src/assets/scss/mixin/_media-screen.scss";

html.inet-mail-themes {
  .mail-box-detail {
    @include mediaScreenWidth(max, md) {
      .new-mail {
        z-index: -1;
        visibility: hidden;
      }
      .top-bar-boxed {
        display: none;
      }
    }
  }

  .label-check-ip {
    position: relative;

    &:before {
      content: "";
      position: absolute;
      padding: 10px;
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: 50px;
      height: 40px;
      width: 40px;
      left: -12px;
      top: -9px;
      opacity: 0;
      transition: opacity .18s ease-in-out 0s;
      cursor: pointer;
    }

    &:hover {
      &:before {
        opacity: 1;
      }
    }
  }

  @include mediaScreenWidth(max, md) {
    .mail-group {
      .inbox__item {
        margin: 0 -12px;
        padding: 0 12px;
      }
    }
  }

  .inbox .inbox__item.inbox__item--active {
    .subject,
    .inbox__item--sender {
      font-weight: 700;
      font-family: Arial, sans-serif;
    }
  }

  &.dark {
    .mail-box-detail {
      .dropdown {
        &-menu {
          a {
            color: rgba(white, .75);
          }
        }
      }
    }

    .inbox .inbox__item {
      .inbox__item--sender {
        color: rgba(white, .5);
      }

      &.inbox__item--active {
        .subject,
        .inbox__item--sender {
          color: rgba(white, .8);
        }
      }
    }
  }
}
</style>
