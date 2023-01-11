<template>
  <div class="flex">
    <span class="px-4 py-2">
      <i v-if="!classAlert" data-lucide="check-circle" class="w-5 h-5 text-success"></i>
      <i v-else data-lucide="alert-circle" class="w-5 h-5 text-danger"></i>
    </span>
    <div class="d-flex">
      <h2 class="text-lg font-bold text-slate-300">{{ title }}</h2>
      <div v-if="details.length > 0">
        <div class="intro-x mb-2" ref="repliesItem" v-show="showHide">
          <div :key="error" v-for="error of details" class="text-slate-500 font-normal" >
            <p>Msg: {{error.reason}}</p>
            <p>Code: {{error.code}}</p>
            <p>Detail: {{error.detail}}</p>
            <p>Trace: {{error.trace}}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <p class="font-bold text-slate-500">{{ content }}</p>
      </div>
      <div v-if="details.length > 0" class="text-right mt-3">
        <button type="button" class="btn btn-sm btn-secondary text-white" @click="showMessage">
          {{ showHide ? closeViewDetail : openViewDetail }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, onMounted } from "vue";
import {Fault} from "@/model/Fault";
import { createIcons, icons } from "lucide";

export default defineComponent({
  name: "CustomNotification",
  props: {
    title: { type: String },
    content: { type: String },
    details: { type: Array as PropType<Fault[]> },
    classAlert: { type: Boolean },
    closeViewDetail: { type: String },
    openViewDetail: { type: String },
  },
  setup () {
    const showHide = ref(false);
    function showMessage () {
      showHide.value = !showHide.value;
    }
    onMounted(() => {
      createIcons({
        icons,
        attrs: {
          'stroke-width': 1.5,
        },
        nameAttr: 'data-lucide',
      });
    })
    return {
      showMessage,
      showHide
    }
  }
});
</script>

<style></style>
