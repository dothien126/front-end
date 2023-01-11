<template>
  <div class="relative mail-auto-complete-group">
    <input type="text"
           ref="typeInputMail"
           class="form-control ip-email"
           v-model="search"
           v-on:focus="search = ''"
           v-on:blur="actionAddMailFromInput"
           @keyup.down="actionKeyDown"
           @keyup.up="actionKeyUp"
           @keyup.enter="actionEnterMailToList()"/>
    <div v-if="search.length > 0"
         class="mail-contact-autocomplete absolute top-full left-0 z-50 bg-light dark:bg-slate-700 dark:text-slate-300 shadow-md rounded max-h-[360px] overflow-y-overlay overflow-x-hidden min-w-[15rem]">
      <a class="item block hover:bg-slate-600/30"
         v-for="(item,index) in userList"
         :key="item"
         @keyup.enter="actionEnterMailToList()"
         :class="`${indexSelected === index ? 'bg-slate-600/30' : ''}`"
      >
        <button @click="actionMailToList(item.email); search = ''" class="w-full h-full p-3 text-left"
                :disabled="mailList.includes(item.email)"
                :class="{ 'cursor-not-allowed': mailList.includes(item.email) }">
          <!--      <div class="w-10 h-10 flex-none image-fit mr-1">-->
          <!--        <img-->
          <!--            :alt="item.fullName"-->
          <!--            class="rounded-full"-->
          <!--            :src="faker.photos[0]"-->
          <!--        />-->
          <!--      </div>-->
          <div>
            <h3 :title="item.fullName" class="truncate w-44">
              {{ item.fullName }}
            </h3>
            <p class="text-xs">{{ item.email.toLowerCase().replace(/\s/g, '') }}</p>
          </div>
        </button>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, PropType, ref, watch} from "vue";
import {AutoComplete} from "@/model/AutoComplete";
import AutoCompleteService from "@/service/AutoCompleteService";
import {MyStore} from "@/stores/my-store";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";

export default defineComponent({
  name: 'MailInputAutoComplete',
  props: {
    mailList: {type: Array as PropType<string[]>, default: []},
  },
  setup(props, {emit}) {
    //init value
    const search = ref('');
    const typeInputMail = ref();
    const mailList = computed({
      get: () => props.mailList as string[],
      set: (value) => emit('update:mailList', value),
    });
    const userList = ref<AutoComplete[]>([]);
    const myStore = MyStore();
    const indexSelected = ref(0);
    const emailSelected = ref<string>("")

    async function actionGetAutocomplete() {
      //reset value
      userList.value.splice(0, userList.value.length);
      //init request
      const itemFind = new AutoComplete();
      itemFind.keywords = search.value;
      //call request
      const response = await AutoCompleteService.find(itemFind, myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          const autoCompleteResponse = responseData.values as AutoComplete[];
          userList.value.push(...autoCompleteResponse);
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    function actionAddMailFromInput() {
      setTimeout(() => {
        if (search.value) {
          const mtArr = search.value.split(',');
          if (mtArr.length > 0) {
            mtArr.forEach(item => {
              if (item) mailList.value.push(item);
              //reset value
              userList.value.splice(0, userList.value.length);
              search.value = '';
            })
          }
        }
      }, 500);
    }

    function actionMailToList(data: string) {
      if (data.length > 0) {
        const mtArr = data.split(',');
        if (mtArr.length > 0) {
          mtArr.forEach(item => {
            if (item) mailList.value.push(item);
            search.value = '';
          })
        }
        //reset value
        userList.value.splice(0, userList.value.length);
      }
    }

    function actionEnterMailToList() {
      if(indexSelected.value === 0) {
        const userInfo = userList.value.at(indexSelected.value) as AutoComplete
        emailSelected.value = userInfo.email
      }
      const mtArr = emailSelected.value as string;
      mailList.value.push(mtArr);
      search.value = '';
    }

    function actionKeyDown() {
      indexSelected.value++;
      if (indexSelected.value > userList.value.length - 1) {
        indexSelected.value = 0
      }
      if (userList.value.length > 0) {
        const userInfo = userList.value.at(indexSelected.value) as AutoComplete
        emailSelected.value = userInfo.email
      }
    }

    function actionKeyUp() {
      indexSelected.value--;
      if (indexSelected.value < 0) {
        indexSelected.value = userList.value.length - 1
      }
      if (userList.value.length > 0) {
        const userInfo = userList.value.at(indexSelected.value) as AutoComplete
        emailSelected.value = userInfo.email
      }
    }

    onMounted(async () => {
      if (typeInputMail.value) {
        typeInputMail.value.focus();
      }
      if (search.value) {
        await actionGetAutocomplete();
      }
    });

    watch(() => search.value, async value => {
      if (value) {
        await actionGetAutocomplete();
      }
    });

    return {
      typeInputMail,
      search,
      userList,
      mailList,
      actionAddMailFromInput,
      indexSelected,
      actionMailToList,
      actionEnterMailToList,
      actionKeyUp,
      actionKeyDown,
    }
  }
})

</script>
