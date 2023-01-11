<template>
  <div class="admin-acc-manager-list">
    <!--    BEGIN: main page-->
    <div class="content-group">
      <div class="body-page my-5">
        <div class="min-h-[10vh]">
          <TrashView />
        </div>
      </div>
    </div>
    <!--    END: main page-->
  </div>
  <iNETComponent name="ModalDelete"/>
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted} from "vue";
import {createIcons, icons} from "lucide";
import {MyStore} from "@/stores/my-store";
import TrashView from "@/views/admin/account-manager/list-view/TrashView.vue";
import {AdminUserManagerStore} from "@/stores/admin-store/user-manager/user-manager-store";

export default defineComponent({
  name: 'AdminAccountManagerTrash',
  data() {
    return {
      ListView: 'TrashView',
    }
  },
  components: {
    TrashView,
  },
  mounted() {
    createIcons({icons, nameAttr: 'icon-name'});
  },
  setup() {
    const adminUserManagerStore = AdminUserManagerStore();
    const myStore = MyStore();
    const emitter = myStore.useEmitter();
    const nameUserTrash = computed({
      get: () => adminUserManagerStore.nameUserTrash as string,
      set: (data) => adminUserManagerStore.nameUserTrash = data,
    });

    onMounted(async () => {
      //listener reload data by search account
      emitter.on('reload-data-user-trash-by-search', async (searchName: string) => {
        //change name user
        nameUserTrash.value = !searchName && searchName.length <= 0 ? '' : searchName;
        //reload
        await adminUserManagerStore.initGetAllUserTrash();
      });
      //init method without emit
      await adminUserManagerStore.initGetAllUserTrash();
    });

    onDeactivated(() => {
      emitter.off('reload-data-user-trash-by-search');
    });

    return {
    }
  }
})
</script>