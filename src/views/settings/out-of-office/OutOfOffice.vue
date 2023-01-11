<template>
  <div class="general-content py-3">
    <h1 class="text-base mb-3 px-5">{{ locale.OUTOFOFFICE }}</h1>
    <div class="setting-gr-item border-t border-gray-20 dark:border-gray-500/30 px-5 relative">
      <!-- BEGIN: OUT OF OFFICE -->
      <div class="border-b border-slate-300/50 dark:border-gray-600/50 py-5">
        <div class="grid grid-cols-12 gap-4">
          <div class="min-w-[150px] col-span-12 sm:col-span-5 md:col-span-4">
            <h3 class="text-base">{{ locale.OUTOFOFFICE }}</h3>
          </div>
          <div class="group-action col-span-12 sm:col-span-7 md:col-span-8">
            <div class="form-group">
              <div class="form-check mb-3">
                <input id="do-not-send" class="form-check-input" type="radio" name="out_of_office" :value="false"
                       v-model="myUser.zimbraPrefOutOfOfficeReplyEnabled"/>
                <label for="do-not-send" class="form-check-label">{{ locale.doNotSendAutoReplies }}</label>
              </div>
              <div class="form-check">
                <input id="send-auto-reply" class="form-check-input" type="radio" name="out_of_office" :value="true"
                       v-model="myUser.zimbraPrefOutOfOfficeReplyEnabled"/>
                <label for="send-auto-reply" class="form-check-label">{{ locale.sendAutoReplyMessage }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: OUT OF OFFICE -->
      <!-- BEGIN: AUTO REPLY MESSAGE -->
      <div class="border-b border-slate-300/50 dark:border-gray-600/50 py-5" v-if="myUser.zimbraPrefOutOfOfficeReplyEnabled">
        <div class="auto-reply-message">
          <div class="grid grid-cols-12 gap-4">
            <div class="min-w-[150px] col-span-12 sm:col-span-5 md:col-span-4">
              <h3 class="text-base">{{ locale.autoReplyMessage }}</h3>
            </div>
            <div class="group-action col-span-12 sm:col-span-7 md:col-span-8">
              <div class="auto-reply-editor">
                <ClassicEditor :config="{
                        toolbar: []
                      }" v-model="myUser.zimbraPrefOutOfOfficeReply"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: AUTO REPLY MESSAGE -->
      <!-- BEGIN: EXTERNAL SENDER -->
      <div class="border-b border-slate-300/50 dark:border-gray-600/50 py-5" v-if="myUser.zimbraPrefOutOfOfficeReplyEnabled">
        <div class="external-sender">
          <div class="grid grid-cols-12 gap-4">
            <div class="min-w-[150px] col-span-12 sm:col-span-5 md:col-span-4">
              <h3 class="text-base">{{ locale.externalSenders }}</h3>
            </div>
            <div class="group-action col-span-12 sm:col-span-7 md:col-span-8">
              <div :class="activeExternalSenderEditor ? 'mb-3' : ''">
                <select class="form-select" @change="actionChangeExternalSender"
                        v-model="externalSenderSelected">
                  <option v-for="item of externalSenderOptionList" :key="item.key" :value="item.key">
                    {{ item.text }}
                  </option>
                </select>
              </div>
              <div v-if="activeExternalSenderEditor">
                <div class="external-sender-editor">
                  <ClassicEditor :config="{
                        toolbar: []
                      }" v-model="myUser.zimbraPrefOutOfOfficeExternalReply"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: EXTERNAL SENDER -->
      <!-- BEGIN: TIME PERIOD -->
      <out-of-office-time-period v-if="myUser.zimbraPrefOutOfOfficeReplyEnabled"/>
      <!-- END: TIME PERIOD -->
      <div class="text-center mt-5 sticky z-10 bottom-0 inset-x-0 bg-white dark:bg-[#373a41]">
        <button class="btn btn-secondary m-2" @click="emitter.emit('on-active-folder-default')">
          {{ locale.cancel }}
        </button>
        <button class="btn text-white bg-violet-600 m-2" @click="actionSaveChange">
          {{ locale.saveChange }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {User} from "@/model/User";
import OutOfOfficeTimePeriod from "@/views/settings/out-of-office/partial/TimePeriod.vue";
import dayjs from "dayjs";
import {IPrefs, RequestNoResponse} from "@/model/RequestNoResponse";
import UserService from "@/service/UserService";
import {ResponseData} from "@/model/ResponseData";
import {convertHtmlToPlainText, showToastMessage} from "@/utils/MyFunction";
import utc from "dayjs/plugin/utc";
import {
  Comp,
  EElement,
  ICreateAppointmentRequest,
  Inv,
  M,
  MpElement
} from "@/model/interface/ICreateAppointmentRequest";
import {FolderStore} from "@/stores/folder-store/folder-store";
import AppointmentService from "@/service/AppointmentService";
import {MyAppointmentStore} from "@/stores/appointment-store/appointment-store";
import { ICreateAppointmentResponse } from "@/model/interface/ICreateAppointmentResponse";
import {IAppointment} from "@/model/interface/IAppointment";
import {useRouter} from "vue-router";
import {ClassicEditor} from "@/global-components/ckeditor";

export default defineComponent({
  name: "MailSettingOutOfOffice",
  components: {OutOfOfficeTimePeriod, ClassicEditor},
  setup() {
    //init value
    dayjs.extend(utc);
    const myStore = MyStore();
    const myFolder = FolderStore();
    const router = useRouter();
    const myAppointmentStore = MyAppointmentStore();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);
    const myUser = computed(() => myStore.myUser as User);
    const appointmentList = computed( () => myAppointmentStore.myAppointmentList as IAppointment);
    const activeExternalSenderEditor = ref(false);
    const externalSenderOptionList = ref([
      {
        key: 'externalReplyEnabled',
        text: computed(() => locale.value.sendStandardAutoReplyMessage),
        active: true,
      },
      {
        key: 'externalOutOfOfficeReply',
        text: computed(() => locale.value.sendCustomMessageNotInMyOrganisation),
        active: false,
      },
      {
        key: 'externalSendersType',
        text: computed(() => locale.value.sendCustomMessageNotInMyOrganisationAndAddressBook),
        active: false,
      },
      {
        key: 'suppressExternalReply',
        text: computed(() => locale.value.dontSendAutoReplyMessageToExternalSender),
        active: false,
      }]);
    const externalSenderSelected = ref(externalSenderOptionList.value[0].key);
    //emit value
    const activeTimePeriod = ref(false);
    const activeAllDay = ref(false);
    const activeCalendarAppointment = ref(false);

    function initActiveTimePeriod(){
      activeTimePeriod.value = !!(myUser.value.zimbraPrefOutOfOfficeReplyEnabled && myUser.value.zimbraPrefOutOfOfficeFromDate && myUser.value.zimbraPrefOutOfOfficeUntilDate);
    }

    function initActiveAllDay(){
      if(activeTimePeriod.value){
        activeAllDay.value = new Date(myUser.value.zimbraPrefOutOfOfficeFromDate).getHours() === 0 && new Date(myUser.value.zimbraPrefOutOfOfficeFromDate).getMinutes() === 0 && new Date(myUser.value.zimbraPrefOutOfOfficeUntilDate).getHours() === 23 && new Date(myUser.value.zimbraPrefOutOfOfficeUntilDate).getMinutes() === 59;
      }
    }

    function initActiveCalendarAppointment(){
      activeCalendarAppointment.value = appointmentList.value.itemList ? appointmentList.value.itemList.length > 0 : false;
    }

    function initGetExternalSender() {
      if (!myUser.value.zimbraPrefOutOfOfficeExternalReplyEnabled && !myUser.value.zimbraPrefOutOfOfficeSuppressExternalReply) {
        //active option 1
        externalSenderOptionList.value.forEach((value, index) => {
          if (index === 0) {
            externalSenderSelected.value = value.key;
            activeExternalSenderEditor.value = false;
          }
          value.active = index === 0;
        });
      } else if (myUser.value.zimbraPrefExternalSendersType === 'ALL') {
        //active option 2
        externalSenderOptionList.value.forEach((value, index) => {
          if (index === 1) {
            externalSenderSelected.value = value.key;
            activeExternalSenderEditor.value = true;
          }
          value.active = index === 1;
        });
      } else if (myUser.value.zimbraPrefExternalSendersType === 'ALLNOTINAB') {
        //active option 3
        externalSenderOptionList.value.forEach((value, index) => {
          if (index === 2) {
            externalSenderSelected.value = value.key;
            activeExternalSenderEditor.value = true;
          }
          value.active = index === 2;
        });
      }
      if (myUser.value.zimbraPrefOutOfOfficeSuppressExternalReply) {
        //active option 4
        externalSenderOptionList.value.forEach((value, index) => {
          if (index === 3) {
            externalSenderSelected.value = value.key;
            activeExternalSenderEditor.value = false;
          }
          value.active = index === 3;
        });
      }
    }

    function actionChangeExternalSender() {
      //option 1
      if (externalSenderSelected.value === 'externalReplyEnabled') {
        myUser.value.zimbraPrefOutOfOfficeExternalReplyEnabled = false;
        myUser.value.zimbraPrefOutOfOfficeSuppressExternalReply = false;
        activeExternalSenderEditor.value = false;
      }
      //option 2
      else if (externalSenderSelected.value === 'externalOutOfOfficeReply') {
        myUser.value.zimbraPrefOutOfOfficeExternalReplyEnabled = true;
        myUser.value.zimbraPrefOutOfOfficeSuppressExternalReply = false;
        myUser.value.zimbraPrefExternalSendersType = 'ALL';
        activeExternalSenderEditor.value = true;
      }
      //option 3
      else if (externalSenderSelected.value === 'externalSendersType') {
        myUser.value.zimbraPrefOutOfOfficeExternalReplyEnabled = true;
        myUser.value.zimbraPrefOutOfOfficeSuppressExternalReply = false;
        myUser.value.zimbraPrefExternalSendersType = 'ALLNOTINAB';
        activeExternalSenderEditor.value = true;
      }
      //option 4
      else if (externalSenderSelected.value === 'suppressExternalReply') {
        myUser.value.zimbraPrefOutOfOfficeExternalReplyEnabled = false;
        myUser.value.zimbraPrefOutOfOfficeSuppressExternalReply = true;
        activeExternalSenderEditor.value = false;
      }
    }

    function calculateBeforeCreateAppointmentRequest(){
      const itemRequest = {} as ICreateAppointmentRequest;
      if(myFolder.calendarFolder.id && myUser.value.zimbraPrefOutOfOfficeReplyEnabled && myUser.value.zimbraPrefOutOfOfficeFromDate && myUser.value.zimbraPrefOutOfOfficeUntilDate){
        itemRequest.m = {
          l: myFolder.calendarFolder.id,
          inv: {
            comp: [{
              at: [] as any[],
              status: 'CONF',
              fb: 'B',
              class: 'PUB',
              transp: '0',
              draft: 0,
              allDay: activeAllDay.value ? '1' : '0',
              s: {
                d: activeAllDay.value ? dayjs(myUser.value.zimbraPrefOutOfOfficeFromDate).format('YYYYMMDD') : dayjs(myUser.value.zimbraPrefOutOfOfficeFromDate).format('YYYYMMDD[T]HHmmss'),
                tz: myUser.value.timeZone,
              },
              e: {
                d: activeAllDay.value ? dayjs(myUser.value.zimbraPrefOutOfOfficeUntilDate).format('YYYYMMDD') : dayjs(myUser.value.zimbraPrefOutOfOfficeUntilDate).format('YYYYMMDD[T]HHmmss'),
                tz: myUser.value.timeZone,
              },
              name: locale.value[myUser.value.zimbraPrefOutOfOfficeFreeBusyStatus],
              loc: '',
              or: {a: myUser.value.account},
              alarm: [{
                action: 'DISPLAY',
                trigger: {
                  rel: {
                    m: 0,
                    related: 'START',
                    neg: '1',
                  }
                }
              }],
            }] as Comp[],

          } as Inv,
          e: [{
            a: myUser.value.account,
            t: 'f'
          }] as EElement[],
          su: locale.value[myUser.value.zimbraPrefOutOfOfficeFreeBusyStatus],
          mp: {
            mp: [{
              ct: 'text/plain',
              content: '',
            }] as MpElement[],
            ct: 'multipart/alternative',
          }
        } as M;
      }
      return itemRequest;
    }

    async function createAppointmentRequest() {
      if (activeTimePeriod.value && activeCalendarAppointment.value) {
        const itemRequest = calculateBeforeCreateAppointmentRequest();
        if (itemRequest.m) {
          //call request
          const response = await AppointmentService.createAppointment(itemRequest, myStore.token);
          if (response.data) {
            const responseData: ResponseData = response.data;
            //Kiểm tra backend có trả error ko
            if (responseData.values.error) {
              // Set thông báo thất bại
              showToastMessage(responseData.values.error, true);
            } else {
              //set to store object created
              myAppointmentStore.setAppointmendCreated(responseData.values as ICreateAppointmentResponse);
            }
          } else {
            showToastMessage(undefined, true);
          }
        }
      }
    }

    async function actionSaveChange() {
      //init request
      const requestNoResponse = new RequestNoResponse();
      //init value active out of office
      const zimbraPrefOutOfOfficeReplyEnabled: IPrefs = {
        name: 'zimbraPrefOutOfOfficeReplyEnabled',
        value: myUser.value.zimbraPrefOutOfOfficeReplyEnabled ? 'TRUE' : 'FALSE'
      };
      //init value content out of office
      const zimbraPrefOutOfOfficeReply: IPrefs = {
        name: 'zimbraPrefOutOfOfficeReply',
        value: convertHtmlToPlainText(myUser.value.zimbraPrefOutOfOfficeReply)
      };
      //init value option 1 external sender
      const zimbraPrefOutOfOfficeExternalReplyEnabled: IPrefs = {
        name: 'zimbraPrefOutOfOfficeExternalReplyEnabled',
        value: myUser.value.zimbraPrefOutOfOfficeReplyEnabled && myUser.value.zimbraPrefOutOfOfficeExternalReplyEnabled ? 'TRUE' : 'FALSE',
      };
      //init value option 2 - 3 external sender
      const zimbraPrefExternalSendersType: IPrefs = {
        name: 'zimbraPrefExternalSendersType',
        value: myUser.value.zimbraPrefExternalSendersType
      };
      //init value content external sender
      const zimbraPrefOutOfOfficeExternalReply: IPrefs = {
        name: 'zimbraPrefOutOfOfficeExternalReply',
        value: convertHtmlToPlainText(myUser.value.zimbraPrefOutOfOfficeExternalReply)
      };
      //init value option 4 external sender
      const zimbraPrefOutOfOfficeSuppressExternalReply: IPrefs = {
        name: 'zimbraPrefOutOfOfficeSuppressExternalReply',
        value: myUser.value.zimbraPrefOutOfOfficeReplyEnabled && myUser.value.zimbraPrefOutOfOfficeSuppressExternalReply ? 'TRUE' : 'FALSE',
      };
      //neu active allday thi doi fromdate = 00:00 , ultidate = 23:59
      if (activeAllDay.value && myUser.value.zimbraPrefOutOfOfficeFromDate) {
        myUser.value.zimbraPrefOutOfOfficeFromDate = dayjs(myUser.value.zimbraPrefOutOfOfficeFromDate).toDate();
        myUser.value.zimbraPrefOutOfOfficeFromDate.setHours(0, 0, 0);
      }
      if (activeAllDay.value && myUser.value.zimbraPrefOutOfOfficeUntilDate) {
        myUser.value.zimbraPrefOutOfOfficeUntilDate = dayjs(myUser.value.zimbraPrefOutOfOfficeUntilDate).toDate();
        myUser.value.zimbraPrefOutOfOfficeUntilDate.setHours(23, 59, 59);
      }
      //convert time js to time zimbra fromDate & untilDate
      const fromDate = myUser.value.zimbraPrefOutOfOfficeReplyEnabled && activeTimePeriod.value && myUser.value.zimbraPrefOutOfOfficeFromDate ? dayjs(myUser.value.zimbraPrefOutOfOfficeFromDate).utc().format('YYYYMMDDHHmmss[Z]') : '';
      const untilDate = myUser.value.zimbraPrefOutOfOfficeReplyEnabled && activeTimePeriod.value && myUser.value.zimbraPrefOutOfOfficeUntilDate ? dayjs(myUser.value.zimbraPrefOutOfOfficeUntilDate).utc().format('YYYYMMDDHHmmss[Z]') : '';
      const zimbraPrefOutOfOfficeFromDate: IPrefs = {
        name: 'zimbraPrefOutOfOfficeFromDate',
        value: fromDate
      };
      const zimbraPrefOutOfOfficeUntilDate: IPrefs = {
        name: 'zimbraPrefOutOfOfficeUntilDate',
        value: untilDate
      };
      //init value option calendar appointment
      // const zimbraPrefOutOfOfficeFreeBusyStatus: IPrefs = {
      //   name: 'zimbraPrefOutOfOfficeFreeBusyStatus',
      //   value: myUser.value.zimbraPrefOutOfOfficeFreeBusyStatus
      // };
      //init value alert
      const zimbraPrefOutOfOfficeStatusAlertOnLogin: IPrefs = {
        name: 'zimbraPrefOutOfOfficeStatusAlertOnLogin',
        value: myUser.value.zimbraPrefOutOfOfficeReplyEnabled && activeTimePeriod.value ? 'TRUE' : 'FALSE',
      };
      //add value to list
      requestNoResponse.prefs.push(zimbraPrefOutOfOfficeReplyEnabled, zimbraPrefOutOfOfficeReply, zimbraPrefOutOfOfficeExternalReplyEnabled, zimbraPrefExternalSendersType, zimbraPrefOutOfOfficeExternalReply, zimbraPrefOutOfOfficeSuppressExternalReply, zimbraPrefOutOfOfficeFromDate, zimbraPrefOutOfOfficeUntilDate, zimbraPrefOutOfOfficeStatusAlertOnLogin);
      //call request
      const response = await UserService.modifyPrefs(requestNoResponse, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          // Thông báo thành công
          showToastMessage();
          // Check create appointment
          await createAppointmentRequest();
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    onMounted(() => {
      initGetExternalSender();
      initActiveTimePeriod();
      initActiveAllDay();
      initActiveCalendarAppointment();
      emitter.on('active-time-period', (data: boolean) => {
        activeTimePeriod.value = data;
      });
      emitter.on('active-all-day-time-period', (data: boolean) => {
        activeAllDay.value = data;
      });
      emitter.on('active-calendar-appointment', (data: boolean) => {
        activeCalendarAppointment.value = data;
      });
    });

    onDeactivated(() => {
      emitter.off('active-all-day-time-period');
      emitter.off('active-time-period');
      emitter.off('active-calendar-appointment');
    });

    return {
      locale,
      myUser,
      router,
      emitter,
      activeTimePeriod,
      activeCalendarAppointment,
      activeExternalSenderEditor,
      externalSenderSelected,
      externalSenderOptionList,
      actionChangeExternalSender,
      actionSaveChange,
    }
  }
});
</script>

<style scoped>

</style>