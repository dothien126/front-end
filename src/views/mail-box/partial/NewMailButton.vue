<template>
  <div ref="newMailwrap" class="new-mail block md:hidden fixed z-50">
    <button
        type="button"
        class="btn bg-violet-600 text-white w-full rounded-full"
        @click="createNewMail()"
    >
      <Edit3Icon class="w-4 h-4 mr-2 shrink-0"/>
      <span class="txt">{{ locale['newMessage'] }}</span>
    </button>
  </div>
</template>

<script>
import {computed, defineComponent, onMounted, ref} from "vue";
  import {MyStore} from "@/stores/my-store";
import {onBeforeRouteUpdate, onBeforeRouteLeave, useRoute} from 'vue-router';

  export default defineComponent({
    name: 'NewMailButton',
    data() {
      return {
        width: window.innerWidth
      }
    },
    mounted() {
      window.addEventListener('resize', this.windowResize);
      window.addEventListener('load', this.windowResize);
      this.initScroll();
    },
    unmounted() {
      window.removeEventListener('resize', this.windowResize);
      window.removeEventListener('load', this.windowResize);
      window.removeEventListener('scroll', this.scrollEvt);
    },
    methods: {
      windowResize() {
        this.width = window.innerWidth;
        this.showHide(this.router);
        this.initScroll();
      },
      initScroll() {
        if(this.width < 768) {
          this.addClassBody(this.width);
          window.addEventListener('scroll', this.scrollEvt);
        }
      },
      scrollEvt(evt) {
        const winY = Math.round(window.pageYOffset);
        if(winY > 200) {
          this.$refs.newMailwrap.classList.add('is-change');
        } else {
          this.$refs.newMailwrap.classList.remove('is-change');
        }
      },
      createNewMail() {
        this.$emit('newMail', 'ok');
      },
      addClassBody(_w) {
        const getBody = document.body;
        if(getBody) {
          if(_w < 768) {
            getBody.classList.add('mail-inbox')
          }
          else {
            getBody.classList.remove('mail-inbox')
          }
        }
      }
    },
    setup() {
      const myStore = MyStore();
      const locale = computed(() => myStore.locale);
      const newMailwrap = ref();
      const path = ['/mail-box?path=%2FInbox'];
      const router = useRoute();
      onBeforeRouteLeave((to, from) => {
        showHide(to);
      })
      onBeforeRouteUpdate(async (to, from) => {
        showHide(to);
      })
      const showHide = (to) => {
        if(path.includes(to.fullPath)) {
          newMailwrap.value.style.display = 'block';
        }
        else {
          newMailwrap.value.style.display = 'none';
        }
      }
      return {
        router,
        locale,
        newMailwrap,
        showHide
      }
    }
  })
</script>

<style lang="scss">
  @import "./src/assets/scss/mixin/_media-screen.scss";
  html.inet-mail-themes {
    @include mediaScreenWidth(max, md) {
      .new-mail {
        bottom: 4.3rem;
        right: .75rem;
        transition: bottom .16s linear 0s;
        .txt {
          transition: width .16s ease 0s;
          width: 52px;
          overflow: hidden;
          white-space: nowrap;
        }
        &.is-change {
          bottom: 6.3rem;
          .txt {
            width: 0;
          }
        }
      }
      .mail-inbox {
        padding-bottom: 54px;
        &.mail-box-detail {
          padding: 0;
          #app {
            > .py-5 {
              padding: 0;
            }
          }
          .inbox-conversation-detail {
            .accordion {
              &-group {
                height: calc(100vh - 112px);
                padding: 0 1.25rem
              }
            }
            .mail-content {
              table {
                width: 100% !important;
              }
            }
          }
        }
      }
    }
  }
</style>