<template>
  <div class="grid grid-cols-12 gap-6 virus-quarantine">
    <div class="col-span-6 md:col-span-5 xl:col-span-4 relative">
      <div class="relative flex flex-col-reverse md:flex-row items-center mb-3">
        <div class="mt-2.5 md:mt-0 md:mr-5 shrink-0" v-if="findQuarantineList().length > 0">
          <span class="text-xs">{{ locale.total }}</span>: <b>{{findQuarantineList().length + '/' + quarantineList.length }}</b>
        </div>
        <div class="form-group relative grow">
          <input class="form-control dark:bg-darkmode-600 pr-[4.5rem]" type="search" :placeholder="locale.search + '...'"
                 v-model="findItemOfQuarantineList"/>
          <button type="button" class="btn absolute inset-y-0 right-10 rounded-none border-none focus:z-10">
            <SearchIcon class="w-4 h-4 text-slate-500"/>
          </button>
          <button type="button" class="btn absolute inset-y-0 right-0 rounded-l-none border-none focus:z-10"
                  :class="{'bg-slate-200 dark:bg-darkmode-500': filterToggle}"
                  @click="filterToggle = !filterToggle">
            <FilterIcon v-if="!filterToggle" class="w-4 h-4 text-slate-500"/>
            <XIcon v-else class="w-4 h-4 text-slate-500"/>
          </button>
        </div>
        <div class="absolute top-full left-0 right-0 mt-1 p-3 bg-slate-200 dark:bg-darkmode-500 rounded" v-if="filterToggle">
          <div class="form-group mb-3">
            <iNETComponent name="VCalendarPicker"
                           :title="locale.begin"
                           :time-model="startTime"
                           @update:time-model="actionChangeStartTime"
                           @actionApplyTimeCallback="actionChangeTime"/>
          </div>
          <div class="form-group mb-5">
            <iNETComponent name="VCalendarPicker"
                           :title="locale.end"
                           :time-model="endTime"
                           @update:time-model="actionChangeEndTime"
                           @actionApplyTimeCallback="actionChangeTime"/>
          </div>
          <div class="form-group mb-5" v-if="routeSpam">
            <label class="form-label sm:w-24">{{ locale.emailAddresses }}</label>
            <div class="flex grow">
              <select v-model="trackFilter.from" class="form-select dark:bg-darkmode-300">
                <option class="dark:text-darkmode-500" :value="item" v-for="item in spamUserList" :key="item">{{ item }}</option>
              </select>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" class="btn btn-outline-secondary dark:text-slate-500 mr-2"
                    @click="filterToggle = false">
              {{ locale.cancel }}
            </button>
            <button type="button" class="btn btn-primary"
                    @click="actionChangeEmailForLoadQuanrantineList(); filterToggle = false;">
              {{ locale.find }}
            </button>
          </div>
        </div>
      </div>
      <div class="virus-quarantine-list overflow-y-auto overflow-x-hidden scroll-gray-400 max-h-custom" @scroll="actionScrolling">
        <iNETComponent name="AlertNotFound" v-if="findQuarantineList().length === 0" :message="locale.notfoundspam"/>
        <a href="javascript:"
           class="py-2 px-3 mb-1.5 bg-white dark:bg-darkmode-600 dark:hover:bg-darkmode-400 hover:bg-blue-100 block"
           :class="{'active': fk.id === quarantineContent.id}"
           v-for="(fk) in findQuarantineList()" :key="fk.id"
           @click="actionGetContent(fk)">
          <p class="truncate text-base font-medium mb-1">{{ fk.from }}</p>
          <div class="grid grid-cols-1 md:grid-cols-3 md:gap-1">
            <div class="dark:text-white/50 text-xs px-2 py-1 md:border-r border-slate-200 dark:border-darkmode-300 break-words">
              <p class="font-medium">{{ routeSpam ? locale.score : locale.virus }}:</p>
              <span>{{ routeSpam ? fk.spamlevel : fk.virusname }}</span>
            </div>
            <div class="dark:text-white/50 text-xs px-2 py-1 md:border-r border-slate-200 dark:border-darkmode-300">
              <p class="font-medium">{{ locale.size }}:</p>
              <span>{{ prettyBytes(fk.bytes) }}</span>
            </div>
            <div class="dark:text-white/50 text-xs px-2 py-1">
              <p class="font-medium">{{ locale.time }}</p>
              <span>{{
                  dayjs(new Date(fk.time * 1000)).format(env.dateTimeFormat)
                }}</span>
            </div>
          </div>
        </a>
      </div>
      <div v-if="scrollToBottom" class="h-4 absolute bottom-2 inset-x-0">
        <iNETComponent name="Loading" load-color="white"/>
      </div>
    </div>
    <div class="col-span-6 md:col-span-7 xl:col-span-8">
      <div class="dark:text-darkmode-600" v-if="quarantineContent && quarantineContent.id">
        <div class="mb-5">
          <div class="flex mb-2">
            <button type="button" class="btn btn-outline-secondary btn-sm"
                    @click="actionToggleRaw">
              <CodeIcon v-if="!toggleRaw" class="shrink-0 w-4 h-4 mr-1.5"/>
              <ChevronLeftIcon v-else class="shrink-0 w-4 h-4 mr-1.5"/>
              {{ locale.toggleRaw }}
            </button>
            <button type="button" class="btn btn-outline-secondary btn-sm ml-3" v-if="routeSpam"
                    @click="actionToggleInfo">
              <InfoIcon v-if="!toggleInfo" class="shrink-0 w-4 h-4 mr-1.5"/>
              <MinusCircleIcon v-else class="shrink-0 w-4 h-4 mr-1.5"/>
              {{ locale.toggleInfo }}
            </button>
            <div class="grow flex flex-col md:flex-row md:items-center md:justify-end pl-3">
              <button type="button" class="btn btn-primary btn-sm mb-2 md:mb-0 md:mr-2"
                      @click="actionContent('deliver')">
                <SendIcon class="shrink-0 w-4 h-4 mr-1.5"/>
                {{ locale.deliver }}
              </button>
              <button type="button" class="btn btn-danger btn-sm"
                      @click="showModalDelete = true">
                <TrashIcon class="shrink-0 w-4 h-4 mr-1.5"/>
                {{ locale.delete }}
              </button>
            </div>
          </div>
        </div>
        <div class="bg-white p-3 rounded overflow-x-hidden overflow-y-auto scroll-gray-400 max-h-custom">
          <template v-if="toggleInfo">
            <div class="mail-header mb-3">
              <table class="table">
                <tbody>
                  <tr v-for="spamInfo in quarantineContent.spaminfo" :key="spamInfo.name">
                    <td>{{ spamInfo.name }}</td>
                    <td>{{ spamInfo.score }}</td>
                    <td>{{ spamInfo.desc }}</td>
                  </tr>
                  <tr>
                    <td><b>{{ locale.score }} {{ locale.spam }}</b></td>
                    <td><b>{{ spamTotalScore.toFixed(3) }}</b></td>
                    <td>&nbsp;</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-if="!toggleRaw">
            <div class="border-b border-slate-300 dark:border-slate-300 pb-3 mb-3">
              <div class="mb-2">
                <b class="mr-2">{{ locale.from }}:</b> {{ quarantineContent.from }}
              </div>
              <div>
                <b class="mr-2">{{ locale.subject }}:</b> {{ quarantineContent.subject }}
              </div>
            </div>
            <div class="quarantine-html-content" v-html="actionRemoveStyleHtmlContent(quarantineContent.htmlContent)"/>
          </template>
          <template v-else>
            <!--          Hiển thị thư gốc-->
            <div>
              <pre class="whitespace-pre-line word-break">{{ quarantineContent.header }}</pre>
            </div>
            <div>
              <pre class="whitespace-pre-line word-break">{{ quarantineContent.content }}</pre>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
  <iNETComponent name="ModalDeleteCallback"
                 @actionDelete="actionContent('delete')"
                 :title="quarantineContent.subject"
                 :show-modal="showModalDelete"
                 @update:show-modal="showModalDelete = false"/>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import {MyStore} from "@/stores/my-store";
