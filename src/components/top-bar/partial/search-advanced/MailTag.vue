<template>
  <div class="py-2 mail-tag">
    <div class="flex flex-col sm:flex-row flex-wrap -mx-2">
      <div class="form-check grow basis-1/2 p-2" v-for="(tag, index) in tagList">
        <input :id="'ck-switch-' + index" class="form-check-input" v-model="formData.value" type="checkbox" :value="tag" />
        <label class="form-check-label flex" :for="'ck-switch-' + index">
          <div class="w-2 h-2 rounded-full mr-2 mt-1.5" :style="'background-color:' + tag.rgb"></div>
          {{ tag.name }}</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, watch} from "vue";
import {MyStore} from "@/stores/my-store";
import {Tag} from "@/model/Tag";
import {MyTagStore} from "@/stores/tag-store/tag-store";
export default defineComponent({
  name: 'MailTag',
  setup() {
    const myStore = MyStore();
    const tagStore = MyTagStore();
    const tagList = computed(() => tagStore.tagList);
    const emitter = myStore.useEmitter();

    const formData = reactive({
      value: []
    })

    watch(() => formData.value, (addVal: Tag[], removeVal: Tag[]) => {
      let query: string = '', isRemove = false;
      if (addVal.length > removeVal.length) {
        let status = addVal.at(-1);
        if (status) query += String(`tag:"${status.name}"`);
      } else {
        let status = removeVal.at(-1); isRemove = true;
        if (status) query += String(`tag:"${status.name}"`);
      }
      emitter.emit('init-value-filter-advanced', { value: query, type: 'tag:', isRemove: isRemove });
    })

    return {
      tagList,
      formData,
    }
  }
})
</script>

<style></style>