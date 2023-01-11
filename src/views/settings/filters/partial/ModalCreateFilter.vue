<template>
  <!-- BEGIN: Modal Content -->
  <Modal size="modal-lg" backdrop="static" :show="modalFilter" @hidden="modalFilter = false">
    <ModalHeader class="flex items-center">
      <h3 class="text-lg grow">{{ locale.createFilter }}</h3>
      <button type="button" class="shrink-0" @click="modalFilter = false">
        <XIcon class="h-4 w-4"/>
      </button>
    </ModalHeader>
    <ModalBody>
      <div class="flex items-center flex-wrap md:flex-nowrap mb-3">
        <span>{{ locale.nameFilter }}:</span>
        <div class="grow px-3">
          <input type="text" class="form-control" v-model="dataForFilterRuleSelected.name"/>
        </div>
        <div class="form-check mt-2 md:mt-0">
          <input class="form-check-input" type="checkbox" v-model="dataForFilterRuleSelected.active"
                 :value="dataForFilterRuleSelected.active"/>
          <label class="form-check-label">{{ locale.active }}</label>
        </div>
      </div>
      <div class="box-group box1 mb-5">
        <div class="flex items-center mb-3">
          {{ locale.if }}
          <div class="mx-2">
            <select class="form-select form-select-sm" v-model="dataForFilterRuleSelected.conditionSelected">
              <option v-for="condition in dataForFilterRuleSelected.conditionList" :value="condition.value">
                {{ condition.text }}
              </option>
            </select>
          </div>
          {{ locale.followingCondition }}
        </div>
        <div class="overflow-y-auto max-h-[360px] min-h-[220px] border dark:border-slate-600 p-2 rounded">
          <div class="flex items-start mb-3"
               v-for="(filterTest) in filterTestDetailList" :key="filterTest.idRender">
            <div class="grow flex items-center flex-wrap md:flex-nowrap -mx-1.5 px-1">
              <!-- BEGIN: HEADER LIST-->
              <div class="m-1.5">
                <select class="form-select form-select-sm"
                        @change="actionDefaultSubDataForHeaderSelected(filterTest)"
                        v-model="filterTest.headerSelected">
                  <option v-for="header in filterTest.headerList" :value="header.value">{{ header.text }}
                  </option>
                </select>
              </div>
              <!-- BEGIN: SUB ONE LIST -->
              <div class="m-1.5">
                <template v-if="filterTest.subOneConditionList && filterTest.subOneConditionList.dataByHeader.length > 0">
                  <select class="form-select form-select-sm" v-model="filterTest.subOneConditionSelected">
                    <option v-for="subOne in filterTest.subOneConditionList.dataByHeader" :value="subOne.value">
                      {{ subOne.text }}
                    </option>
                  </select>
                </template>
                <input type="text" class="form-control form-control-sm"
                       v-model="filterTest.subOneConditionSelected"
                       v-if="filterTest.showInputSubOne"/>
              </div>
              <!-- BEGIN: SUB TWO LIST -->
              <div class="m-1.5">
                <template v-if="filterTest.subTwoConditionList && filterTest.subTwoConditionList.dataByHeader.length > 0">
                  <select class="form-select form-select-sm"
                          @change="actionDefaultSubDataForSubTwoSelected(filterTest)"
                          v-model="filterTest.subTwoConditionSelected">
                    <option v-for="subTwo in filterTest.subTwoConditionList.dataByHeader" :value="subTwo.value">
                      {{ subTwo.text }}
                    </option>
                  </select>
                </template>
                <input type="text" class="form-control form-control-sm"
                       v-model="filterTest.subTwoConditionSelected"
                       v-if="filterTest.showInputSubTwo"/>
                <Litepicker
                    v-model="filterTest.subTwoConditionSelected"
                    v-if="filterTest.headerSelected === EnumHeaderFilter.date"
                    :options="{
                    format: env.dateFormat,
                  autoApply: false,
                  showWeekNumbers: true,
                  dropdowns: {
                    minYear: 1990,
                    maxYear: null,
                    months: true,
                    years: true,
                  },
                }" class="form-control form-control-sm block"/>
              </div>
              <!-- BEGIN: SUB THREE LIST -->
              <div class="m-1.5">
                <template
                    v-if="filterTest.subThreeConditionList && filterTest.subThreeConditionList.dataByHeader.length > 0">
                  <select class="form-select form-select-sm"
                          v-model="filterTest.subThreeConditionSelected">
                    <option v-for="subThree in filterTest.subThreeConditionList.dataByHeader" :value="subThree.value">
                      {{ subThree.text }}
                    </option>
                  </select>
                </template>
                <input type="text"
                       v-model="filterTest.subThreeConditionSelected"
                       v-if="filterTest.showInputSubThree"
                       class="form-control form-control-sm"/>
              </div>
            </div>
            <!-- BEGIN: group5 -->
            <div class="flex shrink-0">
              <button type="button" class="btn btn-outline-secondary btn-sm mx-1 my-1.5" @click="initAddConditionTest">
                <PlusIcon class="w-4 h-4"/>
              </button>
              <button type="button" class="btn btn-outline-secondary btn-sm mx-1 my-1.5"
                      :disabled="filterTestDetailList.length <= 1" @click="actionRemoveConditionTest(filterTest)">
                <MinusIcon class="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="box-group box2">
        <p class="mb-3">{{ locale.followingAction }}</p>
        <div class="overflow-y-auto max-h-[360px] min-h-[220px] border dark:border-slate-600 p-2 rounded">
          <div class="flex items-center mb-3" v-for="(filterAction) in filterActionDetailList"
               :key="filterAction.idRender">
            <!-- BEGIN: ACTION HEADER -->
            <div class="mb-2 md:mb-0 md:mr-2 shrink-0">
              <select class="form-select form-select-sm"
                      @change="actionDefaultSubDataForHeaderActionSelected(filterAction)"
                      v-model="filterAction.headerActionSelected">
                <option v-for="headerAction in filterAction.headerActionList" :value="headerAction.value">
                  {{ headerAction.text }}
                </option>
              </select>
            </div>
            <div class="mb-2 md:mb-0 md:mr-2 grow md:px-2">
              <template
                  v-if="filterAction.subActionConditionList && filterAction.subActionConditionList.dataByHeader.length > 0">
                <select class="form-select form-select-sm" v-model="filterAction.subActionSelected">
                  <option v-for="subAction in filterAction.subActionConditionList.dataByHeader"
                          :value="subAction.value">
                    {{ subAction.text }}
                  </option>
                </select>
              </template>
              <template v-if="filterAction.headerActionSelected === EnumHeaderFilter.moveIntoFolder">
                <button type="button" class="btn btn-secondary btn-sm"
                        @click="actionBrowser(filterAction, EnumHeaderFilter.moveIntoFolder)">
                  {{
                    filterAction.folderPath ? filterAction.folderPath.substring(filterAction.folderPath.lastIndexOf('/')) : locale.browse
                  }}
                </button>
              </template>
              <template v-else-if="filterAction.headerActionSelected === EnumHeaderFilter.tagWith">
                <button type="button" class="btn btn-secondary btn-sm"
                        @click="actionBrowser(filterAction, EnumHeaderFilter.tagWith)">
                  {{ filterAction.tagName ? filterAction.tagName : locale.browse }}
                </button>
              </template>
              <input type="text" class="form-control form-control-sm"
                     v-model="filterAction.subActionSelected"
                     v-if="filterAction.showInputSubAction"/>
            </div>
            <!-- BEGIN: Group 3 -->
            <div class="flex shrink-0">
              <button type="button" class="btn btn-outline-secondary btn-sm m-1" @click="initAddConditionAction">
                <PlusIcon class="w-4 h-4"/>
              </button>
              <button type="button" class="btn btn-outline-secondary btn-sm m-1"
                      :disabled="filterActionDetailList.length <= 1" @click="actionRemoveConditionAction(filterAction)">
                <MinusIcon class="w-4 h-4"/>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="form-check mt-5">
        <input class="form-check-input" type="checkbox" v-model="dataForFilterRuleSelected.notProcessFilter"
               :value="dataForFilterRuleSelected.notProcessFilter"/>
        <label class="form-check-label">{{ locale.doNotProcessAddFilter }}</label>
      </div>
    </ModalBody>
    <ModalFooter class="py-2">
      <div class="-mx-2">
        <button type="button" @click="modalFilter = false" class="btn btn-secondary min-w-[5rem] m-2">
          {{ locale['cancel'] }}
        </button>
        <button type="button" @click="actionModifyFilterRule" class="btn btn-primary min-w-[5rem] m-2">
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
import {Folder} from "@/model/Folder";
import {
  DataByHeader,
  FilterActionDetails,
  FilterActions,
  FilterTestDetails,
  FilterTests,
  IFilterRule,
  SubCondition,
} from "@/model/interface/IFilterRule";
import {EnumHeaderFilter, EnumSubCondition, EnumValueForSelected} from "@/model/dto/EnumData";
import {Tag} from "@/model/Tag";
import ModalCreateFolder from "@/global-components/inet-custom/components/ModalCreateFolder.vue";
import {MyFilterRuleStore} from "@/stores/filter-rule-store/filter-rule-store";
import {showToastMessage} from "@/utils/MyFunction";
import {env, INVALID_NAME, VALUE_EXISTED} from "@/utils/MyVariables";
import {
  initDataMofidyForActionFileIntoAndFlagAndRedirectAndTag,
  initDataMofidyForHeaderActionKeepAndDiscard,
  initDataMofidyForHeaderAddressIn,
  initDataMofidyForHeaderAttachmentToReadReceipt,
  initDataMofidyForHeaderBody,
  initDataMofidyForHeaderCalendar,
  initDataMofidyForHeaderDate,
  initDataMofidyForHeaderFromToSubject,
  initDataMofidyForHeaderMessage,
  initDataMofidyForHeaderNamed,
  initDataMofidyForHeaderSize,
  initDataMofidyForHeaderSocial
} from "@/utils/filter-function/ModifyFilterFunction";
import {
  dataSelectedByHeaderAction,
  dataSelectedByHeaderAddressIn,
  dataSelectedByHeaderAttachmentToReadReceipt,
  dataSelectedByHeaderBody, dataSelectedByHeaderCalendar,
  dataSelectedByHeaderDate,
  dataSelectedByHeaderFromToSubject,
  dataSelectedByHeaderMessage, dataSelectedByHeaderNamed, dataSelectedByHeaderSize, dataSelectedByHeaderSocial,
  setDataByEditFilterRuleForHeader, setDataByEditFilterRuleForHeaderAction
} from "@/utils/filter-function/EditFilterFunction";
import {Item} from "@/model/Conversation";

