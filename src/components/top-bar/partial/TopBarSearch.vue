<template>
  <div id="root-drop-search" class="top-bar-search relative">
    <div class="relative">
      <SearchIcon class="absolute top-3 left-1.5 dark:text-slate-500 w-4 h-4" @click="isIconSearchClick = true"/>
      <vue-input-tag :placeholder="locale.search" @on-focus="showSearchDropdown"
                     @search-while-typing="searchWhileTyping"
                     @changeDeleteAllStatus="actionChangeDeleteAllTagsStatus"
                     @update:tags="handleQueryConversation"
                     @after-search-click="actionAfterSearchClick"
                     :isDeleteAll="deleteAllTags"
                     :filterTypeSearch="filterTypeSearch"
                     :value="searchHistoryModel"
                     :isIconSearchClick="isIconSearchClick"
                     class="form-control outline-0 border-transparent pl-6 pr-14"></vue-input-tag>
      <Tippy tag="button" :content="`${locale.delete} ${locale.search.toLowerCase()}`" v-if="searchTag.length > 0"
             class="absolute top-3 right-12 text-gray-500 dark:text-slate-400"
             @click="deleteAllTags = true; searchModel = ''">
        <XIcon class="w-4 h-4"/>
      </Tippy>
      <div class="absolute top-3 right-2">
        <TippyContent to="filter-dropdown" :options="{trigger: 'mouseenter focus'}">
          {{ locale.showSearchOption }}
        </TippyContent>
        <Dropdown v-slot="{ dismiss }" class="dark:text-slate-500">
          <DropdownToggle class="flex items-center" name="filter-dropdown">
            <MailIcon v-if="filterType === 'mail'" class="w-4 h-4"/>
            <UsersIcon v-else class="w-4 h-4"/>
            <ChevronDownIcon class="w-4 h-4 ml-1"/>
          </DropdownToggle>
          <DropdownMenu class="w-40">
            <DropdownContent>
              <DropdownItem
                  @click="selectedFilter('mail'); setSearchRequestFilter('conversation');contactStore.isContactSearch = false; dismiss()">
                <MailIcon class="w-4 h-4 mr-2"/>
                {{ locale.mail }}
              </DropdownItem>
              <DropdownItem
                  @click="selectedFilter('contact'); setSearchRequestFilter('contact');contactStore.isContactSearch = true; dismiss()">
                <UsersIcon class="w-4 h-4 mr-2"/>
                {{ locale.contacts }}
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="search-result max-w-full md:w-full max-h-[90vh] scroll-x-hidden dark:bg-slate-800" id="dropdown-search"
         :class="{ show: searchDropdown }">
      <button class="absolute right-2 top-3 z-10 md:hidden" @click="searchDropdown = false;">
        <XIcon class="w-4 h-4"/>
      </button>
      <div class="search-result__content">
        <div class="mb-5" v-if="tgTopBarSearch[filterType] && tgTopBarSearch[filterType].basicFilter">
          <div class="search-result__content__title flex">
            <div class="grow">{{ locale.basicFilter }}</div>
          </div>
          <div class="flex flex-wrap items-center -mx-1">
            <button class="btn m-1"
                    v-for="(list, index) in tgTopBarSearch[filterType].basicFilter"
                    @click="tgTopBarSearch.filterSelected(list, index)"
                    :class="{'btn-secondary': !list.active, 'btn-primary': list.active}"
            >
              <i v-if="list.mailIconName" :icon-name="iconName(list.mailIconName)" class="w-4 h-4 mr-2"></i>
              {{ locale[list.label] }}
            </button>
          </div>
        </div>
        <!--        Search History của gmail max: -> 6 kết quả khi chưa select filter & -> 2 kết quả khi select filter -->
        <div class="-mx-5 dark:border-slate-600 search-history"
             :class="filterType === 'mail' ? 'border-t border-gray-200': '-mt-3'"
             v-if="tgTopBarSearch.searchHistory.length > 0">
          <div class="flex items-center py-3 px-5 dark:hover:bg-white/10 search-history-item"
               v-for="(item, index) in tgTopBarSearch.searchHistory.sort((a,b) => Date.parse(b.date) - Date.parse(a.date))"
          >
            <i icon-name="history" stroke="#94a3b8" class="w-4 h-4 shrink-0"></i>
            <div @click="actionSearchHistoryValue(item.key)"
                 class="grow truncate dark:text-slate-300 px-3 cursor-pointer">{{ translateQuery(item.key) }}
            </div>
            <div class="text-gray-500 mr-2">{{ timeAgo(item.date) }}</div>
            <Tippy tag="button"
                   class="text-gray-500 dark:text-slate-500 remove-search-history"
                   :content="locale.removeSearchHistory"
                   @click="tgTopBarSearch.removeSearchHistory(index)">
              <XIcon class="w-4 h-4"/>
            </Tippy>
          </div>
        </div>
        <template v-if="searchModel.trim() !== '' || typingSearch.trim() !== '' ">
          <div class="-mx-5 mb-2">
            <div class="border-t border-gray-200 dark:border-slate-600">
              <a href="javascript:;" class="flex items-center px-5 py-3 dark:hover:bg-white/10 transition-colors"
                 @click="searchDropdown = false;">
                <SearchIcon class="w-4 h-4 mr-3 shrink-0"/>
                <span>{{
                    locale.allSearchResultsFor
                  }} {{
                    (searchModel || typingSearch !== ' ') ? '"' + translateSearchModel(searchModel) + '" ' + locale.and.toLowerCase() : ''
                  }} {{
                    filterSelectedList.length
                  }} {{
                    locale.filter.toLowerCase()
                  }}</span>
              </a>
            </div>
            <div v-if="filterTypeSearch === 'contact'">
              <a v-for="(item, index) in contacts.itemList" :key="item" href="javascript:;"
                 :title="item.fullName"
                 @click="actionOpenContact(item); searchDropdown = false;"
                 class="py-2 px-5 dark:hover:bg-white/10 transition-colors flex items-center"
              >
                <i icon-name="user" stroke="#94a3b8" class="w-4 h-4 shrink-0 mr-3"></i>
                <div class="grow grid grid-cols-3 gap-0">
                  <div class="truncate col-span-2">{{ item.firstName + " " + item.lastName }}</div>
                  <div class="text-slate-500 text-xs col-span-3">
                    <div class="w-auto md:w-64 truncate grow order-3 md:order-none dark:text-slate-400/80 subject">
                      <span>{{ item.email }}</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div v-else>
              <a v-for="(item, index) in conversation.itemList.filter((c, i) => i < 5)" :key="item" href="javascript:;"
                 :title="item.fullName ? item.fullName : item.sortName"
                 @click="actionOpenConversationDetail(item); searchDropdown = false;"
                 class="py-2 px-5 dark:hover:bg-white/10 transition-colors flex items-center"
              >
                <i icon-name="mail" stroke="#94a3b8" class="w-4 h-4 shrink-0 mr-3"></i>
                <div class="grow grid grid-cols-3 gap-0">
                  <div class="truncate col-span-2">{{ item.fullName ? item.fullName : item.sortName }}</div>
                  <div class="text-slate-500 text-xs col-span-3">
                    <div class="w-auto md:w-64 truncate grow order-3 md:order-none dark:text-slate-400/80 subject">
                      <span>{{ item.subject }}</span>
                      - {{ item.contentSort }}
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div class="px-5" v-if="conversation.itemList.length === 0">
              <p class="text-gray-500 dark:text-slate-500">
                {{ locale.thereAreNoItemsMatchingYourSearch }} <a class="underline" href="javascript:">{{
                  locale.searchInOlderCategories
                }}</a>
              </p>
            </div>
          </div>
        </template>
        <div class="border-t border-gray-200 dark:border-slate-600 -mx-5 px-5 pt-3"
             v-if="tgTopBarSearch[filterType] && tgTopBarSearch[filterType].advancedFilter">
          <div class="search-result__content__title">{{ locale.advancedFilter }}</div>
          <SearchAdvanced :advanced-list="tgTopBarSearch[filterType].advancedFilter"
                          @update:advanced-filter="updateLengthFilterAdvanced"
                          @update:avanced-list="tgTopBarSearch[filterType].advancedFilter"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import {createIcons, icons} from "lucide";
