<template>
  <button :title="locale.closeAndOpenMenu" type="button"
          class="btn bg-light dark:bg-transparent dark:hover:bg-white/10 hover:bg-white/10 ml-auto rounded-full p-2"
          @click="changeToggle">
    <AlignRightIcon v-if="toggle" size="19"/>
    <AlignCenterIcon v-else size="19"/>
  </button>
</template>

<script lang="ts">
import {computed, defineComponent } from "vue";
import { sidebarMenuToggle } from "@/views/mail-box/partial/SidebarMenuToggle";
import {MyStore} from '@/stores/my-store';
export default defineComponent({
  name: "ToggleMailBoxMenu",
  setup() {
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    return {
      locale,
    }
  },
  data() {
    return {
      toggle: localStorage.getItem("mailboxMenu") || true
    }
  },
  mounted() {
    new sidebarMenuToggle();
  },
  methods: {
    changeToggle() {
      new sidebarMenuToggle().toggleMenu();
    }
  }
})
</script>

<style lang="scss">
@import "./src/assets/scss/mixin/media-screen";

</style>