export default defineComponent({
  name: 'ModalCreateFilter',
  components: {ModalCreateFolder},
  setup() {
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const modalFilter = ref(false);
    const emitter = myStore.useEmitter();
    const typeOutgoingFilter = ref(false);
    const myFilterRuleStore = MyFilterRuleStore();
    const myFilterRuleList = computed(() => myFilterRuleStore.myFilterRuleList as IFilterRule[]);
    const filterTestDetailList = ref<FilterTestDetails[]>([] as FilterTestDetails[]);
    const filterActionDetailList = ref<FilterActionDetails[]>([] as FilterActionDetails[]);
    const dataForFilterRuleSelected = ref({
      name: '',
      active: true, //default active,
      notProcessFilter: true, //default active,
      conditionSelected: EnumValueForSelected.anyof as string,
      //condition test
      conditionList: [
        {
          value: EnumValueForSelected.anyof,
          text: computed(() => locale.value.any)
        },
        {
          value: EnumValueForSelected.allof,
          text: computed(() => locale.value.all)
        }
      ],
      headerList: [
        {
          value: EnumHeaderFilter.from,
          text: computed(() => locale.value.from)
        },
        {
          value: EnumHeaderFilter.to,
          text: computed(() => locale.value.to)
        },
        {
          value: EnumHeaderFilter.cc,
          text: computed(() => locale.value.cc)
        },
        {
          value: EnumHeaderFilter.toCc,
          text: computed(() => locale.value.to + ' ' + locale.value.or + ' ' + locale.value.cc)
        },
        {
          value: EnumHeaderFilter.subject,
          text: computed(() => locale.value.subject)
        },
        {
          value: EnumHeaderFilter.message,
          text: computed(() => locale.value.message)
        },
        {
          value: EnumHeaderFilter.size,
          text: computed(() => locale.value.size)
        },
        {
          value: EnumHeaderFilter.date,
          text: computed(() => locale.value.date)
        },
        {
          value: EnumHeaderFilter.body,
          text: computed(() => locale.value.body)
        },
        {
          value: EnumHeaderFilter.attachment,
          text: computed(() => locale.value.attachment)
        },
        {
          value: EnumHeaderFilter.readReceipt,
          text: computed(() => locale.value.readRecipt)
        },
        {
          value: EnumHeaderFilter.addressIn,
          text: computed(() => locale.value.addressIn)
        },
        {
          value: EnumHeaderFilter.calendar,
          text: computed(() => locale.value.calendar)
        },
        {
          value: EnumHeaderFilter.social,
          text: computed(() => locale.value.social)
        },
        {
          value: EnumHeaderFilter.headerNamed,
          text: computed(() => locale.value.headerNamed)
        }
      ],
      subOneConditionList: [
        {
          name: EnumSubCondition.forFromToSubject,
          dataByHeader: [
            {
              value: EnumValueForSelected.matchExactly,
              text: computed(() => locale.value.matchExactly)
            },
            {
              value: EnumValueForSelected.doNotMatchExactly,
              text: computed(() => locale.value.doNotMatchExactly)
            },
            {
              value: EnumValueForSelected.contains,
              text: computed(() => locale.value.contains)
            },
            {
              value: EnumValueForSelected.doNotContains,
              text: computed(() => locale.value.doNotContains)
            },
            {
              value: EnumValueForSelected.matchWildcardCondition,
              text: computed(() => locale.value.matchWildcardCondition)
            },
            {
              value: EnumValueForSelected.doNotMatchWildcardCondition,
              text: computed(() => locale.value.doNotMatchWildcardCondition)
            }
          ]
        },
        {
          name: EnumSubCondition.forMessage,
          dataByHeader: [
            {
              value: EnumValueForSelected.is,
              text: computed(() => locale.value.is)
            },
            {
              value: EnumValueForSelected.isNot,
              text: computed(() => locale.value.isNot)
            }
          ]
        },
        {
          name: EnumSubCondition.forSize,
          dataByHeader: [
            {
              value: EnumValueForSelected.under,
              text: computed(() => locale.value.under)
            },
            {
              value: EnumValueForSelected.doNotUnder,
              text: computed(() => locale.value.notUnder)
            },
            {
              value: EnumValueForSelected.over,
              text: computed(() => locale.value.over)
            },
            {
              value: EnumValueForSelected.doNotOver,
              text: computed(() => locale.value.notOver)
            }
          ]
        },
        {
          name: EnumSubCondition.forDate,
          dataByHeader: [
            {
              value: EnumValueForSelected.before,
              text: computed(() => locale.value.before)
            },
            {
              value: EnumValueForSelected.doNotBefore,
              text: computed(() => locale.value.notBefore)
            },
            {
              value: EnumValueForSelected.after,
              text: computed(() => locale.value.after)
            },
            {
              value: EnumValueForSelected.doNotAfter,
              text: computed(() => locale.value.notAfter)
            }
          ]
        },
        {
          name: EnumSubCondition.forBody,
          dataByHeader: [
            {
              value: EnumValueForSelected.contains,
              text: computed(() => locale.value.contains)
            },
            {
              value: EnumValueForSelected.doNotContains,
              text: computed(() => locale.value.doNotContains)
            },
          ]
        },
        {
          name: EnumSubCondition.forAttachmentToReadReceipt,
          dataByHeader: [
            {
              value: EnumValueForSelected.exists,
              text: computed(() => locale.value.exists)
            },
            {
              value: EnumValueForSelected.notExists,
              text: computed(() => locale.value.notExists)
            },
          ]
        },
        {
          name: EnumSubCondition.forAddressIn,
          dataByHeader: [
            {
              value: EnumValueForSelected.from,
              text: computed(() => locale.value.from)
            },
            {
              value: EnumValueForSelected.to,
              text: computed(() => locale.value.to)
            },
            {
              value: EnumValueForSelected.cc,
              text: computed(() => locale.value.cc)
            },
            {
              value: EnumValueForSelected.toCc,
              text: computed(() => locale.value.to + ' ' + locale.value.or + ' ' + locale.value.cc)
            },
          ]
        },
        {
          name: EnumSubCondition.forCalendar,
          dataByHeader: [
            {
              value: EnumValueForSelected.inviteRequested,
              text: computed(() => locale.value.inviteRequested)
            },
            {
              value: EnumValueForSelected.inviteNotRequested,
              text: computed(() => locale.value.inviteNotRequested)
            },
            {
              value: EnumValueForSelected.inviteReplied,
              text: computed(() => locale.value.inviteReplied)
            },
            {
              value: EnumValueForSelected.inviteNotReplied,
              text: computed(() => locale.value.inviteNotReplied)
            },
          ]
        },
        {
          name: EnumSubCondition.forSocial,
          dataByHeader: [
            {
              value: EnumValueForSelected.facebookNotification,
              text: computed(() => locale.value.facebookNotification)
            },
            {
              value: EnumValueForSelected.linkedInNotification,
              text: computed(() => locale.value.linkedInNotification)
            },
            {
              value: EnumValueForSelected.twitterNotification,
              text: computed(() => locale.value.twitterNotification)
            },
          ]
        },
      ],
      subTwoConditionList: [
        {
          name: EnumSubCondition.forMessage,
          dataByHeader: [
            {
              value: EnumValueForSelected.inConversationIStarted,
              text: computed(() => locale.value.inConversationIStarted)
            },
            {
              value: EnumValueForSelected.inConversationIParticipated,
              text: computed(() => locale.value.inConversationIParticipated)
            },
            {
              value: EnumValueForSelected.massMarketing,
              text: computed(() => locale.value.massMarketing)
            },
            {
              value: EnumValueForSelected.fromDistributionList,
              text: computed(() => locale.value.fromDistributionList)
            },
            {
              value: EnumValueForSelected.markAs,
              text: computed(() => locale.value.markAs)
            },
            {
              value: EnumValueForSelected.flagged,
              text: computed(() => locale.value.flagged)
            }
          ]
        },
        {
          name: EnumSubCondition.forAddressIn,
          dataByHeader: [
            {
              value: EnumValueForSelected.in,
              text: computed(() => locale.value.in)
            },
            {
              value: EnumValueForSelected.notIn,
              text: computed(() => locale.value.notIn)
            },
            {
              value: EnumValueForSelected.isMe,
              text: computed(() => locale.value.isMe)
            },
            {
              value: EnumValueForSelected.isNotMe,
              text: computed(() => locale.value.isNotMe)
            },
          ]
        },
        {
          name: EnumSubCondition.forHeaderNamed,
          dataByHeader: [
            {
              value: EnumValueForSelected.matchExactly,
              text: computed(() => locale.value.matchExactly)
            },
            {
              value: EnumValueForSelected.doNotMatchExactly,
              text: computed(() => locale.value.doNotMatchExactly)
            },
            {
              value: EnumValueForSelected.contains,
              text: computed(() => locale.value.contains)
            },
            {
              value: EnumValueForSelected.doNotContains,
              text: computed(() => locale.value.doNotContains)
            },
            {
              value: EnumValueForSelected.matchWildcardCondition,
              text: computed(() => locale.value.matchWildcardCondition)
            },
            {
              value: EnumValueForSelected.doNotMatchWildcardCondition,
              text: computed(() => locale.value.doNotMatchWildcardCondition)
            },
            {
              value: EnumValueForSelected.exists,
              text: computed(() => locale.value.exists)
            },
            {
              value: EnumValueForSelected.notExists,
              text: computed(() => locale.value.notExists)
            },
          ]
        },
      ],
      subThreeConditionList: [
        {
          name: EnumSubCondition.forFromOrToOrCcOrToCc,
          dataByHeader: [
            {
              value: EnumValueForSelected.all,
              text: computed(() => locale.value.all)
            },
            {
              value: EnumValueForSelected.localPart,
              text: computed(() => locale.value.localPart)
            },
            {
              value: EnumValueForSelected.domain,
              text: computed(() => locale.value.domain)
            },
          ]
        },
        {
          name: EnumSubCondition.forMessageAndMarkAs,
          dataByHeader: [
            {
              value: EnumValueForSelected.read,
              text: computed(() => locale.value.read)
            },
            {
              value: EnumValueForSelected.priority,
              text: computed(() => locale.value.priority)
            },
            {
              value: EnumValueForSelected.highImportance,
              text: computed(() => locale.value.highI)
            },
            {
              value: EnumValueForSelected.normalImportance,
              text: computed(() => locale.value.normalI)
            },
            {
              value: EnumValueForSelected.lowImportance,
              text: computed(() => locale.value.lowI)
            },
          ]
        },
        {
          name: EnumSubCondition.forSize,
          dataByHeader: [
            {
              value: EnumValueForSelected.b,
              text: computed(() => locale.value.b)
            },
            {
              value: EnumValueForSelected.kb,
              text: computed(() => locale.value.kb)
            },
            {
              value: EnumValueForSelected.mb,
              text: computed(() => locale.value.mb)
            },
            {
              value: EnumValueForSelected.gb,
              text: computed(() => locale.value.gb)
            },
          ]
        },
        {
          name: EnumSubCondition.forAddressInAndNotEqualIsMeAndNotMe,
          dataByHeader: [
            {
              value: EnumValueForSelected.contacts,
              text: computed(() => locale.value.contacts)
            },
            {
              value: EnumValueForSelected.frequentEmail,
              text: computed(() => locale.value.frequentEmail)
            },
          ]
        },
      ],
      //action
      headerActionList: [
        {
          value: EnumHeaderFilter.keepInInbox,
          text: computed(() => {
            if(typeOutgoingFilter.value){
              return locale.value.keepInSent;
            }
            else{
              return locale.value.keepInInbox;
            }
          })
        },
        {
          value: EnumHeaderFilter.discard,
          text: computed(() => locale.value.discard)
        },
        {
          value: EnumHeaderFilter.moveIntoFolder,
          text: computed(() => locale.value.moveIntoFolder)
        },
        {
          value: EnumHeaderFilter.tagWith,
          text: computed(() => locale.value.tagWith)
        },
        {
          value: EnumHeaderFilter.markAs,
          text: computed(() => locale.value.markAs)
        },
        {
          value: EnumHeaderFilter.redirectToAddress,
          text: computed(() => locale.value.redirectToAddress)
        },
      ],
      subActionList: [
        {
          name: EnumSubCondition.forMarkAs, //default
          dataByHeader: [
            {
              value: EnumValueForSelected.read,
              text: computed(() => locale.value.read)
            },
            {
              value: EnumValueForSelected.flagged,
              text: computed(() => locale.value.flagged)
            },
          ]
        },
      ]
    });
    const folderPathForFilterAction = ref('');
    const tagNameForFilterAction = ref('');
    const filterActionSelectedByBrowser = ref<FilterActionDetails>({} as FilterActionDetails);
    const typeEditFilterRule = ref(false);
    const nameOfFilterRuleEditing = ref('');

    function initAddFilterRuleByConversation(item: Item){
      //init value
      return {
        active: true,
        name: '',
        filterActions: [{
          actionKeep: [{}] as FilterActionDetails[],
          actionStop: [{}] as FilterActionDetails[],
        }] as FilterActions[],
        filterTests: [{
          condition: EnumValueForSelected.allof,
          addressTest: [{
            header: EnumHeaderFilter.from,
            negative: false,
            part: EnumValueForSelected.all,
            stringComparison: EnumValueForSelected.contains,
            value: item.sender,
          }] as FilterTestDetails[],
          headerTest: [{
            header: EnumHeaderFilter.subject,
            negative: false,
            stringComparison: EnumValueForSelected.is,
            value: item.subject,
          }] as FilterTestDetails[],
        }]
      } as IFilterRule;
    }

    function initAddConditionTest() {
      //init value test
      const filterTest = {
        idRender: Math.random().toString(36).substring(2, 9),
        headerSelected: EnumHeaderFilter.from,
        subOneConditionSelected: '',
        subTwoConditionSelected: '',
        subThreeConditionSelected: '',
        showInputSubOne: false,
        showInputSubTwo: true,
        showInputSubThree: false,
        headerList: [...dataForFilterRuleSelected.value.headerList],
        subOneConditionList: dataForFilterRuleSelected.value.subOneConditionList[0],
        subTwoConditionList: dataForFilterRuleSelected.value.subOneConditionList[0],
        subThreeConditionList: dataForFilterRuleSelected.value.subOneConditionList[0],
      } as FilterTestDetails;
      //set to list
      filterTestDetailList.value.push(filterTest);
      //set default data
      actionDefaultSubDataForHeaderSelected(filterTest);
    }

    function initAddConditionAction() {
      //init value action
      const filterAction = {
        idRender: Math.random().toString(36).substring(2, 9),
        headerActionSelected: EnumHeaderFilter.keepInInbox,
        subActionSelected: '',
        showInputSubAction: false,
        headerActionList: [...dataForFilterRuleSelected.value.headerActionList] as DataByHeader[],
        subActionConditionList: {name: '', dataByHeader: [] as DataByHeader[]} as SubCondition,
      } as FilterActionDetails;
      filterActionDetailList.value.push(filterAction);
    }

    function resetAllDataByAddFilter(){
      //reset value
      folderPathForFilterAction.value = '';
      tagNameForFilterAction.value = '';
      filterActionSelectedByBrowser.value = {} as FilterActionDetails;
      filterTestDetailList.value = [] as FilterTestDetails[];
      filterActionDetailList.value = [] as FilterActionDetails[];
      dataForFilterRuleSelected.value.name = '';
      dataForFilterRuleSelected.value.active = true;
      dataForFilterRuleSelected.value.notProcessFilter = true;
      initAddConditionTest();
      initAddConditionAction();
      actionDefaultSubDataForHeaderSelected(filterTestDetailList.value[0]);
    }

    function resetAllDataByEditFilter(data: IFilterRule) {
      //reset value
      folderPathForFilterAction.value = '';
      tagNameForFilterAction.value = '';
      filterActionSelectedByBrowser.value = {} as FilterActionDetails;
      filterTestDetailList.value = [] as FilterTestDetails[];
      filterActionDetailList.value = [] as FilterActionDetails[];
      //set new value
      dataForFilterRuleSelected.value.name = data.name;
      dataForFilterRuleSelected.value.active = data.active;
      dataForFilterRuleSelected.value.notProcessFilter = data.filterActions && data.filterActions.length > 0 ? data.filterActions.some(value => value.actionStop && value.actionStop.length > 0) : false;
      if (data.filterTests && data.filterTests.length > 0) {
        for (const filterTests of data.filterTests) {
          for (const [key, value] of Object.entries(filterTests)) {
            if (key !== 'condition') {
              const items = value as FilterTestDetails[];
              if (items && items.length > 0) {
                for (const item of items) {
                  //Xu ly cac item da tao
                  setDataByEditFilterRuleForHeader(item, key, dataForFilterRuleSelected.value, filterTestDetailList.value);
                  //set gia tri duoc select
                  actionDefaultSubDataForHeaderSelected(item, true, key);
                }
              }
            } else {
              dataForFilterRuleSelected.value.conditionSelected = value as string;
            }
          }
        }
      }
      if (data.filterActions && data.filterActions.length > 0) {
        for (const filterActions of data.filterActions) {
          for (const [key, value] of Object.entries(filterActions)) {
            const items = value as FilterActionDetails[];
            if (items && items.length > 0) {
              if (key !== 'actionStop') {
                for (const item of items) {
                  //Xu ly cac item da tao
                  setDataByEditFilterRuleForHeaderAction(item, key, dataForFilterRuleSelected.value, filterActionDetailList.value);
                  //set gia tri duoc select
                  actionDefaultSubDataForHeaderActionSelected(item, true, key);
                }
              }
            }
          }
        }
      }
    }

    function conditionShowInputSubOne(filterTest: FilterTestDetails) {
      if (filterTest.headerSelected === EnumHeaderFilter.headerNamed) {
        filterTest.subOneConditionSelected = filterTest.value ? filterTest.value : '';
        filterTest.showInputSubOne = true;
      } else {
        filterTest.showInputSubOne = false;
      }
    }

    function conditionShowInputSubTwo(filterTest: FilterTestDetails) {
      if (filterTest.headerSelected === EnumHeaderFilter.from || filterTest.headerSelected === EnumHeaderFilter.to || filterTest.headerSelected === EnumHeaderFilter.cc || filterTest.headerSelected === EnumHeaderFilter.toCc || filterTest.headerSelected === EnumHeaderFilter.subject || filterTest.headerSelected === EnumHeaderFilter.size || filterTest.headerSelected === EnumHeaderFilter.body) {
        filterTest.subTwoConditionSelected = filterTest.value ? filterTest.value : '';
        filterTest.showInputSubTwo = true;
      } else {
        filterTest.showInputSubTwo = false;
      }
    }

    function conditionShowInputSubThree(filterTest: FilterTestDetails) {
      if (filterTest.subTwoConditionSelected !== EnumValueForSelected.notExists && filterTest.subTwoConditionSelected !== EnumValueForSelected.exists && filterTest.headerSelected === EnumHeaderFilter.headerNamed) {
        filterTest.subThreeConditionSelected = filterTest.value ? filterTest.value : '';
        filterTest.showInputSubThree = true;
      } else {
        filterTest.showInputSubThree = false;
      }
    }

    function conditionShowInputSubAction(filterAction: FilterActionDetails) {
      if (filterAction.headerActionSelected === EnumHeaderFilter.redirectToAddress) {
        filterAction.subActionSelected = '';
        filterAction.showInputSubAction = true;
      } else {
        filterAction.showInputSubAction = false;
      }
    }

    function actionDefaultSubDataForHeaderSelected(filterTest: FilterTestDetails, editing?: boolean, key?: string) {
      // Nếu myFilterRuleStore bằng giá trị 'date' thì sẽ mở đông thời ô tìm kiếm
      myFilterRuleStore.filterRuleStatus = filterTest.headerSelected;
      //check show input
      conditionShowInputSubOne(filterTest);
      conditionShowInputSubTwo(filterTest);
      conditionShowInputSubThree(filterTest);
      //sub one condition
      let getDataForSubOne = {name: '', dataByHeader: []} as SubCondition;
      if (filterTest.headerSelected === EnumHeaderFilter.from || filterTest.headerSelected === EnumHeaderFilter.to || filterTest.headerSelected === EnumHeaderFilter.cc || filterTest.headerSelected === EnumHeaderFilter.toCc || filterTest.headerSelected === EnumHeaderFilter.subject) {
        getDataForSubOne = dataForFilterRuleSelected.value.subOneConditionList.find(value => value.name === EnumSubCondition.forFromToSubject) as SubCondition;
      } else if (filterTest.headerSelected === EnumHeaderFilter.message) {
        getDataForSubOne = dataForFilterRuleSelected.value.subOneConditionList.find(value => value.name === EnumSubCondition.forMessage) as SubCondition;
      } else if (filterTest.headerSelected === EnumHeaderFilter.size) {
        getDataForSubOne = dataForFilterRuleSelected.value.subOneConditionList.find(value => value.name === EnumSubCondition.forSize) as SubCondition;
      } else if (filterTest.headerSelected === EnumHeaderFilter.date) {
        getDataForSubOne = dataForFilterRuleSelected.value.subOneConditionList.find(value => value.name === EnumSubCondition.forDate) as SubCondition;
      } else if (filterTest.headerSelected === EnumHeaderFilter.body) {
        getDataForSubOne = dataForFilterRuleSelected.value.subOneConditionList.find(value => value.name === EnumSubCondition.forBody) as SubCondition;
      } else if (filterTest.headerSelected === EnumHeaderFilter.attachment || filterTest.headerSelected === EnumHeaderFilter.readReceipt) {
        getDataForSubOne = dataForFilterRuleSelected.value.subOneConditionList.find(value => value.name === EnumSubCondition.forAttachmentToReadReceipt) as SubCondition;
      } else if (filterTest.headerSelected === EnumHeaderFilter.addressIn) {
        getDataForSubOne = dataForFilterRuleSelected.value.subOneConditionList.find(value => value.name === EnumSubCondition.forAddressIn) as SubCondition;
      } else if (filterTest.headerSelected === EnumHeaderFilter.calendar) {
        getDataForSubOne = dataForFilterRuleSelected.value.subOneConditionList.find(value => value.name === EnumSubCondition.forCalendar) as SubCondition;
      } else if (filterTest.headerSelected === EnumHeaderFilter.social) {
        getDataForSubOne = dataForFilterRuleSelected.value.subOneConditionList.find(value => value.name === EnumSubCondition.forSocial) as SubCondition;
      }
      //set value for sub one
      filterTest.subOneConditionList = getDataForSubOne;
      if (!editing) filterTest.subOneConditionSelected = getDataForSubOne.name ? getDataForSubOne.dataByHeader[0].value : '';
      //Check neu dang edit thi gan cac gia tri da luu
      if (editing) {
        dataSelectedByHeaderFromToSubject(filterTest);
        dataSelectedByHeaderMessage(filterTest, key);
        dataSelectedByHeaderSize(filterTest, key);
        dataSelectedByHeaderDate(filterTest);
        dataSelectedByHeaderBody(filterTest);
        dataSelectedByHeaderAttachmentToReadReceipt(filterTest);
        dataSelectedByHeaderAddressIn(filterTest, key);
        dataSelectedByHeaderCalendar(filterTest);
        dataSelectedByHeaderSocial(filterTest, key);
        dataSelectedByHeaderNamed(filterTest, key);
      }
      //sub two condition
      let getDataForSubTwo = {name: '', dataByHeader: []} as SubCondition;
      if (filterTest.headerSelected === EnumHeaderFilter.message) {
        getDataForSubTwo = dataForFilterRuleSelected.value.subTwoConditionList.find(value => value.name === EnumSubCondition.forMessage) as SubCondition;
      } else if (filterTest.headerSelected === EnumHeaderFilter.addressIn) {
        getDataForSubTwo = dataForFilterRuleSelected.value.subTwoConditionList.find(value => value.name === EnumSubCondition.forAddressIn) as SubCondition;
      } else if (filterTest.headerSelected === EnumHeaderFilter.headerNamed) {
        getDataForSubTwo = dataForFilterRuleSelected.value.subTwoConditionList.find(value => value.name === EnumSubCondition.forHeaderNamed) as SubCondition;
      }
      //set value for sub two
      filterTest.subTwoConditionList = getDataForSubTwo;
      if (!editing) filterTest.subTwoConditionSelected = getDataForSubTwo.name ? getDataForSubTwo.dataByHeader[0].value : '';
      //sub three condition
      let getDataForSubThree = {name: '', dataByHeader: []} as SubCondition;
      if (filterTest.headerSelected === EnumHeaderFilter.from || filterTest.headerSelected === EnumHeaderFilter.to || filterTest.headerSelected === EnumHeaderFilter.cc || filterTest.headerSelected === EnumHeaderFilter.toCc) {
        getDataForSubThree = dataForFilterRuleSelected.value.subThreeConditionList.find(value => value.name === EnumSubCondition.forFromOrToOrCcOrToCc) as SubCondition;
      } else if (filterTest.headerSelected === EnumHeaderFilter.size) {
        getDataForSubThree = dataForFilterRuleSelected.value.subThreeConditionList.find(value => value.name === EnumSubCondition.forSize) as SubCondition;
      } else if (filterTest.headerSelected === EnumHeaderFilter.addressIn && filterTest.subTwoConditionSelected !== EnumValueForSelected.isMe && filterTest.subTwoConditionSelected !== EnumValueForSelected.isNotMe) {
        getDataForSubThree = dataForFilterRuleSelected.value.subThreeConditionList.find(value => value.name === EnumSubCondition.forAddressInAndNotEqualIsMeAndNotMe) as SubCondition;
      } else if (filterTest.headerSelected === EnumHeaderFilter.message && filterTest.subTwoConditionSelected === EnumValueForSelected.markAs) {
        getDataForSubThree = dataForFilterRuleSelected.value.subThreeConditionList.find(value => value.name === EnumSubCondition.forMessageAndMarkAs) as SubCondition;
      }
      //set value for sub three
      filterTest.subThreeConditionList = getDataForSubThree;
      if (!editing) filterTest.subThreeConditionSelected = getDataForSubThree.name ? getDataForSubThree.dataByHeader[0].value : '';
    }

    function actionDefaultSubDataForSubTwoSelected(filterTest: FilterTestDetails) {
      //check show input
      conditionShowInputSubThree(filterTest);
      //sub three condition
      let getDataForSubThree = {name: '', dataByHeader: []} as SubCondition;
      if (filterTest.headerSelected === EnumHeaderFilter.message && filterTest.subTwoConditionSelected === EnumValueForSelected.markAs) {
        getDataForSubThree = dataForFilterRuleSelected.value.subThreeConditionList.find(value => value.name === EnumSubCondition.forMessageAndMarkAs) as SubCondition;
      } else if (filterTest.headerSelected === EnumHeaderFilter.addressIn && (filterTest.subTwoConditionSelected === EnumValueForSelected.in || filterTest.subTwoConditionSelected === EnumValueForSelected.notIn)) {
        getDataForSubThree = dataForFilterRuleSelected.value.subThreeConditionList.find(value => value.name === EnumSubCondition.forAddressInAndNotEqualIsMeAndNotMe) as SubCondition;
      }
      //set value for sub three
      filterTest.subThreeConditionList = getDataForSubThree;
      filterTest.subThreeConditionSelected = getDataForSubThree.name ? getDataForSubThree.dataByHeader[0].value : '';
    }

    function actionDefaultSubDataForHeaderActionSelected(filterAction: FilterActionDetails, editing?: boolean, key?: string) {
      //check show input
      conditionShowInputSubAction(filterAction);
      //sub action condition
      let getDataForSubAction = {name: '', dataByHeader: []} as SubCondition;
      if (filterAction.headerActionSelected === EnumHeaderFilter.markAs) {
        getDataForSubAction = dataForFilterRuleSelected.value.subActionList.find(value => value.name === EnumSubCondition.forMarkAs) as SubCondition;
      }
      //set value for sub action
      filterAction.subActionConditionList = getDataForSubAction;
      if (!editing) filterAction.subActionSelected = getDataForSubAction.name ? getDataForSubAction.dataByHeader[0].value : '';
      //Check neu dang edit thi gan cac gia tri da luu
      if (editing) {
        dataSelectedByHeaderAction(filterAction, key);
      }
    }

    function actionTagSelected(tag: Tag) {
      tagNameForFilterAction.value = tag.name;
    }

    function actionBrowser(filterAction: FilterActionDetails, typeShow: string) {
      if (typeShow === EnumHeaderFilter.moveIntoFolder) {
        emitter.emit('show-modal-select-folder', {modalTitle: locale.value.moveIntoFolder})
      } else if (typeShow === EnumHeaderFilter.tagWith) {
        emitter.emit('show-modal-select-tag', {modalTitle: locale.value.tagWith})
      }
      filterActionSelectedByBrowser.value = filterAction;
    }

    function actionRemoveConditionTest(filterTest: FilterTestDetails) {
      const findIndex = filterTestDetailList.value.findIndex(value => value.idRender === filterTest.idRender);
      if (findIndex >= 0) {
        filterTestDetailList.value.splice(findIndex, 1);
      }
    }

    function actionRemoveConditionAction(filterAction: FilterActionDetails) {
      const findIndex = filterActionDetailList.value.findIndex(value => value.idRender === filterAction.idRender);
      if (findIndex >= 0) {
        filterActionDetailList.value.splice(findIndex, 1);
      }
    }

    async function actionModifyFilterRule() {
      myFilterRuleStore.filterRuleStatus = '';
      //check valid
      if (!dataForFilterRuleSelected.value.name) {
        showToastMessage(INVALID_NAME, true);
        return;
      }
      //init value request
      const itemRequest = {
        name: dataForFilterRuleSelected.value.name,
        active: dataForFilterRuleSelected.value.active,
        filterTests: [] as FilterTests[],
        filterActions: [] as FilterActions[],
      } as IFilterRule;
      //logic
      const filterTests = {
        condition: dataForFilterRuleSelected.value.conditionSelected,
        addressTest: [] as FilterTestDetails[],
        headerTest: [] as FilterTestDetails[],
        addressBookTest: [] as FilterTestDetails[],
        attachmentTest: [] as FilterTestDetails[],
        bodyTest: [] as FilterTestDetails[],
        bulkTest: [] as FilterTestDetails[],
        contactRankingTest: [] as FilterTestDetails[],
        conversationTest: [] as FilterTestDetails[],
        dateTest: [] as FilterTestDetails[],
        facebookTest: [] as FilterTestDetails[],
        flaggedTest: [] as FilterTestDetails[],
        meTest: [] as FilterTestDetails[],
        headerExistsTest: [] as FilterTestDetails[],
        importanceTest: [] as FilterTestDetails[],
        inviteTest: [] as FilterTestDetails[],
        linkedinTest: [] as FilterTestDetails[],
        listTest: [] as FilterTestDetails[],
        sizeTest: [] as FilterTestDetails[],
        twitterTest: [] as FilterTestDetails[],
        mimeHeaderTest: [] as FilterTestDetails[],
      } as FilterTests;
      //logic value rule test
      if (filterTestDetailList.value.length > 0) {
        for (const item of filterTestDetailList.value) {
          //FromToSubject
          initDataMofidyForHeaderFromToSubject(item, filterTests);
          //Message
          initDataMofidyForHeaderMessage(item, filterTests);
          //Size
          initDataMofidyForHeaderSize(item, filterTests);
          //Date
          initDataMofidyForHeaderDate(item, filterTests);
          //Body
          initDataMofidyForHeaderBody(item, filterTests);
          //Attachment -> Read Receipt
          initDataMofidyForHeaderAttachmentToReadReceipt(item, filterTests);
          //AddressIn
          initDataMofidyForHeaderAddressIn(item, filterTests);
          //Calendar
          initDataMofidyForHeaderCalendar(item, filterTests);
          //Social
          initDataMofidyForHeaderSocial(item, filterTests);
          //Header named
          initDataMofidyForHeaderNamed(item, filterTests);
        }
        //set to value request
        itemRequest.filterTests.push(filterTests);
      }
      if (filterActionDetailList.value.length > 0) {
        //init value
        const filterAction = {
          actionKeep: [] as FilterActionDetails[],
          actionStop: [],
          actionDiscard: [],
          actionFlag: [],
          actionFileInto: [],
          actionRedirect: [],
          actionTag: [],
        } as FilterActions;
        //Check value notProcessFilter
        filterAction.actionStop = dataForFilterRuleSelected.value.notProcessFilter ? [{}] as FilterActionDetails[] : [];
        //check value action detail
        for (const item of filterActionDetailList.value) {
          //keep and discard
          initDataMofidyForHeaderActionKeepAndDiscard(item, filterAction);
          //FileIntoAndFlagAndRedirectAndTag
          initDataMofidyForActionFileIntoAndFlagAndRedirectAndTag(item, filterAction);
        }
        //set to value request
        itemRequest.filterActions.push(filterAction);
      }
      //Check neu la kieu edit hay ko
      if (typeEditFilterRule.value) {
        //edit value in store
        const findIndexOfFilterRule = myFilterRuleList.value.findIndex(value => value.name === nameOfFilterRuleEditing.value);
        if (findIndexOfFilterRule >= 0) {
          //set to store
          myFilterRuleList.value[findIndexOfFilterRule] = itemRequest;
          //call request (has reload)
          await myFilterRuleStore.modifyFilterRule(typeOutgoingFilter.value, true);
        }
      } else {
        //set to store
        const findExisted = myFilterRuleList.value.some(value => value.name === itemRequest.name);
        //Chi goi request neu chua ton tai trong danh sach
        if (!findExisted) {
          myFilterRuleList.value.push(itemRequest);
          //call request (has reload)
          await myFilterRuleStore.modifyFilterRule(typeOutgoingFilter.value, true);
        } else {
          showToastMessage(VALUE_EXISTED, true);
        }
      }
      //close modal
      modalFilter.value = false;
      //deselected filter selected
      emitter.emit('modify-success-filter');
    }

    onMounted(() => {
      initAddConditionTest();
      initAddConditionAction();
      //set default selected sub test condition
      actionDefaultSubDataForHeaderSelected(filterTestDetailList.value[0]);
      emitter.on('show-modal-add-filter', (data: boolean) => {
        modalFilter.value = true;
        typeEditFilterRule.value = false;
        typeOutgoingFilter.value = data;
        resetAllDataByAddFilter();
      });
      emitter.on('show-modal-edit-filter', (data: {filterRule: IFilterRule, outgoingFilter: boolean}) => {
        if (data) {
          //show modal
          modalFilter.value = true;
          typeEditFilterRule.value = true;
          typeOutgoingFilter.value = data.outgoingFilter;
          //set new value
          nameOfFilterRuleEditing.value = data.filterRule.name;
          resetAllDataByEditFilter(data.filterRule);
        }
      });
      emitter.on('show-modal-add-filter-by-conversation', (item: Item) => {
        if(item){
          //init value
          const filterRule = initAddFilterRuleByConversation(item);
          //show modal
          modalFilter.value = true;
          typeEditFilterRule.value = false;
          typeOutgoingFilter.value = false;
          //set new value
          nameOfFilterRuleEditing.value = filterRule.name;
          resetAllDataByEditFilter(filterRule);
        }
      });
      emitter.on('data-select-folder', (data: any) => {
        if(data && data.folderSelected as Folder){
          const findFilterActionInData = filterActionDetailList.value.find(value => value.idRender === filterActionSelectedByBrowser.value.idRender);
          if (findFilterActionInData) {
            if (findFilterActionInData.headerActionSelected === EnumHeaderFilter.moveIntoFolder) {
              findFilterActionInData.folderPath = data.folderSelected.folderPath;
            }
          }
        }
      });
      emitter.on('data-select-tag', (data: any) => {
        if(data && data.tagSelected as Tag){
          const findFilterActionInData = filterActionDetailList.value.find(value => value.idRender === filterActionSelectedByBrowser.value.idRender);
          if (findFilterActionInData) {
            if (findFilterActionInData.headerActionSelected === EnumHeaderFilter.tagWith) {
              findFilterActionInData.tagName = data.tagSelected.name;
            }
          }
        }
      });
    });

    onDeactivated(() => {
      emitter.off('show-modal-add-filter');
      emitter.off('show-modal-edit-filter');
      emitter.off('show-modal-add-filter-by-conversation');
      emitter.off('data-select-folder');
      emitter.off('data-select-tag');
    });

    return {
      env,
      locale,
      modalFilter,
      EnumHeaderFilter,
      EnumValueForSelected,
      actionBrowser,
      actionTagSelected,
      actionDefaultSubDataForHeaderSelected,
      actionDefaultSubDataForSubTwoSelected,
      actionDefaultSubDataForHeaderActionSelected,
      actionRemoveConditionTest,
      actionRemoveConditionAction,
      initAddConditionTest,
      initAddConditionAction,
      dataForFilterRuleSelected,
      actionModifyFilterRule,
      filterTestDetailList,
      filterActionDetailList,
    }
  }
})
</script>