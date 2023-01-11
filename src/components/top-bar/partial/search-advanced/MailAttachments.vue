<template>
  <div class="flex items-center flex-wrap -mx-1">
    <button class="btn m-1"
            v-for="(list, idx) in tgMailAttachment.fileList"
            :class="{'btn-secondary': !list.active, 'btn-primary': list.active }"
            @click="tgMailAttachment.fileSelected(list, idx)"
            >
      <template v-if="list.iconName">
        <i :icon-name="list.iconName" class="w-4 h-4 mr-2"></i>
      </template>
      <template v-else-if="list.svg && list.svg.name">
        <svg-icons :name="list.svg.name" class="w-4 h-4 mr-2"></svg-icons>
      </template>
      {{ locale[list.fileName] }}
    </button>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
  import { createIcons, icons } from "lucide";
import {MyStore} from "@/stores/my-store";

  export default defineComponent({
    name: 'MailAttachments',
    props: {
      searchAdvancedObj: {
        type: Object,
        require: true
      },
      searchAdvancedRoot: {
        type: Object
      }
    },
    emits: ['update:search-advanced-obj', 'update:search-advanced-root'],
    mounted() {
      createIcons( { icons , nameAttr: 'icon-name'} );
    },
    setup() {
      const myStore = MyStore();
      const emitter = myStore.useEmitter();
      const locale = computed(() => myStore.locale);
      const suffixFileList = [
        {
          fileName: 'adobePDF',
          iconName: '',
          svg: { name: 'pdf' },
          active: false,
          value: "application/pdf"
        },
        {
          fileName: 'application',
          iconName: 'file-text',
          svg: { name: '' },
          active: false,
          value: "application/*"
        },
        {
          fileName: 'image',
          iconName: 'image',
          svg: { name: '' },
          active: false,
          value: "image/*"
        },
        {
          fileName: 'mail',
          iconName: 'mail',
          svg: { name: '' },
          active: false,
          value: "message/rfc822"
        },
        {
          fileName: 'microsoftExcel',
          svg: {
            name: 'excel'
          },
          iconName: '',
          active: false,
          value: "excel"
        },
        {
          fileName: 'textDocument',
          iconName: 'file-text',
          svg: { name: '' },
          active: false,
          value: "text"
        },
      ];
      const selectFile = ref<any>([]);
      const tgMailAttachment = ref({
        fileList: suffixFileList,
        fileSelected: (_item: any, _idx: number) => {
          _item.active = !_item.active;
          const index = selectFile.value.indexOf(_idx);
          if(index === -1) {
            selectFile.value.push(_idx);
          } else {
            selectFile.value.splice(index, 1);
          }
          let query: string = 'attachment:' + _item.value, isRemove = _item.active;
          emitter.emit('init-value-filter-advanced', { value: query, type: 'attachment:', isRemove: !isRemove });
        }
      });
      return {
        locale,
        tgMailAttachment
      }
    }
  })
</script>

<style></style>