import {defineStore} from "pinia";
import {MyStore} from "@/stores/my-store";
import {computed, ref} from "vue";
import {FolderStore} from "@/stores/folder-store/folder-store";
import {MyTagStore} from "@/stores/tag-store/tag-store";
import {Folder} from "@/model/Folder";
import {Tag} from "@/model/Tag";
import {useRoute} from "vue-router";

export const SeoTitleStore = defineStore('seoTitleStore', () => {
    //init value
    const myStore = MyStore();
    const folderStore = FolderStore();
    const tagStore = MyTagStore();
    const route = useRoute();
    const locale = computed(() => myStore.locale);
    const myUser = computed(() => myStore.myUser);
    const folderSelected = computed(() => folderStore.folderSelected as Folder);
    const tagSelected = computed(() => tagStore.tagSelected as Tag);
    const defaultSeoTitle = ref('OneMail - onemail.vn');

    function initGetSeoTitle(title?: string){
        let seoTitle: string;
        //Truong hop route dung param itemId ==> dang truy cap folder
        if(route && route.params && route.params.itemId && !title){
            const folderName = locale.value[folderSelected.value.label.toLowerCase()] ? locale.value[folderSelected.value.label.toLowerCase()] : folderSelected.value.label;
            const unreadCount = folderSelected.value.unreadCount > 0 ? ' (' + folderSelected.value.unreadCount + ')' : '';
            seoTitle = folderName + unreadCount + ' - ' + myUser.value.account + ' - ' + defaultSeoTitle.value;
        }
        //Truong hop route dung param tagName ==> dang truy cap tag
        else if(route && route.params && route.params.tagName && !title){
            const tagName = locale.value[tagSelected.value.name.toLowerCase()] ? locale.value[tagSelected.value.name.toLowerCase()] : tagSelected.value.name;
            seoTitle = tagName + ' - ' + myUser.value.account + ' - ' + defaultSeoTitle.value;
        }
        //Truong hop dang truy cap contacts
        else if(route && route.path.startsWith('/contacts') && !title){
            const pathName = locale.value.contact;
            seoTitle = pathName + ' - ' + myUser.value.account + ' - ' + defaultSeoTitle.value;
        }
        //Truong hop dang truy cap login
        else if(route && route.path.startsWith('/login') && !title){
            const pathName = locale.value.login;
            seoTitle = pathName + ' - ' + defaultSeoTitle.value;
        }
        else{
            const account = myUser.value.account ? myUser.value.account + ' - ': '';
            seoTitle = title ? title + ' - ' + account + defaultSeoTitle.value : defaultSeoTitle.value;
        }
        //hook vao DOM title tag
        document.title = seoTitle;
    }

    return {
        initGetSeoTitle,
    }
});