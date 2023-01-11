<template>
  <div class="mail-spam-options">
    <div class="grid grid-cols-12 gap-4">
      <div class="min-w-[150px] col-span-12 sm:col-span-5 md:col-span-4">
        <h3 class="text-base">{{ locale.spamMailOption }}</h3>
      </div>
      <div class="group-action col-span-12 sm:col-span-7 md:col-span-8">
        <div class="flex flex-col md:flex-row -mx-2">
          <!--          BEGIN: Allowlist-->
          <div class="shrink-0 w-full basis-full md:basis-1/2 md:w-1/2 px-2 mb-3 md:mb-0">
            <div class="head-group mb-3">
              <p class="mb-3"><b>{{ locale.allowMessageFrom }}:</b></p>
              <div class="flex items-center">
                <Dropdown class="inline-block" placement="bottom-start" v-slot="{ dismiss }">
                  <DropdownToggle class="btn btn-sm btn-secondary">
                    <PlusIcon class="w-4 h-4"/>
                    {{ locale.add }}
                  </DropdownToggle>
                  <DropdownMenu class="w-64">
                    <DropdownContent tag="div">
                      <div class="p-2">
                        <div>
                          <input type="text" v-model="msgCheckAll.allow.listAddModel"
                                 class="form-control flex-1"
                                 @keyup.enter="mailSpamOptions.mailAllow.AllowListAdd(msgCheckAll.allow.listAddModel); msgCheckAll.allow.listAddModel = '';"
                                 :placeholder="locale.enter + ' ' + locale.emailAddresses" required>
                        </div>
                        <div class="flex items-center mt-5 -mx-1">
                          <button @click="dismiss" class="btn btn-secondary py-1 px-2 w-1/2 mx-1">
                            {{ locale.cancel }}
                          </button>
                          <button type="button" class="btn bg-blue-600 dark:bg-violet-600 py-1 px-2 w-1/2 mx-1"
                                  @click="mailSpamOptions.mailAllow.AllowListAdd(msgCheckAll.allow.listAddModel); msgCheckAll.allow.listAddModel = '';">
                            {{ locale.add }}
                          </button>
                        </div>
                      </div>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
                <div class="flex items-center justify-end grow overflow-hidden whitespace-nowrap pl-1"
                     v-if="msgCheckAll.allow.listCheckAll || msgCheckAll.allow.indeterminate">
                  <Tippy tag="button"
                         :content="locale.delete"
                         type="button"
                         @click="mailSpamOptions.mailAllow.deleteFn()"
                         class="mr-2 rounded bg-light dark:hover:bg-slate-700/70 dark:bg-slate-700/50 py-1 px-2 truncate">
                    <TrashIcon class="w-4 h-4 mr-1 inline-block"/>
                    {{ locale.delete }}
                  </Tippy>
                  <Tippy tag="button"
                         :content="locale.moveToBlackList"
                         type="button"
                         @click="mailSpamOptions.mailAllow.moveAllToBlockList()"
                         class="rounded bg-light dark:hover:bg-slate-700/70 dark:bg-slate-700/50 py-1 px-2 truncate">
                    <ArrowRightIcon class="w-4 h-4 mr-1 inline-block"/>
                    {{ locale.moveToBlackList }}
                  </Tippy>
                </div>
              </div>
            </div>
            <div class="border border-dark/10 dark:border-slate-700 min-h-[220px] overflow-auto rounded max-h-[338px]">
              <div class="flex items-center bg-slate-200 dark:bg-slate-700 py-1 px-3 sticky top-0 z-10">
                <input class="form-check-input mr-2"
                       :indeterminate="msgCheckAll.allow.indeterminate"
                       type="checkbox"
                       v-model="msgCheckAll.allow.listCheckAll"
                       :checked="msgCheckAll.allow.listCheckAll"
                       :disabled="whiteBlackListEmit.whiteList.length === 0"
                       @change="mailSpamOptions.mailAllow.listCheckAll(msgCheckAll.allow.listCheckAll)"/>
                <div class="grow">
                  <div class="flex items-center">
                    <span class="shrink-0">{{ locale.selectedAll }}</span>
                    <div class="grow text-right -mx-1">
                      <div class="absolute inset-0 z-5 py-1 px-2" v-if="msgSearch.allowSearch">
                        <input v-model="msgSearch.allow.search" type="search" class="form-control pr-9"
                               :style="`${darkMode === true ? 'background-color: #485466 !important' : ''}`"
                               :placeholder="locale.findInWhiteList + '...'"/>
                        <button type="button"
                                class="btn btn-sm border-0 dark:border-0 absolute right-2 top-2 text-slate-500/50 hover:text-slate-500/70"
                                @click="msgSearch.allowSearch = false;">
                          <XIcon class="w-4 h-4"/>
                        </button>
                      </div>
                      <button type="button" class="btn btn-sm m-1" @click="msgSearch.allowSearch = true;">
                        <SearchIcon class="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                  class="msg-list flex items-center p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/10 relative"
                  v-for="(fk, fkey) in AllowSearchFilter"
                  :key="fk"
              >
                <input :id="'ck-sw-' + fkey" class="form-check-input mr-2" type="checkbox" v-model="fk.checked"
                       @change="mailSpamOptions.mailAllow.AllowListItemCheck()"/>
                <div class="not-edit-content grow">
                  <Tippy tag="p" class="truncate dark:text-slate-400" :content="fk.content">
                    {{ fk.content }}
                  </Tippy>
                  <div
                      class="group-action flex justify-end items-center ml-2 whitespace-nowrap absolute right-0 inset-y-0 bg-gradient">
                    <Tippy tag="button" :content="locale.delete" type="button" class="btn btn-secondary btn-sm mr-2 bg-slate-100 "
                           @click="mailSpamOptions.mailAllow.AllowListRemove(fk)">
                      <TrashIcon class="w-4 h-4"/>
                    </Tippy>
                    <Tippy tag="button" :content="locale.moveToBlackList" type="button"
                           class="btn btn-secondary btn-sm mr-2 bg-slate-100" @click="mailSpamOptions.mailAllow.MoveBlockList(fk)">
                      <ArrowRightIcon class="w-4 h-4"/>
                    </Tippy>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-2">
              <div class="h-1 dark:bg-slate-800 overflow-hidden rounded">
                <div class="h-1 bg-success" :style="{width: whiteBlackListEmit.whiteList.length + '%'}"></div>
              </div>
              <span
                  class="text-xs">{{ whiteBlackListEmit.whiteList.length }}/{{
                  myUser.mailWhitelistMaxNumEntries
                }} {{ locale.used }}</span>
            </div>
          </div>
          <!--          END: Allowlist-->
          <!--          BEGIN: Blocklist-->
          <div class="shrink-0 w-full basis-full md:basis-1/2 md:w-1/2 px-2">
            <div class="head-group mb-3">
              <p class="mb-3"><b>{{ locale.blockMessageFrom }}:</b></p>
              <div class="flex items-center">
                <Dropdown class="inline-block" v-slot="{ dismiss }">
                  <DropdownToggle class="btn btn-sm btn-secondary">
                    <PlusIcon class="w-4 h-4"/>
                    {{ locale.add }}
                  </DropdownToggle>
                  <DropdownMenu class="w-64">
                    <DropdownContent tag="div">
                      <div class="p-2">
                        <div>
                          <input type="text" v-model="BlockListAddModel" class="form-control"
                                 @keyup.enter="mailSpamOptions.mailBlock.BlockListAdd(BlockListAddModel); BlockListAddModel = '';"
                                 :placeholder="locale.enter + ' ' + locale.emailAddresses"/>
                        </div>
                        <div class="flex items-center mt-5 -mx-1">
                          <button @click="dismiss" class="btn btn-secondary py-1 px-2 w-1/2 mx-1">
                            {{ locale.cancel }}
                          </button>
                          <button type="button" class="btn bg-blue-600 dark:bg-violet-600 py-1 px-2 w-1/2 mx-1"
                                  @click="mailSpamOptions.mailBlock.BlockListAdd(BlockListAddModel); BlockListAddModel = '';">
                            {{ locale.add }}
                          </button>
                        </div>
                      </div>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
                <div class="flex items-center justify-end grow overflow-hidden whitespace-nowrap pl-1"
                     v-if="msgCheckAll.block.listCheckAll || msgCheckAll.block.indeterminate">
                  <Tippy tag="button"
                         :content="locale.delete"
                         type="button"
                         @click="mailSpamOptions.mailBlock.deleteFn()"
                         class="mr-2 rounded bg-light dark:hover:bg-slate-700/70 dark:bg-slate-700/50 py-1 px-2 truncate">
                    <TrashIcon class="w-4 h-4 mr-1 inline-block"/>
                    {{ locale.delete }}
                  </Tippy>
                  <Tippy tag="button"
                         :content="locale.moveToWhiteList"
                         type="button"
                         @click="mailSpamOptions.mailBlock.moveAllToAllowList()"
                         class="rounded bg-light dark:hover:bg-slate-700/70 dark:bg-slate-700/50 py-1 px-2 truncate">
                    <ArrowRightIcon class="w-4 h-4 mr-1 inline-block"/>
                    {{ locale.moveToWhiteList }}
                  </Tippy>
                </div>
              </div>
            </div>

            <div class="border border-dark/10 dark:border-slate-700 min-h-[220px] overflow-auto rounded max-h-[338px]">
              <div class="flex items-center bg-slate-200 dark:bg-slate-700 py-1 px-3 sticky top-0 z-10">
                <input class="form-check-input mr-2"
                       :indeterminate="msgCheckAll.block.indeterminate"
                       type="checkbox"
                       v-model="msgCheckAll.block.listCheckAll"
                       :checked="msgCheckAll.block.listCheckAll"
                       :disabled="whiteBlackListEmit.blackList.length === 0"
                       @change="mailSpamOptions.mailBlock.listCheckAll(msgCheckAll.block.listCheckAll)"/>
                <div class="grow">
                  <div class="flex items-center">
                    <span class="shrink-0">{{ locale.selectedAll }}</span>
                    <div class="grow text-right -mx-1">
                      <div class="absolute inset-0 z-5 py-1 px-2" v-if="msgSearch.blockSearch">
                        <input v-model="msgSearch.allow.search" type="search" class="form-control pr-9"
                               :style="`${darkMode === true ? 'background-color: #485466 !important' : ''}`"
                               :placeholder="locale.findInWhiteList + '...'"/>
                        <button type="button"
                                class="btn btn-sm border-0 dark:border-0 absolute right-2 top-2 text-slate-500/50 hover:text-slate-500/70"
                                @click="msgSearch.blockSearch = false;">
                          <XIcon class="w-4 h-4"/>
                        </button>
                      </div>
                      <button type="button" class="btn btn-sm m-1" @click="msgSearch.blockSearch = true;">
                        <SearchIcon class="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div
                  class="msg-list flex items-center p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/10 relative"
                  v-for="(fk, fkey) in BlockSearchFilter"
                  :key="fk"
              >
                <input :id="'ck-sw-' + fkey" class="form-check-input mr-2" type="checkbox" v-model="fk.checked"
                       @change="mailSpamOptions.mailBlock.BlockListItemCheck()"/>
                <div class="not-edit-content grow">
                  <Tippy tag="p" class="truncate dark:text-slate-400" :content="fk.content">
                    {{ fk.content }}
                  </Tippy>
                  <div
                      class="group-action flex justify-end items-center ml-2 whitespace-nowrap absolute right-0 inset-y-0 bg-gradient">
                    <Tippy tag="button" :content="locale.delete" type="button" class="btn btn-secondary btn-sm mr-2 bg-slate-100"
                           @click="mailSpamOptions.mailBlock.BlockListRemove(fk)">
                      <TrashIcon class="w-4 h-4"/>
                    </Tippy>
                    <Tippy tag="button" :content="locale.moveToWhiteList" type="button"
                           class="btn btn-secondary btn-sm mr-2 bg-slate-100" @click="mailSpamOptions.mailBlock.MoveAllowList(fk)">
                      <ArrowRightIcon class="w-4 h-4"/>
                    </Tippy>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-2">
              <div class="h-1 dark:bg-slate-800 overflow-hidden rounded">
                <div class="h-1 bg-success" :style="{width: whiteBlackListEmit.blackList.length + '%'}"></div>
              </div>
              <span
                  class="text-xs">{{ whiteBlackListEmit.blackList.length }}/{{
                  myUser.mailBlacklistMaxNumEntries
                }} {{ locale.used }}</span>
            </div>
          </div>
          <!--          END: Blocklist-->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, PropType, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {Addr, WhiteBlackList} from "@/model/WhiteBlackList";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import MailOptionService from "@/service/MailOptionService";
