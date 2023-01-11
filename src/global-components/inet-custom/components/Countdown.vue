<template>

</template>

<script>
import {computed, defineComponent} from "vue";

export default defineComponent({
  name: "Countdown",
  props: {
    time: {
      type: String,
    }
  },
  setup(props){
    const time = computed(() => props.time);
  }
});
</script>

<style scoped>

</style>