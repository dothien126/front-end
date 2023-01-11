<template>
  <li
      class="tree-row"
      :style="{
      gap: `${gap}px`,
      '--row-hover-background': rowHoverBackground
    }"
      :class="{'is-active': idSelected === node.id}"
  >
    <div
        class="tree-row-item relative" :style="{paddingLeft: childCount ? '1.7rem' : '1.3rem'}"
    >
      <div class="absolute inset-0 flex items-center">
        <!--      TODO: TigerBui`- Cập nhật expanded cây thư mục -->
        <a v-if="childCount" @click="toggleExpanded(node)" class="tree-row-item-icon-wrapper ux-clicked shrink-0 z-10 mx-2 h-[14px] dark:hover:bg-slate-600 rounded">
          <template v-if="!node.expanded">
            <slot name="iconActive">
              <arrow-right/>
            </slot>
          </template>
          <template v-else>
            <slot name="iconInactive">
              <arrow-down/>
            </slot>
          </template>
        </a>
        <div class="grow h-full" @click.stop="handleClick(node)"></div>
      </div>
      <slot
          :id="node.id"
          name="checkbox"
          :node="node"
          :checked="node.checked"
          :indeterminate="node.indeterminate"
      >
        <input
            v-if="useCheckbox"
            v-model="node.checked"
            type="checkbox"
            class="form-check-input mr-2"
            :checked="node.checked"
            :indeterminate="node.indeterminate"
            @click.stop="onToggleCheckbox(node)"
        />
      </slot>
      <template v-if="node.fill && node.stroke">
        <i :icon-name="node.iconName"
           :stroke="node.stroke"
           :fill="node.fill"
           class="w-4 h-4 mr-2"></i>
      </template>
      <template v-else-if="node.iconName">
        <i :icon-name="node.iconName" class="w-4 h-4 mr-2"></i>
      </template>
      <span class="tree-row-txt grow" :class="{'font-bold' : node.unreadCount > 0}">
        {{ locale[node.label.toLowerCase()] ? locale[node.label.toLowerCase()] : node.label }}
      </span>
      <b v-if="node.unreadCount > 0" class="text-xs text-slate-600 dark:text-slate-500 shrink-0 mr-1">{{ node.unreadCount }}</b>
      <template v-if="childCount && showChildCount">
        <slot
            name="childCount"
            :count="childCount"
            :checkedCount="checkedChildCount"
            :childs="node.nodes"
        >
          <span class="child-count">
            {{ childCount }}
          </span>
        </slot>
      </template>
      <template v-if="!node.undeletable && useRowDelete">
        <div class="delete-icon" @click.stop="removedRow(node)">
          <slot name="deleteIcon">
            <delete-icon/>
          </slot>
        </div>
      </template>
    </div>
    <div class="setting-dropdown absolute right-1 top-1" v-if="!t(node.actionMenu).isEmptyObject">
      <Dropdown placement="right-start">
        <DropdownToggle class="btn px-2 text-gray-500 hover:text-gray-400 rounded-full bg-secondary dark:bg-stone-800"
                        @click="node.active = !node.active"
                        :name="'setting-' + node.id">
          <MoreHorizontalIcon class="w-4 h-4"/>
        </DropdownToggle>
        <DropdownMenu class="w-64" :class="{'is-show': idSelected === node.id}">
          <DropdownContent>
            <template v-for="menu in node.actionMenu">
              <DropdownItem v-if="!ignoreMenuDropdown.includes(menu.label)" @click="actionSelectedMenu(menu.label)">
                <div class="flex items-center">
                  <i :icon-name="menu.iconName"
                     :stroke="node.stroke"
                     class="w-4 h-4 mr-2"></i>
                  {{ locale[menu.label] }}
                </div>
              </DropdownItem>
              <DropdownItem v-else @click="searchNodeLabel(node)">
                <div class="flex items-center">
                  <i :icon-name="menu.iconName"
                     :stroke="node.stroke"
                     class="w-4 h-4 mr-2"></i>
                  {{ locale[menu.label] }}
                </div>
              </DropdownItem>
            </template>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
    </div>
    <ul
        v-if="node.expanded"
        class="tree-list"
        :style="{ gap: `${gap}px` }"
    >
      <template
          v-for="child in node.nodes"
          :key="child.id"
      >
        <tree-row
            v-if="!child.hidden"
            :ref="`tree-row-${child.id}`"
            :node="child"
            :use-checkbox="useCheckbox"
            :use-icon="useIcon"
            :use-row-delete="useRowDelete"
            :show-child-count="showChildCount"
            :gap="gap"
            :expand-row-by-default="expandRowByDefault"
            :indent-size="indentSize"
            :row-hover-background="rowHoverBackground"
            :set-node="setNode"
            :get-node="getNode"
            :update-node="updateNode"
            :expandable="expandable"
            :id-selected="idSelected"
            :is-has-tippy="isHasTippy"
            @delete-row="removedRow"
            @node-click="(item) => handleClick(item)"
            @toggle-checkbox="onToggleCheckbox"
            @node-expanded="onNodeExpanded"
        >
          <template #childCount="{ count, checkedCount, childs }">
            <slot
                name="childCount"
                :count="count"
                :checked-count="checkedCount"
                :childs="childs"
            />
          </template>
          <template #iconActive>
            <slot name="iconActive">
              <arrow-right/>
            </slot>
          </template>
          <template #iconInactive>
            <slot name="iconInactive">
              <arrow-down/>
            </slot>
          </template>
          <template #deleteIcon>
            <slot name="deleteIcon">
              <delete-icon/>
            </slot>
          </template>
          <template #checkbox="{ node: slotNode, checked, indeterminate }">
            <slot
                :id="slotNode.id"
                name="checkbox"
                :node="slotNode"
                :checked="checked"
                :indeterminate="indeterminate"
            />
          </template>
        </tree-row>
      </template>
    </ul>
  </li>
</template>

<script lang="ts">
import {computed, onMounted} from 'vue';
import ArrowRight from './Icons/ArrowRight.vue';
import ArrowDown from './Icons/ArrowDown.vue';
import DeleteIcon from './Icons/DeleteIcon.vue';
import {createIcons, icons} from "lucide";
import {MyStore} from "@/stores/my-store";
import t from 'typy';

export default {
  components: {
    ArrowRight,
    ArrowDown,
    DeleteIcon,
  },
  data() {
    return {
      ignoreMenuDropdown: 'OPEN_TAB',
    }
  },
  props: {
    node: {
      type: Object,
      required: true,
    },
    indentSize: {
      type: Number,
      required: true,
    },
    gap: {
      type: Number,
      required: true,
    },
    getNode: {
      type: Function,
      required: true,
    },
    setNode: {
      type: Function,
      required: true,
    },
    updateNode: {
      type: Function,
      required: true,
    },
    expandRowByDefault: {
      type: Boolean,
      default: false,
    },
    useCheckbox: {
      type: Boolean,
      default: false,
    },
    useIcon: {
      type: Boolean,
      default: true,
    },
    useRowDelete: {
      type: Boolean,
      default: false,
    },
    showChildCount: {
      type: Boolean,
      default: false,
    },
    rowHoverBackground: {
      type: String,
      default: '#e0e0e0',
    },
    expandable: {
      type: Boolean,
      default: true,
    },
    idSelected: {
      type: String,
      default: '',
    },
    isHasTippy: {
      type: Boolean,
      default: true
    }
  },
  emits: ['nodeClick', 'toggleCheckbox', 'nodeExpanded', 'deleteRow'],
  setup(props, {emit}) {
    const myStore = MyStore();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);
    const childCount = computed(() => props.node.nodes?.length);
    const checkedChildCount = computed(
        () => props.node.nodes?.filter(item => item.checked).length,
    );

    function actionSelectedMenu(menu: string) {
      emitter.emit('selected-setting-on-folder', {show: true, menu: menu});
    }

    function searchNodeLabel(_item) {
      emitter.emit('treerow-to-search', _item);
      _item.active = false;
    }

    const toggleExpanded = (_node) => {
      _node.expanded = !_node.expanded;
      // nextTick(() => onNodeExpanded(_node, _node.expanded));
    };

    const handleClick = (node) => {
      emit('nodeClick', {...node});
    };

    const onNodeExpanded = (node, state) => {
      emit('nodeExpanded', node, state);
    };

    const onToggleCheckbox = node => {
      emit('toggleCheckbox', node);
    };

    const removedRow = node => {
      emit('deleteRow', node);
    };

    onMounted(() => {
      if(props.node.expanded == undefined) {
        props.node.expanded = true;
      }
      createIcons({icons});
    });

    return {
      t,
      locale,
      childCount,
      checkedChildCount,
      handleClick,
      onNodeExpanded,
      onToggleCheckbox,
      removedRow,
      toggleExpanded,
      searchNodeLabel,
      actionSelectedMenu
    };
  },
};
</script>

<style lang="scss">
.tree-list,
.tree-row {
  display: grid;
  margin: 0;
  padding: 0;
}

.tree-row {
  transform-style: preserve-3d;

  > .setting-dropdown {
    opacity: 0;
    z-index: -1;
    button.dropdown-toggle {
      visibility: hidden;
      transition: opacity .15s ease-out 0s;
    }
  }

  &.is-active {
    > .setting-dropdown {
      opacity: 1;
      z-index: 2;
      button.dropdown-toggle[aria-expanded=true] {
        visibility: visible;
      }
    }
    &:hover {
      > .setting-dropdown {
        opacity: 1;
        z-index: 2;
        button.dropdown-toggle {
          visibility: visible;
        }
      }
    }
  }

  > .tree-list {
    padding-left: 20px;
  }

  &-item {
    display: flex;
    align-items: center;
    position: relative;
    padding: 5px 10px;
    &:hover {
      cursor: pointer;
      &:before {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(white, .15);
        border-radius: 9999px;
        z-index: -1;
      }
    }
    .child-count {
      color: gray;
      margin-left: 6px;
    }

    .delete-icon {
      color: red;
      opacity: 0;
      display: flex;
      align-items: center;
      width: 16px;
      height: 16px;
    }

    &-icon-wrapper {
      width: 15px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }

  &-item:hover {
    .delete-icon {
      opacity: 1;
    }
  }

  &-txt {
    user-select: none;
  }
}

.modal {
  &-dialog {
    .tree-row {
      .setting-dropdown {
        display: none;
      }

      &-item {
        .text-\[\#727272\] {
          color: #94a3b8;
        }
      }
    }
  }
}
</style>
