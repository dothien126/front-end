<template>
  <component :is="dynamicComponent"/>
</template>
<script>
  import { defineAsyncComponent } from 'vue';

  export default {
    name: 'SvgIcons',
    props: {
      name: {
        type: String,
        required: true,
      }
    },
    computed: {
      dynamicComponent() {
        const name = this.name;
        return defineAsyncComponent(() => import(`./icons/${name}.vue`));
      },
    },
  }
</script>
