<template>
  <div class="send-later">
    <div class="grid grid-cols-12 gap-4">
      <div class="min-w-[150px] col-span-12 sm:col-span-5 md:col-span-4">
        <h3 class="text-base">{{ locale.sendLater }}</h3>
      </div>
      <div class="group-action col-span-12 sm:col-span-7 md:col-span-8">
        <div class="form-group">
          <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" v-model="myUser.sendLater" />
            <label class="form-check-label">{{ locale.enabled }} {{ locale.sendLater }}</label>
          </div>
        </div>
        <div class="mb-5">
          <p class="mb-1.5">{{ locale.timeSendLater }}:</p>
          <div class="form-group">
            <input v-model="myUser.timeSendLater" :disabled="!myUser.sendLater"
                type="number" class="form-control mr-3" :placeholder="locale.enter + '...'"/>
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
  name: "SendLater",
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