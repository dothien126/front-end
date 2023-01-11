<template>
  <div class="flex items-center colors-picker">
    <div class="grow pr-2">
      <span v-if="!colorData" class="rounded py-0.5 px-2 bg-white dark:bg-slate-600">{{ locale.none }}</span>
      <span v-else class="w-6 h-6 rounded inline-block" :style="{backgroundColor: colorData.hex}"></span>
    </div>
    <Dropdown class="shrink-0" v-slot="{dismiss}">
      <DropdownToggle class="btn btn-sm btn-secondary">
        {{ locale.selectColor }}
        <ChevronDownIcon class="w-4 h-4"/>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownContent tag="div">
          <div class="p-2">
            <div class="mb-5">
              <Compact v-model="colorData"/>
              <button type="button" class="btn btn-secondary btn-sm mt-3 w-full" @click="colorPickerCustomModal = true;">
                {{ locale.selectColorCustom }}
              </button>
            </div>
            <div class="flex items-center -mx-1.5">
              <button type="button" class="btn btn-secondary m-1.5 whitespace-nowrap" @click="colorData.hex = DEFAULT_COLOR; dismiss();">
                {{ locale.defaultColor }}
              </button>
              <button class="btn btn-primary m-1.5 whitespace-nowrap" @click="dismiss">
                {{ locale.apply }}
              </button>
            </div>
          </div>
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>
  </div>
  <!-- BEGIN: Modal Content -->
  <Modal size="modal-sm" backdrop="static" :show="colorPickerCustomModal" @hidden="colorPickerCustomModal = false">
    <ModalBody class="px-5">
      <div class="text-center">
        <div class="mb-5">
          <Sketch v-model="colorData"/>
        </div>
      </div>
      <div class="-mx-1.5 text-center">
        <button type="button" class="btn btn-secondary m-1.5 min-w-[80px]" @click="colorData.hex = DEFAULT_COLOR; colorPickerCustomModal = false">
          {{ locale.defaultColor }}
        </button>
        <button type="button" class="btn btn-primary m-1.5 min-w-[80px]" @click="colorPickerCustomModal = false">
          {{ locale.apply }}
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Modal Content -->
</template>

<script lang="ts">
  import { Sketch, Compact } from "@ckpack/vue-color";
  import {computed, defineComponent, ref, watch} from "vue";
  import {MyStore} from "@/stores/my-store";
  import {
    DEFAULT_COLOR,
  } from "@/utils/MyVariables";

  export default defineComponent({
    components: {Sketch, Compact},
    props: {
      colorFolder:{
        default: '',
        type: String,
      }
    },
    emits: ['update:color-folder'],
    setup(props, {emit}){
      const myStore = MyStore();
      const locale = computed(() => myStore.locale);
      const colorPickerCustomModal = ref(false);
      const colorFolder = computed({
        get: () => props.colorFolder ? props.colorFolder : '',
        set: (data) => emit('update:color-folder', data),
      });
      const colorData = ref({
        hex: colorFolder.value,
      });

      watch(() => colorData.value.hex, value => {
        if(value){
          colorFolder.value = value;
        }
      });

      watch(() => colorFolder.value, value => {
        if(value){
          colorData.value.hex = value;
        }
      });

      return {
        locale,
        DEFAULT_COLOR,
        colorData,
        colorPickerCustomModal,
      }
    }
  });
</script>

<style lang="scss">
  .colors-picker {
    .vc-compact {
      width: auto;
    }
  }
  .modal {
    &-sm {
      .vc-sketch {
        width: auto;
      }
    }
  }
</style>