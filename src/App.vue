<template>
  <logo-and-favicon/>
  <router-view />
</template>

<script lang="ts">
  // Xử lý responsive có scroll body hoặc không khi màn hình bé hơn 1024px
  import {defineComponent, ref} from "vue";
  import {MyStore} from "@/stores/my-store";
  import LogoAndFavicon from "@/components/top-bar/partial/LogoAndFavicon.vue";

  export default defineComponent({
    components: {LogoAndFavicon},
    methods: {
      removeLoadingScreen() {
        const ldScreen = document.getElementById('ld-pro-screen');
        if(ldScreen) {
          ldScreen.remove();
        }
      }
    },
    mounted() {
      this.removeLoadingScreen();
      window.addEventListener('resize', this.bodyShowHide);
      window.addEventListener('load', this.bodyShowHide);
      setTimeout(() => {
        this.bodyShowHide();
      }, 1000);
    },
    setup() {
      const myStore = MyStore();
      const emitter = myStore.useEmitter();

      const winW = ref<number>(0);
      const bodyShowHide = () => {
        winW.value = window.innerWidth;
        const ckBody = document.body;
        if(winW.value) {
          emitter.emit('window-size-md', winW.value < 769 ? true : '');
        }
        if(winW.value < 769) {
          if(ckBody.classList.contains('body-overflow-hidden')) {
            ckBody.classList.remove('body-overflow-hidden');
          }
        } else {
          window.scrollTo({top: 0, behavior: 'smooth'});
          ckBody.classList.add('body-overflow-hidden')
        }
      };

      return {
        bodyShowHide
      }
    }
  })
</script>