import MailSettingIcon from "@/stores/mail-setting-icon";
import SearchAdvanced from "@/components/top-bar/partial/SearchAdvanced.vue";
import {MyStore} from "@/stores/my-store";
import Vue3TagsInput from 'vue3-tags-input';
import {timeAgo} from "@/utils/MyFunction";
import {ConversationStore} from "@/stores/conversation-store/conversation-store";
import {Conversation, Item} from "@/model/Conversation";
import {ItemContact} from "@/model/Contact";
import {ConversationDetail} from "@/model/ConversationDetail";
import {queryTranslte, exampleQueryTranslate, advancedFilterSearch} from "@/utils/MyVariables"
import {MyContactStore} from "@/stores/contact-store/contact-store";
import {MyFilterRuleStore} from "@/stores/filter-rule-store/filter-rule-store";
// import {Item} from "@/model/Conversation";
// import router from "@/router";
// import {useRoute} from "vue-router";

export default defineComponent({
  name: 'TopBarSearch',
  components: {SearchAdvanced, Vue3TagsInput},
  data() {
    return {
      filterType: 'mail'
    }
  },
  methods: {
    iconName(_label: string) {
      const labelIcon = this.tgTopBarSearch.labelIcons;
      if (labelIcon[_label] && labelIcon[_label].iconName) {
        return labelIcon[_label].iconName;
      }
      return 'folder'; // Icons Folder Default
    },
    iconStroke(_label: string) {
      const labelIcon = this.tgTopBarSearch.labelIcons;
      if (labelIcon[_label] && labelIcon[_label].color) {
        return labelIcon[_label].color;
      }
      return '#a8a29e';
    },
    iconFill(_label: string) {
      const labelIcon = this.tgTopBarSearch.labelIcons;
      if (labelIcon[_label] && labelIcon[_label].color) {
        return labelIcon[_label].color;
      }
      return;
    },
    selectedFilter(_label: string) {
      this.filterType = _label;
    }
  },
  updated() {
    createIcons({icons, nameAttr: 'icon-name'});
  },
  setup() {
    const myStore = MyStore();
    // const route = useRoute();
    const contactStore = MyContactStore();
    const emitter = myStore.useEmitter();
    const conversationStore = ConversationStore();
    const myFilterRuleStore = MyFilterRuleStore()
    const locale = computed(() => myStore.locale);
    const conversation = computed(() => conversationStore.conversation as Conversation);
    const searchRequest = computed(() => conversationStore.searchRequest);
    const searchTag = computed(() => conversationStore.searchTag);
    const searchDropdown = ref(false);
    const filterTypeSearch = ref('mail');
    const searchModel = ref<string>('');
    const filterSelectedList = ref<any>([]);
    const searchHistoryModel = ref<string[]>([]);
    const typingSearch = ref('');
    const ifHaveJustOneTagAndDelete = ref(false);
    const delayTypingSearch = ref('');
    let debounceSearch;
    const deleteAllTags = ref(false);
    const isIconSearchClick = ref(false);
    const tgTopBarSearch = ref({
      mail: {
        keysearch: '',
        basicFilter: [
          {
            label: 'hasAttachment',
            mailIconName: 'attachfile',
            active: false,
            value: ' has:attachment' // TODO: value phải có khoảng trống ở trước
          },
          {
            label: 'isFlagged',
            mailIconName: 'pastday',
            active: false,
            value: ' is:flagged' // TODO: value phải có khoảng trống ở trước
          },
          {
            label: 'unread',
            mailIconName: 'Inbox',
            active: false,
            value: ' is:unread' // TODO: value phải có khoảng trống ở trước
          },
        ],
        advancedFilter: [
          {
            label: 'receivedFrom',
            componentName: 'MailReceived',
            active: false,
            value: 'from:'
          },
          {
            label: 'sentTo',
            componentName: 'MailSentTo',
            active: false,
            value: 'to:'
          },
          {
            label: 'dataSent',
            componentName: 'MailDateSent',
            active: false,
            value: 'date:'
          },
          {
            label: 'hasAttachment',
            componentName: 'MailAttachments',
            active: false,
            value: 'attachment:'
          },
          {
            label: 'size',
            componentName: 'MailSize',
            active: false,
            value: 'size:'
          },
          {
            label: 'status',
            componentName: 'MailStatus',
            active: false,
            value: 'status:'
          },
          {
            label: 'tags',
            componentName: 'MailTag',
            active: false,
            value: 'tag:'
          },
          {
            label: 'folder',
            componentName: 'MailFolder',
            active: false,
            value: 'folder:'
          }
        ]
      },
      contact: {
        advancedFilter: [
          {
            label: 'tags',
            componentName: 'ContactTag',
            active: false,
            value: 'tag:'
          },
          {
            label: 'folder',
            componentName: 'ContactFolder',
            active: false,
            value: 'folder:'
          }
        ]
      },
      labelIcons: MailSettingIcon,
      filterSearchData: (_list: any) => {
        return _list.filter(item => {
          return item.news[0].title.toLowerCase().includes(searchModel.value.toLowerCase());
        })
      },
      filterSelected: async (_item: any, _idx: number) => {
        _item.active = !_item.active;
        const index = filterSelectedList.value.indexOf(_idx);
        if (index === -1) {
          searchHistoryModel.value.push(_item.value);
          filterSelectedList.value.push(_idx);
        } else {
          filterSelectedList.value.splice(index, 1);
          searchHistoryModel.value = searchHistoryModel.value.filter(x => x !== _item.value);
        }
        await searchRequestConversation(tgTopBarSearch.value.mail.keysearch);
      },
      searchHistory: localStorage.getItem('searchHistory') ? JSON.parse(localStorage.getItem('searchHistory') as string) : [],
      removeSearchHistory: async (_idx: number) => {
        tgTopBarSearch.value.searchHistory.splice(_idx, 1);
        localStorage.setItem('searchHistory', JSON.stringify(tgTopBarSearch.value.searchHistory));
      }
    });

    // contact
    const contacts = computed(() => contactStore.contactData);
    const offsetContact = ref(0);
    const typeContactSelected = ref('in:"contacts"');

    function actionChangeDeleteAllTagsStatus(status) {
      deleteAllTags.value = status;
    }

    function actionAfterSearchClick() {
      searchDropdown.value = false;
      isIconSearchClick.value = false;
    }

    // Begin HungHv: Tìm kiếm khi đang nhập ô input
    function searchWhileTyping(searchKeyword: string) {
      typingSearch.value = searchKeyword + ' ';

      // Debounce Search: sau khi ngừng gõ 1 giây thì mới tìm kiếm
      clearTimeout(debounceSearch)
      debounceSearch = setTimeout(async () => {
        delayTypingSearch.value = searchKeyword
        const querySearch = searchModel.value === '' ? delayTypingSearch.value : (delayTypingSearch.value + ' ' + searchModel.value);
        filterTypeSearch.value === 'contact' ? await queryContactWhileTyping(delayTypingSearch.value) : await queryConversationWhileTyping(querySearch)
      }, 1000);
    }

    // End HungHv: Tìm kiếm khi đang nhập ô input

    // Begin HungHv: Dịch các từ nếu nó có nằm trong exampleQueryTranslate
    function translateQuery(queryText: string) {
      let translate = queryText;
      if (localStorage.getItem('localeZimbraWebmail') === 'en') {
        // Thay thế từ khóa search với bảng quy chiếu số 0 là tiếng Anh, số 1 là tiếng Việt
        exampleQueryTranslate.forEach((item) => {
          translate = translate.replaceAll(item, queryTranslte[item][0])
        })
      } else {
        exampleQueryTranslate.forEach((item) => {
          translate = translate.replaceAll(item, queryTranslte[item][1])
        })
      }
      return translate
    }

    // End HungHv: Dịch các từ nếu nó có nằm trong exampleQueryTranslate

    // Begin HungHv: Logic chuyển song ngữ query search
    function translateSearchModel(searchModel: string) {
      let text = '';
      if (filterTypeSearch.value === 'contact') {
        text = searchModel
      } else {
        text = typingSearch.value + searchModel;
      }
      return translateQuery(text)
    }

    // End HungHv:

    // nhập enter input search request
    async function handleQueryConversation(tag: string[]) {
      let query: string = '', value: object[] = [];
      searchHistoryModel.value = tag;
      tag.forEach((t) => {
        value.push({key: t, date: new Date()});
        query += ' ' + t
      });
      // Map data lịch sử search vào localStorage
      value.forEach((v: any) => tgTopBarSearch.value.searchHistory = tgTopBarSearch.value.searchHistory.filter(h => h.key !== v.key));
      tgTopBarSearch.value.searchHistory = [...new Map([...value, ...tgTopBarSearch.value.searchHistory].map((h) => [h.key, h])).values()];
      // Set không tối đa quá 5 data
      tgTopBarSearch.value.searchHistory = tgTopBarSearch.value.searchHistory.slice(0, 5);
      localStorage.setItem('searchHistory', JSON.stringify(tgTopBarSearch.value.searchHistory));
      // query converstation
      filterTypeSearch.value === 'contact' ? await searchRequestContact(query) :
          await searchRequestConversation(tgTopBarSearch.value.mail.keysearch = query);

      // Trường hợp khách hàng search rất nhanh khi bấm Enter thì sẽ ko cần hiện kết quả của Debounce search
      clearTimeout(debounceSearch)

      let searchArray: string[] | undefined | any;
      searchArray = query.split(' ')
      // Nếu phần tử cuối gồm ':' hoặc ' " ' thì nó là bộ lọc và nếu chỉ có 1 tag rồi xóa tag thì không cần đóng dropdown, còn nếu là search thường thì sau Enter sẽ đóng dropdown
      if (!searchArray.at(-1).includes(':') && !searchArray.at(-1).includes('"') && !searchArray.at(-1).includes("'") && !ifHaveJustOneTagAndDelete.value) {
        searchDropdown.value = false;
        // Sau khi Enter search sẽ blur ô search input
        const inputTopBarSearch: HTMLElement | null | any = document.getElementById('input-mail-search');
        inputTopBarSearch.blur();
      }
    }

    watch(() => searchModel.value, (newValue, oldValue) => {
      ifHaveJustOneTagAndDelete.value = oldValue !== '' && newValue === '';
    })

    // tìm kiếm trong contact
    async function searchRequestContact(query: string) {
      searchModel.value = query.trim();
      await contactStore.actionFindContactByInput(offsetContact.value, query, typeContactSelected.value);
    }

    // tìm kiếm trong conversation
    async function searchRequestConversation(query: string) {
      // lấy ra filter cơ bản
      tgTopBarSearch.value.mail.basicFilter.map((x: any) => {
        if (x.active) {
          query += x.value
        }
      });

      // Sẽ trùng lặp 3 filter cơ bản nên sẽ filter nó đi chỉ cho nó xuất hiện 1 lần
      let querySearchArray: string[];

      querySearchArray = query.split(' ')
      if (querySearchArray.includes('has:attachment')) {
        querySearchArray = querySearchArray.filter((item) => item !== 'has:attachment')
        querySearchArray.push('has:attachment')
      }

      if (querySearchArray.includes('is:flagged')) {
        querySearchArray = querySearchArray.filter((item) => item !== 'is:flagged')
        querySearchArray.push('is:flagged')
      }
      if (querySearchArray.includes('is:unread')) {
        querySearchArray = querySearchArray.filter((item) => item !== 'is:unread')
        querySearchArray.push('is:unread')
      }
      searchModel.value = (querySearchArray.join(' ')).trim();
    }

    // Begin HungHv: Tìm kiếm khi đang gõ phím
    async function queryContactWhileTyping(querySearch: string) {
      let queryContact = ''
      searchHistoryModel.value.forEach((t) => {
        queryContact += ' ' + t
      });
      // Từ khóa tìm kiếm là bộ lọc và từ đang gõ
      searchModel.value = (queryContact + ' ' + querySearch).trim()
      await contactStore.actionFindContactByInput(offsetContact.value, searchModel.value, typeContactSelected.value);
    }

    async function queryConversationWhileTyping(querySearch: string) {
      searchRequest.value.filter = querySearch.trim();
      await conversationStore.getConversation();
    }

    // End HungHv: Tìm kiếm khi đang gõ phím

    // Click data trong lịch sử tìm kếm
    async function actionSearchHistoryValue(key: string) {
      searchHistoryModel.value.push(key);
      await handleQueryConversation(searchHistoryModel.value);
    }

    onMounted(() => {
      // Xử lý show hide search dropdown
      document.addEventListener('click', (event: any) => {
        if (!event.target.closest('#root-drop-search') && myFilterRuleStore.filterRuleStatus !== 'date') {
          const openClass = Array.prototype.slice.call(document.querySelectorAll('.litepicker'));
          searchDropdown.value = !!openClass.some(lite => event.composedPath().includes(lite));
        }
      })
      // Lắng nghe dữ liệu trả về từ các component filter nâng cao con
      emitter.on('init-value-filter-advanced', async (data: { value: string, type: string, isRemove?: boolean }) => {
        if (data.isRemove) {
          searchHistoryModel.value = searchHistoryModel.value.filter(x => x !== data.value);
          await handleQueryConversation(searchHistoryModel.value);
        } else {
          await actionSearchHistoryValue(data.value);
        }
      })
    })

    // Fix bug 3 bộ lọc cơ bản sẽ hiện thị đúng search model vs thẻ tag trên ô search
    watch(() => conversationStore.searchTag, (val: string[]) => {
      if (!val.includes(' has:attachment')) {
        searchModel.value = searchModel.value.replaceAll('has:attachment', ' ')
      }
      if (!val.includes(' is:flagged')) {
        searchModel.value = searchModel.value.replaceAll('is:flagged', ' ')
      }
      if (!val.includes(' is:unread')) {
        searchModel.value = searchModel.value.replaceAll('is:unread', ' ')
      }
    })

    // Tắt trạng thái kích hoạt true false của bộ lộc
    watch(() => searchModel.value, (val: string) => {
      // Bô lọc contact
      if (filterTypeSearch.value === 'contact') {
        if (!val.includes('tag:')) {
          tgTopBarSearch.value.contact.advancedFilter[0].active = false;
        }

        if (!val.includes('in:')) {
          tgTopBarSearch.value.contact.advancedFilter[1].active = false;
        }

        //  Bộ lọc Conversation
      } else {
        // Begin Bộ lọc cơ bản
        if (!val.includes('has:attachment')) {
          tgTopBarSearch.value.mail.basicFilter[0].active = false;
        }

        if (!val.includes('is:flagged')) {
          tgTopBarSearch.value.mail.basicFilter[1].active = false;
        }

        if (!val.includes('is:unread')) {
          tgTopBarSearch.value.mail.basicFilter[2].active = false;
        }
        // End bộ lọc cơ bản

        // Begin Bộ lọc nâng cao
        // From
        if (!val.includes('from:')) {
          tgTopBarSearch.value.mail.advancedFilter[0].active = false;
        }

        // To
        if (!val.includes('to:')) {
          tgTopBarSearch.value.mail.advancedFilter[1].active = false;
        }

        // Begin Date
        if (!val.includes('date:') && !val.includes('before:') && !val.includes('after:')) {
          tgTopBarSearch.value.mail.advancedFilter[2].active = false;
        }
        // End Date

        // Begin attachment
        if (!val.includes('attachment:application/pdf') &&
            !val.includes('attachment:application/*') &&
            !val.includes('attachment:image/*') &&
            !val.includes('attachment:message/rfc822') &&
            !val.includes('attachment:excel') &&
            !val.includes('attachment:text')) {
          tgTopBarSearch.value.mail.advancedFilter[3].active = false;
        }
        // End attachment

        // Begin size
        if (!val.includes('larger:') && !val.includes('smaller:')) {
          tgTopBarSearch.value.mail.advancedFilter[4].active = false;
        }
        // End size

        // Begin status
        if (advancedFilterSearch.every((filter: string) => !val.includes(filter))) {
          tgTopBarSearch.value.mail.advancedFilter[5].active = false;
        }
        // End status

        // Tag
        if (!val.includes('tag:')) {
          tgTopBarSearch.value.mail.advancedFilter[6].active = false;
        }

        // Folder
        if (!val.includes('in:')) {
          tgTopBarSearch.value.mail.advancedFilter[7].active = false;
        }
        // End bộ lọc nâng cao
      }
    })

    function showSearchDropdown() {
      searchDropdown.value = true;
    }

    function hideSearchDropdown() {
      searchDropdown.value = false;
    }

    // reset form
    function setSearchRequestFilter(filter: string) {
      tgTopBarSearch.value.mail.basicFilter.filter(x => x.active ? x.active = false : x.active);
      tgTopBarSearch.value.mail.advancedFilter.filter(x => x.active ? x.active = false : x.active);
      tgTopBarSearch.value.contact.advancedFilter.filter(x => x.active ? x.active = false : x.active);
      searchModel.value = "";
      filterTypeSearch.value = filter;
      filterSelectedList.value = [];
      setTimeout(() => {
        searchDropdown.value = true
      }, 100)
    }

    function actionOpenContact(contact: ItemContact) {
      const sender = new Item();
      sender.fullName = contact.fullName;
      sender.sender = contact.email;
      emitter.emit('mail-contact-menu-sidebar', sender);
    }

    function actionOpenConversationDetail(conversationDetail: ConversationDetail) {
      emitter.emit('show-conversation-detail', {conversationDetail})
    }

    function updateLengthFilterAdvanced(data) {
      if (data.count) {
        filterSelectedList.value.push(filterSelectedList.value.length + 1);
      } else {
        filterSelectedList.value.splice(filterSelectedList.value.length - 1, 1);
      }
    }

    return {
      locale,
      timeAgo,
      contacts,
      searchModel,
      conversation,
      searchRequest,
      searchDropdown,
      tgTopBarSearch,
      filterTypeSearch,
      searchHistoryModel,
      filterSelectedList,
      showSearchDropdown,
      hideSearchDropdown,
      actionOpenConversationDetail,
      handleQueryConversation,
      actionSearchHistoryValue,
      setSearchRequestFilter,
      updateLengthFilterAdvanced,
      actionOpenContact,
      translateSearchModel,
      searchWhileTyping,
      typingSearch,
      translateQuery,
      deleteAllTags,
      actionChangeDeleteAllTagsStatus,
      contactStore,
      searchTag,
      isIconSearchClick,
      actionAfterSearchClick
    }
  }
})
</script>

<style lang="scss">
.search {
  &-history {
    &-item {
      .remove-search-history {
        opacity: 0;
        transition: opacity .15s ease-out 0s;
      }

      &:hover {
        .remove-search-history {
          opacity: 1;
        }
      }
    }
  }
}

#dropdown-search .tree-row-item:hover:before {
  background-color: rgba(white, .15)
}
</style>
