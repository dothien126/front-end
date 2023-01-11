<template>
  <Modal
      size="modal-lg"
      backdrop="static"
      :show="showModal"
      @hidden="showModal = false"
  >
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">{{ locale.activityStream }}</h2>
    </ModalHeader>
    <ModalBody>
      <div class="mb-5">
        {{locale.activityStreamDescription}}
      </div>
      <div class="border-t dark:border-slate-600/50 py-5">
        <div class="form-check form-switch">
          <input id="enable-moving" class="form-check-input" type="checkbox" v-model="enableMoving" @change="actionChangeEnableActivityStream"/>
          <label class="form-check-label" for="enable-moving">{{ locale.enableActivityStream }}</label>
        </div>
        <div class="pl-11 mt-3" v-if="enableMoving">
          <div class="form-check mt-2">
            <input
                id="ck-1"
                class="form-check-input"
                type="checkbox"
                v-model="selectedOption.listTest"
                @change="actionChangeListTest"
            />
            <label class="form-check-label" for="ck-1"
            >{{ locale.messageSendThroughDistributionList }}</label>
          </div>
          <div class="form-check mt-2">
            <input
                id="ck-2"
                class="form-check-input"
                type="checkbox"
                v-model="selectedOption.bulkTest"
                @change="actionChangeBulkTest"
            />
            <label class="form-check-label" for="ck-2">{{ locale.commercialMassMarketing }}</label>
          </div>
          <div class="flex items-center mt-2">
            <div class="form-check">
              <input
                  id="ck-3"
                  class="form-check-input"
                  type="checkbox"
                  v-model="selectedOption.meTest"
                  @change="actionChangeMeTest"
              />
              <label class="form-check-label" for="ck-3">{{ locale.messageWhereMyAddress }}</label>
            </div>
            <select class="form-select w-24 mx-2" v-model="meTestSelected">
              <option :value="EnumValueForSelected.to">{{ locale.to }}</option>
              <option :value="EnumValueForSelected.toCc">{{ locale.to }} {{ locale.or }} {{ locale.cc }}</option>
            </select>
          </div>
          <div class="form-check mt-2">
            <input
                id="ck-4"
                class="form-check-input"
                type="checkbox"
                v-model="selectedOption.addressBookTest"
                @change="actionChangeAddressBookTest"
            />
            <label class="form-check-label" for="ck-4">{{ locale.messageFromPeopleNotInMyContact }}</label>
          </div>
        </div>
      </div>
    </ModalBody>
    <ModalFooter class="flex items-center">
      <div class="grow text-left">
        <button type="button" class="btn btn-outline-secondary" @click="actionShowEditFilterRule">
          {{ locale.advancedControl }}
        </button>
      </div>
      <div>
        <button
            type="button"
            @click="showModal = false"
            class="btn btn-secondary min-w-[5rem] mr-3"
        >
          {{ locale.cancel }}
        </button>
        <button type="button" @click="actionSaveAndClose" class="btn btn-primary min-w-[5rem]">
          {{locale.saveAndClose}}
        </button>
      </div>
    </ModalFooter>
  </Modal>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, ref} from "vue";
  import {MyStore} from "@/stores/my-store";
  import ModalCreateFilter from "@/views/settings/filters/partial/ModalCreateFilter.vue";
import {EnumValueForSelected} from "@/model/dto/EnumData";
import {
  FilterActionDetails,
  FilterActions,
  FilterTestDetails,
  FilterTests,
  IFilterRule
} from "@/model/interface/IFilterRule";
import {MyFilterRuleStore} from "@/stores/filter-rule-store/filter-rule-store";
  export default defineComponent({
    name: 'ActivityStreamModal',
    components: {ModalCreateFilter},
    setup() {
      const myStore = MyStore();
      const emitter = myStore.useEmitter();
      const locale = computed(() => myStore.locale);
      const myFilterRuleStore = MyFilterRuleStore();
      const showModal = ref(false);
      const enableMoving = ref(false);
      const advancedControls = ref(false);
      const meTestSelected = ref(EnumValueForSelected.to);
      const selectedOption = ref({
        listTest: false,
        bulkTest: false,
        meTest: false,
        addressBookTest: false,
      });
      const filterRuleSelected = ref<IFilterRule>({
        name: locale.value.activityStream,
        active: false,
        filterTests: [
          {
            condition: EnumValueForSelected.anyof,
          }
        ] as FilterTests[],
        filterActions: [
          {
            actionFileInto: [
              {
                folderPath: locale.value.activityStream,
              } as FilterActionDetails,
            ] as FilterActionDetails[],
          } as FilterActions,
        ] as FilterActions[],
      } as IFilterRule);

      function actionShowEditFilterRule(){
        emitter.emit('show-modal-edit-filter', {filterRule: filterRuleSelected.value, outgoingFilter: false});
      }

      function actionChangeEnableActivityStream(){
        filterRuleSelected.value.active = enableMoving.value;
      }

      function actionChangeListTest(){
        if(selectedOption.value.listTest){
          filterRuleSelected.value.filterTests[0].listTest = [{} as FilterTestDetails];
        }
        else{
          delete filterRuleSelected.value.filterTests[0].listTest;
        }
      }

      function actionChangeBulkTest(){
        if(selectedOption.value.bulkTest){
          filterRuleSelected.value.filterTests[0].bulkTest = [{} as FilterTestDetails];
        }
        else{
          delete filterRuleSelected.value.filterTests[0].bulkTest;
        }
      }

      function actionChangeMeTest(){
        if(selectedOption.value.meTest){
          filterRuleSelected.value.filterTests[0].meTest = [{negative: true, header: meTestSelected.value} as FilterTestDetails];
        }
        else{
          delete filterRuleSelected.value.filterTests[0].meTest;
        }
      }

      function actionChangeAddressBookTest(){
        if(selectedOption.value.addressBookTest){
          filterRuleSelected.value.filterTests[0].addressBookTest = [{negative: true, header: EnumValueForSelected.from} as FilterTestDetails];
        }
        else{
          delete filterRuleSelected.value.filterTests[0].addressBookTest;
        }
      }

      async function actionSaveAndClose() {
        //init value
        await myFilterRuleStore.activityStreamFilterRule(filterRuleSelected.value, true);
        //close modal
        showModal.value = false;
      }

      onMounted(() => {
        emitter.on('show-modal-activity-stream', () => {
          showModal.value = true;
        });
      });

      onDeactivated(() => {
        emitter.off('show-modal-activity-stream');
      });

      return {
        emitter,
        locale,
        EnumValueForSelected,
        selectedOption,
        enableMoving,
        advancedControls,
        showModal,
        meTestSelected,
        actionChangeEnableActivityStream,
        actionShowEditFilterRule,
        actionChangeListTest,
        actionChangeBulkTest,
        actionChangeMeTest,
        actionChangeAddressBookTest,
        actionSaveAndClose,
      }
    }
  })
</script>