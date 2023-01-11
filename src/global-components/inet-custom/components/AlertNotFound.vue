<template>
  <div class="alert-not-found flex justify-center items-center flex-col">
    <svg-icons name="notfound" class="w-28 h-28"/>
    <span class="text-base text-slate-600 dark:text-white/40" v-html="message"></span>
  </div>
</template>

<script lang="ts">
  import {defineComponent} from "vue";
  export default defineComponent({
    name: 'AlertNotFound',
    props: {
      message: {
        type: String,
        default: 'Rất tiếc! Chúng tôi không tìm thấy yêu cầu của bạn!'
      }
    },
    setup() {
      return {}
    }
  })
</script>

<style lang="scss"></style>