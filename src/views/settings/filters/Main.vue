<template>
  <div class="setting-filter">
    <h1 class="text-base py-3 px-5">{{ locale.filter }}</h1>
    <div class="setting-gr-item border-t border-gray-20 dark:border-gray-500/30 p-5 relative h-full flex flex-col">
      <div class="mb-3">
        <Alert class="alert-warning mb-3">
          <b>{{ locale.note }}:</b> {{ locale.noteChangeFilterImmediately }}
        </Alert>
        <fieldset class="border border-slate-300 dark:border-slate-600 mb-3 p-2 w-full rounded">
          <legend class="px-2 text-slate-500">{{ locale.activityStreamFilter }}</legend>
          <div class="flex items-start">
            <button type="button" class="btn btn-outline-secondary shrink-0 mr-2" @click="actionShowModalActivityStream">
              {{ locale.activityStreamSetting }}
            </button>
            <div class="text-slate-500">
              {{
                locale.activityStreamSettingDetail
              }}
            </div>
          </div>
        </fieldset>
      </div>
      <div class="mb-3">
        <in-out-message-filters :type-outgoing-filter="false" />
      </div>
      <div class="mb-3">
        <in-out-message-filters :type-outgoing-filter="true" />
      </div>
    </div>
  </div>
  <modal-create-filter />
  <activity-stream-modal />
  <iNETComponent name="ModalDelete"/>
  <iNETComponent name="ModalSelectFolder"/>
  <iNETComponent name="ModalSelectTag"/>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {MyStore} from "@/stores/my-store";
import InOutMessageFilters from "@/views/settings/filters/partial/InOutMessageFilters.vue";
import ActivityStreamModal from "@/views/settings/filters/partial/ModalActivityStream.vue";
import ModalCreateFilter from "@/views/settings/filters/partial/ModalCreateFilter.vue";

export default defineComponent({
  name: 'MailSettingFilters',
  components: {
    ModalCreateFilter,
    ActivityStreamModal,
    InOutMessageFilters
  },
  setup() {
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();


    function actionShowModalActivityStream(){
      emitter.emit('show-modal-activity-stream');
    }

    return {
      locale,
      actionShowModalActivityStream,
    }
  }
})
</script>