<template>
  <div class="mail-size py-2">
    <div class="form-inline mb-3">
      <label for="is-larger-than" class="form-label sm:w-24">{{ locale.isLargerThan }}</label>
      <div class="grow flex items-center">
        <input id="is-larger-than" v-model="formData.larger.value"
               @keyup.enter="emitFilterAdvanced(formData.larger.value, formData.larger.size, 'larger:')"
               type="number" class="form-control grow rounded-r-none" placeholder="ex: 10MB,..." />
        <select v-model="formData.larger.size" class="form-select w-20 rounded-l-none">
          <option v-for="item in formData.size" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>
    </div>
    <div class="form-inline">
      <label for="is-smaller-than" class="form-label sm:w-24">{{ locale.isSmallerThan }}</label>
      <div class="grow flex items-center">
        <input id="is-smaller-than" v-model="formData.smaller.value"
               @keyup.enter="emitFilterAdvanced(formData.smaller.value, formData.smaller.size, 'smaller:')"
               type="number" class="form-control grow rounded-r-none" placeholder="ex: 10MB,..." />
        <select v-model="formData.smaller.size" class="form-select w-20 rounded-l-none">
          <option v-for="item in formData.size" :key="item" :value="item">{{ item }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import {MyStore} from "@/stores/my-store";
export default defineComponent({
  name: 'MailSize',
  props: {
    componentActive: { type: Boolean }
  },
  emits: ['update:component-active'],
  methods: {
    cancel(evt) {
      evt.stopPropagation();
      this.comActive = false;
    }
  },
  setup(props, { emit }) {
    const myStore = MyStore();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);
    const comActive = computed({
      get: () => {
        return props.componentActive
      },
      set: (vl) => emit('update:component-active', vl)
    })

    const formData = ref({
      larger: {
        value: "",
        size: "KB"
      },
      smaller: {
        value: "",
        size: "KB"
      },
      size: ["KB", "MB"]
    })

    function emitFilterAdvanced (data: string, size: string, type: string) {
      if (data) {
        emitter.emit('init-value-filter-advanced', { value: type + data + size, type: 'size:', isRemove: false });
      }
    }

    return {
      locale,
      formData,
      comActive,
      emitFilterAdvanced
    }
  }
})
</script>

<style></style>