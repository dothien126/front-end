<template>
  <div v-if="mailContactData.mctTippyShowHide" :id="'mt-id-' + mailContactData.conversationId"
       :style="{left: mailContactData.modalPlace.left, top: mailContactData.modalPlace.top}" :class="{'is-active': isActive}"
       @mouseleave="mailContactDataUpdate.mctTippyShowHide = false;isActive = false" @mouseenter="isActive = true"
       class="absolute w-80 dark:bg-neutral-700 rounded shadow-lg bg-white z-50">
      <div class="flex py-2 px-3">
        <div class="w-9 h-9">
          <iNETComponent name="Avatar" :avt-json="mailContactData" :key-str="'sender'"/>
        </div>
        <div class="grow word-break pl-2">
          <div class="font-medium dark:text-neutral-300 leading-relaxed">
            {{ mailContactData.fullName }}
          </div>
          <div class="text-slate-600 dark:text-neutral-400">
            {{mailContactData.sender}}
          </div>
        </div>
      </div>
      <div class="p-2 border-t border-slate-200 flex justify-between">
        <button class="btn text-white bg-purple-600 dark:bg-purple-600/50 hover:bg-purple-600/70 btn-sm" type="button" @click="emitMailContactTippy(mailContactData);">
          {{ locale.openViewDetail }}
        </button>
        <Tippy class="btn hover:bg-neutral-400/50 rounded-full btn-sm" tag="button" :content="locale.newMessage" type="button" @click="emitter.emit('mail-contact-new-to', mailContactData)">
          <MailIcon class="w-4 h-4"/>
        </Tippy>
      </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
  import avtFemale from '@/assets/images/avatar/avatar-female.svg';
  import avtMale from '@/assets/images/avatar/avatar-male.svg';
import {MyStore} from "@/stores/my-store";
  export default defineComponent({
    name: 'MailContactTippy',
    data(){
      return {
        isActive: false
      }
    },
    props: {mailContactData: { type: Object, require: true}},
    emits: ['update:mailContactData'],
    setup(props, {emit}) {
      const myStore = MyStore();
      const emitter = myStore.useEmitter();
      const locale = computed(() => myStore.locale);
      const avtDfRandom = ref([avtFemale, avtMale]);
      const mailContactDataUpdate = computed({
        get: () => {
          return props.mailContactData as object;
        },
        set: (val) => {
          emit('update:mailContactData', val)
        }
      })

      function emitMailContactTippy(_vl) {
        emitter.emit('mail-contact-menu-sidebar', _vl);
      }

      return {
        emitter,
        locale,
        avtDfRandom,
        mailContactDataUpdate,
        emitMailContactTippy,
      }
    }
  })
</script>