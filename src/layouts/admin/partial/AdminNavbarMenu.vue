<template>
  <nav class="admin-navbar-menu flex items-center py-2 px-3">
    <h1 v-if="$route.name" class="text-xl shrink-0 mr-2">{{locale[$route.name]}}</h1>
    <div class="grow">
      <div class="flex items-center justify-end">
<!--        <div class="min-w-[220px] max-w-sm relative">-->
<!--          <input class="form-control form-control-sm shadow-none border border-slate-300 dark:border-slate-300 dark:bg-white dark:text-slate-700 pr-11" type="search" :placeholder="'Tìm trong ' + $route.name.toLowerCase() + '...'"/>-->
<!--          <button class="btn absolute inset-y-0 right-0">-->
<!--            <SearchIcon class="w-4 h-4"/>-->
<!--          </button>-->
<!--        </div>-->
        <div class="flex intro-x items-center relative ml-auto mr-3">
          <Dropdown v-slot="{ dismiss }">
            <DropdownToggle class="btn btn-secondary">
              {{ locale['changeLocale'] }}
              <ChevronDownIcon class="w-4 h-4"/>
            </DropdownToggle>
            <DropdownMenu class="w-40">
              <DropdownContent>
                <DropdownItem @click="actionChangeLocale('en', dismiss)">English</DropdownItem>
                <DropdownItem @click="actionChangeLocale('vn', dismiss)">Tiếng Việt</DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div class="nav-main flex items-center">
          <DarkModeSwitcher class="mr-2"/>
          <Tippy tag="a" content="iNET Help" href="https://helpdesk.inet.vn" target="_blank" class="p-2 mr-2">
            <HelpCircleIcon class="w-4 h-4"/>
          </Tippy>
          <!-- <Tippy tag="a" content="iNET notification" href="/" class="p-2 mr-2">
            <BellIcon class="w-4 h-4"/>
          </Tippy> -->
          <!-- <Tippy tag="a" content="iNET mail home" href="/" class="p-2 mr-2">
            <HomeIcon class="w-4 h-4"/>
          </Tippy> -->
          <Dropdown class="intro-x w-8 h-8">
            <DropdownToggle>
              <inet-avatar avt-class="w-8 h-8" :avt-json="myAdminCompanyUser" key-str="adminEmail"/>
            </DropdownToggle>
            <DropdownMenu class="min-w-[13rem]">
              <DropdownContent
                  class="bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white"
              >
                <DropdownHeader tag="div" class="!font-normal">
                  <div class="font-medium">
                    {{ myAdminCompanyUser.adminEmail }}
                  </div>
                  <div class="text-xs text-white/60 mt-0.5 dark:text-slate-500">
                    {{ myAdminCompanyUser.adminName }}
                  </div>
                </DropdownHeader>
                <DropdownDivider class="border-white/[0.08]"/>
                <DropdownItem class="dropdown-item hover:bg-white/5" @click="actionShowModalChangePassword">
                  <UnlockIcon class="w-4 h-4 mr-2"/>
                  {{ locale.changePassword }}
                </DropdownItem>
                <DropdownDivider class="border-white/[0.08]"/>
                <DropdownItem @click="actionLogout" class="dropdown-item hover:bg-white/5">
                  <ToggleRightIcon class="w-4 h-4 mr-2"/>
                  {{ locale.logout }}
                </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  </nav>
  <iNETComponent name="AdminModalChangePassword" />
  <logo-and-favicon :router-path="$route.path"/>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
  import {MyAdminStore} from "@/stores/admin-store/admin-store";
  import {MyStore} from "@/stores/my-store";
  import InetAvatar from "@/global-components/inet-custom/components/Avatar.vue";
  import DarkModeSwitcher from '@/components/dark-mode-switcher/Main.vue';
  import LogoAndFavicon from "@/components/top-bar/partial/LogoAndFavicon.vue";

  export default defineComponent({
    name: "AdminNavbarMenu",
    components: {InetAvatar, DarkModeSwitcher, LogoAndFavicon},
    setup() {
      const myStore = MyStore();
      const locale = computed(() => myStore.locale);
      //init value
      const adminStore = MyAdminStore();
      const emitter = myStore.useEmitter();
      const myAdminCompanyUser = computed(() => adminStore.myAdminCompanyUser);

      function actionChangeLocale(locale: string, dismiss: any) {
        //change locale
        localStorage.setItem('localeZimbraWebmail', locale);
        myStore.setLocale();
        //hide dropdown
        dismiss();
      }

      function actionLogout(){
        adminStore.deleteAdminCookie();
        window.location.href = '/admin/login';
      }

      function actionShowModalChangePassword(){
        emitter.emit('change-password-admin-user');
      }
      return {
        locale,
        myAdminCompanyUser,
        actionShowModalChangePassword,
        actionLogout,
        actionChangeLocale,
      }
    }
  })
</script>
<style lang="scss"></style>