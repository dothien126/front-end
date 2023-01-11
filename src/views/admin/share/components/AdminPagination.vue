<template>
  <!-- BEGIN: Pagination -->
  <div
      class="intro-y col-span-12 flex flex-wrap sm:flex-row sm:flex-nowrap items-center mt-5 py-2" v-if="pagination.totalPages > 1"
  >
    <nav class="w-full sm:w-auto sm:mr-auto">
      <ul class="pagination">
        <li class="page-item" v-if="pagination.preNumber > 0">
          <button class="page-link" @click="actionReloadDataByPageNumber(1)">
            <ChevronsLeftIcon class="w-4 h-4" />
          </button>
        </li>
        <li class="page-item" v-if="pagination.preNumber > 0">
          <button class="page-link" @click="actionReloadDataByPageNumber(pagination.number - 1)">
            <ChevronLeftIcon class="w-4 h-4" />
          </button>
        </li>
        <li class="page-item" v-if="pagination.preNumber > 0">
          <button class="page-link" @click="actionReloadDataByPageNumber(pagination.preNumber)">{{ pagination.preNumber }}</button>
        </li>
        <li class="page-item active">
          <button class="page-link">{{ pagination.number }}</button>
        </li>
        <li class="page-item" v-if="pagination.nextNumber > 0">
          <button class="page-link" @click="actionReloadDataByPageNumber(pagination.nextNumber)">{{ pagination.nextNumber }}</button>
        </li>
        <li class="page-item" v-if="pagination.nextNumber > 0">
          <button class="page-link" @click="actionReloadDataByPageNumber(pagination.number + 1)">
            <ChevronRightIcon class="w-4 h-4" />
          </button>
        </li>
        <li class="page-item" v-if="pagination.nextNumber > 0">
          <button class="page-link" @click="actionReloadDataByPageNumber(pagination.totalPages)">
            <ChevronsRightIcon class="w-4 h-4" />
          </button>
        </li>
      </ul>
    </nav>
    <select class="w-20 form-select mt-3 sm:mt-0 dark:bg-darkmode-600" @change="actionReloadDataByPageSize" v-model="pageSizeSelected">
      <option class="dark:text-darkmode-400" v-for="item in pageSize" :key="item">{{ item }}</option>
    </select>
  </div>
  <!-- END: Pagination -->
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref} from "vue";
import {IPagination} from "@/model/interface/IPagination";
import {RANGE_PAGE_SIZE} from "@/utils/MyVariables";
import {MyStore} from "@/stores/my-store";
  export default defineComponent({
    name: 'AdminPagination',
    props: {
      pagination: {
        type: Object as PropType<IPagination>,
      }
    },
    setup(props) {
      const myStore = MyStore();
      const pagination = computed(() => props.pagination as IPagination);
      const pageSize = RANGE_PAGE_SIZE;
      const pageSizeSelected = ref(RANGE_PAGE_SIZE[0]);
      const emitter = myStore.useEmitter();

      function actionReloadDataByPageNumber(page: number){
        emitter.emit('reload-data-user-manager-by-page-number', page);
      }

      function actionReloadDataByPageSize(){
        emitter.emit('reload-data-user-manager-by-page-size', pageSizeSelected.value);
      }

      return {
        pagination,
        pageSizeSelected,
        pageSize,
        actionReloadDataByPageNumber,
        actionReloadDataByPageSize
      }
    }
  })
</script>