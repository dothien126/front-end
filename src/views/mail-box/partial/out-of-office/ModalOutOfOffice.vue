<template>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" :show="modalShow" @hidden="modalShow = false">
    <!-- BEGIN: Modal Header -->
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">{{ locale.alert }} {{ locale.OUTOFOFFICE }}</h2>
    </ModalHeader>
    <!-- END: Modal Header -->
    <ModalBody>
      <div class="form-group">
        <div class="mb-3">
          <p>{{ locale.alertOutOfOfficeIsOn }}</p>
        </div>
        <div class="mb-3 text-center">
          <input class="form-check-input" type="checkbox" id="do-not-re-mind-again" v-model="doNotRemindAgain"/>
          <label class="form-check-label" for="do-not-re-mind-again">{{ locale.doNotRemindMeAgain }}</label>
        </div>
        <div class="-mx-2 text-right">
          <button type="button" @click="modalShow = false" class="btn btn-secondary w-24 m-2">
            {{ locale.cancel }}
          </button>
          <button type="button" @click="actionSaveChange" class="btn btn-primary w-24 m-2">
            {{ locale.apply }}
          </button>
        </div>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Modal Content -->
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {User} from "@/model/User";
import {IPrefs, RequestNoResponse} from "@/model/RequestNoResponse";
import UserService from "@/service/UserService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";

export default defineComponent({
  name: 'ModalOutOfOffice',
  setup() {
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const myUser = computed(() => myStore.myUser as User);
    const modalShow = ref(myUser.value.zimbraPrefOutOfOfficeReplyEnabled);
    const doNotRemindAgain = ref(false); //khong tac dung - theo form zimbra

    async function actionSaveChange() {
      //init request
      const requestNoResponse = new RequestNoResponse();
      //init value active out of office
      const zimbraPrefOutOfOfficeReplyEnabled: IPrefs = {
        name: 'zimbraPrefOutOfOfficeReplyEnabled',
        value: 'FALSE'
      };
      //add value to list
      requestNoResponse.prefs.push(zimbraPrefOutOfOfficeReplyEnabled);
      //call request
      const response = await UserService.modifyPrefs(requestNoResponse, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        }
        else{
          //close modal
          modalShow.value = false;
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    onMounted(() => {

    });

    return {
      locale,
      modalShow,
      doNotRemindAgain,
      actionSaveChange,
    }
  }
})
</script>