import {useDarkModeStore} from "@/stores/dark-mode";

export default defineComponent({
  name: "MailSettingSpamOption",
  data() {
    return {
      BlockListAddModel: '',
      msgSearch: {
        blockSearch: false,
        allowSearch: false,
        allow: {
          search: ''
        },
        block: {
          search: ''
        }
      }
    }
  },
  computed: {
    AllowSearchFilter() {
      const _self = this;
      const listArr = this.whiteBlackListEmit.whiteList;
      return listArr.filter(item => {
        return item.op === '+' && item.content.toLowerCase().includes(_self.msgSearch.allow.search.toLowerCase());
      })
    },
    BlockSearchFilter() {
      const _self = this;
      const listArr = this.whiteBlackListEmit.blackList;
      return listArr.filter(item => {
        return item.op === '+' && item.content.toLowerCase().includes(_self.msgSearch.block.search.toLowerCase());
      })
    }
  },
  props: {
    whiteBlackList: {
      type: Object as PropType<WhiteBlackList>,
      default: () => new WhiteBlackList(),
    }
  },
  emits: ['update:white-black-list'],
  setup(props, {emit}) {
    //init value
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const myUser = computed(() => myStore.myUser);
    const whiteBlackListEmit = computed({
      get: () => props.whiteBlackList ? props.whiteBlackList : new WhiteBlackList(),
      set: (val) => emit('update:white-black-list', val),
    });
    const darkModeStore = useDarkModeStore();
    const darkMode = computed(() => darkModeStore.darkMode);

    const msgCheckAll = ref<any>({
      allow: {
        list: false,
        listAddModel: '',
        indeterminate: false,
        listCheckAll: false
      },
      block: {
        list: false,
        listAddModel: '',
        indeterminate: false,
        listCheckAll: false
      }
    });

    function MoveList(_ArrFrom: Addr[], _ArrDestination: Addr[], _itemMove: Addr, _key) {
      //Add data vào danh sách đích nếu chưa tồn tại
      const newItem = {} as Addr;
      newItem.op = '+';
      newItem.content = _itemMove.content;
      newItem.checked = false;
      const itemFind = _ArrDestination.find(value => value.content === newItem.content);
      if (itemFind) {
        itemFind.op = newItem.op;
      } else {
        _ArrDestination.push(newItem);
      }
      //f5 checkbox nguồn
      ListItemCheck(_ArrFrom, _key);
      //Xóa data danh sách nguồn
      const findIndex = _ArrFrom.findIndex(value => value === _itemMove);
      if (findIndex >= 0) _ArrFrom.splice(findIndex, 1);
    }

    function ListAdd(_Arr: Addr[], _val) {
      if (!_val) return _val;
      const addr = {} as Addr;
      addr.op = '+';
      addr.content = _val;
      addr.checked = false;
      _Arr.push(addr);
    }

    function ListCheckAll(_Arr: Addr[], _val, _key) {
      msgCheckAll.value[_key].indeterminate = false;
      _Arr.forEach(item => {
        return item.checked = _val;
      })
    }

    function ListItemCheck(_Arr: Addr[], _name) {
      const countItemCheck = _Arr.filter(value => value.checked);
      if (countItemCheck && countItemCheck.length === _Arr.length) {
        msgCheckAll.value[_name].indeterminate = false;
        msgCheckAll.value[_name].listCheckAll = true;
      } else if (countItemCheck && countItemCheck.length === 0) {
        msgCheckAll.value[_name].indeterminate = false;
        msgCheckAll.value[_name].listCheckAll = false;
      } else {
        msgCheckAll.value[_name].indeterminate = true;
        msgCheckAll.value[_name].listCheckAll = false;
      }
    }

    function MoveAllToList(_ArrFrom: Addr[], _ArrTo: Addr[], _key) {
      const fromList: Addr[] = [];
      for (const item of _ArrFrom) {
        if (item.checked) {
          fromList.push(item);
        }
      }
      for (const item of fromList) {
        MoveList(_ArrFrom, _ArrTo, item, _key);
      }
      //Ẩn check all
      msgCheckAll.value[_key].indeterminate = false;
      msgCheckAll.value[_key].listCheckAll = false;
    }

    function Delete(_Arr: Addr[], _key) {
      const getIdx: any = [];
      _Arr.forEach((item, idx) => {
        if (item.checked) {
          getIdx.push(idx);
        }
      });
      for (let i = getIdx.length - 1; i >= 0; i--) {
        _Arr.splice(getIdx[i], 1);
      }
      msgCheckAll.value[_key].listCheckAll = false;
      msgCheckAll.value[_key].indeterminate = false;
    }

    const mailSpamOptions = {
      mailAllow: {
        search: '',
        listCheckAll: (_val) => {
          ListCheckAll(whiteBlackListEmit.value.whiteList, _val, 'allow');
        },
        AllowListItemCheck: () => {
          ListItemCheck(whiteBlackListEmit.value.whiteList, 'allow');
        },
        deleteFn: () => {
          Delete(whiteBlackListEmit.value.whiteList, 'allow');
        },
        moveAllToBlockList: () => {
          MoveAllToList(whiteBlackListEmit.value.whiteList, whiteBlackListEmit.value.blackList, 'allow');
        },
        AllowListAdd: (_val) => {
          ListAdd(whiteBlackListEmit.value.whiteList, _val);
        },
        AllowListRemove: (item: Addr) => {
          const findIndex = whiteBlackListEmit.value.whiteList.findIndex(value => value === item);
          if (findIndex >= 0) {
            mailSpamOptions.mailAllow.AllowListItemCheck();
            whiteBlackListEmit.value.whiteList.splice(findIndex, 1);
          }
        },
        MoveBlockList: (_item) => {
          MoveList(whiteBlackListEmit.value.whiteList, whiteBlackListEmit.value.blackList, _item, 'allow');
        },
      },
      mailBlock: {
        search: '',
        listCheckAll: (_val) => {
          ListCheckAll(whiteBlackListEmit.value.blackList, _val, 'block');
        },
        BlockListItemCheck: () => {
          ListItemCheck(whiteBlackListEmit.value.blackList, 'block');
        },
        moveAllToAllowList: () => {
          MoveAllToList(whiteBlackListEmit.value.blackList, whiteBlackListEmit.value.whiteList, 'block');
        },
        deleteFn: () => {
          Delete(whiteBlackListEmit.value.blackList, 'block');
        },
        BlockListAdd: (_val) => {
          ListAdd(whiteBlackListEmit.value.blackList, _val);
        },
        BlockListRemove: (item: Addr) => {
          const findIndex = whiteBlackListEmit.value.blackList.findIndex(value => value === item);
          if (findIndex >= 0) {
            mailSpamOptions.mailBlock.BlockListItemCheck();
            whiteBlackListEmit.value.blackList.splice(findIndex, 1);
          }
        },
        MoveAllowList: (_item) => {
          MoveList(whiteBlackListEmit.value.blackList, whiteBlackListEmit.value.whiteList, _item, 'block');
        }
      }
    }

    async function initGetWhiteBlackList() {
      //call request
      const response = await MailOptionService.getWhiteBlackList(myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          const whiteBlackListResponse = responseData.values as WhiteBlackList;
          //add data
          whiteBlackListEmit.value.whiteList.push(...whiteBlackListResponse.whiteList);
          whiteBlackListEmit.value.blackList.push(...whiteBlackListResponse.blackList);
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    onMounted(async () => {
      await initGetWhiteBlackList();
    });

    return {
      locale,
      myUser,
      whiteBlackListEmit,
      msgCheckAll,
      mailSpamOptions,
      localStorage,
      darkMode
    }
  }
})
</script>

<style lang="scss">
.msg-list {
  .not-edit-content {
    &:hover {
      .group-action {
        opacity: 1;
        visibility: visible;
        z-index: 5;
      }
    }

    .group-action {
      opacity: 0;
      visibility: hidden;
      z-index: -1;
      transition: all .16s linear 0s;
    }
  }
}
</style>