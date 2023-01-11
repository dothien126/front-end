<template>
  <div class="py-5">
    <div class="time-period">
      <div class="grid grid-cols-12 gap-4">
        <div class="min-w-[150px] col-span-12 sm:col-span-5 md:col-span-4">
          <h3 class="text-base">{{ locale.timePeriod }}</h3>
        </div>
        <div class="group-action col-span-12 sm:col-span-7 md:col-span-8">
          <div :class="activeTimePeriod ? 'mb-5' : ''">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="send-auto-replies" v-model="activeTimePeriod" @change="actionChangeTimePeriod"/>
              <label class="form-check-label" for="send-auto-replies">{{ locale.sendAutoRepliesTimePeriod }}</label>
            </div>
          </div>
          <template v-if="activeTimePeriod">
            <div class="form-check form-switch mb-2">
              <input class="form-check-input" type="checkbox" id="ip-all-day" v-model="activeAllDay" @change="actionChangeAllDay"/>
              <label class="form-check-label" for="ip-all-day">{{ locale.allDay }}</label>
            </div>
            <div class="grid grid-cols-2 gap-4 lg:gap-6 mb-5">
              <div class="col-span-2 lg:col-span-1">
                <div class="begin">
                  <h4 class="mb-1">{{ locale.begin }}</h4>
                  <div class="flex form-group mb-3">
                    <v-date-picker class="grow" v-model="myUser.zimbraPrefOutOfOfficeFromDate" :mode="'date'" is-dark is24hr>
                      <template v-slot="{ inputValue, togglePopover }">
                        <input type="text" class="form-control bg-slate-300 rounded-r-none" :value="inputValue" :disabled="activeTimePeriod === false"
                               @click="dateTimeDropdown.start.date = true"/>
                      </template>
                    </v-date-picker>
                    <Dropdown :show="dateTimeDropdown.start.date" @hidden="dateTimeDropdown.start.date = false" v-if="activeTimePeriod"
                              v-slot="{ dismiss }">
                      <DropdownToggle class="btn btn-secondary rounded-l-none h-full">
                        <CalendarIcon class="w-4 h-4"/>
                        <ChevronDownIcon class="w-4 h-4 ml-2"/>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownContent tag="div">
                          <div>
                            <v-date-picker is-expanded v-model="myUser.zimbraPrefOutOfOfficeFromDate" :mode="'date'" is-dark is24hr />
                          </div>
                          <div class="flex items-center mt-3">
                            <button @click="dismiss" class="btn btn-secondary grow mr-3">
                              {{ locale.skip }}
                            </button>
                            <button @click="dismiss" class="btn btn-primary grow">
                              {{ locale.apply }}
                            </button>
                          </div>
                        </DropdownContent>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div class="flex form-group" v-if="!activeAllDay">
                    <v-date-picker class="grow" v-model="myUser.zimbraPrefOutOfOfficeFromDate" :mode="'time'" is-dark is24hr>
                      <template v-slot="{ inputValue, togglePopover }">
                        <input type="text" class="form-control bg-slate-300 rounded-r-none" :value="inputValue" :disabled="activeTimePeriod === false"
                               @click="dateTimeDropdown.start.time = true"/>
                      </template>
                    </v-date-picker>
                    <Dropdown :show="dateTimeDropdown.start.time" @hidden="dateTimeDropdown.start.time = false" v-if="activeTimePeriod"
                              v-slot="{ dismiss }">
                      <DropdownToggle class="btn btn-secondary rounded-l-none h-full">
                        <ClockIcon class="w-4 h-4"/>
                        <ChevronDownIcon class="w-4 h-4 ml-2"/>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownContent tag="div">
                          <div>
                            <v-date-picker class="w-full" v-model="myUser.zimbraPrefOutOfOfficeFromDate" :mode="'time'" is-dark is24hr />
                          </div>
                          <div class="flex items-center mt-3">
                            <button @click="dismiss" class="btn btn-secondary grow mr-3">
                              {{ locale.skip }}
                            </button>
                            <button @click="dismiss" class="btn btn-primary grow">
                              {{ locale.apply }}
                            </button>
                          </div>
                        </DropdownContent>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>
              <div class="col-span-2 lg:col-span-1">
                <div class="end">
                  <h4 class="mb-1">{{ locale.end }}:</h4>
                  <div class="flex form-group mb-3">
                    <v-date-picker class="grow" v-model="myUser.zimbraPrefOutOfOfficeUntilDate" :mode="'date'" is-dark is24hr>
                      <template v-slot="{ inputValue, togglePopover }">
                        <input type="text" class="form-control rounded-r-none" :value="inputValue" :disabled="activeTimePeriod === false"
                               @click="dateTimeDropdown.end.date = true"/>
                      </template>
                    </v-date-picker>
                    <Dropdown :show="dateTimeDropdown.end.date" @hidden="dateTimeDropdown.end.date = false" v-if="activeTimePeriod"
                              v-slot="{ dismiss }">
                      <DropdownToggle class="btn btn-secondary rounded-l-none h-full">
                        <CalendarIcon class="w-4 h-4"/>
                        <ChevronDownIcon class="w-4 h-4 ml-2"/>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownContent tag="div">
                          <div>
                            <v-date-picker is-expanded v-model="myUser.zimbraPrefOutOfOfficeUntilDate" :mode="'date'" is-dark/>
                          </div>
                          <div class="flex items-center mt-3">
                            <button @click="dismiss" class="btn btn-secondary grow mr-3">
                              {{ locale.skip }}
                            </button>
                            <button @click="dismiss" class="btn btn-primary grow">
                              {{ locale.apply }}
                            </button>
                          </div>
                        </DropdownContent>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                  <div class="flex form-group" v-if="!activeAllDay">
                    <v-date-picker class="grow" v-model="myUser.zimbraPrefOutOfOfficeUntilDate" :mode="'time'" is-dark is24hr>
                      <template v-slot="{ inputValue, togglePopover }">
                        <input type="text" class="form-control bg-slate-300 rounded-r-none" :value="inputValue" :disabled="activeTimePeriod === false"
                               @click="dateTimeDropdown.end.time = true"/>
                      </template>
                    </v-date-picker>
                    <Dropdown :show="dateTimeDropdown.end.time" @hidden="dateTimeDropdown.end.time = false" v-if="activeTimePeriod"
                              v-slot="{ dismiss }">
                      <DropdownToggle class="btn btn-secondary rounded-l-none h-full">
                        <ClockIcon class="w-4 h-4"/>
                        <ChevronDownIcon class="w-4 h-4 ml-2"/>
                      </DropdownToggle>
                      <DropdownMenu>
                        <DropdownContent tag="div">
                          <div>
                            <v-date-picker class="w-full" v-model="myUser.zimbraPrefOutOfOfficeUntilDate" :mode="'time'" is-dark is24hr />
                          </div>
                          <div class="flex items-center mt-3">
                            <button @click="dismiss" class="btn btn-secondary grow mr-3">
                              {{ locale.skip }}
                            </button>
                            <button @click="dismiss" class="btn btn-primary grow">
                              {{ locale.apply }}
                            </button>
                          </div>
                        </DropdownContent>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
            <!-- HIDDEN CALENDAR APPOINTMENT -->
