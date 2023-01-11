<template>
  <keep-alive>
    <component :is="loadComponent($route.path)"/>
  </keep-alive>
</template>

<script lang="ts">
import {defineAsyncComponent, defineComponent} from "vue";
import { regexNameComponentFromPathUrl } from '@/global-components/inet-custom/helper/RegexNameComponentFromPathUrl';
export default defineComponent({
  setup() {
    const loadComponent = (_urlPath) => {
      const name = new regexNameComponentFromPathUrl(_urlPath).formatName();
      return defineAsyncComponent(() => import(`./components/${name}.vue`));
    }
    return {
      loadComponent
    }
  }
})
</script>

<style lang="scss"></style>