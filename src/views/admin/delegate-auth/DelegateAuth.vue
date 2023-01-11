<template>
  <iNETComponent name="Loading"/>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {IAdminUser} from "@/model/admin/IAdminUser";
import {MyAdminStore} from "@/stores/admin-store/admin-store";

export default defineComponent({
  name: "DelegateAuth",
  setup(){
    //init value
    const myAdminStore = MyAdminStore();
    const route = useRoute();
    const router = useRouter();

    onMounted(async () => {
      //validate
      if (route.query.jwt) {
        //init value
        const myAdmin = {jwt: route.query.jwt} as IAdminUser;
        //set cookie
        myAdminStore.setAdminCookie(myAdmin);
        //check redirect dashboard
        await router.push('/admin/dashboard');
      }
      else{
        await router.push('/admin/login');
      }
    });
  }
});
</script>

<style scoped>

</style>