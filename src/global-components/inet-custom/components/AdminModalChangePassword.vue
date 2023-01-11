<template>
  <!-- BEGIN: Modal Change Pass -->
  <Modal backdrop="static" :show="showModal" @hidden="showModal = false">
    <ModalBody class="p-5">
      <form name="FrmChangePass" @submit.prevent="actionChangePassword">
        <div class="mb-5">
          <div class="mb-3">
            <label class="form-label">{{ locale.oldPassword }}</label>
            <input
                   v-model="validate.password.$model"
                   :class="{ 'border-danger': validate.password.$error }"
                   type="password" class="form-control" :placeholder="locale.enter + ' ' + locale.oldPassword + '...'"/>
            <template v-if="validate.password.$error">
              <div
                  v-for="(error, index) in validate.password.$errors"
                  :key="index"
                  class="text-warning mt-2"
              >
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div class="mb-3">
            <label
                   class="form-label">{{ locale.newPassword }}</label>
            <input
                   v-model="validate.passwordNew.$model"
                   :class="{ 'border-danger': validate.passwordNew.$error }"
                   type="password" class="form-control" :placeholder="locale.enter + ' ' + locale.newPassword + '...'"/>
            <template v-if="validate.passwordNew.$error">
              <div
                  v-for="(error, index) in validate.passwordNew.$errors"
                  :key="index"
                  class="text-warning mt-2"
              >
                {{ error.$message }}
              </div>
            </template>
          </div>
          <div>
            <label for="confirm-pass" class="form-label">{{ locale.confirmPassword }}</label>
            <input id="confirm-pass"
                   v-model="validate.confirmPassword.$model"
                   :class="{ 'border-danger': validate.confirmPassword.$error }"
                   type="password" class="form-control"
                   :placeholder="locale.enter + ' ' + locale.confirmPassword + '...'"/>
            <template v-if="validate.confirmPassword.$error">
              <div
                  v-for="(error, index) in validate.confirmPassword.$errors"
                  :key="index"
                  class="text-warning mt-2"
              >
                {{ error.$message }}
              </div>
            </template>
          </div>
        </div>
        <div class="btn-group text-right">
          <button type="button" @click="actionResetValue" class="btn btn-secondary mr-3">
            {{ locale.cancel }}
          </button>
          <button type="submit" class="btn bg-primary dark:bg-violet-600">
            {{ locale.changePassword }}
          </button>
        </div>
      </form>
    </ModalBody>
  </Modal>
  <!-- END: Modal Change Pass -->
</template>

<script lang="ts">
import {computed, defineComponent, onDeactivated, onMounted, reactive, ref, toRefs} from "vue";
import {MyStore} from "@/stores/my-store";
import {useVuelidate} from "@vuelidate/core";
import {helpers, required} from "@vuelidate/validators";
import {NOT_MATCH_PASSWORD, REQUIRED} from "@/utils/MyVariables";
import {showToastMessage} from "@/utils/MyFunction";
import {ResponseData} from "@/model/ResponseData";
import {MyAdminStore} from "@/stores/admin-store/admin-store";
import {IAdminUser} from "@/model/admin/IAdminUser";
import {IAdminCompanyUser} from "@/model/admin/dto/IAdminCompanyUser";
import AdminUserService from "@/service/admin/AdminUserService";
import {useRouter} from "vue-router";

export default defineComponent({
  name: "AdminModalChangePassword",
  setup() {
    const myStore = MyStore();
    const adminStore = MyAdminStore();
    const router = useRouter();
    const emitter = myStore.useEmitter();
    const locale = computed(() => myStore.locale);
    const myJwt = computed(() => adminStore.myAdminJwt);
    const myAdminCompanyUser = computed(() => adminStore.myAdminCompanyUser as IAdminCompanyUser);
    const showModal = ref(false);
    const formData = reactive({
      password: '',
      passwordNew: '',
      confirmPassword: '', //client only
    } as IAdminUser);
    const samePassword = helpers.withParams(
        {type: 'samePassword'},
        (value: any) => value === formData.passwordNew
    );
    const rules = {
      password: {
        required: helpers.withMessage(REQUIRED, required),
      },
      passwordNew: {
        required: helpers.withMessage(REQUIRED, required),
      },
      confirmPassword: {
        required: helpers.withMessage(REQUIRED, required),
        samePassword: helpers.withMessage(NOT_MATCH_PASSWORD, samePassword),
      },
    }
    const validate = useVuelidate(rules, toRefs(formData));

    function actionResetValue() {
      formData.password = '';
      formData.passwordNew = '';
      showModal.value = false;
    }

    async function actionChangePassword() {
      validate.value.$touch();
      if (validate.value.$invalid) {
        showToastMessage(undefined, true);
      } else {
        //init request
        const itemRequest = {_id: '', password: '', passwordNew: '', account: ''} as IAdminUser;
        itemRequest._id = myAdminCompanyUser.value.adminId;
        itemRequest.account = myAdminCompanyUser.value.adminEmail;
        itemRequest.password = formData.password;
        itemRequest.passwordNew = formData.passwordNew;
        //call request
        const response = await AdminUserService.changePassword(itemRequest, myJwt.value);
        if (response.data) {
          const responseData: ResponseData = response.data;
          //Kiểm tra backend có trả error ko
          if (responseData.values.error) {
            // Set thông báo thất bại
            showToastMessage(responseData.values.error, true);
          } else {
            //delete cookie cu
            adminStore.deleteAdminCookie();
            //reset value
            actionResetValue();
            //alert success
            showToastMessage();
            //change route
            await router.push('/admin/login');
          }
        } else {
          showToastMessage(undefined, true);
        }
      }
    }

    onMounted(() => {
      //Lắng nghe sự kiện
      emitter.on('change-password-admin-user', () => {
        //show modal
        showModal.value = true;
      });
    });

    onDeactivated(() => {
      emitter.off('change-password-admin-user');
    });

    return {
      locale,
      validate,
      showModal,
      actionResetValue,
      actionChangePassword
    }
  }
})
</script>