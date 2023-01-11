<template>
  <div class="sign-in">
    <div class="grid grid-cols-12 gap-4">
      <div class="min-w-[220px] col-span-12 sm:col-span-5 md:col-span-4">
        <h3 class="text-base">{{ locale.signin }}</h3>
      </div>
      <div class="group-action col-span-12 sm:col-span-7 md:col-span-8">
        <div class="mb-3">
          <p><b>{{ locale.password }}:</b></p>
          <button type="button" class="btn btn-secondary-soft mt-3" @click="ModalChangePassword = true">{{
              locale.changePassword
            }}</button>
        </div>
      </div>
    </div>
    <!-- BEGIN: Modal Change Pass -->
    <Modal backdrop="static" :show="ModalChangePassword" @hidden="ModalChangePassword = false">
      <ModalBody class="p-5">
        <form name="FrmChangePass" @submit.prevent="actionChangePassword">
          <div class="mb-5">
            <div class="mb-3">
              <label class="form-label">{{ locale.oldPassword }}</label>
              <input
                     v-model="validate.oldPassword.$model"
                     :class="{ 'border-danger': validate.oldPassword.$error }"
                     type="password" class="form-control" :placeholder="locale.enter + ' ' + locale.oldPassword + '...'" />
              <template v-if="validate.oldPassword.$error">
                <div
                    v-for="(error, index) in validate.oldPassword.$errors"
                    :key="index"
                    class="text-danger mt-2"
                >
                  {{ error.$message }}
                </div>
              </template>
            </div>
            <div class="mb-3">
              <label
                     class="form-label">{{ locale.newPassword }}</label>
              <input
                     v-model="validate.password.$model"
                     :class="{ 'border-danger': validate.password.$error }"
                     type="password" class="form-control" :placeholder="locale.enter + ' ' + locale.newPassword + '...'" />
              <template v-if="validate.password.$error">
                <div
                    v-for="(error, index) in validate.password.$errors"
                    :key="index"
                    class="text-danger mt-2"
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
                     type="password" class="form-control" :placeholder="locale.enter + ' ' + locale.confirmPassword + '...'" />
              <template v-if="validate.confirmPassword.$error">
                <div
                    v-for="(error, index) in validate.confirmPassword.$errors"
                    :key="index"
                    class="text-danger mt-2"
                >
                  {{ error.$message }}
                </div>
              </template>
            </div>
          </div>
          <div class="btn-group text-right">
            <button type="button" @click="ModalChangePassword = false" class="btn btn-secondary mr-3">
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
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, toRefs} from "vue";
import {MyStore} from "@/stores/my-store";
import {User} from "@/model/User";
import {helpers, required} from "@vuelidate/validators";
import {NOT_MATCH_PASSWORD, REQUIRED} from "@/utils/MyVariables";
import {useVuelidate} from "@vuelidate/core";
import {showToastMessage} from "@/utils/MyFunction";
import UserService from "@/service/UserService";
import {ResponseData} from "@/model/ResponseData";
  export default defineComponent({
    name: "MailSetingGeneralSignin",
    setup() {
      const ModalChangePassword = ref<boolean>(false);
      const myStore = MyStore();
      const myUser = computed(() => myStore.myUser);
      const locale = computed(() => myStore.locale);
      //setting
      const formData = reactive(new User());
      const samePassword = helpers.withParams(
          { type: 'samePassword' },
          (value: any) => value === formData.password
      );
      //validate
      const rules = {
        oldPassword: {
          required: helpers.withMessage(REQUIRED, required),
        },
        password: {
          required: helpers.withMessage(REQUIRED, required),
        },
        confirmPassword: {
          required: helpers.withMessage(REQUIRED, required),
          samePassword: helpers.withMessage(NOT_MATCH_PASSWORD, samePassword),
        },
      }
      const validate = useVuelidate(rules, toRefs(formData));

      async function actionChangePassword() {
        validate.value.$touch();
        if (validate.value.$invalid) {
          showToastMessage(undefined, true);
        } else {
          //init request
          const itemRequest = new User();
          itemRequest._id = myUser.value._id;
          itemRequest.account = myUser.value.account;
          itemRequest.password = formData.password;
          itemRequest.oldPassword = formData.oldPassword;
          //call request
          const response = await UserService.changePassword(itemRequest, myStore.token);
          if (response.data) {
            const responseData: ResponseData = response.data;
            //Kiểm tra backend có trả error ko
            if (responseData.values.error) {
              // Set thông báo thất bại
              showToastMessage(responseData.values.error, true);
            } else {
              const userResponse = responseData.values as User;
              //set store token
              myStore.setCookie(userResponse);
              //set store user
              myStore.setUser(userResponse);
              //close modal
              ModalChangePassword.value = false;
              //alert success
              showToastMessage();
            }
          } else {
            showToastMessage(undefined, true);
          }
        }
      }

      return {
        ModalChangePassword,
        locale,
        validate,
        myUser,
        actionChangePassword,
      }
    }
  })
</script>

<style lang="scss"></style>