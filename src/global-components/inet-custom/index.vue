<template>
  <keep-alive>
    <component :is="importComponent"/>
  </keep-alive>
</template>

<script lang="ts">
import {defineAsyncComponent, defineComponent} from "vue";
  export default defineComponent({
    props: {
      name: {
        type: String,
        required: true,
      }
    },
    computed: {
      importComponent() {
        const name = this.name;
        return defineAsyncComponent(() => import(`./components/${name}.vue`));
      }
    }
  });
</script>
