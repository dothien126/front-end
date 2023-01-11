<template>
  <div class="tags-wrap">
    <div class="flex items-center px-3">
      <h3 class="grow">{{ locale.tags }}</h3>
      <div class="shrink-0">
        <TippyContent to="create-tag" :options="{trigger: 'mouseenter focus'}">
          {{ locale.createTag }}
        </TippyContent>
        <Dropdown placement="bottom-start" v-slot="{ dismiss }"
                  @click="tags.title = ''; errorMsg = '';">
          <DropdownToggle class="btn px-2 rounded-full" name="create-tag">
            <PlusIcon class="w-4 h-4"/>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownContent tag="div">
              <div class="p-2">
                <div class="mb-3">
                  <div class="text-base"> {{ locale.createTag }}</div>
                  <input type="text" class="form-control mt-2 flex-1" :placeholder="locale.enterTag + '...'"
                         v-model="tags.title"/>
                  <div class="text-xs text-warning mt-1" v-if="errorMsg">{{ errorMsg }}</div>
                </div>
                <div class="flex items-center">
                  <h4 class="text-base grow"> {{ locale.colorTag }}</h4>
                  <div class="shrink-0 w-4 h-4 rounded-full" :style="{backgroundColor: tagColor.hex}"></div>
                </div>
                <div class="py-2">
                  <Compact v-model="tagColor"/>
                  <button type="button" class="btn btn-secondary mt-1 w-full" @click="tagCreateColorMoreCustom = true;">
                    {{ locale.selectColorCustom }}
                  </button>
                </div>
                <div class="flex items-center -mx-1">
                  <button @click="dismiss" class="btn btn-sm btn-secondary grow m-1">
                    {{ locale.cancel }}
                  </button>
                  <button type="button" class="btn btn-sm btn-primary grow m-1" @click="actionCreateTag(dismiss)">
                    {{ locale.add }}
                  </button>
                </div>
              </div>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="flex items-center rounded-full hover:bg-gray-300/30 dark:hover:bg-white/10 cursor-point mx-auto lg:ml-1 lg:mr-3 my-2"
         v-for="(tg, tIdx) in tagList" :key="tg.id">
      <button class="grow p-2 flex items-center overflow-hidden" @click="actionShowConversationByTag(tg)">
        <div class="w-2 h-2 rounded-full mr-2 shrink-0" :style="'background-color:' + tg.rgb"></div>
        <span class="text-xs truncate">
          {{ tg.name }}
        </span>
      </button>
      <TippyContent :to="'tag-title-' + tIdx" :options="{trigger: 'mouseenter focus'}">
        {{ tg.name }}
      </TippyContent>
      <Dropdown placement="right-start">
        <DropdownToggle class="btn px-2 text-gray-500 hover:text-gray-400 rounded-full"
                        :name="'tag-title-' + tIdx"
                        @click="actionGetTagSelected(tg)">
          <MoreHorizontalIcon class="w-4 h-4"/>
        </DropdownToggle>
        <DropdownMenu class="min-w-[256px]">
          <DropdownContent>
            <DropdownItem class="flex items-center" @click="modalShowHideEditTag = !modalShowHideEditTag">
              <span class="grow">{{ locale.colorTag }}</span>
              <ChevronRightIcon v-if="!modalShowHideEditTag" class="w-4 h-4 shrink-0"/>
              <ChevronDownIcon v-else class="w-4 h-4"/>
            </DropdownItem>
            <div class="tag-sketch-color" v-if="modalShowHideEditTag">
              <Compact v-model="tagColor" @update:modelValue="tg.rgb = tagColor.hex; actionOpTag = 'color'; actionEditDeleteTag();"/>
              <button type="button" class="btn btn-secondary mt-1 w-full" @click="tagColorMoreCustom = true; tagIndex = tIdx;">
                {{ locale.selectColorCustom }}
              </button>
            </div>
            <DropdownDivider/>
            <DropdownItem
                @click="modalShowConfirmEditTag = true; showValueEditTag = true; showValueDeleteTag = false; actionOpTag = 'rename';">
              {{ locale.editTag }}
            </DropdownItem>
            <DropdownItem
                @click="modalShowConfirmEditTag = true; showValueDeleteTag = true; showValueEditTag = false; actionOpTag = 'delete';">
              {{ locale.deleteTag }}
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
    </div>
    <!-- BEGIN: Edit Delete -->
    <Modal backdrop="static" :show="modalShowConfirmEditTag" @hidden="modalShowConfirmEditTag = false">
      <ModalBody class="px-5 py-3">
        <div class="mb-5 mt-2 text-center" v-if="showValueDeleteTag">
          <p class="text-base">{{ locale.areYouSure + locale.deleteTag.toLowerCase() }}?</p>
          <b class="text-xl">{{ vuelidate.nameTag.$model }}</b>
        </div>
        <div class="mb-2 mt-2" v-if="showValueEditTag">
          <label for="edit-tag" class="form-label text-base">{{ locale.editTag }}?</label>
          <input id="edit-tag" type="text" class="form-control" v-model="vuelidate.nameTag.$model" :placeholder="locale.enterTag"/>
        </div>
        <template v-if="vuelidate.nameTag.$error">
          <div v-for="(error) in vuelidate.nameTag.$errors" :key="error" class="mt-2 text-sm text-red-600">* {{ error.$message }}</div>
        </template>
        <div class="-mx-1" :class="{'text-right': showValueEditTag, 'text-center': showValueDeleteTag}">
          <button type="button" class="btn btn-secondary w-24 m-1" @click="modalShowConfirmEditTag = false;">
            {{ locale.cancel }}
          </button>
          <button v-if="showValueDeleteTag" type="button" class="btn btn-danger w-24 m-1"
                  @click="actionEditDeleteTag(); modalShowConfirmEditTag = false;">
            {{ locale.deleteTag }}
          </button>
          <button v-if="showValueEditTag" type="button" class="btn btn-primary w-24 m-1"
                  @click="actionEditDeleteTag();">
            {{ locale.editTag }}
          </button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Edit Delete -->
    <Modal class="tag-color-custom" size="modal-sm" backdrop="static" :show="tagColorMoreCustom" @hidden="tagColorMoreCustom = false">
      <ModalBody class="px-5">
        <h3 class="text-xl mb-3">{{locale.addColorCustom}}</h3>
        <div class="border-t border-gray-300 dark:border-slate-600 py-2">
          {{ locale.previewColorTag }}
        </div>
        <div class="mb-3">
          <span class="w-3 h-3 rounded-full inline-block mr-1" :style="{backgroundColor: tagList && tagList[tagIndex] ? tagList[tagIndex].rgb : tagColor.hex}"></span>
          {{tagList && tagList[tagIndex] ? tagList[tagIndex].name : tagColor.hex}}
        </div>
        <div class="mb-5">
          <p class="mb-1">{{ locale.colorTag }}</p>
          <Sketch v-model="tagColor" @update:modelValue="tagList[tagIndex].rgb = tagColor.hex"/>
        </div>
        <div class="text-center -mx-1">
          <button type="button" @click="tagColorMoreCustom = false" class="btn btn-secondary w-24 m-1">
            {{ locale.cancel }}
          </button>
          <button type="button" @click="actionOpTag = 'color'; actionEditDeleteTag(); tagColorMoreCustom = false" class="btn btn-primary m-1">{{ locale.saveChange }}</button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->
    <!-- BEGIN: Modal Content -->
    <Modal class="tag-color-custom" size="modal-sm" backdrop="static" :show="tagCreateColorMoreCustom" @hidden="tagCreateColorMoreCustom = false">
      <ModalBody class="px-5">
        <h3 class="text-xl mb-3">{{locale.addColorCustom}}</h3>
        <div class="border-t border-gray-300 dark:border-slate-600 py-2">
          {{ locale.previewColorTag }}
        </div>
        <div class="mb-3">
          <span class="w-3 h-3 rounded-full inline-block mr-1" :style="{backgroundColor: tagColor.hex}"></span>
          <span :class="{'text-gray-500 dark:text-slate-500': tags.title, 'text-gray-400 dark:text-slate-500/70': !tags.title}">
            {{tags.title ? tags.title : locale.noNameTag}}
          </span>
        </div>
        <div class="mb-5">
          <p class="mb-1">{{ locale.colorTag }}</p>
          <Sketch v-model="tagColor" @update:modelValue="tagList[tagIndex].rgb = tagColor.hex"/>
        </div>
        <div class="text-center -mx-1">
          <button type="button" @click="tagCreateColorMoreCustom = false" class="btn btn-secondary w-24 m-1">
            {{ locale.cancel }}
          </button>
          <button type="button" @click="actionCreateTag();" class="btn btn-primary m-1">{{ locale.add }}</button>
        </div>
      </ModalBody>
    </Modal>
    <!-- END: Modal Content -->
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref} from "vue";
import {colors} from "@/utils/colors";
import {Tag} from "@/model/Tag";
import {ResponseData} from "@/model/ResponseData";
import {showToastMessage, toSlug} from "@/utils/MyFunction";
import TagService from "@/service/TagService";
import {MyStore} from "@/stores/my-store";
import { Sketch, Compact } from "@ckpack/vue-color";
import { DEFAULT_COLOR } from "@/utils/MyVariables";
import router from "@/router";
import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import {ConversationStore} from "@/stores/conversation-store/conversation-store";
import {useRoute} from "vue-router";
import {MyTagStore} from "@/stores/tag-store/tag-store";

