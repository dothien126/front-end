<template>
  <div class="sent-message">
    <div class="grid grid-cols-12 gap-4">
      <div class="min-w-[150px] col-span-12 md:col-span-5 lg:col-span-4">
        <h3 class="text-base">{{ locale.settingForSendMessage }}</h3>
      </div>
      <div class="group-action col-span-12 md:col-span-7 lg:col-span-8">
        <div class="mb-5">
          <p class="mb-3 flex items-center">
            <b>{{ locale.from }}:</b>
            <Tippy tag="span" class="ml-2" :content="locale.chooseAppearFromFieldOfEmailMessage">
              <HelpCircleIcon class="w-4 h-4"/>
            </Tippy>
          </p>
          <div class="grid grid-cols-2 gap-6">
            <div class="col-span-2 lg:col-span-1">
              <input v-model="myUser.zimbraPrefFromDisplay"
                     type="text" class="form-control mr-3" :placeholder="locale.enter + ' ' + locale.preferences + '...'"/>
            </div>
            <div class="col-span-2 lg:col-span-1">
              <select class="form-select"
                      v-model="myUser.account">
                <option :value="myUser.account">
                  {{ myUser.account }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="mb-5">
          <div class="mb-3">
<!--            <div class="form-check">
              <b>{{ locale.replyTo }}:</b>
            </div>-->
            <div class="form-check">
              <input class="form-check-input" id="pref-reply" type="checkbox" v-model="myUser.zimbraPrefReplyToEnabled"/>
              <label class="form-check-label" for="pref-reply">
                {{ locale.setReplyToFieldOfEmailMessage }}
              </label>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-6" v-if="myUser.zimbraPrefReplyToEnabled">
            <div class="col-span-2 md:col-span-1">
              <input v-model="myUser.zimbraPrefReplyToDisplay"
                     type="text" class="form-control mr-3" :placeholder="locale.enter + ' ' + locale.preferences + '...'"/>
            </div>
            <div class="col-span-2 md:col-span-1">
              <select class="form-select"
                      v-model="myUser.account">
                <option :value="myUser.account">
                  {{ myUser.account }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class="mt-3">
          <h4 class="font-medium mb-1">{{ locale.signatures }}</h4>
          <button class="text-blue-400" @click="$router.push('/mail/setting/signatures')">{{locale.manageYourSignature}}...</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {MyStore} from "@/stores/my-store";
import { User } from "@/model/User";

export default defineComponent({
  name: "SentMessage",
  setup() {
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