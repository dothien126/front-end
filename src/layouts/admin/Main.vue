<template>
  <div class="admin-layout">
    <div class="flex flex-wrap max-h-screen">
      <div class="admin-sb-root bg-white dark:bg-slate-800"
           :class="{'w-[18rem] basis-72': !showHide, 'w-[4rem] basis-16': showHide}">
        <a href="/admin" class="admin-logo flex items-center py-2 px-5 min-h-[54px]">
          <iNETComponent name="AdminLogoBrandView" :alt="myCompany.title" frame-size="h-[35px] max-w-[57px] shrink-0"
                         img-size="h-full max-h-[35px]"/>
          <span class="ml-2 text-gray-600/70 dark:text-slate-500" v-if="!showHide">Admin</span>
        </a>
        <admin-sidebar-menu/>
      </div>

      <div class="admin-content bg-slate-100 dark:bg-light"
           :style="{flexBasis: !showHide ? 'calc(100% - 18rem)' : 'calc(100% - 4rem)', width: !showHide ? 'calc(100% - 18rem)' : 'calc(100% - 4rem)'}">
        <div class="flex items-center bg-white dark:text-white/50 dark:bg-[#1e293b] scroll-gray-400 overflow-y-hidden">
          <button type="button" class="btn btn-outline-secondary mx-2" @click="showHide = !showHide">
            <AlignRightIcon v-if="!showHide" class="w-4 h-4"/>
            <XIcon v-else class="w-4 h-4"/>
          </button>
          <div class="grow">
            <admin-navbar-menu/>
          </div>
        </div>
        <div class="p-5 scroll-gray-400 overflow-y-auto bg-light dark:bg-darkmode-300 dark:text-white/70"
             style="height: calc(100vh - 55px)">
          <iNETComponent name="Loading" :load-options="{name: 'perfor'}"/>
          <router-view/>
        </div>
      </div>
    </div>
  </div>
  <!-- BEGIN: Notification Toastify -->
  <NotificationToastify/>
  <!-- END: Notification Toastify -->
</template>

<script lang="ts">
import AdminSidebarMenu from "@/layouts/admin/partial/AdminSidebarMenu.vue";
import AdminNavbarMenu from "@/layouts/admin/partial/AdminNavbarMenu.vue";
import {computed, defineComponent, onMounted, ref} from "vue";
import DarkModeSwitcher from '@/components/dark-mode-switcher/Main.vue';
import {Company} from "@/model/Company";
import {MyStore} from "@/stores/my-store";
import {SeoTitleStore} from "@/stores/seo-title-store/seo-title-store";

export default defineComponent({
  components: {AdminSidebarMenu, AdminNavbarMenu, DarkModeSwitcher},
  setup() {
    const showHide = ref(false);
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const seoTitleStore = SeoTitleStore();
    const myCompany = computed(() => myStore.myCompany as Company);
    const emmiter = myStore.useEmitter();

    function checkWindowSize() {
      emmiter.on('window-size-md', (_vl) => {
        if (!showHide.value && _vl) {
          showHide.value = true;
        }
      })
    }

    onMounted(() => {
      checkWindowSize();
      //reload seo title
      seoTitleStore.initGetSeoTitle(locale.value.admin);
    })

    return {
      showHide,
      myCompany
    }
  }
});
</script>

<style lang="scss">
@import "@/assets/scss/colors";

html.inet-mail-themes {
  .admin-content {
    color: $black;
  }

  &.dark {
    .admin-content {
      .box {
        background-color: get-color(gray, 200);
      }

      .form-control,
      .form-select {
        &:not([class*=dark\:bg]) {
          background-color: white;
          color: get-color(gray, 700);
        }
      }

      .form-check {
        &:not(.form-switch) {
          .form-check-input {
            &[type=checkbox] {
              &:focus,
              &:checked,
              &:indeterminate {
                border-color: get-color(primary, dark);
                box-shadow: 0 0 0 3px rgba(black, .12);
              }

              &:indeterminate {
                background-color: blueviolet;
              }
            }

            &.check-all[type=checkbox] {
              &:checked {
                background-color: blueviolet;
              }
            }
          }
        }
      }

      .pagination {
        .page-item {
          &:hover,
          &.active {
            .page-link {
              box-shadow: 0 0 0 2px get-color(violet, 500);
              color: get-color(violet, 500);
              background-color: get-color(darkmode, 600);
            }
          }

          .page-link {
            height: 100%;
          }
        }
      }
    }
  }

  .w-\[4rem\] {
    .ad-lsb-mn {
      overflow: inherit;

      ul {
        li {
          position: relative;

          &:hover {
            z-index: 199;

            > ul {
              opacity: 1;
            }
          }

          > a {
            text-indent: -9999em;

            > svg {
              width: 1.35rem;
              height: 1.35rem;
            }

            &.link-router-active {
              + ul {
                margin-left: 10px;
                min-width: auto;
                box-shadow: none;

                li {
                  &:first-child {
                    &:before {
                      visibility: hidden;
                    }
                  }

                  > a {
                    text-indent: -9999em;

                    &.link-router-active {
                      &:hover {
                        text-indent: inherit;
                        white-space: nowrap;
                      }
                    }
                  }
                }
              }
            }
          }

          &:hover {
            .link-router-active {
              + ul {
                min-width: 120px;

                li {
                  > a {
                    text-indent: inherit;
                    white-space: nowrap;
                  }
                }
              }
            }
          }

          > ul {
            position: absolute;
            top: 0;
            left: 100%;
            min-width: 200px;
            opacity: 0;
            transition: opacity .16s linear 0s;
            z-index: -1;
            background-color: get-color(slate, 800);
            border-radius: 0 5px 5px 0;
            box-shadow: 3px 3px 0 0 rgba(black, .25);

            li {
              > a {
                text-indent: inherit;
              }
            }
          }
        }
      }
    }
  }
}
</style>