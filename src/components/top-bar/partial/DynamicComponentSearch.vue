<template>
  <component :is="dynamicComponent"/>
</template>
<script>
  import { defineAsyncComponent } from 'vue';
  export default {
    name: 'DynamicComponentSearch',
    props: {
      comName: {
        type: String,
        required: true,
      }
    },
    computed: {
      dynamicComponent() {
        const name = this.comName;
        return defineAsyncComponent(() => import(`./search-advanced/${name}.vue`));
      },
    },
  }
</script>
