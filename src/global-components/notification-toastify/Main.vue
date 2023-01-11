<template>
  <div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, watch} from "vue";
  import { createToast, withProps } from "mosha-vue-toastify";
  import { MyStore } from "@/stores/my-store";
  import 'mosha-vue-toastify/dist/style.css';
  import { ToasitfyMessage } from "@/model/dto/ToasitfyMessageDto";
  import CustomNotification from "@/global-components/notification-toastify/CustomNotification.vue";

  export default defineComponent({
    name: 'NotificationToastify',
    setup () {
      const myStore = MyStore();
      const locale = computed(() => myStore.locale);
      watch(
          () => myStore.showMessage,
          (val: ToasitfyMessage) => {
            if (val) {
              createToast(withProps(CustomNotification, { title: val.title, content: val.content, details: val.details, classAlert: val.class,
                openViewDetail: locale.value.openViewDetail, closeViewDetail: locale.value.closeViewDetail }), {
                timeout: val.type === 'danger' ? 30000 : 5000,
                type: val.type as any,
                toastBackgroundColor: '#28334E',
                showIcon: false,
                hideProgressBar: true,
              });
            }
          },
      );

      return {
      };
    }
  })
</script>
