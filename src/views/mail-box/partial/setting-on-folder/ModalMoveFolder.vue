<template>
  <Modal backdrop="static" class="move-folder" v-if="showModal" :show="showModal" @hidden="showModal = false">
    <ModalBody class="px-5">
      <div class="col-span-12">
        <h3 class="mb-5 text-base pb-3 border-b border-gray-300 dark:border-slate-700">
          {{ locale.MOVE_FOLDER }}
          <span class="py-0.5 px-2 bg-white dark:bg-slate-600 rounded inline-block">
            {{ folderProperties.label }}
          </span>
        </h3>
        <div class="p-3 bg-light dark:bg-darkmode-400 rounded-md">
          <div class="mb-3">
            <label for="find-folder" class="form-label">{{ locale.selectDestinationFolder }}</label>
            <div class="input-group">
              <input id="find-folder" type="text" class="form-control"
                     :placeholder="locale.findFolder + '...'"
                     v-model="vuelidate.folderNameInput.$model"/>
            </div>
            <template v-if="vuelidate.folderNameInput.$error">
              <div v-for="(error) in vuelidate.folderNameInput.$errors" :key="error" class="mt-2 text-sm text-red-600">* {{ error.$message }}</div>
            </template>
          </div>
          <div class="overflow-y-auto overflow-x-hidden max-h-[380px]">
            <Tree v-model:nodes="moveFolderList" @nodeClick="actionSelectFolderWhenMove"
                  :is-has-tippy="isHasTippy"
                  :search-text="vuelidate.folderNameInput.$model"
                  :id-selected="vuelidate.folderIdSelected.$model"  />
          </div>
        </div>
        <div class="flex items-center mt-5">
          <button type="button" class="btn btn-secondary shrink-0" @click="actionCreateFolder">{{ locale.createFolder }}</button>
          <div class="grow text-right -mx-1">
            <button type="button" class="btn btn-secondary min-w-[7em] m-1" @click="actionCloseModal">
              {{ locale.cancel }}
            </button>
            <button type="button" class="btn btn-primary min-w-[8em] m-1" @click="actionSaveChange">
              {{ locale.saveChange }}
            </button>
          </div>
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
import {ResponseData} from "@/model/ResponseData";
import {FolderStore} from "@/stores/folder-store/folder-store";
import SettingOnModalCreateFolder from "./ModalCreateFolder.vue";
import {helpers, required} from "@vuelidate/validators";
import {REQUIRED} from "@/utils/MyVariables";
import useVuelidate from "@vuelidate/core";
import {BatchRequest, FolderActionRequest} from "@/model/BatchRequest";
import BatchService from "@/service/BatchService";
import {BatchResponse} from "@/model/BatchResponse";
import {Fault} from "@/model/Fault";

export default defineComponent({
  name: "ModalMoveFolder",
  components: { SettingOnModalCreateFolder },
  setup() {
    const myStore = MyStore();
    const folderStore = FolderStore();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);
    const showModal = ref(false);
    const folderProperties = ref<Folder>(new Folder());
    const folderWhenClickCreate = ref<Folder>(new Folder());
    const moveFolderList = computed({
      get: () => folderStore.myFolderListHasRoot,
      set: (data) => folderStore.myFolderListHasRoot = data,
    });
    const faultResponse = ref<Fault[]>([]);
    const isHasTippy = ref(false);

    const formData = reactive({
      folderNameInput: "",
      folderIdSelected: "",
    });

    // Rules
    const rules = {
      folderNameInput: {
        required: helpers.withMessage(REQUIRED, required),
      },
      folderIdSelected: {
        required: helpers.withMessage(REQUIRED, required),
      },
    };

    // Validate
    const vuelidate = useVuelidate(rules, formData);

    function actionCloseModal() {
      // Đóng modal
      showModal.value = false;
    }

    function actionSelectFolderWhenMove(folder: Folder) {
      formData.folderIdSelected = folder.folderId;
      formData.folderNameInput = folder.label;
      folderWhenClickCreate.value = folder;
    }

    async function actionSaveChange() {
      //Valid before submit
      vuelidate.value.$touch();
      //Init object
      if (vuelidate.value.$invalid) {
        showToastMessage(undefined, true);
      }
      else{
        //init request
        faultResponse.value = [];
        const batchRequest = new BatchRequest();
        const folderActionRequest = new FolderActionRequest();
        folderActionRequest.action.op = 'move';
        folderActionRequest.action.id = folderProperties.value.folderId;
        folderActionRequest.action.l = formData.folderIdSelected;
        batchRequest.FolderActionRequest.push(folderActionRequest);
        //call request
        const response = await BatchService.request(batchRequest, myStore.token);
        if (response.data) {
          const responseData: ResponseData = response.data;
          //Kiểm tra backend có trả error ko
          if (responseData.values.error) {
            // Set thông báo thất bại
            showToastMessage(responseData.values.error, true);
          } else {
            const bodyResponse = responseData.values as [];
            //Nếu thành công có response thì check 2 trường hợp là đã gửi share chưa
            if (bodyResponse && bodyResponse.length > 0) {
              for (const item of bodyResponse) {
                const checkHasData = item as BatchResponse;
                if (!checkHasData.folderId) faultResponse.value.push(item);
              }
            }
            //Bắn thông báo sau khi hoàn tất
            if (faultResponse.value.length > 0) {
              showToastMessage('', true, faultResponse.value);
            } else {
              //reload
              await folderStore.initGetFolder();
              await folderStore.initGetFolderHasRoot();
              //active default folder
              emitter.emit('on-active-folder-default');
              // Đóng modal
              actionCloseModal();
            }
          }
        } else {
          showToastMessage(undefined, true);
        }
      }
    }

    onMounted(async () => {
      emitter.on('setting-move-folder', (data: {show: boolean, folderSelected: Folder}) => {
        //reload data
        showModal.value = data.show;
        folderProperties.value = data.folderSelected;
        actionSelectFolderWhenMove(folderProperties.value);
      });
    });

    onDeactivated(() => {
      emitter.off('setting-move-folder');
    });

    function actionCreateFolder() {
      emitter.emit('setting-create-folder', {show: true, folderSelected: folderWhenClickCreate.value});
    }

    return {
      locale,
      vuelidate,
      showModal,
      isHasTippy,
      moveFolderList,
      folderProperties,
      actionCloseModal,
      actionSaveChange,
      actionSelectFolderWhenMove,
      actionCreateFolder
    }
  }
})
</script>

<style lang="scss">
  html.inet-mail-themes {
    &.dark {
      .modal {
        &.move-folder {
          .modal-dialog {
            .tree {
              background-color: transparent;
            }
          }
        }
      }
    }
  }
</style>
