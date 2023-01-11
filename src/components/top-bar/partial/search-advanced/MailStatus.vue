<template>
  <div class="py-2 mail-status">
    <div class="flex flex-col sm:flex-row flex-wrap -mx-2">
      <div class="form-check grow basis-1/2 p-2" v-for="(list, index) in formData.status">
        <input :id="'ck-switch-' + index" class="form-check-input" v-model="formData.value" type="checkbox" :value="list" />
        <label class="form-check-label" :for="'ck-switch-' + index">{{ locale[list.label] }}</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, watch} from "vue";
import {MyStore} from "@/stores/my-store";
export default defineComponent({
  name: 'MailStatus',
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
  data(){
    return {
      checkedStatus: []
    }
  },
  methods: {
    cancel(evt) {
      evt.stopPropagation();
      this.searchAvd!.active = false;
    },
    selectChecked() {
      const findIdx = this.searchAdvRoot!.findIndex(item => item.label == this.searchAvd?.label);
      if(findIdx !== -1) {
        this.searchAdvRoot[findIdx].itemSelected = this.checkedStatus;
      }
    }
  },
  setup(props, { emit }) {
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    const searchAvd = computed({
      get: () => {
        return props.searchAdvancedObj
      },
      set: (vl) => emit('update:search-advanced-obj', vl)
    });
    const searchAdvRoot = computed({
      get: () => {
        return props.searchAdvancedRoot as any;
      },
      set: (vl) => emit('update:search-advanced-root', vl)
    });

    const formData = reactive({
      status: [
        {
          label: "unread",
          value: 'unread'
        },
        {
          label: "read",
          value: 'read'
        },
        {
          label: "flagged",
          value: 'flagged'
        },
        {
          label: "notflagged",
          value: 'notflagged'
        },
        {
          label: "drafts",
          value: 'draft'
        },
        {
          label: "sentByMe",
          value: 'sent'
        },
        {
          label: "receivedbyMe",
          value: 'received'
        },
        {
          label: "repliedbyMe",
          value: 'replied'
        },
        {
          label: "unRepliedbyMe",
          value: 'unreplied'
        },
        {
          label: "forwarded",
          value: 'forwarded'
        },
        {
          label: "unForwarded",
          value: 'unforwarded'
        },
        {
          label: "invite",
          value: 'invite'
        },
        {
          label: "conversationByAMail",
          value: 'solo'
        },
        {
          label: "toMe",
          value: 'tome'
        },
        {
          label: "fromMe",
          value: 'fromme'
        },
        {
          label: "ccMe",
          value: 'ccme'
        },
        {
          label: "toFromMe",
          value: 'tofromme'
        },
        {
          label: "toCCMe",
          value: 'toccme'
        },
        {
          label: "fromCCMe",
          value: 'fromccme'
        },
        {
          label: "toFromCCMe",
          value: 'tofromccme'
        },
        {
          label: "inOneOfMyFolders",
          value: 'local'
        },
        {
          label: "inOneOfFoldersSharedWithMe",
          value: 'remote'
        },
        {
          label: "inAnyFolder",
          value: 'anywhere'
        },
      ],
      value: []
    })

    interface IStatus {
      label_vn: string,
      label_en: string,
      value: string
    }

    watch(() => formData.value, (addVal: IStatus[], removeVal: IStatus[]) => {
      let query: string = '', isRemove = false;
      if (addVal.length > removeVal.length) {
        let status = addVal.at(-1);
        if (status) query += String('is:' + status.value);
      } else {
        let status = removeVal.at(-1); isRemove = true;
        if (status) query += String('is:' + status.value);
      }
      emitter.emit('init-value-filter-advanced', { value: query, type: 'status:', isRemove: isRemove });
    })


    return {
      locale,
      formData,
      searchAvd,
      searchAdvRoot,
    }
  }
})
</script>

<style></style>