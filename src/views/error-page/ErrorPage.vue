<template>
  <div>
    <DarkModeSwitcher />
    <div class="container">
      <!-- BEGIN: Error Page -->
      <div
        class="error-page flex flex-col lg:flex-row items-center justify-center h-screen text-center lg:text-left"
      >
        <div class="-intro-x lg:mr-20">
          <img
            alt="Midone Tailwind HTML Admin Template"
            class="h-48 lg:h-auto"
            src="@/assets/images/error-illustration.svg"
          />
        </div>
        <div class="text-white mt-10 lg:mt-0">
          <div class="intro-x text-8xl font-medium">404</div>
          <div class="intro-x text-xl lg:text-3xl font-medium mt-5">
           {{locale.thisPageHasGoneMissing}}
          </div>
          <div class="intro-x text-lg mt-3">
            {{locale.errorAddress}}
          </div>
          <a href="/" class="intro-x btn py-3 px-4 text-white border-white dark:border-darkmode-400 dark:text-slate-200 mt-10"
          >
            {{locale.backHome}}
          </a>
        </div>
      </div>
      <!-- END: Error Page -->
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from 'vue';
  import DarkModeSwitcher from '@/components/dark-mode-switcher/Main.vue';
  import dom from '@left4code/tw-starter/dist/js/dom';
import {MyStore} from "@/stores/my-store";

  export default defineComponent({
    name: 'ErrorPage',
    components: { DarkModeSwitcher },
    setup() {
      const myStore = MyStore();
      const locale = computed(() => myStore.locale);
      onMounted(() => {
        dom('body').removeClass('main').removeClass('login').addClass('error-page');
      });

      return {
        locale
      };
    },
  });
</script>
