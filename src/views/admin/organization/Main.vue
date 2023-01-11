<template>
  <div class="admin-organization">
    <!--    BEGIN: Dashboard view cấu hinhg thương hiệu-->
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 lg:col-span-8">
        <div class="p-3 rounded relative md:max-w-3xl lg:max-w-5xl" v-if="$route.path === showPlan[1]">
          <div class="flex flex-col md:flex-row items-center">
            <div class="flex items-center">
              <iNETComponent name="AdminLogoBrandView" :alt="locale.preview" frame-size="h-[80px]" img-size="h-[80px]"/>
              <span class="grow text-slate-400 text-base ml-2">{{myAdminCompanyUser.companyTitle}}</span>
            </div>
            <div class="px-5">
              <div>
                <p>{{ locale.adminAccount }}</p>
                <p><strong>{{ myAdminCompanyUser.adminEmail }}</strong></p>
              </div>
            </div>
          </div>
        </div>
        <!--    BEGIN: Chỉnh sửa cấu hình Thương Hiệu-->
        <div class="md:max-w-5xl lg:max-w-7xl p-5 bg-white dark:bg-darkmode-600 rounded shadow-md" v-if="$route.path === showPlan[0]">
          <h2 class="text-xl mb-3">{{ locale.inforConfig }}</h2>
          <div class="organization-edit mb-5">
            <!-- BEGIN: Tên doanh nghiệp -->
            <template v-if="!myAdminCompanyUser.companyTitle && orgName.view">
              <button type="button" class="btn btn-primary rounded-full px-3" @click="orgName.view = false">
                {{ locale.brandName }}
                <PlusCircleIcon class="w-5 h-5 ml-2"/>
              </button>
            </template>
            <template v-else>
              <fieldset class="border border-slate-300 dark:border-slate-300 my-2 p-3 w-full">
                <legend class="text-base px-2">{{locale.brandName}}</legend>
                <div class="organization-name text-sm" v-if="orgName.view">
                  <div class="flex items-center">
                    <b class="grow truncate">{{ myAdminCompanyUser.companyTitle }}</b>
                    <div class="shrink-0 pl-3">
                      <TippyContent to="textLayout" :options="{trigger: 'mouseenter focus'}">
                        {{!myAdminCompanyUser.companyVerticalMode ? locale.showOnTextRight : locale.showOnTextBelow }}
                      </TippyContent>
                      <button type="button" name="textLayout" class="btn btn-outline-secondary rounded-full px-2 mr-2"
                              @click="myAdminCompanyUser.companyVerticalMode = !myAdminCompanyUser.companyVerticalMode; actionChangeTitleOrLogo();">
                        <TypeIcon :style="{transform: myAdminCompanyUser.companyVerticalMode ? 'rotate(180deg)' : 'rotate(90deg)'}" class="w-4 h-4"/>
                      </button>
                      <button :title="locale.exModifyName" type="button" class="btn btn-outline-secondary rounded-full px-2 mr-2"
                              @click="orgName.view = false">
                        <EditIcon class="w-4 h-4"/>
                      </button>
                      <button type="button" :title="locale.deleteName"
                              class="btn btn-outline-danger rounded-full px-2"
                              @click="myAdminCompanyUser.companyTitle = ''; actionChangeTitleOrLogo();">
                        <TrashIcon class="w-4 h-4"/>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col md:flex-row md:items-end" v-else>
                  <div class="grow mb-2 md:mb-0 md:pr-3 min-w-[260px]">
                    <div class="flex items-center mb-1">
                      <label for="org-name" class="form-label grow pr-2">{{ locale.brandName }}</label>
                      <span class="text-slate-500">{{ locale.still1 }} {{ Math.ceil(120 - (myAdminCompanyUser.companyTitle ? myAdminCompanyUser.companyTitle.length : 0)) }} {{ locale.character }}</span>
                    </div>
                    <input id="org-name" type="text" v-model="myAdminCompanyUser.companyTitle" class="form-control dark:border-slate-200"
                           minlength="0" maxlength="120"/>
                  </div>
                  <div class="-mx-1 shrink-0 text-right">
                    <button type="button" :title="locale.save" class="btn btn-outline-primary m-1"
                            @click="orgName.view = true; actionChangeTitleOrLogo();">
                      <UploadCloudIcon class="w-4 h-4"/>
                    </button>
                    <button type="button" :title="locale.skip" class="btn btn-outline-primary m-1" @click="orgName.view = true">
                      <XIcon class="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </fieldset>
            </template>
            <!-- END: Tên doanh nghiệp -->
          </div>
          <div class="logo-preview-update" v-click-outside-box="actionOutSideClick">
            <fieldset class="border border-slate-300 dark:border-slate-300 mt-2 mb-5 p-3 w-full">
              <legend class="text-base px-2">{{locale.previewBrandLight}}</legend>
              <div class="preview-content">
                <div class="relative text-right">
                  <Tippy tag="button" type="button" :content="locale.changeLogo" class="btn btn-outline-secondary rounded-full px-2"
                         @click="actionShowModalUploadLogo(modeLogo.lightMode)">
                    <EditIcon class="w-4 h-4"/>
                  </Tippy>
                  <Tippy tag="button" type="button" :content="locale.removeLogo" class="btn btn-outline-danger rounded-full px-2 ml-2"
                         @click="actionRemoveLogo(modeLogo.lightMode)">
                    <TrashIcon class="w-4 h-4"/>
                  </Tippy>
                  <file-upload-dropdown :mode="modeLogo.lightMode"/>
                </div>
                <div class="grid grid-cols-12 gap-6">
                  <div class="topbar-left mb-3 col-span-12 xl:col-span-4">
                    <h4 class="text-slate-600/70 dark:text-white/50 mb-1">{{ locale.showOnLeftScreen }}</h4>
                    <div class="dark:bg-white border dark:border-slate-200 rounded p-3">
                      <a href="/admin" class="admin-logo flex items-center">
                        <iNETComponent name="AdminLogoBrandView" alt="Logo brand" frame-size="h-[35px] max-w-[57px]" img-size="h-full max-h-[35px]" :mode="modeLogo.lightMode"/>
                        <span class="ml-2 text-gray-600/70 dark:text-slate-500">Admin</span>
                      </a>
                    </div>
                  </div>
                  <div class="show-login col-span-12 xl:col-span-8">
                    <h4 class="text-slate-600/70 dark:text-white/50 mb-1">{{ locale.showOnLoginPage }}</h4>
                    <div class="bg-white border dark:border-slate-200 rounded text-center p-3">
                      <div class="inline-flex items-center" :class="{'flex-row': !myAdminCompanyUser.companyVerticalMode, 'flex-col': myAdminCompanyUser.companyVerticalMode}">
                        <iNETComponent name="AdminLogoBrandView" :alt="locale.changeLogo" :mode="modeLogo.lightMode" frame-size="h-[60px] max-w-[147px] shrink-0" img-size="h-full max-h-[90px]"/>
                        <span :class="{'ml-2': !myAdminCompanyUser.companyVerticalMode, 'mt-2': myAdminCompanyUser.companyVerticalMode}" class="grow text-slate-400 dark:text-slate-500 text-xl">{{myAdminCompanyUser.companyTitle}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
            <fieldset class="border border-slate-300 dark:border-slate-300 p-3 w-full">
              <legend class="text-base px-2">{{locale.previewBrandDark}}</legend>
              <div class="preview-dark-mode">
                <div class="relative text-right">
                  <Tippy tag="button" type="button" :content="locale.changeLogo" class="btn btn-outline-secondary rounded-full px-2 ml-2"
                         @click="actionShowModalUploadLogo(modeLogo.darkMode)">
                    <EditIcon class="w-4 h-4"/>
                  </Tippy>
                  <Tippy tag="button" type="button" :content="locale.removeLogo" class="btn btn-outline-danger rounded-full px-2 ml-2"
                         @click="actionRemoveLogo(modeLogo.darkMode)">
                    <TrashIcon class="w-4 h-4"/>
                  </Tippy>
                  <file-upload-dropdown :mode="modeLogo.darkMode"/>
                </div>
                <div class="grid grid-cols-12 gap-6">
                  <div class="col-span-12 xl:col-span-4">
                    <h4 class="text-slate-600/70 dark:text-white/50 mb-1">{{ locale.showOnLeftScreen }}</h4>
                    <div class="bg-slate-700 rounded p-3">
                      <a href="/admin" class="admin-logo flex items-center">
                        <iNETComponent name="AdminLogoBrandView" alt="Logo brand" frame-size="h-[35px] max-w-[57px]" img-size="h-full max-h-[35px]" :mode="modeLogo.darkMode"/>
                        <span class="ml-2 text-gray-600/70 dark:text-slate-500">Admin</span>
                      </a>
                    </div>
                  </div>
                  <div class="col-span-12 xl:col-span-8">
                    <h4 class="text-slate-600/70 dark:text-white/50 mb-1">{{ locale.showOnLoginPage }}</h4>
                    <div class="bg-[#303d53] rounded text-center p-3">
                      <div class="inline-flex items-center" :class="{'flex-row': !myAdminCompanyUser.companyVerticalMode, 'flex-col': myAdminCompanyUser.companyVerticalMode}">
                        <iNETComponent name="AdminLogoBrandView" :alt="locale.changeLogo" :mode="modeLogo.darkMode" frame-size="h-[60px] max-w-[147px] shrink-0" img-size="h-full max-h-[90px]"/>
                        <span :class="{'ml-2': !myAdminCompanyUser.companyVerticalMode, 'mt-2': myAdminCompanyUser.companyVerticalMode}" class="grow text-slate-400 dark:text-slate-500 text-xl">{{myAdminCompanyUser.companyTitle}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
    <!--    END: Dashboard view cấu hình thương hiệu-->
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import dayjs from "dayjs";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {IAdminCompanyUser} from "@/model/admin/dto/IAdminCompanyUser";
import { Company } from "@/model/Company";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import AdminCompanyService from "@/service/admin/AdminCompanyService";
import { MyStore } from "@/stores/my-store";
import {useDarkModeStore} from "@/stores/dark-mode";
import { env, modeLogo } from "@/utils/MyVariables";
import FileUploadDropdown from "@/views/admin/organization/components/FileUploadDropdown.vue";

export default defineComponent({
  name: "AdminOrganization",
  components: {FileUploadDropdown},
  data() {
    return {
      showPlan: ['/admin/organization', '/admin/dashboard'],
    }
  },
  props: {
    viewDashboard: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    // locale language
    const myStore = MyStore();
    const locale = computed(() => myStore.locale);
    const emitter = myStore.useEmitter();
    //init value
    const adminStore = MyAdminStore();
    const darkModeStore = useDarkModeStore();
    const myJwt = computed(() => adminStore.myAdminJwt);
    const myAdminCompanyUser = computed(() => adminStore.myAdminCompanyUser as IAdminCompanyUser);

    const orgName = ref({
      view: true,
    });
    const orgContact = ref({
      view: true,
    });
    const darkMode = computed(() => darkModeStore.darkMode as boolean);
    const fileUploadRef = ref();

    async function actionChangeTitleOrLogo() {
      //init request
      const itemUpdate = new Company();
      itemUpdate._id = myAdminCompanyUser.value.companyId;
      itemUpdate.title = myAdminCompanyUser.value.companyTitle;
      itemUpdate.logo = myAdminCompanyUser.value.companyLogo;
      itemUpdate.logoDarkMode = myAdminCompanyUser.value.companyLogoDarkMode;
      itemUpdate.verticalMode = myAdminCompanyUser.value.companyVerticalMode;
      //call request
      const response = await AdminCompanyService.updateTitleAndLogo(itemUpdate, myJwt.value);
      if (response.data) {
        const responseData: ResponseData = response.data;
        if (!responseData.values.error) {
          // Set giá trị
          const bodyResponse = responseData.values as Company;
          if (bodyResponse && bodyResponse._id) {
            //set store
            adminStore.setAdminCompanyUser(bodyResponse);
          }
        } else {
          showToastMessage(responseData.values.error, true);
        }
      }
    }

    async function actionRemoveLogo(mode: string) {
      const itemUpdate = new Company();
      itemUpdate.title = myAdminCompanyUser.value.companyTitle;
      itemUpdate.logo = myAdminCompanyUser.value.companyLogo;
      itemUpdate.logoDarkMode = myAdminCompanyUser.value.companyLogoDarkMode;
      if (mode === modeLogo.darkMode) {
        itemUpdate.logoDarkMode = '';
      }
      else if(mode === modeLogo.lightMode){
        itemUpdate.logo = '';
      }
      //set store
      adminStore.setAdminCompanyUser(itemUpdate);
      //call request update
      await actionChangeTitleOrLogo();
      //reload image
      emitter.emit('reload-upload-image-logo');
      //remove show upload logo
      actionOutSideClick();
    }

    function actionOutSideClick(){
      emitter.emit('hidden-upload-image-logo-' + modeLogo.lightMode);
      emitter.emit('hidden-upload-image-logo-' + modeLogo.darkMode);
    }

    function actionShowModalUploadLogo(mode: string){
      emitter.emit('show-upload-image-logo-' + mode);
    }
    return {
      locale,
      env,
      dayjs,
      modeLogo,
      darkMode,
      myAdminCompanyUser,
      orgName,
      orgContact,
      fileUploadRef,
      actionOutSideClick,
      actionChangeTitleOrLogo,
      actionShowModalUploadLogo,
      actionRemoveLogo
    }
  }
})
</script>

<style lang="scss">
@import './src/assets/scss/colors';

html.inet-mail-themes {
  .table {
    &-secondary {
      th,
      td {
        border-color: get-color(gray, 300);
      }
    }
  }

  .is-drag {
    .dragdrop-file-upload {
      border-color: get-color(violet, 600);
    }
  }
}
</style>