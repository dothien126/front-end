<template>
  <section size="A4">
    <div class="text-slate-600 content-print" v-html="new TgPrint().removeZimbraBrand(contentPrint)"></div>
  </section>
  <!-- BEGIN: Notification Toastify -->
  <NotificationToastify/>
  <!-- END: Notification Toastify -->
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, onUpdated, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {onBeforeRouteLeave, useRoute} from "vue-router";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import { Item } from "@/model/Conversation";
import ConversationService from "@/service/ConversationService";

export default defineComponent({
  name: "Print",
  setup(){
    //init value
    const myStore = MyStore();
    const route = useRoute();
    const conversationIdSelected = computed(() => route.params && route.params.conversationId ? route.params.conversationId : '');
    const contentPrint = ref('');
    const hasContentPrint = ref(false);

    async function initGetContentPrint() {
      addPrintClsToHtml();
      //init request
      const conversation = {conversationId: conversationIdSelected.value} as Item;
      //call request
      const response = await ConversationService.print(conversation, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          //set content
          contentPrint.value = responseData.values;
          //check valid
          hasContentPrint.value = true;
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    onUpdated(() => {
      if(hasContentPrint.value){
        //active print
        setTimeout(() => window.print(), 1000);
      }
    });

    onMounted(async () => {
      await initGetContentPrint();
    });

    function addPrintClsToHtml() {
      const html = document.getElementsByTagName('html')[0];
      if(!html.classList.contains('print')) {
        html.classList.add(route.path.split('/')[1]);
      }
    }

    onBeforeRouteLeave(() => {
      document.getElementsByTagName('html')[0].classList.remove('print');
    })

    // BEGIN: TigerBui
    class TgPrint {
      constructor() {}
      removeZimbraBrand(_html) {
        // cứ có từ Zimbra là xoá
        const regex = /Zimbra/g;
        return _html.replace(regex, "");
      }
    }

    return {
      TgPrint,
      contentPrint
    }
  }
});
</script>

<style lang="scss">
  .inet-mail-themes {
    &.print {

      .body-overflow-hidden {
        overflow: auto;
        background: rgb(204,204,204);
        padding: 1cm 0;
      }

      section[size="A4"] {
        width: 21cm;
        min-height: 29.7cm;
        padding: 1.9cm;
        margin: 0 auto;
        background: white;
        overflow: hidden;
        table {
          width: 100% !important;
        }
      }

      @media print {
        body, html,
        section[size="A4"] {
          width: 21cm;
          height: 29.7cm;
          padding: 0;
          margin: 0;
          box-shadow: none;
        }

        section[size="A4"] {
          overflow: inherit;
        }

        @page {
          size: A4;
        }

        @page :blank {
          @top-center { content: "This page is intentionally left blank." }
        }

      }
    }
  }
</style>