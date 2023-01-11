<template>
  <div class="search-advanced">
    <div class="flex flex-wrap items-center -mx-1">
      <button type="button" class="btn m-1 relative"
              v-for="(list, index) in tgSearchAdvanced.advList"
              @click="tgSearchAdvanced.filterSelected(list, index)"
              :class="{'btn-secondary': !list.active, 'btn-primary': list.active}"
      >
        <i v-if="list.mailIconName" :icon-name="iconName(list.mailIconName)" class="w-4 h-4 mr-2"></i>
        {{ locale[list.label] }}
        <span class="absolute -top-1.5 -right-2 rounded-full py-0.5 px-2 text-xs bg-violet-600"
              v-if="list.itemSelected">
          {{list.itemSelected ? list.itemSelected.length : 0}}
        </span>
      </button>
    </div>
    <div class="p-3 flex rounded bg-gray-200 dark:bg-slate-600/60" v-if="filterSelectActived && filterSelectActived.active">
      <div class="grow">
        <dynamic-component-search
            :com-name="tgSearchAdvanced.componentAdvancedLoad(filterSelectActived.componentName)"
            :search-advanced-obj="filterSelectActived"
            :search-advanced-root="tgSearchAdvanced.advList"
            @update:search-advanced-root="tgSearchAdvanced.advList"
            @update:search-advanced-obj="filterSelectActived"
        >
        </dynamic-component-search>
      </div>
      <div class="flex items-center">
        <button type="button" class="btn btn-secondary rounded-full shrink-0 px-2" @click="closeAdvandeContent">
          <i icon-name="x" class="w-4 h-4"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {computed, defineComponent, ref} from "vue";
  import {createIcons, icons } from "lucide";
  import MailSettingIcon from "@/stores/mail-setting-icon";
  import DynamicComponentSearch from '@/components/top-bar/partial/DynamicComponentSearch.vue';
  import {MyStore} from "@/stores/my-store";
  export default defineComponent({
    name: 'SearchAdvanced',
    components: { DynamicComponentSearch },
    props: {
      advancedList: {
        type: Object,
        require: true
      }
    },
    emits: ['update:advanced-list', 'update:advanced-filter'],
    methods: {
      iconName(_label: string) {
        const labelIcon = MailSettingIcon;
        if(labelIcon[_label] && labelIcon[_label].iconName) {
          return labelIcon[_label].iconName;
        }
        return 'folder'; // Icons Folder Default
      },
      closeAdvandeContent(_evt) {
        _evt.stopPropagation();
        this.filterSelectActived.active = false;
      }
    },
    updated() {
      createIcons( { icons, nameAttr: 'icon-name' } );
    },
    setup(props, {emit}){
      const myStore = MyStore();
      const locale = computed(() => myStore.locale);
      const advList = computed({
        get: () => {
          return props.advancedList
        },
        set: (vl) => emit('update:advanced-list', vl)
      });
      const filterSelectActived = ref<any>({});
      const tgSearchAdvanced = ref({
        advList: advList,
        filterSelected: (_item: any, _idx: number) => {
          _item.active = !_item.active;
          filterSelectActived.value = _item;
          emit('update:advanced-filter', { count: !!_item.active })
        },
        componentAdvancedLoad: (_componentName) => {
          return _componentName;
        }
      });

      return {
        locale,
        tgSearchAdvanced,
        filterSelectActived
      };
    }
  })
</script>

<style lang="scss">

</style>