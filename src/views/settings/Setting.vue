<template>
  <div class="md:mt-5 mail-setting-root">
    <div class="grid gap-0 grid-cols-12">
      <div class="col-span-12 md:col-span-3">
        <h3 class="text-base px-4 py-3 bg-light dark:bg-gray-500/20 rounded-tl">{{ locale.settings }}</h3>
        <div
            class="mail-mn-cog rounded-bl border-t border-gray-20 dark:border-gray-500/30 p-3 dark:bg-gray-500/20 bg-light">
          <div class="intro-y" v-for="(menu, index) in demoMenuSbltd">
            <router-link class="dark:hover:bg-gray-500/20 py-3 px-4 flex items-center transition-colors rounded-full"
                         :to="menu.url">
              <i :icon-name="menu.iconName" class="text-slate-600 dark:text-slate-300/50 w-4 h-4 mr-1.5 shrink-0"></i>
              {{ menu.title }}
            </router-link>
          </div>
        </div>
      </div>
      <div class="setting-content-child bg-white dark:bg-gray-500/50 col-span-12 md:col-span-9 rounded-r">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {createIcons, icons} from "lucide";
import {MyStore} from "@/stores/my-store";
import {SeoTitleStore} from "@/stores/seo-title-store/seo-title-store";

export default defineComponent({
  name: 'MailSetting',
  mounted() {
    createIcons({icons});
    this.addClsToBody();
  },
  beforeUnmount() {
    this.removeClsBody();
  },
  methods: {
    addClsToBody() {
      const urlPath = this.$route.path;
      const regexUrl = /^['\/mail\-box/setting']/;
      if (regexUrl.test(urlPath)) {
        document.body.classList.add('mail-setting');
      }
    },
    removeClsBody() {
      const ck = document.body.classList.contains('mail-setting');
      if (ck) {
        document.body.classList.remove('mail-setting');
      }
    }
  },
  setup() {
    const myStore = MyStore();
    const seoTitleStore = SeoTitleStore();
    const locale = computed(() => myStore.locale);
    const demoMenuSbltd = ref([
      {
        title: computed(() => locale.value.settings),
        url: '/mail-box/setting/general',
        iconName: "settings"
      },
      {
        title: computed(() => locale.value.account),
        url: '/mail-box/setting/account',
        iconName: "user"
      },
      {
        title: computed(() => locale.value.mail),
        url: "/mail-box/setting/mail",
        iconName: "mails"
      },
      /*{
        title: "Bộ lọc",
        url: "/mail/setting/filters"
      },*/
      {
        title: computed(() => locale.value.signatures),
        url: "/mail-box/setting/signatures",
        iconName: "edit-3"
      },
      {
        title: computed(() => locale.value.OUTOFOFFICE),
        url: "/mail-box/setting/out-of-office",
        iconName: "user-x"
      },
      /*{
        title: "Danh bạ",
        url: "/mail/setting/contacts"
      },
      {
        title: "Thông báo",
        url: "/mail/setting/notifications"
      },
      {
        title: "Bàn phím nhanh",
        url: "/mail/setting/keyboard-shortcuts"
      }*/
      {
        title: computed(() => locale.value.filter),
        url: "/mail-box/setting/filters",
        iconName: "filter"
      }
    ]);

    onMounted(() => {
      //reload seo title
      seoTitleStore.initGetSeoTitle(locale.value.preferences);
    });

    return {
      locale,
      demoMenuSbltd
    }
  }
})
</script>

<style lang="scss">
@import "@/assets/scss/mixin/_media-screen.scss";

html.inet-mail-themes {
  .mail-setting {
    .view-main-content {
      > .content {
        background-color: transparent;
        border-radius: 0;
      }
    }

    &-root {
      .setting-gr-item {
        $mt: 1.25rem;
        overflow-y: auto;
        overflow-x: hidden;
        @include mediaScreenWidth(min, md) {
          max-height: calc(100vh - 216px);
        }
        @include mediaScreenWidth(min, lg) {
          max-height: calc(100vh - (147px + #{$mt}));
        }
      }

      @include mediaScreenWidth(min, md) {
        height: calc(100vh - 101px);
      }
    }
  }

  .link-router-active {
    background-color: rgba(black, .08);

    &:hover {
      cursor: default;
      @extend .link-router-active;
    }
  }

  &.dark {
    .link-router-active,
    .link-router-active:hover {
      background-color: rgba(black, .2);
    }
  }

  .mail-mn-cog {
    $mt: 1.25rem;
    @include mediaScreenWidth(min, md) {
      height: calc(100vh - 204px);
      overflow-y: auto;
      overflow-x: hidden;
    }
    @include mediaScreenWidth(min, lg) {
      height: calc(100vh - (135px + #{$mt}));
    }
    @include mediaScreenWidth(max, md) {
      display: flex;
      flex-flow: row nowrap;
      overflow-x: auto;
      overflow-y: hidden;
      > .intro-y {
        flex-shrink: 0;
      }
    }
  }
}
</style>