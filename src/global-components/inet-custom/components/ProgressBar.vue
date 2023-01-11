<template>
  <div class="progress" :class="perClass">
    <div class="progress-bar max-w-full" :class="progressClassName(perProgress)" :style="{width: Math.floor(perProgress) === 0 ? 'auto' : Math.floor(perProgress) + '%'}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
      {{Math.floor(perProgress)}}%
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  export default defineComponent({
    name: 'ProgressBar',
    props: {
      perProgress: {
        type: Number,
        default: () => 0
      },
      perClass: {
        type: String,
        default: () => 'h-4'
      }
    },
    methods: {
      progressClassName(_perNumber) {
        const per = parseFloat(_perNumber);
        if(per > 1 && per < 50) {
          return 'bg-green-500';
        }
        else if(per > 50 && per < 80) {
          return 'bg-orange-500';
        }
        else if(per > 80 && per <= 100) {
          return 'bg-red-600';
        }
        else if(per > 100) {
          return 'bg-red-800'
        }
        return 'bg-slate-300 dark:bg-darkmode-300'
      },
    },
    setup() {
      return {}
    }
  })
</script>

<style lang="scss"></style>