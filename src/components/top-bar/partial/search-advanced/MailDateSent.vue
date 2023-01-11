<template>
  <div class="p-2">
    <div class="form-inline mb-3">
      <label class="form-label sm:w-20">{{ locale.before }}</label>
      <div class="relative w-56">
        <div class="absolute rounded-l w-10 h-full flex items-center justify-center bg-slate-100 border text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
          <CalendarIcon class="w-4 h-4" />
        </div>
        <Litepicker
            @update:modelValue="getDate.before"
            v-model="dateBefore" :options="{
                    autoApply: true,
                    showWeekNumbers: true,
                    dropdowns: {
                      minYear: 1990,
                      maxYear: null,
                      months: true,
                      years: true,
                    },
                  }" class="form-control pl-12" />
      </div>
    </div>
    <div class="form-inline mb-3">
      <label class="form-label sm:w-20">{{ locale.after }}</label>
      <div class="relative w-56">
        <div class="absolute rounded-l w-10 h-full flex items-center justify-center bg-slate-100 border text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
          <CalendarIcon class="w-4 h-4" />
        </div>
        <Litepicker
            @update:modelValue="getDate.after"
            v-model="dateAfter" :options="{
                    autoApply: true,
                    showWeekNumbers: true,
                    dropdowns: {
                      minYear: 1990,
                      maxYear: null,
                      months: true,
                      years: true,
                    },
                  }" class="form-control pl-12" />
      </div>
    </div>
    <div class="form-inline">
      <label class="form-label sm:w-20">{{ locale.in }}</label>
      <div class="relative w-56">
        <div class="absolute rounded-l w-10 h-full flex items-center justify-center bg-slate-100 border text-slate-500 dark:bg-darkmode-700 dark:border-darkmode-800 dark:text-slate-400">
          <CalendarIcon class="w-4 h-4" />
        </div>
        <Litepicker
            @update:modelValue="getDate.inDay"
            v-model="dateOnday" :options="{
                    autoApply: true,
                    showWeekNumbers: true,
                    dropdowns: {
                      minYear: 1990,
                      maxYear: null,
                      months: true,
                      years: true,
                    },
                  }" class="form-control pl-12" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import { DatePicker } from "v-calendar";
import {MyStore} from "@/stores/my-store";
import dayjs from "dayjs";
export default defineComponent({
  name: 'MailDateSent',
  components: {DatePicker},
  data() {
    return {
      isBeforeDate: new Date(),
      isAfterDate: new Date(),
      isOnDate: new Date()
    }
  },
  props: {
    searchAdvancedObj: {
      type: Object,
      require: true
    },
    searchAdvancedRoot: {
      type: Object
    }
  },
  emits: ['update:search-advanced-obj', 'update:search-advanced-root'],
  methods: {
    cancel(evt) {
      evt.stopPropagation();
      this.searchAvd!.active = false;
    },
  },
  setup(props, { emit }) {
    const myStore = MyStore();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);
    const searchAvd = computed({
      get: () => {
        return props.searchAdvancedObj
      },
      set: (vl) => emit('update:search-advanced-obj', vl)
    })

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = Number('0' + dd);
    if (mm < 10) mm = Number('0' + mm);

    const formattedToday = mm + '/' + dd + '/' + yyyy;

    const dateBefore = ref(formattedToday);
    const dateAfter = ref(formattedToday);
    const dateOnday = ref(formattedToday);

    const getDate = ref({
      before: function (date) {
        getDate.value.emitFilterAdvanced(date, 'before:')
      },
      after: function (date) {
        getDate.value.emitFilterAdvanced(date, 'after:')
      },
      inDay: function (date) {
        getDate.value.emitFilterAdvanced(date, 'date:')
      },
      emitFilterAdvanced: function (date, filter) {
        let time = dayjs(date).format('DD/MM/YYYY');
        emitter.emit('init-value-filter-advanced', { value: filter + time, type: 'date:', isRemove: false });
      }
    })


    return {
      locale,
      searchAvd,
      dateBefore,
      dateAfter,
      dateOnday,
      getDate,
    }
  }
})
</script>

<style></style>