<!--            <div class="mb-3">-->
<!--              <div class="form-check form-switch mb-2">-->
<!--                <input class="form-check-input" type="checkbox" id="ip-create-appoint-ment" v-model="activeCalendarAppointment" @change="actionChangeCalendarAppointment"/>-->
<!--                <label class="form-check-label mr-3" for="ip-create-appoint-ment">{{ locale.calendarAppointment }}</label>-->
<!--              </div>-->
<!--              <div class="form-inline" v-if="activeCalendarAppointment">-->
<!--                <h4 class="shrink-0 mr-3">{{ locale.createAppointmentAndDisplayAs }}:</h4>-->
<!--                <select class="form-select" v-model="myUser.zimbraPrefOutOfOfficeFreeBusyStatus">-->
<!--                  <option value="OUTOFOFFICE">-->
<!--                    {{ locale.OUTOFOFFICE }}-->
<!--                  </option>-->
<!--                  <option value="BUSY">-->
<!--                    {{ locale.BUSY }}-->
<!--                  </option>-->
<!--                </select>-->
<!--              </div>-->
<!--            </div>-->
            <!-- HIDDEN CALENDAR APPOINTMENT -->
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {User} from "@/model/User";
import {IAppointment} from "@/model/interface/IAppointment";
import {MyAppointmentStore} from "@/stores/appointment-store/appointment-store";
export default defineComponent({
  name: "OutOfOfficeTimePeriod",
  setup() {
    const myStore = MyStore();
    const myAppointmentStore = MyAppointmentStore();
    const emitter = myStore.useEmitter();
    const myUser = computed(() => myStore.myUser as User);
    const locale = computed(() => myStore.locale);
    const appointmentList = computed( () => myAppointmentStore.myAppointmentList as IAppointment);
    const dateTimeDropdown = ref({
      start: {
        date: false,
        time: false
      },
      end: {
        date: false,
        time: false
      }
    });
    const activeTimePeriod = ref(false);
    const activeAllDay = ref(false);
    const activeCalendarAppointment = ref(appointmentList.value.itemList ? appointmentList.value.itemList.length > 0 : false);

    function initGetTimePeriod(){
      //Check neu gio phu bat dau = 00:00, ket thuc = 23:59 thi doi trang thai allDay
      if(myUser.value.zimbraPrefOutOfOfficeReplyEnabled && myUser.value.zimbraPrefOutOfOfficeFromDate && myUser.value.zimbraPrefOutOfOfficeUntilDate){
        activeTimePeriod.value = true;
        activeAllDay.value = new Date(myUser.value.zimbraPrefOutOfOfficeFromDate).getHours() === 0 && new Date(myUser.value.zimbraPrefOutOfOfficeFromDate).getMinutes() === 0 && new Date(myUser.value.zimbraPrefOutOfOfficeUntilDate).getHours() === 23 && new Date(myUser.value.zimbraPrefOutOfOfficeUntilDate).getMinutes() === 59;
      }
      else{
        activeTimePeriod.value = false;
      }
    }

    function actionChangeTimePeriod(){
      if(activeTimePeriod.value && !myUser.value.zimbraPrefOutOfOfficeFromDate) myUser.value.zimbraPrefOutOfOfficeFromDate = new Date();
      if(activeTimePeriod.value && !myUser.value.zimbraPrefOutOfOfficeUntilDate) myUser.value.zimbraPrefOutOfOfficeUntilDate = new Date();
      emitter.emit('active-time-period', activeTimePeriod.value);
    }

    function actionChangeAllDay(){
      emitter.emit('active-all-day-time-period', activeAllDay.value);
    }

    function actionChangeCalendarAppointment(){
      emitter.emit('active-calendar-appointment', activeCalendarAppointment.value);
    }

    onMounted(() => {
      initGetTimePeriod();
      actionChangeTimePeriod();
      actionChangeCalendarAppointment();
    })

    return {
      locale,
      myUser,
      activeAllDay,
      dateTimeDropdown,
      activeTimePeriod,
      activeCalendarAppointment,
      actionChangeTimePeriod,
      actionChangeAllDay,
      actionChangeCalendarAppointment,
    }
  }
})
</script>