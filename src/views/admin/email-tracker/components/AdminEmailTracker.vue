<template>
  <div class="admin-email-tracker">
    <div v-if="$route.path === '/admin/dashboard'">
      <div class="flex items-center mb-3">
        <h4 class="grow text-base">{{ locale.totalMail }}</h4>
        <Dropdown class="shrink-0" v-slot="{dismiss}">
          <DropdownToggle class="btn btn-sm border border-slate-200 dark:border-darkmode-200">
            {{ textDisplayDateStatics[textSelectedDateStatics] }}
            <ChevronDownIcon class="w-4 h-4 ml-2"/>
          </DropdownToggle>
          <DropdownMenu class="w-40">
            <DropdownContent>
              <DropdownItem @click="GetDataFromInDay(); dismiss();">{{ textDisplayDateStatics.inDay }}</DropdownItem>
              <DropdownItem @click="GetDataFromDayOfWeek(); dismiss();">{{ textDisplayDateStatics.inWeek }}
              </DropdownItem>
              <DropdownItem @click="GetDataFrom7DayRecently(); dismiss();">{{ textDisplayDateStatics.sevenDayRecently }}
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="h-full bg-orange-100 dark:bg-darkmode-400 p-3 min-h-[5rem] rounded-md text-center">
        <div>
          <strong class="text-7xl text-orange-500 dark:text-white/60 mb-1">{{ trackingList.length }}</strong>
          <div class="bg-orange-50 dark:bg-darkmode-200 rounded mt-3">
            <div class="flex p-2">
              <div class="px-2 flex-1">
                <b class="text-2xl">{{ statusTotal.accepted }}</b>
                <iNETComponent name="Status" s-value="A2"/>
              </div>
              <div class="px-2 flex-1">
                <b class="text-2xl">{{ statusTotal.quarantine }}</b>
                <iNETComponent name="Status" s-value="Q"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="relative">
        <div class="flex items-center mb-3 bg-white dark:bg-darkmode-600 p-3 rounded">
          <div class="grow">
            {{ locale.totalTraceMail }} <b>{{ trackingList && trackingList.length > 0 ? trackingList.length : 0 }}</b>
          </div>
          <div class="shrink-0 flex">
            <div class="relative mr-3">
              <input class="form-control dark:bg-darkmode-300 shadow-none pr-9" type="search" :placeholder="locale.find"
                     v-model="filterTracking"/>
              <button type="button" class="btn shadow-none absolute border-none inset-y-0 right-0">
                <SearchIcon class="w-4 h-4"/>
              </button>
            </div>
            <button type="button" class="btn border-slate-200 dark:border-darkmode-300" @click="searchAdvanced = !searchAdvanced">
              <FilterIcon class="w-4 h-4" v-if="!searchAdvanced"/>
              <XIcon class="w-4 h-4" v-else/>
            </button>
          </div>
        </div>
        <div class="p-3 bg-slate-200 dark:bg-darkmode-600 rounded absolute top-full intro-y mb-3 inset-x-0" v-if="searchAdvanced">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="form-inline mb-5">
                <label class="form-label sm:w-24">{{ locale.sender }}</label>
                <input type="text" class="form-control dark:bg-darkmode-300" v-model="trackFilter.from"/>
              </div>
              <div class="form-inline mb-5">
                <label class="form-label sm:w-24">{{ locale.receiver }}</label>
                <input type="text" class="form-control dark:bg-darkmode-300" v-model="trackFilter.target"/>
              </div>
            </div>
            <div>
              <div class="form-inline mb-5">
                <label class="form-label sm:w-24">{{ locale.begin }}</label>
                <div class="flex flex-row-reverse grow">
                  <Dropdown :show="dateTimeDropdown.start" @hidden="dateTimeDropdown.start = false"
                            v-slot="{ dismiss }">
                    <DropdownToggle class="btn btn-secondary rounded-l-none h-full">
                      <CalendarIcon class="w-4 h-4"/>
                      <ChevronDownIcon class="w-4 h-4 ml-2"/>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownContent tag="div">
                        <v-date-picker is-expanded v-model="startTime" :max-date="new Date()" mode="dateTime" is-dark is24hr/>
                        <div class="flex items-center mt-3">
                          <button @click="dismiss" class="btn btn-secondary w-32 ml-auto">
                            {{ locale.skip }}
                          </button>
                          <button @click="dismiss" class="btn btn-primary w-32 ml-2">
                            {{ locale.apply }}
                          </button>
                        </div>
                      </DropdownContent>
                    </DropdownMenu>
                  </Dropdown>
                  <v-date-picker class="grow" v-model="startTime" :max-date="new Date()" mode="dateTime" is-dark is24hr>
                    <template v-slot="{ inputValue, togglePopover }">
                      <input type="text" class="form-control dark:bg-darkmode-300 rounded-r-none" :value="inputValue"
                             @click="dateTimeDropdown.start = true"/>
                    </template>
                  </v-date-picker>
                  <!-- <div class="relative grow">
                   <v-date-picker is-dark v-model="startTime" mode="dateTime" class="pl-8" :masks="masks">
                      <template v-slot="{ inputValue, inputEvents }">
                        <input id="frm-time"
                               class="form-control form-check-input py-2 px-3 focus:outline-none focus:border-blue-300"
                               :value="inputValue"
                               v-on="inputEvents"
                        />
                      </template>
                    </v-date-picker>
                  </div>-->
                </div>
              </div>
              <div class="form-inline mb-5">
                <label class="form-label sm:w-24">{{ locale.end }}</label>
                <div class="flex flex-row-reverse grow">
                  <Dropdown :show="dateTimeDropdown.end" @hidden="dateTimeDropdown.end = false" v-slot="{ dismiss }">
                    <DropdownToggle class="btn btn-secondary rounded-l-none h-full">
                      <CalendarIcon class="w-4 h-4"/>
                      <ChevronDownIcon class="w-4 h-4 ml-2"/>
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownContent tag="div">
                        <v-date-picker is-expanded v-model="endTime" :max-date="new Date()" mode="dateTime" is-dark is24hr/>
                        <div class="flex items-center mt-3">
                          <button @click="dismiss" class="btn btn-secondary w-32 ml-auto">
                            {{ locale.skip }}
                          </button>
                          <button @click="dismiss" class="btn btn-primary w-32 ml-2">
                            {{ locale.apply }}
                          </button>
                        </div>
                      </DropdownContent>
                    </DropdownMenu>
                  </Dropdown>
                  <v-date-picker class="grow" v-model="endTime" :max-date="new Date()" mode="dateTime" is-dark is24hr>
                    <template v-slot="{ inputValue, togglePopover }">
                      <input type="text" class="form-control dark:bg-darkmode-300 rounded-r-none" :value="inputValue"
                             @click="dateTimeDropdown.end = true"/>
                    </template>
                  </v-date-picker>
                  <!-- <div class="relative grow">
                   <v-date-picker is-dark v-model="endTime" mode="dateTime" class="pl-8" :masks="masks">
                      <template v-slot="{ inputValue, inputEvents }">
                        <input id="frm-time"
                               class="form-control form-check-input py-2 px-3 focus:outline-none focus:border-blue-300"
                               :value="inputValue"
                               v-on="inputEvents"
                        />
                      </template>
                    </v-date-picker>
                  </div>-->
                </div>
              </div>
              <div class="form-inline ml-1">
                <div class="sm:w-28"></div>
                <div class="flex flex-col sm:flex-row">
                  <div class="form-check mr-2">
                    <input class="form-check-input" id="empty-sender" type="checkbox" v-model="trackFilter.ndr"/>
                    <label class="form-check-label" for="empty-sender">{{ locale.includeEmptySenders}}</label>
                  </div>
                  <div class="form-check mr-2 mt-2 sm:mt-0">
                    <input class="form-check-input" id="greylist" type="checkbox" v-model="trackFilter.greylist"/>
                    <label class="form-check-label" for="greylist">{{ locale.includeGreylist}}</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="text-right mt-3 -mx-2">
            <button type="button" class="btn border-slate-200 dark:border-darkmode-200 m-2"
                    @click="searchAdvanced = false">
              {{ locale.skip }}
            </button>
            <button type="button" class="btn bg-violet-600 text-white/60 min-w-[7rem] m-2"
                    @click="actionFindTracking()">
              {{ locale.search }}
              <SearchIcon class="w-4 h-4 ml-2"/>
            </button>
          </div>
        </div>
      </div>
      <div class="table-view" v-if="trackingList.length > 0">
        <div class="overflow-x-auto scroll-gray-400 bg-white dark:bg-darkmode-600">
          <table class="table table-hover">
            <thead>
            <tr>
              <th>
                {{ locale.time }}
              </th>
              <th>
                {{ locale.from }}
              </th>
              <th>
                {{ locale.to }}
              </th>
              <th>
                {{ locale.status }}
              </th>
              <th class="whitespace-nowrap">
                {{ locale.diary }}
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in filterList" :key="item.id">
              <td class="whitespace-nowrap">
                <small>
                  {{ helper.formatDate(item.timeDisplay, env.dateTimeFormat) }}
                </small>
              </td>
              <td>
                {{ item.from }}
              </td>
              <td>
                {{ item.target }}
              </td>
              <td>
                <iNETComponent name="Status" :s-value="item" :s-options="{type: 'dot', text: true}"/>
              </td>
              <td>
                <div class="-mx-1.5">
                  <Tippy tag="button" :content="locale.diary" type="button"
                         class="btn btn-sm border-slate-300 dark:border-darkmode-300 m-1.5"
                         @click="actionFindTracking(item);">
                    <NewspaperIcon class="w-4 h-4"/>
                  </Tippy>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else>
        <iNETComponent name="AlertNotFound" :message="locale.notifyNoMail"/>
      </div>
    </div>
  </div>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" :slideOver="true" :show="buttonSlideOverPreview" @hidden="buttonSlideOverPreview = false">
    <a @click="buttonSlideOverPreview = false" class="absolute top-0 left-0 right-auto mt-4 -ml-12">
      <XIcon class="w-8 h-8 text-slate-400"/>
    </a>
    <ModalHeader class="p-5">
      <h2 class="font-medium text-base mr-auto">
        {{ locale.diary }}
      </h2>
    </ModalHeader>
    <ModalBody>
      <Alert class="alert-secondary flex items-center mb-2" style="word-break: break-word;" v-for="item of trackingLogs">
        <AlertOctagonIcon class="w-6 h-6 mr-2 shrink-0"/>
        {{ item }}
      </Alert>
    </ModalBody>
  </Modal>
  <!-- END: Modal Content -->
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {AdminTrackingCenterStore} from "@/stores/admin-store/tracking-center/tracking-center-store";
import {IAdminTrackingCenter} from "@/model/admin/dto/IAdminTrackingCenter";
import {helper} from "@/utils/helper";
import {env} from "@/utils/MyVariables";
import {MyStore} from "@/stores/my-store";
import dayjs from "dayjs";
import {showToastMessage} from "@/utils/MyFunction";

