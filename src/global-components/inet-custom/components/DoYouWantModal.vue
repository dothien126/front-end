<template>
  <!-- BEGIN: Modal Content -->
  <Modal :show="dyw" @hidden="dyw = false">
    <ModalBody class="p-10 text-center">
      <h3 class="text-xl mb-3">Có thêm tính năng này không?</h3>
      <ul>
        <li class="text-base">
          <b>Có</b> => Báo Mr.Hổ làm tiếp :)
        </li>
        <li class="text-base">
          <b>Không</b> => tự bỏ đi
        </li>
      </ul>
    </ModalBody>
    <ModalFooter>
      <button type="button" class="btn btn-primary min-w-[5rem]" @click="dyw = false">
        Ô cơ
      </button>
    </ModalFooter>
  </Modal>
  <!-- END: Modal Content -->
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
  export default defineComponent({
    name: "DoYouWantModal",
    props: {
      modalShow: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modal-show'],
    setup(props, { emit }) {
      const dyw = computed({
        get: () => props.modalShow,
        set: (vl) => emit('update:modal-show', vl)
      })
      return {
        dyw
      }
    }
  })
</script>