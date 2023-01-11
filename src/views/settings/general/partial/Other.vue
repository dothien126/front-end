<template>
  <div class="search-wrap">
    <div class="grid grid-cols-12 gap-4">
      <div class="min-w-[220px] col-span-12 sm:col-span-5 md:col-span-4">
        <h3 class="text-base">{{ locale.otherSettings }}</h3>
      </div>
      <div class="group-action col-span-12 sm:col-span-7 md:col-span-8">
        <div class="mb-3">
          <p class="mb-3"><b>{{ locale.selection }}:</b></p>
          <div class="form-check form-switch mb-3">
            <input id="frmO1" class="form-check-input" type="checkbox" v-model="myUser.displayCheckboxInSelectedItem"/>
            <label class="form-check-label" for="frmO1">{{ locale.displayCheckboxInList }}</label>
          </div>
        </div>
        <div class="mb-3">
          <p class="mb-3"><b>{{ locale.emailAddresses }}:</b></p>
          <div class="form-check form-switch">
            <input id="frmO2" class="form-check-input" type="checkbox" v-model="myUser.displayNameInEmailAddress" />
            <label class="form-check-label" for="frmO2">{{ locale.displayNameInPlaceOfEmailAddresses }}</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {MyStore} from "@/stores/my-store";
  export default defineComponent({
    name: "MailSetingGeneralOther",
    setup() {
      //init value
      const myStore = MyStore();
      const locale = computed(() => myStore.locale);
      const myUser = computed(() => myStore.myUser);
      return {
        locale,
        myUser,
      }
    }
  })
</script>

<style lang="scss"></style>