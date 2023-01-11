<template>
  <div class="contacts-distribution-list">
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-5 md:col-span-4">
        <div class="form-group relative">
          <input type="search" class="form-control rounded pr-8" :placeholder="locale.contactSearch"
                 v-model="findInput"/>
          <button type="button" class="items-center absolute inset-y-0 px-3 right-0">
            <SearchIcon class="w-4 h-4"/>
          </button>
        </div>
        <div class="py-3 contacts-list">
          <div class="overflow-y-auto h-full bg-white dark:bg-slate-900 rounded">
            <div class="py-5 px-3 text-center"
                 v-if="distributionList.distributionList && distributionList.distributionList.length === 0">
              {{ locale.emailNotFound }} {{ locale.mailgroup }}
            </div>
            <a href="javascript:;" v-for="item in findDistributionList()"
               :key="item.id"
               :title="item.email"
               :class="{'bg-gray-300/70 dark:bg-gray-500/50': ctDetail.email === item.email}"
               class="intro-y block p-3 transition-colors hover:bg-gray-500/20 dark:hover:bg-gray-500/50"
               @click="actionDistributionListSelected(item)"
            >
              <div class="flex items-center">
                <div class="w-10 h-10 flex-none image-fit rounded-full">
                  <iNETComponent name="Avatar" :avt-json="item" :key-str="'email'"/>
                </div>
                <div class="truncate pl-3 grow">
                  <p class="font-medium truncate text-gray-600 dark:text-slate-300/75">{{ item.displayName }}</p>
                  <p class="truncate text-xs text-gray-600 dark:text-slate-500">{{ item.email }}</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div v-if="Object.entries(ctDetail).length > 0" class="col-span-7 md:col-span-8">
        <div class="flex flex-col sm:flex-row items-center">
          <iNETComponent name="Avatar" :avt-json="ctDetail" avt-class="w-10 h-10 shrink-0" :key-str="'email'"/>
          <div class="overflow-hidden px-3 grow">
            <p class="truncate font-medium text-xl text-gray-600 dark:text-slate-300/75">{{ ctDetail.displayName }}</p>
          </div>
          <div class="flex items-center mt-2 sm:mt-0 shrink-0" v-if="totalObject < distributionListMember.total">
            <div class="mx-auto my-auto mr-5 text-slate-500">
              {{ totalObject }} {{ locale.inTotalNumber }} {{ distributionListMember.total }}
            </div>
            <Tippy tag="button" :content="locale.older" class="btn btn-secondary"
                   :disabled="!distributionListMember.hasMore && number >= totalPage"
                   @click="actionNextDistributionListMember(distributionListMember)"
            >
              <ChevronRightIcon class="w-4 h-4"/>
            </Tippy>
          </div>
        </div>
        <div class="contacts-list py-3">
          <div class="grid grid-cols-12 gap-6 grid-flow-row auto-rows-max overflow-y-auto overflow-x-hidden h-full">
            <div class="col-span-12 xl:col-span-6" v-for="item in distributionListMember.distributionList"
                 :key="item.id">
              <div class="flex items-center py-2 px-3 bg-white dark:bg-slate-600/70 rounded">
                <div class="flex-none">
                  <iNETComponent name="Avatar" avt-class="w-8 h-8 shrink-0" :avt-json="item" :key-str="'email'"/>
                </div>
                <div class="pl-3 flex-auto">
                  <p class="font-medium text-gray-600 dark:text-slate-300/75">{{ item.displayName }}</p>
                  <p class="text-gray-600 dark:text-slate-500">{{ item.email }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {MyDistributionStore} from "@/stores/distribution-store/distribution-store";
import {IDistribution, IItemDistribution} from "@/model/interface/IDistribution";
import {IGetDistributionListMembersRequest} from "@/model/interface/IGetDistributionListMembersRequest";
import t from "typy";

export default defineComponent({
  name: 'ContactsDistributionList',
  setup() {
    const myStore = MyStore();
    const distributionStore = MyDistributionStore();
    const locale = computed(() => myStore.locale);
    const distributionList = computed(() => distributionStore.accountDistributionList as IDistribution);
    const distributionListMember = computed(() => distributionStore.distributionListMember as IDistribution);
    const ctDetail = ref<IItemDistribution>({} as IItemDistribution);
    const findInput = ref('');
    const getDistributionListMembersRequest = ref<IGetDistributionListMembersRequest>({} as IGetDistributionListMembersRequest);
    const offset = ref(0);
    const limit = ref(10);
    const number = ref(1);
    const totalObject = computed(() => t(distributionStore.distributionListMember.distributionList.length).safeNumber);
    const totalPage = computed(() => Math.ceil(distributionListMember.value.total / limit.value));

    function findDistributionList() {
      return distributionList.value.distributionList.filter(({
                                                               email,
                                                               displayName
                                                             }) => [email, displayName].some(val => val ? val.toLowerCase().includes(findInput.value.toLowerCase()) : ''));
    }

    async function actionDistributionListSelected(_item: IItemDistribution) {
      //set value to selected
      ctDetail.value = _item;
      //reset value
      distributionListMember.value.distributionList = [];
      distributionListMember.value.hasMore = false;
      distributionListMember.value.total = 0;
      offset.value = 0;
      number.value = 1;
      //reset request
      getDistributionListMembersRequest.value = {
        offset: offset.value,
        limit: limit.value,
        dl: {_content: _item.email},
      } as IGetDistributionListMembersRequest;
      //reload data
      await distributionStore.getDistributionListMember(getDistributionListMembersRequest.value);
    }

    async function actionNextDistributionListMember(itemMember: IDistribution) {
      //init number
      if (number.value >= 0) number.value += 1;
      //init offset
      const page = number.value - 1;
      offset.value = (page * limit.value);
      //only call request if has more
      if (itemMember.hasMore) {
        //init request
        getDistributionListMembersRequest.value = {
          offset: offset.value,
          limit: limit.value,
          dl: {_content: ctDetail.value.email},
        } as IGetDistributionListMembersRequest;
        //call request
        await distributionStore.getDistributionListMember(getDistributionListMembersRequest.value);
      }
    }

    return {
      locale,
      number,
      offset,
      totalObject,
      totalPage,
      ctDetail,
      findInput,
      findDistributionList,
      distributionList,
      distributionListMember,
      actionDistributionListSelected,
      actionNextDistributionListMember,
    }
  }
})
</script>

<style lang="scss">
@import "@/assets/scss/mixin/media-screen";

.inet-mail-themes {
  .contacts-distribution-list {
    .contacts-list {
      height: calc(100vh - 145px);
      @include mediaScreenWidth(min, md) {
        height: calc(100vh - 176px);
      }
      @include mediaScreenWidth(min, lg) {
        height: calc(100vh - 125px);
      }
    }
  }
}
</style>