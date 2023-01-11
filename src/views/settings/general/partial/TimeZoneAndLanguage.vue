<template>
  <div class="time-zone-and-language">
    <div class="grid grid-cols-12 gap-4">
      <div class="min-w-[220px] col-span-12 sm:col-span-5 md:col-span-4">
        <h3 class="text-base">{{ locale.timeZoneAndLanguage }}</h3>
      </div>
      <div class="group-action col-span-12 sm:col-span-7 md:col-span-8">
        <div class="mb-3">
          <p class="mb-3"><b>{{ locale.timeZone }}:</b></p>
          <div class="inline-flex">
            <TomSelect v-model="myUser.timeZone" :options="{
                      placeholder: locale.timeZoneSelected,
                      maxOptions: 100,
                    }" class="min-w-[220px]">
              <option v-for="(item) in timeZoneList" :key="item" :value="item.name">
                {{ item.value }}
              </option>
            </TomSelect>
          </div>
        </div>
<!--        <div class="mb-3">-->
<!--          <p class="mb-3"><b>{{ locale.language }}:</b></p>-->
<!--          <div class="inline-flex">-->
<!--            <TomSelect v-model="myUser.language" :options="{-->
<!--                      placeholder: locale.languageSelected,-->
<!--                      maxOptions: 100,-->
<!--                    }" class="min-w-[220px]">-->
<!--              <option v-for="(language) in languageList" :key="language" :value="language.id">-->
<!--                {{ language.localName }}-->
<!--              </option>-->
<!--            </TomSelect>-->
<!--          </div>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import dayjs from "dayjs";
import {MyStore} from "@/stores/my-store";
import {timeZone} from "@/utils/time-zone";
import {TimeZoneDto} from "@/model/dto/TimeZoneDto";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import AvailableLocalesService from "@/service/AvailableLocalesService";
import {AvailableLocales, Locale} from "@/model/AvailableLocales";

export default defineComponent({
  name: "MailSettingTimeZoneAndLanguage",
  setup() {
    //init value
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const myUser = computed(() => myStore.myUser);
    const timeZoneList = ref<TimeZoneDto[]>([]);
    const languageList = ref<Locale[]>([]);

    function initGetTimeZoneList() {
      const timeZoneKeys = Object.entries(timeZone);
      for (const item of timeZoneKeys) {
        const timeZoneDto = new TimeZoneDto();
        timeZoneDto.name = item[0];
        timeZoneDto.value = item[1];
        timeZoneList.value.push(timeZoneDto);
      }
    }

    async function initGetLanguageAvailable() {
      //call request
      const response = await AvailableLocalesService.getAvailable(myStore.token);
      if (response.data) {
        const responseData: ResponseData = response.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          const availableLocales = responseData.values as AvailableLocales;
          languageList.value.push(...availableLocales.locale);
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    onMounted(async () => {
      initGetTimeZoneList();
      await initGetLanguageAvailable();
    })
    return {
      dayjs,
      myUser,
      locale,
      timeZoneList,
      languageList
    }
  }
})
</script>

<style lang="scss"></style>