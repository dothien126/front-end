<template>
  <div class="signatures-content py-3">
    <h1 class="text-base mb-3 px-5">{{ locale.signatures }}</h1>
    <div class="setting-gr-item border-t border-gray-20 dark:border-gray-500/30 px-5 relative">
      <!-- BEGIN: SIGNATURE CREATE -->
      <div class="signature-create border-b border-slate-300/50 dark:border-gray-600/50 py-5">
        <div class="grid grid-cols-12 gap-4">
          <div class="min-w-[150px] col-span-12 sm:col-span-5 md:col-span-4">
            <h3 class="text-base">{{ locale.signatures }}</h3>
          </div>
          <div class="col-span-12 sm:col-span-7 md:col-span-8">
            <div class="signature-group">
              <div class="sg-header flex mb-2">
                <div class="grow flex items-center pr-2">
                  <div class="grow flex items-center py-1 pl-3 pr-1 bg-white dark:bg-neutral-600/50 rounded"
                       v-if="signatureList.length > 0">
                    <span class="grow mr-2">{{ signatureSelected.title }}</span>
                    <Tippy tag="button" :content="locale.nameEditSignatures" type="button"
                           @click="checkCreateOrUpdate = false; ModalSignatureCreate = true;"
                           class="btn bg-light dark:bg-slate-600/30 dark:hover:bg-slate-600/50 rounded-full py-2 btn-sm">
                      <Edit2Icon class="w-4 h-4"/>
                    </Tippy>
                  </div>
                  <div class="ml-2" v-if="signatureList.length > 1">
                    <TippyContent to="your-signatures" :options="{trigger: 'mouseenter focus'}">
                      <p>{{ locale.signaturesCreated }}</p>
                    </TippyContent>
                    <Dropdown v-slot="{ dismiss }">
                      <DropdownToggle class="btn btn-outline-secondary" name="your-signatures">
                        <MoreHorizontalIcon class="w-4 h-5"/>
                      </DropdownToggle>
                      <DropdownMenu class="min-w-[220px]">
                        <DropdownContent>
                          <DropdownItem v-for="(item) in signatureList"
                                        :key="item.id"
                                        @click="checkCreateOrUpdate = false; actionChangeDataSignatureSelected(item); dismiss();">
                            {{ item.title }}
                          </DropdownItem>
                        </DropdownContent>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
                <button type="button" class="btn btn-outline-secondary"
                        @click="checkCreateOrUpdate = true; ModalSignatureCreate = true;">
                  <ChevronRightIcon class="w-4 h-4"/>
                  {{ locale.add }}
                </button>
              </div>
              <div class="btn-group mb-2">
                <select class="form-select sm:mr-2" :aria-label="locale.selection" v-model="typeSelected">
                  <option :value="item.typeValue" v-for="item in typeList">
                    {{ item.typeText }}
                  </option>
                </select>
              </div>
              <div class="signature-editor mb-3">
                <div v-if="typeSelected === typeList[0].typeValue">
                  <ClassicEditor :config="{
                        toolbar: []
                      }" v-model="contentForPlain.content"/>
                </div>
                <div v-else>
                  <ClassicEditor v-model="contentForHtml.content"/>
                </div>
              </div>
              <div class="text-right">
                <button class="btn btn-outline-danger min-w-[75px] btn-sm" @click="actionDeleteSignatureSelected" v-if="signatureList.length > 0">
                  <TrashIcon class="w-4 h-4 mr-2"/>
                  {{ locale.deleteSignature }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- BEGIN: Modal signatures create -->
        <Modal backdrop="static" :show="ModalSignatureCreate" @hidden="ModalSignatureCreate = false">
          <ModalBody class="p-5">
              <div class="mb-3">
                <label for="sgName"
                       class="form-label text-xl">{{
                    checkCreateOrUpdate ? locale.nameNewsignatures : locale.nameEditSignatures
                  }}</label>
                <input id="sgName" v-model="signatureSelected.title" type="text" class="form-control"
                       :placeholder="locale.signatures + '...'"/>
              </div>
              <div class="btn-group text-right -mx-2">
                <button type="button" @click="ModalSignatureCreate = false" class="btn btn-secondary min-w-[80px] m-2">
                  {{ locale.cancel }}
                </button>
                <button type="button"
                        @click="actionSaveChangeSignature"
                        class="btn btn-primary min-w-[80px] m-2">
                  {{ checkCreateOrUpdate ? locale.add : locale.saveChange }}
                </button>
              </div>
          </ModalBody>
        </Modal>
        <!-- END: Modal signatures create -->
      </div>
      <!-- END: SIGNATURE CREATE -->
      <!-- BEGIN: SIGNATURE USING -->
      <div class="signature-create py-5">
        <div class="grid grid-cols-12 gap-4">
          <div class="min-w-[150px] col-span-12 sm:col-span-5 md:col-span-4">
            <h3 class="text-base">{{ locale.usingSignatures }}</h3>
          </div>
          <div class="col-span-12 sm:col-span-7 md:col-span-8">
            <div class="primary-account sg-item">
              <p class="mb-1"><b>{{ locale.primaryAccount }}:</b></p>
              <div class="flex flex-col md:flex-row -m-2">
                <div class="new-msg msg-item m-2">
                  <h4 class="dark:text-slate-500">{{ locale.newMessage }}</h4>
                  <select class="form-select mt-2 sm:mr-2" aria-label="Default select example"
                          v-model="myUser.defaultSignatureId">
                    <option :value="locale.noSignatures">
                      {{ locale.noSignatures }}
                    </option>
                    <option v-for="(item) in signatureList" :key="item" :value="item.id">
                      {{ item.title }}
                    </option>
                  </select>
                </div>
                <div class="replies-forward-msg msg-item m-2">
                  <h4 class="dark:text-slate-500">{{ locale.replyAndForward }}</h4>
                  <select class="form-select mt-2 sm:mr-2" aria-label="Default select example"
                          v-model="myUser.forwardReplySignatureId">
                    <option :value="locale.noSignatures">
                      {{ locale.noSignatures }}
                    </option>
                    <option v-for="(item) in signatureList" :key="item.id" :value="item.id">
                      {{ item.title }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="mt-5">
              <p><b>{{ locale.signaturesPlacement }}:</b></p>
              <div class="flex flex-col -mx-2">
                <div class="form-check m-2">
                  <input id="sgradio1" class="form-check-input" type="radio" name="horizontal_radio_button"
                         v-model="myUser.mailSignatureStyle"
                         value="outlook" :checked="myUser.mailSignatureStyle === 'outlook'"/>
                  <label class="form-check-label" for="sgradio1">{{ locale.aboveIncludedMessage }}</label>
                </div>
                <div class="form-check m-2">
                  <input id="sgradio2" class="form-check-input" type="radio" name="horizontal_radio_button"
                         v-model="myUser.mailSignatureStyle"
                         value="internet" :checked="myUser.mailSignatureStyle === 'internet'"/>
                  <label class="form-check-label" for="sgradio2">{{ locale.belowIncludedMessage }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- END: SIGNATURE USING -->
      <div
          class="btn-gr-action mt-5 text-center sticky z-10 bottom-0 md:-bottom-[20px] inset-x-0 bg-white dark:bg-[#373a41]">
        <button class="btn btn-secondary m-2" @click="emitter.emit('on-active-folder-default')">
          {{ locale.cancel }}
        </button>
        <button class="btn text-white bg-violet-600 m-2" @click="actionSaveChangeSignature">
          {{ checkCreateOrUpdate ? locale.add : locale.saveChange }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {Content, Signature} from "@/model/Signature";
import {IPrefs, RequestNoResponse} from "@/model/RequestNoResponse";
import {ResponseData} from "@/model/ResponseData";
import {convertHtmlToPlainText, showToastMessage} from "@/utils/MyFunction";
import SignatureService from "@/service/SignatureService";
import UserService from "@/service/UserService";
import {SignatureStore} from "@/stores/signature-store/signature-store";
import { User } from "@/model/User";
import {useRouter} from "vue-router";
import {ClassicEditor} from "@/global-components/ckeditor";
export default defineComponent({
  name: "MailSettingSignatures",
  components: {ClassicEditor},
  setup() {
    //init value
    const myStore = MyStore();
    const router = useRouter();
    const emitter = myStore.useEmitter();
    const signatureStore = SignatureStore();
    const locale = computed(() => myStore.locale);
    const myUser = computed(() => myStore.myUser as User);
    //signature create
    const ModalSignatureCreate = ref(false);
    const checkCreateOrUpdate = ref(false);
    //signature
    const signatureSelected = ref<Signature>(new Signature());
    const signatureList = computed(() => signatureStore.mySignatureList as Signature[]);
    const typeList = ref([
      {
        typeValue: "text/plain",
        typeText: locale.value.formatAsPlanText,
      },
      {
        typeValue: "text/html",
        typeText: locale.value.formatAsHtml,
      }
    ]);
    //signature data on template
    const typeSelected = ref(typeList.value[0].typeValue);
    const contentForPlain = ref<Content>(new Content());
    const contentForHtml = ref<Content>(new Content());

    function resetContentPlain(){
      contentForPlain.value = new Content();
      contentForPlain.value.type = typeList.value[0].typeValue;
      contentForPlain.value.content = '';
    }

    function resetContentHtml(){
      contentForHtml.value = new Content();
      contentForHtml.value.type = typeList.value[1].typeValue;
      contentForHtml.value.content = '';
    }

    //method action
    function actionChangeDataSignatureSelected(data: Signature) {
      signatureSelected.value = data;
      getSignatureModel();
    }

    async function actionDeleteSignatureSelected() {
      if (!signatureSelected.value.id) {
        showToastMessage(undefined, true);
      } else {
        //call request
        const response = await SignatureService.deleteSignature(signatureSelected.value, myStore.token);
        if (response.data) {
          const responseData: ResponseData = response.data;
          //Kiểm tra backend có trả error ko
          if (responseData.values.error) {
            // Set thông báo thất bại
            showToastMessage(responseData.values.error, true);
          } else {
            //Xóa item vừa xóa trong danh sách chữ ký
            const findIndex = signatureList.value.findIndex(value => value.id === signatureSelected.value.id);
            if (findIndex >= 0) {
              signatureList.value.splice(findIndex, 1);
            }
            //Kiểm tra có sử dụng id chữ ký dang dùng ko, nếu có thì trả về default
            if (myUser.value.defaultSignatureId === signatureSelected.value.id) myUser.value.defaultSignatureId = locale.value.noSignatures;
            if (myUser.value.forwardReplySignatureId === signatureSelected.value.id) myUser.value.forwardReplySignatureId = locale.value.noSignatures;
            //set lại chữ ký
            initGetSignatureSelected();
            getSignatureModel();
            //Lưu thông tin chữ ký đang sử dụng
            await saveUsingSignatureSelected();
          }
        } else {
          showToastMessage(undefined, true);
        }
      }
    }

    async function saveUsingSignatureSelected() {
      //init request
      const requestNoResponse = new RequestNoResponse();
      //init value
      const defaultSignatureId: IPrefs = {
        name: 'zimbraPrefDefaultSignatureId',
        value: myUser.value.defaultSignatureId === locale.value.noSignatures ? '' : myUser.value.defaultSignatureId
      };
      const forwardReplySignatureId: IPrefs = {
        name: 'zimbraPrefForwardReplySignatureId',
        value: myUser.value.forwardReplySignatureId === locale.value.noSignatures ? '' : myUser.value.forwardReplySignatureId
      };
      const mailSignatureStyle: IPrefs = {name: 'zimbraPrefMailSignatureStyle', value: myUser.value.mailSignatureStyle};
      //add value to list
      requestNoResponse.prefs.push(defaultSignatureId, forwardReplySignatureId, mailSignatureStyle);
      //call request
      const prefResponse = await UserService.modifyPrefs(requestNoResponse, myStore.token);
      if (prefResponse.data) {
        const responseData: ResponseData = prefResponse.data;
        //Kiểm tra backend có trả error ko
        if (responseData.values.error) {
          // Set thông báo thất bại
          showToastMessage(responseData.values.error, true);
        } else {
          showToastMessage();
        }
      } else {
        showToastMessage(undefined, true);
      }
    }

    async function actionSaveChangeSignature() {
      if (signatureSelected.value.title === '') {
        showToastMessage(undefined, true);
      } else {
        //Kiểm tra nếu nội dung trống thì set mặc định ... để không bị lỗi hệ thống
        if (!contentForPlain.value.content && !contentForHtml.value.content) {
          contentForPlain.value.content = '...';
          contentForHtml.value.content = '...';
        }
        //set value
        setSignatureSelectedByModel();
        //call request
        const response = checkCreateOrUpdate.value ? await SignatureService.createSignature(signatureSelected.value, myStore.token) : await SignatureService.modifySignature(signatureSelected.value, myStore.token);
        if (response.data) {
          const responseData: ResponseData = response.data;
          //Kiểm tra backend có trả error ko
          if (responseData.values.error) {
            // Set thông báo thất bại
            showToastMessage(responseData.values.error, true);
          } else {
            //Set giá trị id vừa được tạo
            signatureSelected.value = responseData.values as Signature;
            //Lưu thông tin chữ ký đang sử dụng
            await saveUsingSignatureSelected();
            //Xử lý data để add thêm vào danh sách hoặc thay đổi
            if (checkCreateOrUpdate.value) {
              const itemNew = new Signature();
              itemNew.id = signatureSelected.value.id;
              itemNew.title = signatureSelected.value.title;
              itemNew.content = signatureSelected.value.content;
              signatureList.value.push(itemNew);
              //Sau khi thêm mới thì đổi trạng thái sang sua chữ ký
              checkCreateOrUpdate.value = false;
            } else {
              const itemFind = signatureList.value.find(value => value.id === signatureSelected.value.id);
              if (itemFind) {
                itemFind.title = signatureSelected.value.title;
                itemFind.content = signatureSelected.value.content;
              }
            }
            //đóng modal
            ModalSignatureCreate.value = false;
          }
        } else {
          showToastMessage(undefined, true);
        }
      }
    }

    function getSignatureModel() {
      if (signatureSelected.value.id && signatureSelected.value.content && signatureSelected.value.content.length > 0) {
        const findContentPlain = signatureSelected.value.content.find(value => value.type === typeList.value[0].typeValue);
        if(findContentPlain){
          contentForPlain.value = findContentPlain;
        }
        else{
          resetContentPlain();
        }
        const findContentHtml = signatureSelected.value.content.find(value => value.type === typeList.value[1].typeValue);
        if(findContentHtml){
          contentForHtml.value = findContentHtml;
        }
        else{
          resetContentHtml();
        }
      }
      else{
        signatureSelected.value.title = '';
        resetContentPlain();
        resetContentHtml();
      }
    }

    function setSignatureSelectedByModel() {
      //Check 2 trường hợp, nếu signature selected rỗng thì
      if(signatureSelected.value.content.length <= 0){
        //set lại content cho plain text
        if(typeSelected.value === contentForPlain.value.type) contentForPlain.value.content = convertHtmlToPlainText(contentForPlain.value.content);
        //add vào list
        signatureSelected.value.content.push(contentForPlain.value, contentForHtml.value);
      }
      else{
        for (const item of signatureSelected.value.content) {
          if(item.type === contentForPlain.value.type){
            item.content = contentForPlain.value.content;
          }
          else{
            item.content = contentForHtml.value.content;
          }
        }
      }
    }

    //init method
    function initGetSignatureSelected() {
      if (signatureList.value.length > 0) {
        myUser.value.defaultSignatureId = myUser.value.defaultSignatureId ? myUser.value.defaultSignatureId : locale.value.noSignatures;
        myUser.value.forwardReplySignatureId = myUser.value.forwardReplySignatureId ? myUser.value.forwardReplySignatureId : locale.value.noSignatures;
        //Tìm id trong mặc định
        const findItem = signatureList.value.find(value => value.id === myUser.value.defaultSignatureId);
        if (findItem) {
          signatureSelected.value.id = findItem.id;
          signatureSelected.value.title = findItem.title;
          signatureSelected.value.content = findItem.content;
        }
        else{
          signatureSelected.value.id = signatureList.value.length > 0 ? signatureList.value[0].id : '';
          signatureSelected.value.title = signatureList.value.length > 0 ? signatureList.value[0].title : '';
          signatureSelected.value.content = signatureList.value.length > 0 ? signatureList.value[0].content : [] as Content[];
        }
      } else {
        signatureSelected.value = new Signature();
        myUser.value.defaultSignatureId = locale.value.noSignatures;
        myUser.value.forwardReplySignatureId = locale.value.noSignatures;
      }
    }

    onMounted(async () => {
      if (myStore.token) {
        await signatureStore.initGetSignatureList();
        signatureStore.initGetSignatureForNewMailOrReply();
        initGetSignatureSelected();
        getSignatureModel();
      }
    });

    return {
      locale,
      myUser,
      router,
      emitter,
      ModalSignatureCreate,
      signatureSelected,
      signatureList,
      typeList,
      typeSelected,
      contentForPlain,
      contentForHtml,
      actionSaveChangeSignature,
      actionChangeDataSignatureSelected,
      actionDeleteSignatureSelected,
      checkCreateOrUpdate
    }
  }
})
</script>

<style lang="scss">
.signature-editor {
  .ck-editor {
    .ck {
      &-content {
        max-height: 320px;
      }
    }
  }
}
</style>
