<template></template>

<script lang="ts">
import {computed, defineComponent, onMounted} from "vue";
  import {onBeforeRouteUpdate, useRoute} from "vue-router";
  import {MyStore} from "@/stores/my-store";

  export default defineComponent({
    name: 'SeoTitleTabBrowser',
    props: {
      mailBoxSubject: {
        type: String
      }
    },
    setup(props) {
      const myStore = MyStore();
      const route = useRoute();
      const myUser = computed(() => myStore.myUser);
      const locale = computed(() => myStore.locale);
      const mailBoxSubject = computed(() => props.mailBoxSubject);
      class SEOTitle {
        SEOHead: any = {
          path: '',
          query: {}
        };
        docTitle = document.getElementsByTagName('title');
        subTgr = ' - ' + myUser.value.account + ' - OneMail - onemail.vn';
        mailInboxUnreadCount: string = ' (123) ';
        constructor(_obj: object) {
          this.SEOHead = _obj;
          if(this.SEOHead.path.indexOf('mail-box') !== -1) {
            this.changeTitleMailBox();
          }
          else {
            if(locale.value[this.SEOHead.name]) {
              this.docTitle[0].innerHTML = this.changeSEOName(this.SEOHead.name);
            }
            this.changeTitlePath(this.SEOHead.path);
          }
        }
        changeTitleMailBox() {
          if(this.SEOHead.mailboxdetail) {
            this.docTitle[0].innerHTML = this.SEOHead.mailboxdetail + this.subTgr;
          }
          else {
            // Trường hợp có name bên router/index.ts
            if(locale.value[this.SEOHead.name]) {
              this.docTitle[0].innerHTML = this.changeSEOName(this.SEOHead.name);
            }
            else if(this.SEOHead.query.tags) {
              this.docTitle[0].innerHTML = this.changeTitleWithTags();
            }
            else if(this.SEOHead.query.path) {
              this.docTitle[0].innerHTML = this.changeTitlePath(this.SEOHead.query.path);
            }
          }
        }
        changeSEOName(name: string) {
          return locale.value[name] + ' -' + this.mailInboxUnreadCount + this.subTgr;
        }
        changeTitleWithTags() {
          return `"${this.SEOHead.query.tags}" ${this.subTgr}`
        }
        changeTitlePath(path: string) {
          const replaceSlash = path.replace('/', '');
          return replaceSlash + this.mailInboxUnreadCount +  this.subTgr;
        }
      }

      onMounted(() => {
        new SEOTitle({path: route.path, query: route.query, name: route.name, mailboxdetail: mailBoxSubject.value});
      })

      // fetch the user information when params change
      onBeforeRouteUpdate((_to, _from, next) => {
        new SEOTitle({path: _to.path, query: _to.query, name: _to.name, mailboxdetail: mailBoxSubject.value });
        next();
      });
      return {}
    }
  })
</script>