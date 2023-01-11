<template>
  <div :class="className">
    <TippyContent to="add-tag" :options="{trigger: 'mouseenter focus'}">
      {{ locale.tags }}
    </TippyContent>
    <Dropdown placement="bottom-start">
      <DropdownToggle class="btn-sm" :class="isConversation ? '' : 'btn btn-secondary'" name="add-tag">
        <TagIcon class="w-4 h-4"/>
      </DropdownToggle>
      <DropdownMenu class="w-60">
        <DropdownContent>
          <DropdownHeader>
            <label for="add-label-tag" class="form-label">{{ locale.findTag }}:</label>
            <div class="relative">
              <input id="add-label-tag" type="text" class="form-control" :placeholder="locale.enterTag + '...'"
                     v-model="searchInput" @change="actionFilterTag"/>
              <button class="absolute right-2 top-2.5 dark:text-slate-500/50 dark:hover:text-slate-500" @click="actionFilterTag">
                <SearchIcon class="w-4 h-4"/>
              </button>
            </div>
          </DropdownHeader>
          <li class="overflow-y-auto h-60">
            <div class="form-check my-2 px-2" v-for="(item) in tagList" :key="item">
              <button class="grow p-2 flex items-center" @click="actionSelectedTag(item)">
                <div class="w-2 h-2 rounded-full mr-2 shrink-0" :style="'background-color:' + item.rgb"></div>
                <span class="form-check-label truncate">
                  {{ item.name }}
                </span>
              </button>
            </div>
          </li>
        </DropdownContent>
      </DropdownMenu>
    </Dropdown>
  </div>
  <!-- BEGIN: Modal Content -->
  <Modal backdrop="static" :show="tagCreateModal" @hidden="tagCreateModal = false">
    <ModalBody class="px-5">
      <h3 class="text-xl mb-5">{{ locale.createNewLabel }}</h3>
      <div class="mb-3">
        <label for="frm-tag-create" class="form-label">{{ locale.enterNewLabelName }}:</label>
        <input id="frm-tag-create" type="text" class="form-control"/>
      </div>
      <!--      <div class="form-check mt-2 mb-1">-->
      <!--        <input id="tag-child" class="form-check-input" type="checkbox" value="" v-model="tagChildChecked"/>-->
      <!--        <label class="form-check-label" for="tag-child">Nhãn xếp lồng trong</label>-->
      <!--      </div>-->
      <!--      <select class="form-select" aria-label="Default select example">-->
      <!--        <option value="">{{tagChildChecked ? 'Vui lòng chọn nhạn gốc' : ''}}</option>-->
      <!--        <option v-for="(fakeTag, fkTagIfx) in $_.take($f(), 20)" :key="fkTagIfx" :value="fakeTag.users[0].name">-->
      <!--          {{(fkTagIfx%2) !== 0 ? '&nbsp;&nbsp;&nbsp;&nbsp;' + fakeTag.users[0].name : fakeTag.users[0].name}}-->
      <!--        </option>-->
      <!--      </select>-->
      <div class="text-right -mx-1 mt-3">
        <button type="button" @click="tagCreateModal = false" class="btn btn-secondary w-24 m-1">
          {{ locale.cancel }}
        </button>
        <button type="button" class="btn btn-primary w-24 m-1">
          {{ locale.add }}
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!-- END: Modal Content -->
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref} from "vue";
import {MyStore} from "@/stores/my-store";
import {Tag} from "@/model/Tag";
import {ItemTag} from "@/model/ConversationDetail";
import {actionConversation, actionConversationDetail } from "@/utils/MyFunction";
import {ConversationStore} from "@/stores/conversation-store/conversation-store";
import {MyTagStore} from "@/stores/tag-store/tag-store";

export default defineComponent({
  name: 'MailBoxTag',
  props: {
    className: { type: String },
    messageId: { type: String },
    conversationId: { type: String },
    isConversation: { type: Boolean, default: false },
    selectedBox: { type: Array },
    tagListOfConversationDetail: { type: Array as PropType<Array<ItemTag>> }
  },
  emit: ["update:tag-list-of-conversation-detail"],
  setup(props, {emit}) {
    const myStore = MyStore();
    const tagStore = MyTagStore();
    const conversationStore = ConversationStore();
    const locale = computed(() => myStore.locale);
    const messageId = props.messageId ? props.messageId : '';
    const conversationId = props.conversationId ? props.conversationId : '';
    const isConversation = props.isConversation;
    const selectedBox = props.selectedBox ? props.selectedBox : [];
    const searchInput = ref('');
    const tagCreateModal = ref(false);
    const tagListReadOnly = computed(() => tagStore.tagList as Tag[]);
    const tagList = ref<Tag[]>(tagListReadOnly.value);
    const tagListOfConversationDetail = computed({
      get: () => props.tagListOfConversationDetail ? props.tagListOfConversationDetail : [],
      set: (data) => emit('update:tag-list-of-conversation-detail', data),
    });

    async function actionSelectedTag(data: Tag) {
      const itemAdd = new ItemTag();
      itemAdd.id = data.id;
      itemAdd.name = data.name;
      const findExisted = tagListOfConversationDetail.value.find(value => value.id === itemAdd.id);
      // Không tồn tại mới add
      if (!findExisted) {
        // Xử ly thêm nhiều tag trong conversation
        if (isConversation) {
          if (selectedBox && selectedBox.length > 0) {
            let main = await actionConversation(selectedBox.join(','), 'tag', '', data);
            if (main) {
              for (const conversationID of selectedBox) {
                // Xử lý trong conversation store
                conversationStore.handleTagConversation(conversationID as string, itemAdd, 'tag');
              }
            }
          }
        }
        // Xử lý thêm tag trong conversation detail
        else {
          tagListOfConversationDetail.value.push(itemAdd);
          if (messageId && conversationId) {
            let main = await actionConversationDetail(messageId, 'tag', itemAdd, false);
            if (main) {
              // Xử lý trong conversation store
              conversationStore.handleTagConversation(conversationId, itemAdd, 'tag');
            }
          }

        }
      }
    }

    function actionFilterTag() {
      if (searchInput.value) {
        tagList.value = tagList.value.filter(value => value.name.toLowerCase().includes(searchInput.value.toLowerCase()));
      } else {
        tagList.value = tagListReadOnly.value;
      }
    }

    return {
      locale,
      tagList,
      searchInput,
      tagCreateModal,
      actionFilterTag,
      actionSelectedTag,
    }
  }
})
</script>

<style lang="scss"></style>