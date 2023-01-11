<template>
  <div :class="{'is-drag': fileDrag,}"
       @dragleave.prevent="fileDrag = false"
       @dragover.prevent="fileDrag = true"
       @drop.prevent="fileDrag = false"
       v-show="showModal"
       class="p-2 bg-light dark:text-slate-300 dark:bg-dark rounded min-w-[280px] absolute top-full right-0 mr-8 shadow-md">
    <div @drop="actionChangeFileUpload($event, true)"
         class="dragdrop-file-upload p-2 rounded border-2 border-dashed border-slate-300 dark:border-slate-600 relative">
      <ol class="list-decimal text-left list-inside dark:text-slate-300 md:whitespace-nowrap">
        <li>{{ locale.inforImageFormat }}</li>
        <li>{{ locale.limitStorage }}</li>
        <li>{{ locale.notUploadOtherBrand }}</li>
        <li>{{ locale.fileSize }}</li>
      </ol>
      <div class="text-center mt-3 mb-2">
        <label class="btn btn-primary">
          {{ locale.browseUpload }}
          <input ref="fileUploadRef" @change="actionChangeFileUpload($event, false)" class="opacity-0 absolute inset-0 cursor-pointer" type="file"
                 accept=".png, .jpg, .jpeg, .svg"/>
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {showToastMessage} from "@/utils/MyFunction";
import AdminCompanyService from "@/service/admin/AdminCompanyService";
import {ResponseData} from "@/model/ResponseData";
import {Company} from "@/model/Company";
import {IAdminCompanyUser} from "@/model/admin/dto/IAdminCompanyUser";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {modeLogo} from "@/utils/MyVariables";

  export default defineComponent({
    name: "FileUploadDropdown",
    props: {
      mode:{
        type: String,
        default: modeLogo.darkMode,
      }
    },
    setup(props) {
      const fileUploadRef = ref();
      const myStore = MyStore();
      const adminStore = MyAdminStore();
      const locale = computed(() => myStore.locale);
      const myJwt = computed(() => adminStore.myAdminJwt);
      const emitter = myStore.useEmitter();
      const myAdminCompanyUser = computed(() => adminStore.myAdminCompanyUser as IAdminCompanyUser);
      const showModal = ref(false);
      const fileDrag = ref(false);
      const mode = computed(() => props.mode);

      async function actionChangeFileUpload(_evt, isDrop: boolean) {
        const target = isDrop ? _evt.dataTransfer : _evt.target as HTMLInputElement;
        if (target && target.files && target.files.length > 0) {
          const file = target.files[0] as File;
          if (file) {
            //check size
            if (file.size / 1024 > 500) {
              showToastMessage(locale.value.limitStorage, true);
            } else {
              //init request
              const formData = new FormData();
              formData.append(myAdminCompanyUser.value.adminId, file);
              formData.append('useDarkMode', mode.value === modeLogo.darkMode ? 'true' : 'false');
              //call request
              const response = await AdminCompanyService.uploadLogo(formData, myJwt.value);
              if (response.data) {
                const responseData: ResponseData = response.data;
                if (!responseData.values.error) {
                  // Set giá trị
                  const bodyResponse = responseData.values as Company;
                  if (bodyResponse && bodyResponse._id) {
                    //close modal
                    showModal.value = false;
                    //reload image
                    emitter.emit('reload-upload-image-logo');
                  }
                } else {
                  showToastMessage(responseData.values.error, true);
                }
              }
            }
          }
        }
      }

      onMounted(() => {
        emitter.on('show-upload-image-logo-' + mode.value, () => {
          showModal.value = true;
        });
        emitter.on('hidden-upload-image-logo-' + mode.value, () => {
          showModal.value = false;
        });
      });

      onDeactivated(() => {
        emitter.off('show-upload-image-logo-' + mode.value);
        emitter.off('hidden-upload-image-logo-' + mode.value);
      })

      return {
        locale,
        showModal,
        fileDrag,
        fileUploadRef,
        actionChangeFileUpload
      }
    }
  })
</script>