export default defineComponent({
  name: 'AdminEmailTracker',
  data() {
    return {
      filterTracking: ''
    }
  },
  computed: {
    filterList() {
      const data = this.trackingList as any;
      return data.filter(({
                            from,
                            target
                          }) => [from, target].some(val => val.toLowerCase().includes(this.filterTracking.toLowerCase())))
    }
  },
  setup() {
    // locale language
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const buttonSlideOverPreview = ref(false);
    const adminTrackingCenterStore = AdminTrackingCenterStore();
    const searchAdvanced = ref(false);
    const trackingLogs = computed(() => adminTrackingCenterStore.trackingLogs as string[]);
    const trackingList = computed(() => adminTrackingCenterStore.trackingList as IAdminTrackingCenter[]);
    const startTime = ref<Date>(new Date());
    const endTime = ref<Date>(new Date());
    const masks = {
      input: env.dateTimeFormat,
    };
    const trackFilter = ref<IAdminTrackingCenter>({
      from: '',
      target: '',
      starttime: 0,
      endtime: 0,
      ndr: false,
      greylist: false,
    } as IAdminTrackingCenter);
    const statusTotal = ref({
      accepted: 0,
      quarantine: 0
    });

    const currentDate = ref(new Date());

    const textDisplayDateStatics = ref({
      sevenDayRecently: computed(() => locale.value.sevenDayRecently),
      inDay: computed(() => locale.value.inDay),
      inWeek: computed(() => locale.value.inWeek),
      inMonth: computed(() => locale.value.inMonth),
    });

    const textSelectedDateStatics = ref('sevenDayRecently');

    async function actionFindTracking(item?: IAdminTrackingCenter) {
      //neu ngay ket thuc - ngay bat dau < 0 ===> alert
      const diffDay = dayjs(startTime.value).diff(dayjs(endTime.value), "day");
      //logic
      if(diffDay < -7 || diffDay > 0){
        showToastMessage(locale.value.validFilter7day, true);
      }
      else{
        //close modal
        searchAdvanced.value = false;
        trackFilter.value.id = item && item.id ? item.id : '';
        //Neu tim chi tiet thi bo ndr va greylist
        if(item && item.id){
          trackFilter.value.ndr = false;
          trackFilter.value.greylist = false;
        }
        //convert time to timestamp
        trackFilter.value.starttime = Math.floor(startTime.value.getTime() / 1000);
        trackFilter.value.endtime = Math.floor(endTime.value.getTime() / 1000);
        //change value filter
        adminTrackingCenterStore.setTrackingFilter(trackFilter.value);
        //filter action
        await adminTrackingCenterStore.initFindTracking(item);
        //format date
        convertTimeToTimeDisplay();
        //Show logs
        if(item){
          buttonSlideOverPreview.value = true;
        }
      }
    }

    function convertTimeToTimeDisplay() {
      //reset value
      statusTotal.value.accepted = 0;
      statusTotal.value.quarantine = 0;
      //logic
      if (trackingList.value.length > 0) {
        for (const item of trackingList.value) {
          if (item.dstatus === 'A') {
            statusTotal.value.accepted++;
          } else if (item.dstatus === '4') {
            statusTotal.value.quarantine++;
          }
          item.timeDisplay = new Date(item.time * 1000);
        }
      }
    }

    async function ProcessGetDataFromDay(textDisplay: string, dateChange: number) {
      //reset time
      startTime.value = new Date();
      endTime.value = new Date();
      //change text statics
      textSelectedDateStatics.value = textDisplay;
      //set thoi gian qua khu
      startTime.value.setDate(dateChange);
      startTime.value.setHours(0, 0, 0);
      //set thoi gian max (tinh den hien tai 23:59:59)
      endTime.value.setDate(currentDate.value.getDate());
      endTime.value.setHours(23, 59, 59);
      //find data
      await actionFindTracking();
    }

    async function GetDataFrom7DayRecently() {
      await ProcessGetDataFromDay('sevenDayRecently', currentDate.value.getDate() - 7);
    }

    async function GetDataFromInDay() {
      await ProcessGetDataFromDay('inDay', currentDate.value.getDate());
    }

    async function GetDataFromDayOfWeek() {
      let calculateDayOfWeek = 6;
      if(currentDate.value.getDay() === 1) calculateDayOfWeek = 0; //thu 2
      else if(currentDate.value.getDay() === 2) calculateDayOfWeek = 1; //thu 3
      else if(currentDate.value.getDay() === 3) calculateDayOfWeek = 2; //thu 4
      else if(currentDate.value.getDay() === 4) calculateDayOfWeek = 3; //thu 5
      else if(currentDate.value.getDay() === 5) calculateDayOfWeek = 4; //thu 6
      else if(currentDate.value.getDay() === 6) calculateDayOfWeek = 5; //thu 7
      else if(currentDate.value.getDay() === 0) calculateDayOfWeek = 6; //chu nhat
      const dayOfWeek = currentDate.value.getDate() - calculateDayOfWeek;
      await ProcessGetDataFromDay('inWeek', dayOfWeek);
    }

    onMounted(async () => {
      await GetDataFromInDay();
      convertTimeToTimeDisplay();
      await GetDataFrom7DayRecently()
    });

    const dateTimeDropdown = ref({
      start: false,
      end: false
    });

    return {
      locale,
      env,
      helper,
      searchAdvanced,
      buttonSlideOverPreview,
      trackingLogs,
      trackingList,
      trackFilter,
      startTime,
      endTime,
      actionFindTracking,
      masks,
      dateTimeDropdown,
      statusTotal,
      textDisplayDateStatics,
      textSelectedDateStatics,
      GetDataFromInDay,
      GetDataFromDayOfWeek,
      GetDataFrom7DayRecently,
    }
  }
})
</script>