<template>
  <label class="form-label">{{ title }}</label>
  <div class="flex flex-row-reverse grow">
    <Dropdown :show="showModal" @hidden="showModal = false" v-slot="{ dismiss }">
      <DropdownToggle class="btn border-none bg-white dark:bg-darkmode-300 rounded-l-none h-full">
        <CalendarIcon class="w-4 h-4"/>
        <ChevronDownIcon class="w-4 h-4 ml-2"/>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownContent tag="div">
          <v-date-picker is-expanded v-model="timeModel" :max-date="new Date()" mode="date" is-dark/>
          <div class="flex items-center mt-3">
            <button @click="dismiss" class="btn btn-secondary w-32 ml-auto">
              {{ locale.skip }}
            </button>
            <button @click="actionApplyTimeCallback(dismiss)" class="btn btn-primary w-32 ml-2">
              {{ locale.apply }}
            </button>
          </div>
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>
    <input type="text" class="form-control border-none dark:bg-darkmode-300 rounded-r-none focus:z-10" :value="timeDisplay"
           @click="showModal = true"/>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch} from "vue";
import {MyStore} from "@/stores/my-store";
import dayjs from "dayjs";
import { env } from "@/utils/MyVariables";

export default defineComponent({
  name: "VCalendarPicker",
  props: {
    title: {
      type: String,
      required: true,
      default: '',
    },
    timeModel: {
      type: Date,
      required: true,
      default: new Date(),
    }
  },
  emits: ['update:show-modal', 'update:time-model', 'actionApplyTimeCallback'],
  setup(props, {emit}){
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const showModal = ref(false);
    const title = computed(() => props.title as string);
    const timeModel = computed({
      get: () => props.timeModel as Date,
      set: (data) => emit('update:time-model', data),
    });
    const timeDisplay = ref(dayjs(timeModel.value.getTime()).format(env.dateFormat));

    function actionApplyTimeCallback(dismiss){
      emit('actionApplyTimeCallback');
      dismiss();
    }

    watch(() => timeModel.value, value => {
      if(value){
        timeDisplay.value = dayjs(timeModel.value.getTime()).format(env.dateFormat);
      }
    });

    return {
      locale,
      dayjs,
      env,
      showModal,
      title,
      timeModel,
      timeDisplay,
      actionApplyTimeCallback,
    }
  }
})
</script>

<style scoped>

</style>