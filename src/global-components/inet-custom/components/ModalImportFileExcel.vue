<template>
  <!-- BEGIN: Modal Content -->
  <Modal size="modal-xl" backdrop="static" :show="modalShowHide" @hidden="modalShowHide = false">
    <ModalHeader class="flex items-center">
      <h3 class="text-base grow">{{ modalTitle }}</h3>
      <p>{{ locale.viewFileExample }} <a class="text-blue-200 hover:underline"
                         href="https://drive.inet.vn/uploads/donv@inet.vn/download/file-1623903333086_email_import.xlsx"
                         target="_blank">{{ locale.here }}</a></p>
    </ModalHeader>
    <ModalBody>
      <div>
        <div>
          <button type="button" title="Xoá file" class="btn btn-secondary rounded-full px-2 ml-2" v-if="fileUpload"
                  @click="fileUpload = false">
            <TrashIcon class="w-4 h-4"/>
          </button>
          <div ref="fileRef"
               :class="{'is-drag': fileDrag, 'mr-8': fileUpload}"
               @dragleave.prevent="fileDrag = false"
               @dragover.prevent="fileDrag = true"
               @drop.prevent="fileDrag = false"
               class="p-2 dark:text-slate-300 dark:bg-dark rounded min-w-[280px]">
            <div @drop="actionChangeFileUpload($event, true)" @click="fileUploadRef.click()"
                 class="dragdrop-file-upload p-2 rounded border-2 border-dashed dark:border-slate-600 cursor-pointer">
              <div class="max-w-[30rem] text-center mx-auto">
                <ol class="list-decimal list-inside text-slate-300 md:whitespace-nowrap">
                  <li>{{ locale.supportFormatXlsx }}</li>
                  <li>{{ locale.limitFileSize }}</li>
                </ol>
                <div class="mt-3 mb-2 text-slate-500">
                  <div class="inline-block">
                    <i icon-name="file-plus-2" class="w-12 h-12"></i>
                    <input ref="fileUploadRef" type="file" class="hidden"
                           @change="actionChangeFileUpload($event, false)" accept=".xlsx"/>
                  </div>
                  <h3 class="text-xl">{{ locale.selectFileExcelUpload }}</h3>
                  <p>{{ locale.dragOrDropFileHere }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto mt-5 mb-2" v-if="fileInfo.name">
          <table class="table table-bordered">
            <thead>
            <tr>
              <td class="dark:bg-white/10" colspan="4">
                <div class="flex justify-center items-center">
                  <div class="w-8 h-8 text-slate-500">
                    <svg-icons name="excel" class="w-8 h-8"/>
                  </div>
                  <div class="py-2 px-5">
                    <h4 class="text-base">{{ locale.fileUploaded }}</h4>
                    <p class="text-slate-500">{{ fileInfo.name }}</p>
                    <p class="text-slate-500">{{ prettyBytes(fileInfo.size) || 0 }}</p>
                  </div>
                  <div class="p-2">
                    <button type="button" class="btn btn-sm btn-outline-danger" title="Xoá file" @click="removeFileUpload()">
                      <XIcon class="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr>
              <th class="whitespace-nowrap">{{ locale.nameDisplay }}</th>
              <th class="whitespace-nowrap">{{ locale.account }}</th>
              <th class="whitespace-nowrap">{{ locale.password }}</th>
              <th class="whitespace-nowrap w-[10rem]">{{ locale.capacity }}(MB)</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>
                <select class="form-select" aria-label="Tên hiển thị" v-model="genDisplayName">
                  <option v-for="table in tableList" :value="table.header">{{ table.header }}</option>
                </select>
              </td>
              <td>
                <select class="form-select" aria-label="Tài khoản" v-model="genAccount">
                  <option value="defaultGenByDisplayName">{{ locale.selfGenAccount }}
                  </option>
                  <option v-for="table in tableList" :value="table.header">{{ table.header }}</option>
                </select>
              </td>
              <td>
                <label class="form-check-label">
                  <input type="checkbox" class="form-check-input" v-model="genPass"/>
                  {{ locale.selfGeneratedPassword }}
                </label>
              </td>
              <td>
                <div class="input-group">
                  <input type="number" class="form-control" v-model="genQuota" aria-label="Input size"
                         aria-describedby="input-group-size1"/>
                  <div id="input-group-size1" class="input-group-text">MB</div>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="5" class="text-center">
                <button type="button" class="btn btn-primary min-w-[7rem]" @click="actionViewDataUserManager">
                  {{ locale.see }}
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="overflow-x-auto" v-if="viewFileImport && fileInfo.name && dataUserManager.userList.length > 0">
          <table class="table">
            <thead>
            <tr>
              <th class="w-5">
                <label class="form-check-label label-check-ip m-0" title="Check All">
                  <input class="form-check-input" type="checkbox" @change="actionSelectedAllViewData" v-model="selectedAll"/>
                </label>
              </th>
              <th class="whitespace-nowrap">{{ locale.nameDisplay }}</th>
              <th class="whitespace-nowrap">{{ locale.account }}</th>
              <th class="whitespace-nowrap">{{ locale.password }}</th>
              <th class="whitespace-nowrap">{{ locale.capacity }}(MB)</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item) in dataUserManager.userList" :key="item">
              <td>
                <label class="form-check-label label-check-ip m-0" title="Check item">
                  <input class="form-check-input" type="checkbox" v-model="item.selected"/>
                </label>
              </td>
              <td class="whitespace-nowrap">
                <input type="text" class="form-control min-w-[10rem]" v-model="item.displayName"/>
              </td>
              <td class="whitespace-nowrap">
                <input type="text" class="form-control min-w-[10rem]" v-model="item.account"/>
              </td>
              <td class="whitespace-nowrap">
                <input type="text" class="form-control min-w-[10rem]"
                       v-model="item.password"/>
              </td>
              <td class="whitespace-nowrap">
                <div class="input-group">
                  <input type="number" class="form-control" v-model="item.dataMax"
                         aria-describedby="input-group-size"/>
                  <div id="input-group-size" class="input-group-text">MB</div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="-mx-2 text-right mt-3">
          <button type="button" @click="modalShowHide = false" class="btn btn-secondary min-w-[7em] m-2">
            {{ locale['cancel'] }}
          </button>
          <button v-if="fileInfo.name" v-show="viewFileImport" type="button" @click="actionImportExcel"
                  class="btn btn-primary min-w-[7em] m-2">
            {{ locale.importFile }}
          </button>
        </div>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Modal Content -->
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {createIcons, icons} from 'lucide';
import {genPassword, removeVietnameseTones, showToastMessage} from "@/utils/MyFunction";
import readXlsxFile from "read-excel-file";
import {IAdminDataTable} from "@/model/admin/dto/IAdminDataTable";
import {IAdminUserManager, IUserAccount} from "@/model/admin/dto/IAdminUserManager";
import {IPagination} from "@/model/interface/IPagination";
import {INVALID_MIN_NUMBER, INVALID_OPTION_SELECT } from "@/utils/MyVariables";
import {AFieldOfCreateAccountRequest, IAdminCreateAccountRequest} from "@/model/admin/IAdminCreateAccountRequest";
import AdminUserManagerService from "@/service/admin/AdminUserManagerService";
import {ResponseData} from "@/model/ResponseData";
import {AdminUserManagerStore} from "@/stores/admin-store/user-manager/user-manager-store";
import {IAdminCompanyUser} from "@/model/admin/dto/IAdminCompanyUser";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {Fault} from "@/model/Fault";
import SvgIcons from "@/global-components/svg-icons/Main.vue";
import { prettyBytes } from "@/utils/pretty-bytes-function/PrettyBytes";

