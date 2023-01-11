<template>
  <div :class="frameSize">
    <img :alt="alt" :src="logoDisplay" crossorigin="anonymous" :class="imgSize"/>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted} from "vue";
import {MyStore} from "@/stores/my-store";
import {useDarkModeStore} from "@/stores/dark-mode";
import {modeLogo} from "@/utils/MyVariables";

export default defineComponent({
  name: 'AdminLogoBrandView',
  props: {
    mode: {
      type: String
    },
    frameSize: {
      type: String,
      default: 'h-[40px] max-w-[135px]'
    },
    imgSize: {
      type: String
    },
    alt: {
      type: String
    }
  },
  setup(props) {
    const myStore = MyStore();
    const emitter = myStore.useEmitter();
    const darkModeStore = useDarkModeStore();
    const logoLightMode = computed(() => myStore.logoLightMode);
    const logoDarkMode = computed(() => myStore.logoDarkMode);
    const darkMode = computed(() => darkModeStore.darkMode);
    const mode = computed(() => props.mode);
    const logoDisplay = computed(() => {
      if(mode.value === modeLogo.darkMode){
        return logoDarkMode.value;
      }
      else if (mode.value === modeLogo.lightMode) {
        return logoLightMode.value;
      }
      else{
        const logo = darkMode.value ? logoDarkMode.value : logoLightMode.value;
        return logo;
      }
    })
    onMounted(() => {
      //Lang nghe su kien neu thay doi logo
      emitter.on('reload-upload-image-logo', () => {
        myStore.reloadLogo();
      });
    });

    onDeactivated(() => {
      emitter.off('reload-upload-image-logo');
    });

    return {
      logoDisplay
    }
  }
})
</script>