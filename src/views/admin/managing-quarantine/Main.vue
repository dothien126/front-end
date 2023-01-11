<template>
  <SpamVirusQuarantine />
</template>

<script lang="ts">
import {defineComponent} from "vue";
import SpamVirusQuarantine from "@/views/admin/managing-quarantine/components/AdminManagingQuarantineSpamVirus.vue";
export default defineComponent({
  name: "MainQuarantine",
  components: {SpamVirusQuarantine},
  setup() {
    return {
      SpamVirusQuarantine,
    }
  }
})
</script>
