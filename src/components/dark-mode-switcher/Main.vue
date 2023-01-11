<template>
  <!-- BEGIN: Dark Mode Switcher-->
    <Tippy tag="button" :content="locale.darkModeOrLightMode" class="rounded-full bg-light dark:bg-transparent dark:hover:bg-white/10 hover:bg-white/10 mr-4 intro-x p-6x" @click="switchMode">
        <CloudSunIcon v-if="!darkMode" size="21"/>
        <CloudMoonIcon v-else size="21"/>
    </Tippy>
  <!-- END: Dark Mode Switcher-->
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from 'vue';
  import { useDarkModeStore } from '@/stores/dark-mode';
  import dom from '@left4code/tw-starter/dist/js/dom';
  import {MyStore} from "@/stores/my-store";

export default defineComponent({
  name: "DarkModeSwitcher",
  setup(){
    const darkModeStore = useDarkModeStore();
    const darkMode = computed(() => darkModeStore.darkMode);
    const myStore = MyStore();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);

    const setDarkModeClass = () => {
      darkMode.value ? dom('html').addClass('dark') : dom('html').removeClass('dark');
    };

    const switchMode = () => {
      darkModeStore.setDarkMode(!darkMode.value);
      setDarkModeClass();
      emitter.emit('reload-upload-image-logo');
    };

    onMounted(() => {
      setDarkModeClass();
    });

    return {
      locale,
      darkMode,
      switchMode,
    }
  }
});
</script>

<style lang="scss">
    .btn-switcher-themes {
        border-color: rgba(white, .25);
        > svg {
            path {
                color: rgba(white, .65);
            }
        }
        &:hover {
            background-color: rgba(black, .75);
            border-color: rgba(white, 0);
        }
    }
    .dark {
        .btn-switcher-themes {
            &:hover {
                background-color: rgba(white, .15);
            }
        }
    }
</style>