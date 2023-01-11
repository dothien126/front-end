<template>
  <div class="p-2">
    <select class="form-select mb-2" aria-label="Message selecte" v-model="formData.fromTo">
      <option v-for="(item) in searchFilterAdvanced.mail.fromTo" :key="item" :value="item.name">
        {{ locale[item.name] }}
      </option>
    </select>
    <div>
      <!--  BEGIN: Data address  -->
      <div v-if="formData.fromTo === searchFilterAdvanced.mail.fromTo[0].name">
        <!--  Begin HungHv: onKeyPress ko cho phép có dấu cách trong input        -->
        <input onkeypress="return /[^\s]/.test(event.key)" type="text" class="form-control flex-1"
               @keyup.enter="searchRequestFromConversation" v-model="formData.searchRequestFrom"
               :placeholder="formData.fromTo === searchFilterAdvanced.mail.fromTo[0].name ? locale.enterAddress : locale.enterDomain"/>
      </div>
      <!--  END: Data address  -->
      <!--  BEGIN: Data domain  -->
      <div v-else>
        <TomSelect
            v-model="formData.searchFromTomSelect"
            :disabled="false"
            :multiple="false"
            :options="{
                      placeholder: locale.enterDomain,
                      maxOptions: 100,
                      create: true
                    }"
            class="min-w-[220px]"
        >
          <option v-for="item in domain" :key="item._content" :value="item._content"
          >{{ item._content }}
          </option>
        </TomSelect>
        <!--  END: Data domain  -->
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {computed, defineComponent, reactive, ref, watch} from "vue";
import {MyStore} from "@/stores/my-store";
import {MyBrowseStore} from "@/stores/browse-store/browse-store";
  export default defineComponent({
    name: 'SentToForm',
    props: {
      searchAdvancedObj: {
        type: Object,
        require: true
      },
      searchAdvancedRoot: {
        type: Object
      }
    },
    emits: ['update:search-advanced-obj', 'update:search-advanced-root'],
    methods: {
      cancel(evt) {
        evt.stopPropagation();
        this.searchAvd.active = false;
      },
    },
    setup(props, { emit }) {
      const myStore = MyStore();
      const emitter = myStore.useEmitter();
      const myBrowseStore = MyBrowseStore();
      const domain = computed(() => myBrowseStore.myBrowseList.bd);
      const locale = computed(() => myStore.locale);
      const searchAvd = computed({
        get: () => {
          return props.searchAdvancedObj as any;
        },
        set: (vl) => emit('update:search-advanced-obj', vl)
      });
      const searchFilterAdvanced = ref({
        mail: {
          fromTo: [
            {
              name: 'Address',
              dict: "enterAddress",
            },
            {
              name: 'Domain',
              dict: "enterDomain",
            }
          ]
        }
      })

      const formData = reactive({
        fromTo: searchFilterAdvanced.value.mail.fromTo[0].name,
        searchRequestFrom: '',
        searchFromTomSelect: ['']
      })

      watch(() => formData.searchFromTomSelect, (val: any) => {
        formData.searchRequestFrom = val as string;
        searchRequestFromConversation();
      })

      // Truyền value lên TopBarSearch Component
      function searchRequestFromConversation () {
        emitter.emit('init-value-filter-advanced', { value: 'to:' + formData.searchRequestFrom, type: 'to:', isRemove: false });
      }

      return {
        locale,
        domain,
        searchAvd,
        formData,
        searchFilterAdvanced,
        searchRequestFromConversation
      }
    }
  })
</script>

<style></style>