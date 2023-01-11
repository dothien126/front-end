<script>
/* eslint-disable */
import {exampleQueryTranslate, queryTranslte} from "@/utils/MyVariables";
import { ConversationStore} from "@/stores/conversation-store/conversation-store";

const validators = {
  email: new RegExp(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ),
  url: new RegExp(
      /^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i
  ),
  text: new RegExp(/^[a-zA-Z]+$/),
  digits: new RegExp(/^[\d() \.\:\-\+#]+$/),
  isodate: new RegExp(
      /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/
  )
};
/* eslint-enable */

export default {
  name: "InputTag",

  props: {
    value: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ""
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    validate: {
      type: [String, Function, Object],
      default: ""
    },
    addTagOnKeys: {
      type: Array,
      default: function() {
        return [
          13, // Return
          188, // Comma ','
          9 // Tab
        ];
      }
    },
    addTagOnBlur: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: -1
    },
    allowDuplicates: {
      type: Boolean,
      default: false
    },
    beforeAdding: {
      type: Function
    },
    isDeleteAll: {
      type: Boolean,
      default: false
    },
    filterTypeSearch: {
      type: String,
      default: 'mail'
    },
    isIconSearchClick: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      newTag: "",
      innerTags: [...this.value],
      isInputActive: false,
      typingTag: ''
    };
  },

  computed: {
    isLimit: function() {
      return this.limit > 0 && Number(this.limit) === this.innerTags.length;
    }
  },

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(tags) {
        const conversationStore = ConversationStore();
        this.innerTags = [...tags];
        conversationStore.searchTag = this.innerTags
      }
    },
    isDeleteAll: {
      immediate: true,
      handler(value) {
        const conversationStore = ConversationStore();
        if(value) {
          this.innerTags = conversationStore.search= [];
          this.$emit("changeDeleteAllStatus", false);
          this.tagChange();
        }
      }
    },
    filterTypeSearch: {
      immediate: true,
      handler(value) {
        const conversationStore = ConversationStore();
        this.innerTags = conversationStore.search= [];
        this.tagChange();
      }
    },
    isIconSearchClick: {
      immediate: true,
      handler(value) {
        if(value && this.typingTag !== '') {
          this.innerTags.push(this.typingTag);
          this.tagChange();
          this.typingTag = '';
          this.newTag = '';
          this.$emit('after-search-click')
        }
      }
    }
  },

  methods: {
    translateTag(tag) {
      let translate = tag;
      if (localStorage.getItem('localeZimbraWebmail') === 'en') {
        // Thay thế từ khóa search với bảng quy chiếu số 0 là tiếng Anh, số 1 là tiếng Việt
        exampleQueryTranslate.forEach((item) => {
          translate = translate.replaceAll(item, queryTranslte[item][0])
        })
      } else {
        exampleQueryTranslate.forEach((item) => {
          translate = translate.replaceAll(item, queryTranslte[item][1])
        })
      }
      return translate;
    },
    focusNewTag() {
      if (this.readOnly || !this.$el.querySelector(".new-tag")) {
        return;
      }
      this.$el.querySelector(".new-tag").focus();
    },

    handleInputFocus(event) {
      this.isInputActive = true;
      this.$emit('on-focus', event);
    },

    handleInputBlur(e) {
      this.isInputActive = false;
      this.addNew(e);
    },

    async addNew(e) {
      const keyShouldAddTag = e
          ? this.addTagOnKeys.indexOf(e.keyCode) !== -1
          : true;

      const typeIsNotBlur = e && e.type !== "blur";

      if (
          (!keyShouldAddTag && (typeIsNotBlur || !this.addTagOnBlur)) ||
          this.isLimit
      ) {
        return;
      }

      const tag = this.beforeAdding
          ? await this.beforeAdding(this.newTag)
          : this.newTag;

      const isValid = await this.validateIfNeeded(tag);

      if (
          tag &&
          isValid &&
          (this.allowDuplicates || this.innerTags.indexOf(tag) === -1)
      ) {
        this.innerTags.push(tag);
        this.newTag = "";
        this.tagChange();

        e && e.preventDefault();
      }
    },

    validateIfNeeded(tagValue) {
      if (this.validate === "" || this.validate === undefined) {
        return true;
      }

      if (typeof this.validate === "function") {
        return this.validate(tagValue);
      }

      if (
          typeof this.validate === "string" &&
          Object.keys(validators).indexOf(this.validate) > -1
      ) {
        return validators[this.validate].test(tagValue);
      }

      if (
          typeof this.validate === "object" &&
          this.validate.test !== undefined
      ) {
        return this.validate.test(tagValue);
      }

      return true;
    },

    remove(index) {
      this.innerTags.splice(index, 1);
      this.tagChange();
    },

    removeLastTag() {
      if (this.newTag) {
        return;
      }
      let innerTagsLengthBeforePop =  this.innerTags.length;
      this.innerTags.pop();
      // Nếu số thẻ Tags đổi mới cho gọi lại request tránh trường hợp search while typing bấm nút Backspace cũng gọi lại request
      if(innerTagsLengthBeforePop !== this.innerTags.length) {
        this.tagChange();
      }
    },

    tagChange() {
      this.$emit("update:tags", this.innerTags);
      this.$emit("input", this.innerTags);
    },
    handleOnKeyUp(e) {
     this.$emit("search-while-typing", e.target.value);
     this.typingTag = e.target.value;
    }
  }
};
</script>

<template>
  <div
      @click="focusNewTag()"
      :class="{
      'read-only': readOnly,
      'vue-input-tag-wrapper--active': isInputActive
    }"
      class="vue-input-tag-wrapper"
  >
    <span v-for="(tag, index) in innerTags" :key="index" class="input-tag">
      <span>{{ translateTag(tag) }}</span>
      <a v-if="!readOnly" @click.prevent.stop="remove(index)" class="remove">
        <slot name="remove-icon" />
      </a>
    </span>
    <input
        v-if="!readOnly && !isLimit"
        ref="inputtag"
        :placeholder="placeholder"
        type="text"
        v-model="newTag"
        v-on:keydown.delete.stop="removeLastTag"
        v-on:keydown="addNew"
        v-on:blur="handleInputBlur"
        v-on:focus="handleInputFocus"
        v-on:keyup="handleOnKeyUp"
        class="new-tag"
        id="input-mail-search"
    />
  </div>
</template>

<style lang="scss">
.vue-input-tag-wrapper {
  background-color: #fff;
  border: 1px solid #ccc;
  overflow: hidden;
  cursor: text;
  text-align: left;
  -webkit-appearance: textfield;
  display: flex;
  flex-wrap: wrap;
  .input-tag {
    background-color: #317CAF;
    border-radius: 5px;
    color: #fff;
    display: inline-block;
    font-size: 14px;
    font-weight: 400;
    margin-top: 7px;
    margin-bottom: 7px;
    margin-right: 4px;
    padding: 5px 8px;
    .remove {
      cursor: pointer;
      font-weight: bold;
      color: #fff;
      opacity: .5;
      &:hover {
        text-decoration: none;
      }
      &:empty::before {
        content: " x";
      }
    }
  }
  .new-tag {
    box-shadow: none!important;
    background: transparent;
    border: 0;
    color: #777;
    font-size: 13px;
    font-weight: 400;
    outline: none;
    flex-grow: 1;
    &::placeholder {
      color: rgba(white, .45);
    }
  }
  &.read-only {
    cursor: default;
  }
}
</style>
