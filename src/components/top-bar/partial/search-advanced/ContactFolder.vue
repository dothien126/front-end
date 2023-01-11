<template>
  <div class="flex flex-col md:flex-row -mx-1">
    <button class="btn m-1"
            v-for="(list, idx) in tgMailAttachment.folderList"
            :class="{'btn-secondary': !list.active, 'btn-primary': list.active }"
            @click="tgMailAttachment.fileSelected(list, idx)">
      <template v-if="list.iconName">
        <i :icon-name="list.iconName" class="w-4 h-4 mr-2"></i>
      </template>
      {{list.fileName}}
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
    methods: {
      cancel(evt) {
        evt.stopPropagation();
        this.searchAvd!.active = false;
      },
    },
    mounted() {
      createIcons( { icons , nameAttr: 'icon-name'} );
    },
    setup(props, { emit }) {
      const myStore = MyStore();
      const emitter = myStore.useEmitter();
      const searchAvd = computed({
        get: () => {
          return props.searchAdvancedObj
        },
        set: (vl) => emit('update:search-advanced-obj', vl)
      });
      const contactFolder = [
        {
          fileName: 'Contacts',
          iconName: 'contact',
          active: false,
          value: 'contacts'
        },
        {
          fileName: 'Emailed Contacts',
          iconName: 'mail-search',
          active: false,
          value: '"Emailed Contacts"'
        },
        {
          fileName: 'Trash',
          iconName: 'trash',
          active: false,
          value: 'trash'
        },
      ];
      const selectFile = ref<any>([]);
      const tgMailAttachment = ref({
        folderList: contactFolder,
        fileSelected: (_item: any, _idx: number) => {
          _item.active = !_item.active;
          const index = selectFile.value.indexOf(_idx);
          if(index === -1) {
            selectFile.value.push(_idx);
          } else {
            selectFile.value.splice(index, 1);
          }
          let query: string = 'in:' + _item.value, isRemove = _item.active;
          emitter.emit('init-value-filter-advanced', { value: query, type: 'folder:', isRemove: !isRemove });
        }
      });


      return {
        searchAvd,
        tgMailAttachment
      }
    }
  })
</script>

<style></style>