<template>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalBody>
      <div class="text-center">
        <div class="mb-5 whitespace-pre-wrap">
          <p class="text-2xl">{{ locale.areYouSure }} {{ locale.delete.toLowerCase() }} <span class="text-orange-500 block" style="line-break: anywhere">{{ title }}?</span></p>
        </div>
        <div class="-mx-2">
          <button type="button" @click="showModal = false" class="btn btn-secondary w-24 m-2">
            {{ locale.cancel }}
          </button>
          <button type="button" @click="actionDelete" class="btn btn-danger w-24 m-2">
            {{ locale.delete }}
          </button>
        </div>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Modal Content -->
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
  import {MyStore} from "@/stores/my-store";
  export default defineComponent({
    name: 'ModalDeleteCallback',
    props: {
      title: {
        type: String,
        required: true,
        default: 'Xóa',
      },
      showModal: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    emits: ['update:show-modal', 'actionDelete'],
    setup(props, {emit}) {
      const myStore = MyStore();
      const locale = computed(() => myStore.locale);
      const title = computed(() => props.title as string);
      const showModal = computed({
        get: () => props.showModal as boolean,
        set: (data) => emit('update:show-modal', data),
      });

      function actionDelete(){
        emit('actionDelete');
      }

      return {
        locale,
        showModal,
        title,
        actionDelete,
      }
    }
  })
</script>