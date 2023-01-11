<template>
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalBody class="px-5">
      <div class="col-span-12">
        <div class="mb-3">
          <label for="modal-create-new-folder" class="form-label">{{ locale.nameNewCreateFolder }}:</label>
          <div class="input-group">
            <input id="modal-create-new-folder" type="text" class="form-control"  v-model="vuelidate.name.$model" />
          </div>
          <template v-if="vuelidate.name.$error">
            <div v-for="(error, index) in vuelidate.name.$errors" :key="error" class="mt-2 text-sm text-red-600">* {{ error.$message }}</div>
          </template>
        </div>
        <div class="mb-3">
          <fieldset class="border border-slate-200 dark:border-slate-600 my-2 p-2 w-full">
            <legend class="px-2">{{ locale.rootPath }}</legend>
            <div>
          <span
              class="py-0.5 px-2 bg-white dark:bg-slate-600 rounded">{{ folderProperties.label }}</span>
            </div>
          </fieldset>
        </div>
        <div class="mb-3 flex items-center">
          <fieldset class="border border-slate-200 dark:border-slate-600 my-2 p-2 w-full">
            <legend class="px-2">{{ locale.folderColor }}</legend>
            <colors-picker :color-folder="folderProperties.rgb" @update:color-folder="actionChangeColor"/>
          </fieldset>
        </div>
        <div class="mb-3">
          <fieldset class="border border-slate-200 dark:border-slate-600 my-2 p-2 w-full">
            <legend class="px-2">{{ locale.feed }}</legend>
            <div class="form-check">
              <input id="feed-rss" class="form-check-input" type="checkbox" v-model="feedRss"/>
              <label class="form-check-label" for="feed-rss">{{ locale.registerFeedRssAtom }}</label>
            </div>
            <div class="mt-2" v-if="feedRss">
              <label for="feed-rss-url" class="form-label">{{ locale.url }}</label>
              <input id="feed-rss-url" type="text" class="form-control" v-model="feedRssInput"
                     :placeholder="locale.enter + '...'"/>
            </div>
          </fieldset>
        </div>
        <div class="text-right mt-5 -mx-1">
          <button type="button" class="btn btn-secondary min-w-[7em] m-1" @click="actionCloseModal"> {{
              locale.cancel
            }}
          </button>
          <button type="button" class="btn btn-primary min-w-[8em] m-1" @click="actionSaveChange">{{
              locale.add
            }}
          </button>
        </div>
      </div>
    </ModalBody>
  </Modal>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, reactive, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {Folder} from "@/model/Folder";
import {showToastMessage} from "@/utils/MyFunction";
import FolderService from "@/service/FolderService";
import {ResponseData} from "@/model/ResponseData";
import {FolderStore} from "@/stores/folder-store/folder-store";
import {TRANSPARENT_COLOR} from "@/utils/MyVariables";
import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default defineComponent({
  name: "SettingOnModalCreateFolder",
  data() {
    return {
      folderStroke: '',
      feedRss: false
    }
  },
  setup() {
    const myStore = MyStore();
    const folderStore = FolderStore();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);
    const showModal = ref(false);
    const feedRssInput = ref('');
    const folderProperties = ref<Folder>(new Folder());

    // validate
    const formFolder = reactive({
      name: "",
    })

    const rules = {
      name: {
        required: helpers.withMessage(locale.value.INVALID_FOLDER, required),
      },
    }
    const vuelidate = useVuelidate(rules, formFolder);

    function actionCloseModal() {
      // Đóng modal
      showModal.value = false;
    }

    function actionChangeColor(value){
      if(value){
        folderProperties.value.rgb = value;
      }
    }

    async function actionSaveChange() {
      //Valid before submit
      vuelidate.value.$touch();
      //Init object
      if (!vuelidate.value.$invalid) {
        //init request
        const itemRequest = new Folder();
        itemRequest.parentId = folderProperties.value.folderId;
        itemRequest.name = formFolder.name;
        itemRequest.rgb = folderProperties.value.rgb;
        itemRequest.url = feedRssInput.value;
        itemRequest.view = 'message';
        //call request
        const response = await FolderService.createFolder(itemRequest, myStore.token);
        if (response.data) {
          const responseData: ResponseData = response.data;
          //Kiểm tra backend có trả error ko
          if (responseData.values.error) {
            // Set thông báo thất bại
            showToastMessage(responseData.values.error, true);
          } else {
            const folderResponse: Folder = responseData.values;
            //Nếu có giá trị thì reload
            if (folderResponse.parentId) {
              //reload folder list
              await folderStore.initGetFolder();
              await folderStore.initGetFolderHasRoot();
              showToastMessage();
              // Đóng modal
              actionCloseModal();
            }
          }
        } else {
          showToastMessage(undefined, true);
        }
      }
    }

    onMounted(() => {
      emitter.on('setting-create-folder', (data: {show: boolean, folderSelected: Folder}) => {
        //reload data
        showModal.value = data.show;
        folderProperties.value = data.folderSelected;
        if(!folderProperties.value.rgb) folderProperties.value.rgb = TRANSPARENT_COLOR; //transparent
      });
    });

    onDeactivated(() => {
      emitter.off('setting-create-folder');
    });

    return {
      locale,
      showModal,
      vuelidate,
      folderProperties,
      feedRssInput,
      actionCloseModal,
      actionSaveChange,
      actionChangeColor,
    }
  }
})
</script>

<style scoped>

</style>
