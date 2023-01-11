<template>
  <div class="incoming-msg-filters">
    <fieldset class="border border-slate-300 dark:border-slate-600 mb-3 p-2 w-full rounded">
      <legend class="text-base px-2">{{ typeOutgoingFilter ? locale.outgoingMessageFilter : locale.incomingMessageFilter }}</legend>
      <div class="-mx-1.5 mb-3">
        <button type="button"
                class="btn btn-outline-primary dark:hover:border-violet-500 btn-sm dark:text-violet-400 m-1.5"
                @click="actionShowModalAddFilter">
          {{ locale.createFilter }}
        </button>
        <button type="button"
                class="btn btn-outline-primary dark:hover:border-violet-500 btn-sm dark:text-violet-400 m-1.5"
                :disabled="!filterRuleSelected.name"
                @click="actionShowModalEditFilter">
          {{ locale.editFilter }}
        </button>
        <button type="button"
                class="btn btn-outline-primary dark:hover:border-violet-500 btn-sm dark:text-violet-400 m-1.5"
                @click="actionShowModalDeleteFilter"
                :disabled="!filterRuleSelected.name">
          {{ locale.deleteFilter }}
        </button>
        <button type="button"
                class="btn btn-outline-primary dark:hover:border-violet-500 btn-sm dark:text-violet-400 m-1.5"
                :disabled="!filterRuleSelected.name"
                @click="actionShowModalRunFilter">
          {{ locale.runFilter }}
        </button>
      </div>
      <div class="grid grid-cols-11 gap-4 mb-3">
        <div class="col-span-4">
          <h3 class="text-base mb-3">{{ locale.activeFilter }} <small
              class="text-slate-500/70">({{ myFilterRuleActiveList.length }})</small></h3>
          <Alert class="alert-outline-secondary" v-if="myFilterRuleActiveList.length === 0">
            {{ locale.notFilter }}
          </Alert>
          <div class="overflow-y-auto max-h-[360px]" v-else>
            <div class="text-slate-500" v-for="(ruleActive, index) in myFilterRuleActiveList">
              <a class="p-2 block dark:hover:bg-slate-600/50 hover:bg-gray-300 rounded"
                 :class="{'dark:bg-slate-600/50 bg-gray-300': ruleActive.selected}" @click="actionSelectedFilterRuleActive(ruleActive, index)">
                {{ ruleActive.name }}
              </a>
            </div>
          </div>
        </div>
        <div class="col-span-3">
          <div class="">
            <button type="button" class="btn btn-secondary-soft btn-sm w-full mb-2" v-if="filterRuleSelected.moveAdd" @click="actionChangeMove('add')">
              <ChevronsLeftIcon class="w-4 h-4 mr-2"/>
              {{ locale.add }}
            </button>
            <button type="button" class="btn btn-secondary-soft btn-sm w-full mb-2" v-if="filterRuleSelected.moveRemove" @click="actionChangeMove('remove')">
              {{ locale.remove }}
              <ChevronsRightIcon class="w-4 h-4 ml-2"/>
            </button>
            <button type="button" class="btn btn-secondary-soft btn-sm w-full mb-2" v-if="filterRuleSelected.moveUp" @click="actionChangeMove('up')">
              <ChevronsUpIcon class="w-4 h-4 mr-2"/>
              {{ locale.moveUp }}
            </button>
            <button type="button" class="btn btn-secondary-soft btn-sm w-full" v-if="filterRuleSelected.moveDown" @click="actionChangeMove('down')">
              {{ locale.moveDown }}
              <ChevronsDownIcon class="w-4 h-4 ml-2"/>
            </button>
          </div>
        </div>
        <div class="col-span-4">
          <h3 class="text-base mb-3">{{ locale.availableFilter }} <small
              class="text-slate-500/70">({{ myFilterRuleAvailableList.length }})</small></h3>
          <Alert class="alert-outline-secondary" v-if="myFilterRuleAvailableList.length === 0">
            {{ locale.notFilter }}
          </Alert>
          <div class="overflow-y-auto max-h-[360px]" v-else>
            <div class="text-slate-500" v-for="(ruleAvailable, index) in myFilterRuleAvailableList">
              <a class="p-2 block dark:hover:bg-slate-600/50 hover:bg-gray-300 rounded"
                 :class="{'dark:bg-slate-600/50 bg-gray-300': ruleAvailable.selected}" @click="actionSelectedFilterRuleActive(ruleAvailable, index)">
                {{ ruleAvailable.name }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {IFilterRule} from "@/model/interface/IFilterRule";
import {MyFilterRuleStore} from "@/stores/filter-rule-store/filter-rule-store";
import { Folder } from "@/model/Folder";
import { showToastMessage } from "@/utils/MyFunction";
import {FilterRule, IApplyFilterRulesRequest} from "@/model/interface/IApplyFilterRulesRequest";
import FilterRuleService from "@/service/FilterRuleService";
import {ResponseData} from "@/model/ResponseData";

export default defineComponent({
  name: 'InOutMessageFilters',
  props: {
    typeOutgoingFilter:{
      type: Boolean,
      default: false,
      required: true,
    }
  },
  setup(props) {
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const typeOutgoingFilter = computed(() => props.typeOutgoingFilter as boolean);
    const emitter = myStore.useEmitter();
    const myFilterRuleStore = MyFilterRuleStore();
    const myFilterRuleActiveList = computed(() => {
      if(typeOutgoingFilter.value){
        return myFilterRuleStore.myOutgoingFilterRuleList.filter(value => value.active);
      }
      else{
        return myFilterRuleStore.myFilterRuleList.filter(value => value.active);
      }
    });
    const myFilterRuleAvailableList = computed(() => {
      if(typeOutgoingFilter.value){
        return myFilterRuleStore.myOutgoingFilterRuleList.filter(value => !value.active);
      }
      else{
        return myFilterRuleStore.myFilterRuleList.filter(value => !value.active);
      }
    });
    const filterRuleSelected = ref<IFilterRule>({} as IFilterRule);


    function actionSelectedFilterRuleActive(item: IFilterRule, indexSelected: number){
      //change css item other
      const findFilterRuleActiveWithoutSelected = myFilterRuleActiveList.value.find(value => value.selected);
      if(findFilterRuleActiveWithoutSelected){
        findFilterRuleActiveWithoutSelected.selected = false;
      }
      //change css item other
      const findFilterRuleAvailableWithoutSelected = myFilterRuleAvailableList.value.find(value => value.selected);
      if(findFilterRuleAvailableWithoutSelected){
        findFilterRuleAvailableWithoutSelected.selected = false;
      }
      //change css item selected
      item.selected = true;
      item.indexSelected = indexSelected;
      //change move
      item.moveAdd = !item.active;
      item.moveRemove = item.active;
      item.moveUp = indexSelected > 0;
      item.moveDown = item.active ? indexSelected < myFilterRuleActiveList.value.length - 1 : indexSelected < myFilterRuleAvailableList.value.length - 1;
      //set to object selected
      filterRuleSelected.value = item;
    }

    async function actionChangeMove(move: string) {
      //Neu la add - them tu danh sach available append duoi cung danh sach active
      if (move === 'add') {
        //change value active (available -> active)
        filterRuleSelected.value.active = true;
        //change selected by list active
        actionSelectedFilterRuleActive(filterRuleSelected.value, myFilterRuleActiveList.value.length - 1);
        //add to list active
        await myFilterRuleStore.modifyFilterRule(typeOutgoingFilter.value, false);
      } else if (move === 'remove') {
        //change value active (available -> active)
        filterRuleSelected.value.active = false;
        //change selected by list active
        actionSelectedFilterRuleActive(filterRuleSelected.value, myFilterRuleAvailableList.value.length - 1);
        //add to list active
        await myFilterRuleStore.modifyFilterRule(typeOutgoingFilter.value, false);
      } else if (move === 'up') {
        //move up
        myFilterRuleStore.moveUpFilterRuleSelected(filterRuleSelected.value, typeOutgoingFilter.value);
        //tru index
        filterRuleSelected.value.indexSelected = filterRuleSelected.value.indexSelected - 1;
        //call request
        await myFilterRuleStore.modifyFilterRule(typeOutgoingFilter.value, false);
        //check downest
        actionSelectedFilterRuleActive(filterRuleSelected.value, filterRuleSelected.value.indexSelected);
      } else if (move === 'down') {
        //move down
        myFilterRuleStore.moveDownFilterRuleSelected(filterRuleSelected.value, typeOutgoingFilter.value);
        //cong index
        filterRuleSelected.value.indexSelected = filterRuleSelected.value.indexSelected + 1;
        //call request
        await myFilterRuleStore.modifyFilterRule(typeOutgoingFilter.value, false);
        //check upnest
        actionSelectedFilterRuleActive(filterRuleSelected.value, filterRuleSelected.value.indexSelected);
      }
    }

    function actionShowModalAddFilter(){
      emitter.emit('show-modal-add-filter', typeOutgoingFilter.value);
    }

    function actionShowModalEditFilter(){
      emitter.emit('show-modal-edit-filter', {filterRule: filterRuleSelected.value, outgoingFilter: typeOutgoingFilter.value});
    }

    function actionShowModalDeleteFilter() {
      emitter.emit('show-modal-delete-filter', {filterRule: filterRuleSelected.value, outgoingFilter: typeOutgoingFilter.value});
    }

    function actionShowModalRunFilter() {
      //show modal if contains an action to “Forward To Address”
      if(filterRuleSelected.value.filterActions && filterRuleSelected.value.filterActions.length > 0){
        for(const item of filterRuleSelected.value.filterActions){
          if(item.actionRedirect && item.actionRedirect.length > 0){
            for(const redirect of item.actionRedirect){
              if(redirect.a) showToastMessage(locale.value.informationApplyFilter, true);
            }
          }
        }
      }
      emitter.emit('show-modal-select-folder', {useCheckbox: true, typeRootList: false, isHasTippy: false, modalTitle: locale.value.runFilter, modalNote: locale.value.chooseFolderToApplyFilter + '<p></p>' + locale.value.chooseFolderToApplyFilterDetail});
    }

    async function applyFilterRulesRequest(data: any) {
      if (data && data.folderSelectedByCheckbox) {
        const folderSelectedList = data.folderSelectedByCheckbox as Folder[];
        if (folderSelectedList.length > 0) {
          //init value request
          const applyFilterRequest = {
            filterRules: [] as FilterRule[],
            folderPathSelected: [] as string[],
          } as IApplyFilterRulesRequest;
          //Lay cac phan tu rule selected
          const filterRule = {filterRule: filterRuleSelected.value} as FilterRule;
          //add vao danh sach filterRules
          applyFilterRequest.filterRules.push(filterRule);
          //Lay cac phan tu folder path
          for (const item of folderSelectedList) {
            const path = 'in:\"' + item.folderPath + '\"';
            //add vao danh sach folder path
            applyFilterRequest.folderPathSelected.push(path);
          }
          //call request
          const response = await FilterRuleService.run(applyFilterRequest, myStore.token);
          if (response.data) {
            const responseData: ResponseData = response.data;
            if (!responseData.values.error) {
              const total = responseData.values.total ? responseData.values.total : 0;
              //value content success
              const completeString = total + ' ' + locale.value.message + ' ' + locale.value.processed;
              //alert success
              showToastMessage(completeString);
            } else {
              showToastMessage(responseData.values.error, true);
            }
          }
        }
      }
    }

    onMounted(() => {
      emitter.on('modify-success-filter', () => {
        filterRuleSelected.value = {} as IFilterRule;
      });
      emitter.on('data-select-folder', async (data: any) => {
        await applyFilterRulesRequest(data);
      });
    });

    onDeactivated(() => {
      emitter.off('modify-success-filter');
      emitter.off('data-select-folder');
    });

    return {
      locale,
      typeOutgoingFilter,
      actionShowModalRunFilter,
      filterRuleSelected,
      myFilterRuleActiveList,
      myFilterRuleAvailableList,
      actionSelectedFilterRuleActive,
      actionChangeMove,
      actionShowModalAddFilter,
      actionShowModalEditFilter,
      actionShowModalDeleteFilter,
    }
  }
})
</script>