export default defineComponent({
  name: 'ModalImportFileExcel',
  components: {SvgIcons},
  data() {
    return {
      fileUpload: false,
      fileDrag: false
    }
  },
  props: {
    modalTitle: {
      type: String,
      default: () => 'Import từ file Excel'
    },
    modalShow: {
      type: Boolean,
      default: () => false
    }
  },
  emits: ['update:modal-show'],
  mounted() {
    createIcons({icons, nameAttr: 'icon-name'});
  },
  setup(props, {emit}) {
    const modalShowHide = computed({
      get: () => props.modalShow,
      set: (vl) => emit('update:modal-show', vl)
    });
    const mystore = MyStore();
    const adminStore = MyAdminStore();
    const adminUserManagerStore = AdminUserManagerStore();
    const myJwt = computed(() => adminStore.myAdminJwt);
    const myAdminCompanyUser = computed(() => adminStore.myAdminCompanyUser as IAdminCompanyUser);
    const locale = computed(() => mystore.locale);
    const viewFileImport = ref(false);
    const fileUploadRef = ref();
    const fileInfo = ref({
      name: '',
      size: 0,
    });
    const genDisplayName = ref('');
    const genAccount = ref('defaultGenByDisplayName');
    const genPass = ref(true);
    const genQuota = ref(10);
    const tableList = ref<IAdminDataTable[]>([] as IAdminDataTable[]);
    const dataUserManager = ref<IAdminUserManager>({
      userList: [] as IUserAccount[],
      pagination: {} as IPagination
    } as IAdminUserManager);
    const selectedAll = ref(true);

    async function actionChangeFileUpload(_evt, isDrop: boolean) {
      try {
        fileUploadRef.value = isDrop ? _evt.dataTransfer : _evt.target as HTMLInputElement;
        if (fileUploadRef.value && fileUploadRef.value.files && fileUploadRef.value.files.length > 0) {
          const file = fileUploadRef.value.files[0] as File;
          if (file) {
            //check size
            if (file.size / 1024 > 2500) {
              showToastMessage('Kích thước tập tin không vượt quá 2500 KB', true);
            } else {
              //reset value
              tableList.value = [];
              //init value
              fileInfo.value.name = file.name;
              fileInfo.value.size = file.size;
              //logic read file
              const resultFile = await readXlsxFile(file);
              if (resultFile && resultFile.length > 1) {
                for (let i = 0; i < resultFile.length; i++) {
                  //init value
                  const rows = resultFile[i];
                  //Set header
                  if (i === 0) {
                    for (const header of rows) {
                      if (String(header)) {
                        const tableData: IAdminDataTable = {
                          header: String(header),
                          data: [] as string[],
                        };
                        tableList.value.push(tableData);
                      }
                    }
                  }
                  //Set data
                  else {
                    rows.forEach((value, index) => {
                      if (value && tableList.value && tableList.value.length > 0) {
                        tableList.value[index].data.push(String(value));
                      }
                    });
                  }
                }
              }
            }
          }
        }
      } catch (e) {
        let err = '';
        if (e instanceof Error) {
          err = e.message;
        }
        showToastMessage(err, true);
      }
    }

    function actionViewDataUserManager(){
      //check valid
      if(!genDisplayName.value || !genAccount.value){
        showToastMessage(INVALID_OPTION_SELECT, true);
      }
      else if(genQuota.value <= 0){
        showToastMessage(INVALID_MIN_NUMBER, true);
      }
      //logic
      else{
        //show template
        viewFileImport.value = true;
        //reset value
        dataUserManager.value.userList = [] as IUserAccount[];
        selectedAll.value = true;
        //set value
        if(tableList.value.length > 0){
          //find data display name
          const findDataDisplayNameTable = tableList.value.find(value => value.header === genDisplayName.value);
          //get value in data table
          if(findDataDisplayNameTable && findDataDisplayNameTable.data && findDataDisplayNameTable.data.length > 0){
            for(const data of findDataDisplayNameTable.data){
              //init value list
              const userAccount = {displayName: data, account: '', password: '', dataMax: genQuota.value, selected: true} as IUserAccount;
              //password
              userAccount.password = genPass.value ? genPassword() : '';
              //set to list
              dataUserManager.value.userList.push(userAccount);
            }
          }
          //find data account sau
          let findDataAccountTable = tableList.value.find(value => value.header === genAccount.value);
          //Trường hợp find data account không thấy, chọn default theo displayname
          if(!findDataAccountTable) findDataAccountTable = findDataDisplayNameTable;
          //get value in data table
          if(findDataAccountTable && findDataAccountTable.data && findDataAccountTable.data.length > 0){
            findDataAccountTable.data.forEach((data, indexFindDataAccountTable) => {
              //init set value
              let accountArray = [] as string[];
              //Xử lý chuỗi nếu chọn default
              if(genAccount.value === 'defaultGenByDisplayName'){
                let getCharacter: string = data;
                //tách từng chuỗi
                const dataSplit = data.split(" ");
                //logic nếu có khoảng cách
                if(dataSplit && dataSplit.length > 1){
                  dataSplit.forEach((keyword, index) => {
                    if(index < dataSplit.length - 1){
                      getCharacter = removeVietnameseTones(keyword.substring(0, 1));
                    }
                    else{
                      getCharacter = removeVietnameseTones(keyword);
                    }
                    accountArray.push(getCharacter.toLowerCase());
                  });
                }
                else{
                  getCharacter = removeVietnameseTones(data);
                  accountArray.push(getCharacter.toLowerCase());
                }
                //Đảo ngược chuỗi (ký tự cuối xếp đầu tiên)
                accountArray.sort(a => {
                  //Nếu tìm thấy phần tử cuối trong mảng thì chuyển lên đầu tiên
                  if(a === accountArray[accountArray.length - 1]){
                    return -1;
                  }
                  //Ngược lại không sắp xếp
                  else {
                    return 0;
                  }
                });
              }else{
                accountArray.push(data);
              }
              //edit account in list
              const findUserAccount = dataUserManager.value.userList.find((_value, index) => index === indexFindDataAccountTable);
              if(findUserAccount){
                findUserAccount.account = accountArray.join("");
              }
            });
          }
        }
      }
    }

    function actionSelectedAllViewData(){
      if(dataUserManager.value.userList && dataUserManager.value.userList.length > 0){
        for(const item of dataUserManager.value.userList){
          item.selected = selectedAll.value;
        }
      }
    }

    async function actionImportExcel() {
      //init value
      const itemCreateList = [] as IAdminCreateAccountRequest[];
      //Duyệt từng phần tử trong danh sách import
      for(const formData of dataUserManager.value.userList){
        if(formData.selected){
          //init value account
          const account = formData.account + "@" + myAdminCompanyUser.value.domain;
          //init request
          const itemCreate  = {
            name: account,
            password: formData.password,
            a: [] as AFieldOfCreateAccountRequest[]
          } as IAdminCreateAccountRequest;
          //init value displayName
          const displayName = {n: 'displayName', _content: formData.displayName};
          //init value quota
          const quota = {n: 'zimbraMailQuota', _content: String(formData.dataMax)};
          //init value status
          const status = {n: 'zimbraAccountStatus', _content: 'active'};
          //set to value request
          itemCreate.a.push(displayName, quota, status);
          itemCreateList.push(itemCreate);
        }
      }
      //call request
      const response = await AdminUserManagerService.importAccount(itemCreateList, myJwt.value);
      if (response.data) {
        const responseData: ResponseData = response.data;
        const bodyResponse = responseData.values as Fault[];
        if (bodyResponse && bodyResponse.length <= 0) {
          //Thông báo thành công
          showToastMessage();
        }
        else{
          showToastMessage('', true, bodyResponse);
        }
        //Close modal
        modalShowHide.value = false;
        //reload data
        await adminUserManagerStore.initGetUserManagerList();
      }
    }

    const removeFileUpload = () => {
      fileUploadRef.value.value = '';
      fileInfo.value.name = '';
    }

    return {
      locale,
      fileInfo,
      selectedAll,
      genDisplayName,
      genAccount,
      genPass,
      genQuota,
      dataUserManager,
      tableList,
      prettyBytes,
      modalShowHide,
      fileUploadRef,
      viewFileImport,
      actionChangeFileUpload,
      actionViewDataUserManager,
      actionSelectedAllViewData,
      actionImportExcel,
      removeFileUpload
    }
  }
})
</script>