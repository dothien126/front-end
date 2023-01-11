<template>
  <div class="py-5 md:py-0">
    <!--    <DarkModeSwitcher />-->
    <!--    <MainColorSwitcher />-->
<!--    <MobileMenu />-->
    <TopBar class="z-[2]"/>
    <div class="view-main-content bg-gray-300 dark:bg-black/75 overflow-hidden relative z-[1]">
      <!-- BEGIN: Content -->
      <div class="content">
        <router-view />
      </div>
      <!-- END: Content -->
    </div>
    <!--  BEGIN: MailContactMenuSideBar-->
    <mail-contact-menu-sidebar></mail-contact-menu-sidebar>
    <!--  END: MailContactMenuSideBar-->
    <back-to-top/>
  </div>
</template>

<script setup>
  import { computed, onMounted, provide, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { helper as $h } from '@/utils/helper';
  import { useSideMenuStore } from '@/stores/side-menu';
  import TopBar from '@/components/top-bar/Main.vue';
  import BackToTop from "@/components/back-to-top/Main.vue";
  import MailContactMenuSidebar from "@/views/contacts/MailContactMenuSidebar.vue";
  import { nestedMenu } from './index';
  import dom from '@left4code/tw-starter/dist/js/dom';

  const route = useRoute();
  const router = useRouter();
  const formattedMenu = ref([]);
  const sideMenuStore = useSideMenuStore();
  const sideMenu = computed(() => nestedMenu(sideMenuStore.menu, route));

  provide('forceActiveMenu', (pageName) => {
    route.forceActiveMenu = pageName;
    formattedMenu.value = $h.toRaw(sideMenu.value);
  });

  onMounted(() => {
    dom('body').removeClass('error-page').removeClass('login').addClass('main');
    formattedMenu.value = $h.toRaw(sideMenu.value);
  });
</script>

<style lang="scss">
  .inet-mail-themes {

  }
</style>