import {IAdminTrackingCenter} from "@/model/admin/dto/IAdminTrackingCenter";
import {AdminMailGatewayStore} from "@/stores/admin-store/mail-gateway/mail-gateway-store";
import t from "typy";
import dayjs from "dayjs";
import {env} from "@/utils/MyVariables";
import {prettyBytes} from "@/utils/pretty-bytes-function/PrettyBytes";
import {IAdminQuarantine} from "@/model/admin/dto/IAdminQuarantine";
import {useRoute} from "vue-router";
import {PaginatorForArray} from "@/utils/MyFunction";

export default defineComponent({
  name: 'SpamVirusQuarantine',
  setup() {
    const myStore = MyStore();
    const adminMailGatewayStore = AdminMailGatewayStore();
    const route = useRoute();
    const routeSpam = computed(() => route.path.endsWith('/spam'));
    const locale = computed(() => myStore.locale);
    const filterToggle = ref(false);
    const startTime = ref<Date>(new Date());
    const endTime = ref<Date>(new Date());
    //
    const showModalDelete = ref(false);
    const findItemOfQuarantineList = ref('');
    const spamUserList = computed(() => adminMailGatewayStore.spamUserList.accountList as string[]);
    const quarantineList = computed(() => adminMailGatewayStore.quarantineList as IAdminQuarantine[]);
    const quarantineContent = computed(() => adminMailGatewayStore.quarantineContent as IAdminQuarantine);
    const spamTotalScore = computed(() => {
      let totalScore = 0;
      if (t(quarantineContent.value.spaminfo).safeArray.length > 0) {
        quarantineContent.value.spaminfo.forEach(value => totalScore += value.score);
      }
      return totalScore;
    })
    const trackFilter = ref<IAdminTrackingCenter>({
      from: t(spamUserList.value).safeArray.length > 0 ? spamUserList.value[0] : '',
      target: '',
      starttime: 0,
      endtime: 0,
      ndr: false,
      greylist: false,
    } as IAdminTrackingCenter);
    const toggleRaw = ref(false);
    const toggleInfo = ref(false);
    //pagination
    const quarantineListDisplay = ref<IAdminQuarantine[]>([]);
    const scrollToBottom = ref(false);
    const maxPage = ref(50);
    const currentPage = ref(1);

    function findQuarantineList() {
      return quarantineListDisplay.value.filter(({
                                            from,
                                            subject
                                          }) => [from, subject].some(val => val.toLowerCase().includes(findItemOfQuarantineList.value.toLowerCase())))
    }

    async function actionChangeEmailForLoadQuanrantineList() {
      //call store
      if (routeSpam.value) {
        await adminMailGatewayStore.initGetAllSpam(trackFilter.value);
      } else {
        await adminMailGatewayStore.initGetAllVirus(trackFilter.value);
      }
      //reset current page
      currentPage.value = 1;
      //pagination
      const {data} = PaginatorForArray(quarantineList.value, currentPage.value, maxPage.value);
      quarantineListDisplay.value = data;
    }

    function actionChangeStartTime(data: Date) {
      startTime.value = data;
    }

    function actionChangeEndTime(data: Date) {
      endTime.value = data;
    }

    async function actionChangeTime() {
      if (t(startTime.value).isDate && t(endTime.value).isDate) {
        trackFilter.value.starttime = Math.floor(startTime.value.getTime() / 1000);
        trackFilter.value.endtime = Math.floor(endTime.value.getTime() / 1000);
        //call store
        if (routeSpam.value) {
          await adminMailGatewayStore.initGetAllSpamUser(trackFilter.value);
        } else {
          await adminMailGatewayStore.initGetAllVirus(trackFilter.value);
        }
        //reset current page
        currentPage.value = 1;
        //pagination
        const {data} = PaginatorForArray(quarantineList.value, currentPage.value, maxPage.value);
        quarantineListDisplay.value = data;
      }
    }

    function actionGetContent(item: IAdminQuarantine) {
      adminMailGatewayStore.actionGetContent(item);
    }

    function actionToggleRaw() {
      toggleRaw.value = !toggleRaw.value;
    }

    function actionToggleInfo() {
      toggleInfo.value = !toggleInfo.value;
    }

    function actionContent(type: string) {
      if(type === 'deliver'){
        //call request
        adminMailGatewayStore.actionDeliverContent(quarantineContent.value);
      }
      else if(type === 'delete'){
        //call request
        adminMailGatewayStore.actionDeleteContent(quarantineContent.value);
      }
      //remove item in list
      adminMailGatewayStore.removeItemOfGetAllQuarantine(quarantineContent.value);
      //close modal
      showModalDelete.value = false;
    }

    async function initDataQuarantine() {
      //reset value
      adminMailGatewayStore.resetGetAllQuarantine();
      //init data spam user list
      await actionChangeTime();
      //init opion select
      trackFilter.value.from = t(spamUserList.value).safeArray.length > 0 ? spamUserList.value[0] : '';
    }

    function actionRemoveStyleHtmlContent(_html: string) {
      const regex = /(<style[\w\W]+style>)/g;
      return _html ? _html.replace(regex, "") : '';
    }

    function actionScrolling(e) {
      const clientHeight = e.target.clientHeight
      const scrollHeight = e.target.scrollHeight
      const scrollTop = e.target.scrollTop
      if (Math.round(Math.abs(scrollHeight - clientHeight - scrollTop)) <= 1 && quarantineListDisplay.value.length < quarantineList.value.length) {
        scrollToBottom.value = true;
        setTimeout(() => {
          currentPage.value += 1;
          const {data, total_pages} = PaginatorForArray(quarantineList.value, currentPage.value, maxPage.value);
          if(currentPage.value <= total_pages){
            quarantineListDisplay.value.push(...data);
          }
          scrollToBottom.value = false;
        }, 2000);
      } else {
        scrollToBottom.value = false;
      }
    }

    watch(() => routeSpam.value, (_value) => {
      initDataQuarantine();
    });

    onMounted( async () => {
      //set thoi gian qua khu
      startTime.value.setDate(startTime.value.getDate() - 7);
      startTime.value.setHours(0, 0, 0);
      //set thoi gian max (tinh den hien tai 23:59:59)
      endTime.value.setHours(23, 59, 59);
      //init data
      await initDataQuarantine();
    });

    // BEGIN: TigerBui
    // const TgQuarantine = {
    //   quarantienList: ref<any>([]),
    //   quarantienLimit: findQuarantineList().length,
    //   quarantienCreate: 9,
    //   quarantienCurPage: 1
    // };
    // class TgMngQuarantine {
    //   quarantienPage = Math.ceil(TgQuarantine.quarantienLimit / TgQuarantine.quarantienCreate);
    //   constructor() {
    //   }
    //
    //   quarantineCreate(index) {
    //     if(findQuarantineList()[index]) {
    //       if(!TgQuarantine.quarantienList.value[index]) {
    //         TgQuarantine.quarantienList.value.push(findQuarantineList()[index]);
    //       }
    //     }
    //   }
    //   addQuarantineToList(pageIndex) {
    //     TgQuarantine.quarantienCurPage = pageIndex;
    //
    //     const startRange = (pageIndex - 1) * TgQuarantine.quarantienCreate;
    //     const endRange = TgQuarantine.quarantienCurPage == this.quarantienPage ? TgQuarantine.quarantienLimit : pageIndex * TgQuarantine.quarantienCreate;
    //     for (let i = startRange + 1; i <= endRange; i++) {
    //       this.quarantineCreate(i);
    //     }
    //     return TgQuarantine.quarantienList.value;
    //   }
    // }
    //
    // onBeforeRouteUpdate((_to, _from) => {
    //   if(_to.name !== _from.name) {
    //     TgQuarantine.quarantienList = ref<any>([]);
    //   }
    // })

    return {
      locale,
      env,
      dayjs,
      prettyBytes,
      toggleRaw,
      toggleInfo,
      routeSpam,
      endTime,
      startTime,
      showModalDelete,
      trackFilter,
      filterToggle,
      findItemOfQuarantineList,
      spamUserList,
      actionRemoveStyleHtmlContent,
      quarantineList,
      findQuarantineList,
      quarantineListDisplay,
      quarantineContent,
      spamTotalScore,
      scrollToBottom,
      actionChangeTime,
      actionChangeStartTime,
      actionChangeEndTime,
      actionChangeEmailForLoadQuanrantineList,
      actionGetContent,
      actionToggleRaw,
      actionToggleInfo,
      actionContent,
      actionScrolling,
      //TgMngQuarantine
    }
  }
})
</script>

<style lang="scss">
@import "@/assets/scss/colors";
@import "@/assets/scss/mixin/media-screen";
html.inet-mail-themes {
  .virus-quarantine {
    &-list {
      > .active {
        background-color: get-color(blue, 100);
        position: sticky;
        top: 0;
        bottom: 0;
      }
    }
  }
  &.dark {
    .virus-quarantine {
      &-list {
        > .active {
          background-color: #1a3155;
        }
      }
    }
  }
}
.virus-quarantine {
  .max-h-custom {
    max-height: calc(100vh - 175px);
    @include mediaScreenWidth(min, md) {
      max-height: calc(100vh - 145px);
    }
  }
  .mail {
    &-header {
      > .table {
        tr {
          > td {
            padding: .35rem;
          }
          &:hover {
            background-color: get-color(gray, 100);
          }
        }
      }
    }
  }
}
.quarantine {
  &-html-content {
    table {
      width: 100% !important;
    }
  }
}
</style>