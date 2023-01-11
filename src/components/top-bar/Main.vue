<template>
  <!-- BEGIN: TigerBui` - Top Bar -->
  <div
      class="top-bar-boxed md:px-5 md:py-3 z-[100] relative"
  >
<!--    BEGIN: Mobile-->
    <div class="mobile-top-bar bg-gray-200 dark:bg-darkmode-900 md:hidden">
      <div class="flex items-center">
        <a href="/" class="mr-3 h-[32px] shrink-0">
          <iNETComponent name="AdminLogoBrandView" :alt="myCompany.title" frame-size="h-[35px] min-w-[30px] max-w-[57px]" img-size="h-full max-h-[35px]" :class="{'logo-dark': darkMode, 'logo-light': !darkMode}"/>
        </a>
        <ToggleMailBoxMenu />
        <div class="find-group grow px-5">
          <top-bar-search v-if="isMobile" />
        </div>
        <div class="flex items-center">
          <DarkModeSwitcher/>
          <Dropdown class="intro-x">
            <DropdownToggle
                tag="div"
                role="button"
                class="w-10 h-10"
            >
              <inet-avatar avt-class="w-10 h-10" :avt-json="myUser" key-str="account"/>
            </DropdownToggle>
            <DropdownMenu class="min-w-[12rem]">
              <DropdownContent
                  class="bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white"
              >
                <DropdownHeader tag="div" class="!font-normal">
                  <div class="font-medium">
                    {{ myUser.account }}
                  </div>
                  <div class="text-xs text-white/60 mt-0.5 dark:text-slate-500">
                    {{ myUser.fullName }}
                  </div>
                </DropdownHeader>
                <DropdownDivider class="border-white/[0.08]"/>
                <DropdownItem class="dropdown-item hover:bg-white/5" @click="$router.push('/mail-box/setting/general')">
                  <UserIcon class="w-4 h-4 mr-2"/>
                  {{ locale.settings }}
                </DropdownItem>
                <DropdownItem class="dropdown-item hover:bg-white/5" @click="$router.push('/mail-box/setting/general')">
                  <UnlockIcon class="w-4 h-4 mr-2"/>
                  {{ locale.changePassword }}
                </DropdownItem>
                <DropdownDivider class="border-white/[0.08]"/>
                <DropdownItem @click="logout" class="dropdown-item hover:bg-white/5">
                  <ToggleRightIcon class="w-4 h-4 mr-2"/>
                  {{ locale.logout }}
                </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
<!--    END: Mobile-->
    <div class="hidden md:grid md:grid-cols-12 md:gap-3">
      <div class="col-span-12 lg:col-span-3 2xl:col-span-2">
        <div class="flex">
          <!-- BEGIN: Logo -->
          <div class="flex grow">
            <a href="/" class="-intro-x">
              <iNETComponent name="AdminLogoBrandView" frame-size="h-[35px] max-w-[125px]" img-size="h-full max-h-[35px]" :alt="myCompany.title" :class="{'logo-dark': darkMode, 'logo-light': !darkMode}"/>
<!--              <span :title="myCompany.domain" class="text-gray-900 dark:text-gray-200 text-lg ml-3 truncate"> {{ myCompany.domain }}</span>-->
            </a>
          </div>
          <!-- END: Logo -->
          <div v-if="!regexPathContacts($route.path)"><ToggleMailBoxMenu/></div>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-9 2xl:col-span-10">
        <div class="flex items-center">
          <!-- BEGIN: Search -->
          <div class="intro-x relative md:min-w-[45vw] xl:min-w-[35vw] mr-5">
            <TopBarSearch v-if="!isMobile" />
          </div>
          <!-- END: Search -->
          <DarkModeSwitcher/>
          <div class="flex intro-x items-center relative ml-auto mr-3">
            <Dropdown v-slot="{ dismiss }">
              <DropdownToggle class="btn bg-light dark:bg-black/30">
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
          <!-- BEGIN: Account Menu -->
          <Dropdown class="intro-x">
            <DropdownToggle
                tag="div"
                role="button"
                class="flex items-center"
            >
              <inet-avatar avt-class="w-10 h-10 shrink-0" :avt-json="myUser" key-str="account"/>
            </DropdownToggle>
            <DropdownMenu class="min-w-[13rem]">
              <DropdownContent>
                <DropdownHeader tag="div" class="!font-normal">
                  <div class="font-medium">
                    {{ myUser.account }}
                  </div>
                  <div class="text-xs text-white/60 mt-0.5 dark:text-slate-500">
                    {{ myUser.fullName }}
                  </div>
                </DropdownHeader>
                <DropdownDivider class="border-white/[0.08]"/>
                <DropdownItem class="dropdown-item hover:bg-white/5" @click="settingChangePassword">
                  <UserIcon class="w-4 h-4 mr-2"/>
                  {{ locale.settings }}
                </DropdownItem>
                <DropdownItem class="dropdown-item hover:bg-white/5" @click="settingChangePassword">
                  <LockIcon class="w-4 h-4 mr-2"/>
                  {{ locale.changePassword }}
                </DropdownItem>
                <DropdownDivider class="border-white/[0.08]"/>
                <DropdownItem @click="logout" class="dropdown-item hover:bg-white/5">
                  <ToggleRightIcon class="w-4 h-4 mr-2"/>
                  {{ locale.logout }}
                </DropdownItem>
              </DropdownContent>
            </DropdownMenu>
          </Dropdown>
          <!-- END: Account Menu -->
        </div>
<!--        &lt;!&ndash; BEGIN: Notification Toggle &ndash;&gt;-->
<!--        <NotificationMessageGlobal/>-->
<!--        &lt;!&ndash; END: Notification Toggle &ndash;&gt;-->
        <!-- BEGIN: Notification Toastify -->
        <NotificationToastify />
        <!-- END: Notification Toastify -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue';
import {MyStore} from '@/stores/my-store';
import DarkModeSwitcher from '@/components/dark-mode-switcher/Main.vue';
import ToggleMailBoxMenu from '@/components/toggle-mail-box-menu/Main.vue';
import TopBarSearch from "@/components/top-bar/partial/TopBarSearch.vue";
import iNETmailLogo from '@/assets/images/mail-iNET-logo-circle.svg';
import {Company} from "@/model/Company";
import {useRouter} from "vue-router";
import {useDarkModeStore} from "@/stores/dark-mode";
import InetAvatar from "@/global-components/inet-custom/components/Avatar.vue";
import SeoTitleTabBrowser from "@/global-components/inet-custom/components/SeoTitleTabBrowser.vue";

export default defineComponent({
  name: 'TopBar',
  components: {
    SeoTitleTabBrowser,
    TopBarSearch,
    DarkModeSwitcher,
    ToggleMailBoxMenu,
    InetAvatar
  },
  props: {
    class: {
      type: String
    }
  },
  mounted() {
    this.getDimensions();
    window.addEventListener('resize', this.getDimensions);
  },
  unmounted() {
    window.removeEventListener('resize', this.getDimensions);
  },
  methods: {
    regexPathContacts(_path: string) {
      const regex = /^\/contacts/;
      return regex.test(_path);
    }
  },
  setup() {
    //init value
    const myStore = MyStore();
    const route = useRouter();
    const darkModeStore = useDarkModeStore();
    const darkMode = computed(() => darkModeStore.darkMode);
    const locale = computed(() => myStore.locale);
    const myUser = computed(() => myStore.myUser);
    const myCompany = computed(() => myStore.myCompany as Company);
    const searchDropdown = ref(false);

    const showSearchDropdown = () => {
      searchDropdown.value = true;
    };

    const hideSearchDropdown = () => {
      searchDropdown.value = false;
    };

    function actionChangeLocale(locale: string, dismiss: any) {
      //change locale
      localStorage.setItem('localeZimbraWebmail', locale);
      myStore.setLocale();
      //hide dropdown
      dismiss();
    }

    const settingChangePassword = async () => {
      await route.push('/mail-box/setting/general');
      console.log('111 - đây là ghi chú')
    }

    async function logout() {
      myStore.deleteCookie();
      await route.push('/login');
    }

    const isMobile = ref(false);
    const getDimensions = () => {
      window.innerWidth > 768 ? isMobile.value = false : isMobile.value = true;
    }

    return {
      locale,
      darkMode,
      myCompany,
      searchDropdown,
      myUser,
      isMobile,
      logout,
      getDimensions,
      showSearchDropdown,
      hideSearchDropdown,
      actionChangeLocale,
      iNETmailLogo,
      settingChangePassword
    };
  },
});
</script>

<style lang="scss">
@import './src/assets/scss/mixin/media-screen';
@import './src/assets/scss/_colors.scss';
html.inet-mail-themes {
  .top-bar-boxed {
    &:after,
    &:before {
      visibility: hidden;
    }
  }
  @include mediaScreenWidth(max, md) {
    #mail-box-toggle {
      .menu-control {
        position: fixed;
        top: 0;
        left: 0;
        right: 7rem;
        bottom: 0;
        z-index: 1060;
        background-color: white;
        max-height: 100vh;
        overflow-y: auto;
        overflow-x: hidden;
        > .intro-y {
          height: 100%;
        }
      }
    }
  }
  &.dark {
    @media screen and (max-width: 768px){
      #mail-box-toggle {
        .menu-control {
          background-color: get-color(slate, 800);
        }
      }
    }
  }
}
</style>