export default defineComponent({
  name: 'Tags',
  components: { Sketch, Compact },
  data() {
    return {
      tagColorMoreCustom: false,
      tagIndex: 0,
    }
  },
  setup() {
    //init value
    const myStore = MyStore();
    const emitter = myStore.useEmitter();
    const route = useRoute();
    const routeTagName = computed(() => route.params.tagName as string);
    const conversationStore = ConversationStore();
    const myTagStore = MyTagStore();
    const conversation = computed(() => conversationStore.conversation)
    const locale = computed(() => myStore.locale);
    const tagList = computed(() => myTagStore.tagList as Tag[]);
    const tagSelected = computed({
      get: () => myTagStore.tagSelected as Tag,
      set: (data) => myTagStore.tagSelected = data,
    });
    const modalShowHideEditTag = ref(false);
    const modalShowConfirmEditTag = ref(false);
    const showValueEditTag = ref(false);
    const showValueDeleteTag = ref(false);
    const tagCreateColorMoreCustom = ref(false);
    const actionOpTag = ref('');
    // BEGIN: TigerBui
    const tagColor = ref({
      hex: DEFAULT_COLOR
    });
    const errorMsg = ref<string>('');
    const tagColorList = ref<any>([]);
    const colorPal = colors;
    for (let i = 0; i < 33; i++) {
      let cl = colorPal.randomRgbColor();
      tagColorList.value.push({
        color: cl,
        active: false
      });
    }
    const tags = {
      title: "",
    };

    // END: TigerBui

    // validate
    const formTag = reactive({
      id: "",
      nameTag: "",
    })

    const rules = {
      nameTag: {
        required: helpers.withMessage(locale.value.invalidNameTag, required),
      },
    }
    const vuelidate = useVuelidate(rules, formTag);

    function actionGetTagSelected(tag: Tag){
      formTag.id = tag.id;
      formTag.nameTag = tag.name;
    }


    async function actionShowConversationByTag(tag: Tag){
      //set to tag selected
      tagSelected.value = tag;
      //friendly tag name
      const tagName = locale.value[tag.name.toLowerCase()] ? locale.value[tag.name.toLowerCase()] : tag.name;
      if (!myStore.alertReplyMail.replyMail) {
        // Xử lý khi click cùng vào một tags
        if (routeTagName.value === tag.name) {
          await conversationStore.getConversation();
        }
        // Push tags route
        await router.push('/mail-box/tag/' + toSlug(tagName));
        // Reload lai conversation
        emitter.emit('show-conversation')
      } else {
        myStore.alertReplyMail.showAlert = true;
        myStore.alertReplyMail.router = '/mail-box/tag/' + toSlug(tagName);
      }
    }

    async function actionCreateTag(dismiss) {
      //validate
      if (!tags.title){
        errorMsg.value = locale.value.invalidNameTag;
        // showToastMessage(errorMsg.value, true);
      }
      else{
        //init request
        const itemCreate = new Tag();
        itemCreate.name = tags.title;
        //itemCreate.rgb = convertRGBtoHex(tags.color);
        itemCreate.rgb = tagColor.value.hex;
        //call request
        const response = await TagService.createTag(itemCreate, myStore.token);
        if (response.data) {
          const responseData: ResponseData = response.data;
          //Kiểm tra backend có trả error ko
          if (responseData.values.error) {
            // Set thông báo thất bại
            showToastMessage(responseData.values.error, true);
          } else {
            const bodyResponse: Tag = responseData.values;
            //Nếu có giá trị thì reload
            if (bodyResponse.id) {
              await myTagStore.initGetTagList();
              // Set thông báo thành công
              showToastMessage();
              // Đóng modal
              dismiss();
            }
          }
        } else {
          showToastMessage(undefined, true);
        }
      }
    }

    async function actionEditDeleteTag() {
      //Valid before submit
      vuelidate.value.$touch();
      //validate
      if (!vuelidate.value.$invalid) {
        //init request
        const itemUpdate = new Tag();
        itemUpdate.id = formTag.id;
        itemUpdate.op = actionOpTag.value;
        //if(itemUpdate.op === 'color') itemUpdate.rgb =  convertRGBtoHex(tagSelected.value.rgb);
        if (itemUpdate.op === 'color') itemUpdate.rgb = tagColor.value.hex;
        if (itemUpdate.op === 'rename') itemUpdate.name = formTag.nameTag;
        //call request
        const response = await TagService.actionTag(itemUpdate, myStore.token);
        if (response.data) {
          const responseData: ResponseData = response.data;
          //Kiểm tra backend có trả error ko
          if (responseData.values.error) {
            // Set thông báo thất bại
            showToastMessage(responseData.values.error, true);
          } else {
            const bodyResponse: Tag = responseData.values;
            //Nếu có giá trị thì reload
            if (bodyResponse.id) {
              await myTagStore.initGetTagList();
              // Set thông báo thành công
              showToastMessage();
              modalShowConfirmEditTag.value = false;
            }
          }
        } else {
          showToastMessage(undefined, true);
        }
      }
      else{
        errorMsg.value = locale.value.invalidNameTag;
        showToastMessage(errorMsg.value, true);
      }
    }

    return {
      locale,
      tags,
      tagList,
      modalShowHideEditTag,
      errorMsg,
      tagCreateColorMoreCustom,
      actionGetTagSelected,
      actionCreateTag,
      actionEditDeleteTag,
      actionShowConversationByTag,
      modalShowConfirmEditTag,
      showValueEditTag,
      showValueDeleteTag,
      actionOpTag,
      tagColor,
      vuelidate,
      conversation
    }
  }
})
</script>

<style lang="scss">
  .modal {
    &.tag-color-custom {
      .vc-sketch {
        width: auto;
      }
    }
  }
</style>
