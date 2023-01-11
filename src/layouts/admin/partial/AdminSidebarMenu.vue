<template>
  <div class="ad-lsb-mn">
    <ul>
      <li v-for="list in listRouterAdmin">
        <router-link class="py-3 px-5 flex items-center" :to="'/admin/' + list.path">
          <i v-if="list.meta && list.meta.lucideIcon" :icon-name="list.meta.lucideIcon" class="w-4 h-4 mr-2 shrink-0"></i>
          {{ localeAdmin[list.name] }}
        </router-link>
        <ul v-if="list.children && list.children.length > 0">
          <li v-for="listC in list.children">
            <router-link class="py-3 px-5 flex items-center" :to="'/admin/' + list.path + '/' + listC.path">
              <i v-if="listC.meta && listC.meta.lucideIcon" :icon-name="listC.meta.lucideIcon" class="w-4 h-4 mr-2 shrink-0"></i>
              {{ localeAdmin[listC.name] }}
            </router-link>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed } from "vue";
  import { useRouter } from 'vue-router';
  import {ref} from "vue";
  import { createIcons, icons } from "lucide";
  import {MyStore} from "@/stores/my-store";

  export default defineComponent({
    name: 'AdminSidebarMenu',
    mounted() {
      createIcons({ icons, nameAttr: 'icon-name' });
    },
    setup() {
      const myStore = MyStore();
      const locale = computed(() => myStore.locale);
      const localeAdmin = computed(() => myStore.locale);
      const router = useRouter();
      const listRouterAdmin = ref<any>([]);
      const findAdmin = router.options.routes.find(item => item.path === '/admin');
      if(findAdmin && findAdmin.children) {
        findAdmin.children.forEach(item => listRouterAdmin.value.push(item));
      }
      function actionChangeLocale(locale: string, dismiss: any) {
        // change locale
        localStorage.setItem('localeZimbraWebMail', locale)
        myStore.setLocale();
        // hide dropdown
        dismiss()
      }
      return {
        locale,
        localeAdmin,
        listRouterAdmin,
        actionChangeLocale
      }
    }
  })
</script>

<style lang="scss">
  @import './src/assets/scss/_colors.scss';
  html.inet-mail-themes {
    &.dark {
      .admin {
        &-sb-root {
          box-shadow: none;
        }
      }
      .ad-lsb-mn {
        ul {
          li {
            > a {
              color: get-color(slate, 400);
              &:hover,
              &.link-router-active {
                color: get-color(slate, 300);
                background-color: rgba(get-color(primary), .3);
              }
              &.link-router-active {
                &:after {
                  border-color: transparent get-color(darkmode, 300) transparent transparent;
                }
                + ul {
                  background-color: #2d456a;
                  li {
                    &:first-child {
                      &:before {
                        border-color: rgba(get-color(primary), .3) transparent transparent;
                      }
                    }
                    > a {
                      &:hover,
                      &.link-router-active {
                        &:after {
                          border-color: rgba(white, .35);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .ad-lsb-mn {
      height: calc(100% - 51px);
      overflow-x: hidden;
      overflow-y: auto;
      ul {
        li {
          > a {
            transition: color .16s linear 0s;
            color: get-color(slate, 900);
            &:hover {
              background-color: get-color(slate, 100);
            }
            &.link-router-active {
              background-color: rgba(get-color(slate, 300), .75);
              position: relative;
              &:after {
                content: "";
                border-width: 22px 10px;
                border-style: solid;
                border-color: transparent get-color(slate, 100) transparent transparent;
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
              }
              + ul {
                margin-left: 1.65rem;
                background-color: get-color(slate, 200);
                position: static;
                opacity: 1;
                li {
                  &:first-child {
                    position: relative;
                    &:before {
                      content: "";
                      border-width: 20px 0 0 25px;
                      border-color: get-color(slate, 200) transparent transparent;
                      position: absolute;
                      left: -25px;
                      top: 0;
                    }
                  }
                  > a {
                    padding: .75rem .85rem;
                    position: relative;
                    &:after {
                      content: "";
                      border-width: 0 0 1px 0;
                      border-color: transparent;
                      height: 1px;
                      width: 9px;
                      right: inherit;
                      left: 0;
                      top: 50%;
                      margin-top: -1px;
                      position: absolute;
                    }
                    &:hover,
                    &.link-router-active {
                      background-color: transparent;
                      &:after {
                        border-color: get-color(slate, 600);
                      }
                    }
                  }
                }
              }
            }
          }
          > ul {
            opacity: 0;
            position: absolute;
            left: -100%;
            top: 0;
            transition: all .2s ease 0s;
          }
        }
      }
    }
  }
</style>