<template>
  <div class="receiving-message">
    <div class="grid grid-cols-12 gap-4">
      <div class="min-w-[150px] col-span-12 sm:col-span-5 md:col-span-4">
        <h3 class="text-base">{{ locale.receivingMessage }}</h3>
      </div>
      <div class="group-action col-span-12 sm:col-span-7 md:col-span-8">
        <div class="mb-5">
          <p class="mb-1.5">{{ locale.forwardCopyTo }}:</p>
          <div class="form-group">
            <input v-model="myUser.zimbraPrefMailForwardingAddress"
                type="text" class="form-control mr-3" :placeholder="locale.enter + ' ' + locale.emailAddresses + '...'"/>
          </div>
        </div>
        <div class="mb-5">
          <div class="form-check">
            <input class="form-check-input" type="checkbox" id="remove-local-copy-msg" v-model="myUser.zimbraPrefMailLocalDeliveryDisabled" />
            <label class="form-check-label" for="remove-local-copy-msg">{{ locale.removeLocalCopyMessage }}</label>
          </div>
        </div>
        <div class="mb-3">
          <p class="mb-1.5">{{ locale.sendNotificationTo }}:</p>
          <div class="form-group">
            <input v-model="myUser.zimbraPrefNewMailNotificationAddress"
                type="text" class="form-control mr-3" :placeholder="locale.enter + ' ' + locale.emailAddresses + '...'"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {MyStore} from "@/stores/my-store";
import {User} from "@/model/User";

export default defineComponent({
  name: "ReceivingMessage",
  setup(){
    //init value
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const myUser = computed(() => myStore.myUser as User);

    return {
      locale,
      myUser,
    }
  }
});
</script>

<style scoped>

</style>