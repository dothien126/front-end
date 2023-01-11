<template>
  <Modal backdrop="static" :show="AccountData.modalShowHide" @hidden="AccountData.modalShowHide = false">
    <ModalBody class="px-5 py-3">
      <form name="frmPersonaAcc">
        <h3 class="text-xl mb-5">Persona Settings</h3>
        <div class="mb-3 ip-line">
          <input id="frmPer1" type="text" class="form-control" v-model="AccountData.persona.name" :class="{'is-txt-len': AccountData.persona.name}"/>
          <label for="frmPer1" placeholder="Enter Persona name..." title="Persona Name:" class="form-label mb-1"></label>
        </div>
        <h4 class="text-base pt-2 pb-3">Settings for Sent Messages</h4>
        <div class="mb-3 form-inline">
          <div class="ip-line mr-3">
            <input id="frmPer2" type="text" class="form-control"
                   v-model="AccountData.persona.sentMsg.from"
                   :class="{'is-txt-len': AccountData.persona.sentMsg.from}"/>
            <label for="frmPer2" placeholder="Enter Persona name..." title="From:" class="form-label mb-1"></label>
          </div>
          <div v-if="dataMockLeng < 5">
            <select class="form-select" aria-label="Email External List">
              <option v-for="(fk, fkey) in $_.take($f(), dataMockLeng)" :key="fkey">
                {{ fk.users[0].email }}
              </option>
            </select>
          </div>
          <div v-else>
            <TomSelect v-model="personaMailSelect" :options="{
                      placeholder: 'Select your favorite actors',
                    }" class="w-full">
              <option v-for="(fk, fkey) in $_.take($f(), dataMockLeng)" :key="fkey" :value="fkey">
                {{ fk.users[0].email }}
              </option>
            </TomSelect>
          </div>
        </div>
        <div class="form-check mb-1">
          <input id="frmPer3" class="form-check-input" type="checkbox" @change="AccountData.persona.sentMsg.replyto = !AccountData.persona.sentMsg.replyto"/>
          <label class="form-check-label" for="frmPer3">Reply-to</label>
        </div>
        <div class="flex flex-col sm:flex-row items-center -mx-2" v-if="AccountData.persona.sentMsg.replyto">
          <input type="text" class="form-control m-2" placeholder="e.g. Bob Smith"/>
          <select class="form-select m-2" aria-label=".form-select-sm example">
            <option>Chris Evans</option>
            <option>Liam Neeson</option>
            <option>Daniel Craig</option>
          </select>
        </div>
        <div class="mt-3">
          <label class="mr-2">Signature:</label>
          <a class="text-blue-500 hover:text-blue-400 transition-colors" href="/mail/setting/signatures">Manage your signatures ...</a>
        </div>
        <h4 class="text-base py-2 mt-3 border-t border-slate-500">Use this persona:</h4>
        <div class="mb-3">
          <div class="form-check mb-1">
            <input id="frmPer4" class="form-check-input" type="checkbox" @change="AccountData.persona.replyorforwarding = !AccountData.persona.replyorforwarding"/>
            <label for="frmPer4" class="form-check-label text-slate-300/60 hover:text-slate-400">When replying or forwarding messages sent to:</label>
          </div>
          <div v-if="AccountData.persona.replyorforwarding">
            <input type="text" class="form-control" placeholder="e.g. Bob Smith" aria-label="Replying or Forwarding"/>
          </div>
        </div>
        <div class="mb-3">
          <div class="form-check mb-1">
            <input id="frmPer5" class="form-check-input" type="checkbox" @change="AccountData.persona.composing = !AccountData.persona.composing"/>
            <label for="frmPer5" class="form-check-label text-slate-300/60 hover:text-slate-400">When composing, replying to or forwarding messages in folder(s):</label>
          </div>
          <div v-if="AccountData.persona.composing">
            <div class="relative mb-1">
              <input type="text" class="form-control pr-11"
                     placeholder="Folder name(s)"
                     aria-label="When composing, replying to or forwarding messages in folder(s)"/>
              <button type="button" class="btn btn-secondary-soft absolute right-[2px] top-[2px]" @click="folderChooseModal = true; archiveModalGetFolder()">
                <FolderIcon class="w-4 h-4"/>
              </button>
            </div>
            <p class="text-xs dark:text-slate-500">Enter folder names separated by commas or semi-colons</p>
          </div>
        </div>
        <div class="btn-group text-right -mx-1.5">
          <button type="button" class="btn btn-secondary m-1.5" @click="AccountData.modalShowHide = false;">
            Huỷ
          </button>
          <button type="button" class="btn bg-violet-600 m-1.5">
            Save
          </button>
        </div>
      </form>
      <!-- BEGIN: Overlapping Modal Content -->
      <Modal :show="folderChooseModal" @hidden="folderChooseModal = false">
        <ModalBody>
          <input type="search" class="form-control" placeholder="Find folder..." aria-label="Find folder"/>
          <div class="mb-3 mt-2 overflow-y-auto overflow-x-hidden">
            <Tree
                v-model:nodes="folderList" @nodeClick="onNodeClickItemFolder" :id-selected="folderIdSelected"
            />
          </div>
          <div class="flex items-center">
            <div class="grow">
              <button type="button" class="btn btn-secondary">New</button>
            </div>
            <button type="button" class="btn btn-secondary mr-3" @click="folderChooseModal = false;">
              Cancel
            </button>
            <button type="button" class="btn text-white bg-blue-600 dark:bg-violet-500 min-w-[100px]">
              OK
            </button>
          </div>
        </ModalBody>
      </Modal>
      <!-- END: Overlapping Modal Content -->
    </ModalBody>
  </Modal>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
  import {Folder} from "@/model/Folder";
  import Tree from '@/global-components/tree-view/lib';
import FolderService from "@/service/FolderService";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage} from "@/utils/MyFunction";
import {MyStore} from "@/stores/my-store";

  export default defineComponent({
    name: "AccountAddPersonaModal",
    components: {
      Tree
    },
    data(){
      return {
        dataMockLeng: 13,
        personaMailSelect: 1,
        folderChooseModal: false
      }
    },
    props: {
      AccountData: { type: Object, require: true, default: () => {} }
    },
    setup(props, {emit}) {
      // Logic code here!
      const myStore = MyStore();
      const folderList = ref<Folder[]>([]);
      const folderIdSelected = ref('');
      const archiveModalLoading = ref();
      const onNodeClickItemFolder = async function (folder: Folder) {
        folderIdSelected.value = folder.folderId;
      }
      const archiveModalGetFolder = async function () {
        archiveModalLoading.value = true;
        //init request
        const itemFind = new Folder();
        //call request
        const response = await FolderService.find(itemFind, myStore.token);
        console.log(response);
        if (response.data) {
          archiveModalLoading.value = false;
          const responseData: ResponseData = response.data;
          //Kiểm tra backend có trả error ko
          if (responseData.values.error) {
            // Set thông báo thất bại
            showToastMessage(responseData.values.error, true);
          } else {
            const foldersResponse: Folder[] = responseData.values;
            folderList.value.push(...foldersResponse);
            //default active folder
            await onNodeClickItemFolder(folderList.value[0]);
          }
        } else {
          showToastMessage(undefined, true);
        }
      }
      return {
        folderList,
        folderIdSelected,
        onNodeClickItemFolder,
        archiveModalGetFolder
      }
    }
  })
</script>

<style lang="scss"></style>