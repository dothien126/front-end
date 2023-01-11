<template>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalHeader class="text-base" v-if="modalTitle">
      {{ modalTitle }}
    </ModalHeader>
    <ModalBody>
      <p class="mb-2 dark:text-slate-500 text-gray-600" v-if="modalNote" v-html="modalNote"></p>
      <div class="mb-2">
        <input type="search" class="form-control" :placeholder="locale.enterTag + '...'" v-model="searchText" @change="actionSearchNameTag"/>
        <button class="absolute right-2 top-2.5 dark:text-slate-500/50 dark:hover:text-slate-500" @click="actionSearchNameTag">
          <SearchIcon class="w-4 h-4"/>
        </button>
      </div>
      <ul class="border dark:border-slate-600 rounded overflow-y-auto max-h-[24rem]">
        <li v-for="(item) in tagDisplayList" :key="item">
          <a href="javascript:" class="p-2 flex items-center hover:bg-slate-700" :class="{'bg-slate-700': tagSelected.id === item.id}" @click="onNodeClickItemTag(item)">
            <div class="w-2 h-2 rounded-full mr-2 shrink-0" :style="'background-color:' + item.rgb"></div>
            <span class="form-check-label truncate">
                    {{ item.name }}
                  </span>
          </a>
        </li>
      </ul>
    </ModalBody>
    <ModalFooter class="py-2 flex items-center">
      <div class="-mx-1.5 grow">
        <button type="button" class="btn btn-secondary m-1.5" @click="showModal = false;">
          {{ locale['cancel'] }}
        </button>
        <button type="button" class="btn btn-primary m-1.5" @click="actionTagSelected">
          {{ locale['saveAndClose'] }}
        </button>
      </div>
    </ModalFooter>
  </Modal>
  <!-- END: Modal Content -->
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {Tag} from "@/model/Tag";
import {MyTagStore} from "@/stores/tag-store/tag-store";

export default defineComponent({
  name: "ModalSelectTag",
  setup() {
    const myStore = MyStore();
    const tagStore = MyTagStore();
    const locale = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    const tagList = computed(() => tagStore.tagList as Tag[]);
    const tagDisplayList = ref<Tag[]>([]);
    const tagSelected = ref<Tag>(new Tag());
    const showModal = ref(false);
    const searchText = ref('');
    //option
    const modalTitle = ref('');
    const modalNote = ref();

    function resetAllData(){
      tagSelected.value = new Tag();
      showModal.value = false;
      searchText.value = '';
    }

    function actionSearchNameTag(){
      tagDisplayList.value = [];
      if(searchText.value){
        const findData = tagList.value.filter(value => value.name.toLowerCase().includes(searchText.value.toLowerCase()));
        tagDisplayList.value.push(...findData);
      }
      else{
        tagDisplayList.value.push(...tagList.value);
      }
    }

    const onNodeClickItemTag = function (tag: Tag) {
      tagSelected.value = tag;
    }

    function actionTagSelected() {
      const data = {
        tagSelected: tagSelected.value,
      }
      //reset all data
      resetAllData();
      emitter.emit('data-select-tag', data);
    }

    onMounted(() => {
      emitter.on('show-modal-select-tag', (data: {modalTitle?: string, modalNote?: any }) => {
        showModal.value = true;
        tagDisplayList.value = [];
        tagDisplayList.value.push(...tagList.value);
        modalTitle.value = data.modalTitle ? data.modalTitle : '';
        modalNote.value = data.modalNote ? data.modalTitle : '';
      });
    });

    onDeactivated(() => {
      emitter.off('show-modal-select-tag');
    });

    return {
      locale,
      showModal,
      modalTitle,
      modalNote,
      tagSelected,
      tagDisplayList,
      searchText,
      actionSearchNameTag,
      onNodeClickItemTag,
      actionTagSelected,
    }
  }
})
</script>