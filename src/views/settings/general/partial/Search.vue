<template>
  <div class="search-wrap">
    <div class="grid grid-cols-12 gap-4">
      <div class="min-w-[220px] col-span-12 sm:col-span-5 md:col-span-4">
        <h3 class="text-base">{{ locale.search }}</h3>
      </div>
      <div class="group-action col-span-12 sm:col-span-7 md:col-span-8">
        <div class="mb-3">
          <p class="mb-3"><b>{{ locale.searchFolders }}:</b></p>
          <div class="form-group">
            <div class="form-check form-switch mb-3">
              <input id="sw1" class="form-check-input" type="checkbox" v-model="myUser.includeSpamFolderInSearch" />
              <label class="form-check-label" for="sw1">{{ locale.includeSpamFolderInSearch }}</label>
            </div>
            <div class="form-check form-switch mb-3">
              <input id="sw2" class="form-check-input" type="checkbox" v-model="myUser.includeTrashFolderInSearch" />
              <label class="form-check-label" for="sw2">{{ locale.includeTrashFolderInSearch }}</label>
            </div>
            <div class="form-check form-switch">
              <input id="sw3" class="form-check-input" type="checkbox" v-model="myUser.includeSharedFolderInSearch" />
              <label class="form-check-label" for="sw3">{{ locale.includeSharedFolderInSearch }}</label>
            </div>
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
    name: "MailSetingGeneralSearch",
    setup() {
      //init value
      const myStore = MyStore();
      const locale = computed(() => myStore.locale);
      const myUser = computed(() => myStore.myUser);
      return {
        myUser,
        locale,
      }
    }
  })
</script>

<style lang="scss"></style>