<template></template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted} from "vue";
// import {FolderStore} from "@/stores/folder-store/folder-store";
import {useDarkModeStore} from "@/stores/dark-mode";
import {MyStore} from "@/stores/my-store";

export default defineComponent({
  name: "LogoAndFavicon",
  props: {
    routerPath: {
      type: String
    }
  },
  setup(_props){
    const myStore = MyStore();
    const emitter = myStore.useEmitter();
    // const folderStore = FolderStore();
    const darkModeStore = useDarkModeStore();
    const darkMode = computed(() => darkModeStore.darkMode);
    const logoLightMode = computed(() => myStore.logoLightMode);
    const logoDarkMode = computed(() => myStore.logoDarkMode);
    // const unreadCount = computed(() => folderStore.unreadCountInbox);
    const logoChange = computed(() => {
      if(darkMode.value){
        return logoDarkMode.value;
      }
      return logoLightMode.value;
    });

    // const currentPath = computed(() => props.routerPath);

    class faviconSite {
      imgurl: string = '';
      canvasSize: number = 16;
      constructor(_imageurl: string) {
        this.imgurl = _imageurl;
        this.changeLinkIcon();
      }
      toDataURL(_src, callback) {
        // const _seft = this;
        const canvas = document.createElement('canvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = this.canvasSize;
        canvas.height = this.canvasSize;
        const d = new Date();
        let img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const imgScale = parseFloat((img.width/img.height).toFixed(2));
          imgScale == 1 ? context.drawImage(img, 0, 0, this.canvasSize, this.canvasSize) : context.drawImage(img,0, 0, this.canvasSize, this.canvasSize/imgScale);
          // TODO: Tạm ẩn do số nhìn mờ "Theo report của Mr.Đạt (28/12/2022 4:55 PM telegram)"
          /*if(!currentPath.value ||
              (currentPath.value && currentPath.value.indexOf('/admin') == -1 && currentPath.value.indexOf('/login') == -1)) {
            unreadCount.value >= 10 ? this.DrawDozens(context, '9+') : this.DrawUnit(context, unreadCount.value);
          }*/
          const dataUrl = canvas.toDataURL('image/jpeg');
          callback(dataUrl);
        }
        img.src = _src + '?v=' + d[Symbol.toPrimitive]('number');
      }
      DrawDozens(ctx, text_title) {
        ctx.beginPath();
        ctx.rect(4, 6, this.canvasSize, this.canvasSize);
        ctx.fillStyle = "#dc2626";
        ctx.fill();
        ctx.closePath();
        ctx.font='normal normal 200 9px monospace';
        ctx.fillStyle = "white";
        ctx.fillText(text_title, 5.3, 14);
      }
      DrawUnit(ctx, text_title) {
        ctx.beginPath();
        ctx.rect(7, 6, this.canvasSize, this.canvasSize);
        ctx.fillStyle = "#dc2626";
        ctx.fill();
        ctx.closePath();
        ctx.font='normal normal 200 9px monospace';
        ctx.fillStyle = "white";
        ctx.fillText(text_title, 9, 14);
      }
      changeLinkIcon() {
        this.toDataURL(this.imgurl, (_base) => {
          if(!_base) return console.warn(_base);
          let link = document.querySelectorAll("link[rel~='icon']") as any;
          if (link.length > 0) {
            link.forEach(item => {
              item.setAttribute('crossorigin', '');
              item.href = _base;
            });
          } else {
            link = document.createElement('link');
            link.rel = 'icon';
            link.href = _base;
            link.setAttribute('crossorigin', '');
            document.getElementsByTagName('head')[0].appendChild(link);
          }
        });
      }
    }

    onMounted(() => {
      new faviconSite(logoChange.value);
      emitter.on('reload-upload-image-logo', () => {
        myStore.reloadLogo();
        new faviconSite(logoChange.value);
      });
    });
    onDeactivated(() => {
      emitter.off('reload-upload-image-logo');
    });

    return{

    }
  }
})
</script>

<style scoped>

</style>