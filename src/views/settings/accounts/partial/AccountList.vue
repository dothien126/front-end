<template>
  <div class="account-list">
    <div class="grid grid-cols-12 gap-4">
      <div class="min-w-[220px] col-span-12 sm:col-span-5 md:col-span-4">
        <h3 class="text-base">Accounts</h3>
        <p class="text-xs text-gray-600 dark:text-gray-400/80 mb-2">
          (Sử dụng iNET mail để gửi thư từ các địa chỉ email khác của bạn)
        </p>
        <a class="text-blue-500 hover:text-blue-400 transition-colors" href="/">Tìm hiểu thêm</a>
      </div>
      <div class="acc-list-table col-span-12 sm:col-span-7 md:col-span-8">
        <div class="flex flex-col sm:flex-row items-start mb-3">
          <div class="grow">
            <h3 class="text-base">List Accounts</h3>
            <small class="text-slate-500">Total Accounts: <b>{{dataMockLeng}}</b></small>
          </div>
          <div class="-mx-2">
            <button type="button" class="btn btn-outline-secondary mx-2 mb-2" @click="addExternalAccModal = true;">
              Add External Account
            </button>
            <button type="button" class="btn btn-outline-secondary mx-2 mb-2" @click="frmExternalAcc.modalShowHide = true;">
              Add Persona
            </button>
          </div>
        </div>
        <div class="mb-3">
          <div class="mb-2.5 bg-light dark:bg-white/10 rounded" v-for="(faker, fakerKey) in $_.take($f(), dataMockLeng).slice(0, 5)" :key="fakerKey">
            <div class="flex py-2 px-3 flex-col md:flex-row">
              <div class="md:pr-3 md:border-r min-w-[150px] md:border-slate-500 dark:border-slate-500/30">
                <p class="text-slate-500">Account Name</p>
                <p>{{faker.users[0].name}}</p>
              </div>
              <div class="md:pl-3">
                <p class="text-slate-500">Email Address</p>
                <p class="mb-1.5 -mx-1.5 flex items-center">
                  <Tippy tag="span" :content="fakerKey == 0 ? 'Status - Active' : 'Status - Not active'"
                         :class="{'bg-success': fakerKey == 0, 'bg-danger': fakerKey != 0}"
                         class="p-1 rounded-full w-1.5 h-1.5 m-1.5">
                  </Tippy>
                  {{faker.users[0].email}}
                </p>
              </div>
            </div>
            <div class="flex py-1 px-3 bg-light dark:bg-slate-500/5 items-center">
              <div class="tag-group grow">
                <Tippy tag="span" content="Type" class="px-2 text-xs py-1 rounded m-1"
                       :class="{'bg-blue-600 text-white': fakerKey == 0, 'bg-gray-600/30': fakerKey != 0 }">
                  {{fakerKey == 0 ? 'Primary' : 'POP3'}}
                </Tippy>
              </div>
              <div class="btn-group -mx-1.5">
                <Tippy tag="button" content="Chỉnh sửa" type="button" class="btn btn-sm mx-1.5 my-1" @click="frmExternalAccEdit(faker.users[0], fakerKey); addExternalAccModal = true;">
                  <Edit2Icon class="w-4 h-4"/>
                </Tippy>
                <Tippy v-if="fakerKey != 0" tag="button" content="Xoá" type="button" class="btn btn-sm mx-1.5 my-1" @click="frmExternalAccDel(faker.users[0]); addExternalAccModal = true;">
                  <TrashIcon class="w-4 h-4"/>
                </Tippy>
              </div>
            </div>
          </div>
          <!-- BEGIN: Pagination -->
          <div class="intro-y" v-if="dataMockLeng > 10">
            <nav class="w-full">
              <ul class="pagination justify-center">
                <li class="page-item">
                  <a class="page-link" href="#">
                    <ChevronsLeftIcon class="w-4 h-4" />
                  </a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">
                    <ChevronLeftIcon class="w-4 h-4" />
                  </a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">...</a>
                </li>
                <li class="page-item" v-for="n in Math.ceil(dataMockLeng/5)" :key="n">
                  <a class="page-link" href="#">{{n}}</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">...</a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">
                    <ChevronRightIcon class="w-4 h-4" />
                  </a>
                </li>
                <li class="page-item">
                  <a class="page-link" href="#">
                    <ChevronsRightIcon class="w-4 h-4" />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <!-- END: Pagination -->
        </div>
      </div>
    </div>
    <!-- BEGIN: Add External Account Modal -->
    <Modal backdrop="static" :show="addExternalAccModal" @hidden="addExternalAccModal = false">
      <ModalBody class="px-5 py-3">
        <form name="frmExternalAcc" v-if="!ExteralAccDel">
          <h3 class="text-xl mb-3">External Account Settings</h3>
          <div class="grid grid-cols-1 divide-y divide-slate-400/30">
            <div class="gr-1 mb-2">
              <div class="mb-3 ip-line">
                <input id="frmEx1" type="text"
                       class="form-control"
                       v-model="frmExternalAcc.email"
                       :class="{'is-txt-len': frmExternalAcc.email}"
                       :disabled="frmExternalAcc.mailType"/>
                <label for="frmEx1" placeholder="Enter email address..." title="Email address:" class="form-label mb-1"></label>
              </div>
              <div class="ip-line">
                <input id="frmEx2" type="text" class="form-control" v-model="frmExternalAcc.accName" :class="{'is-txt-len': frmExternalAcc.accName}"/>
                <label for="frmEx2" placeholder="Enter Account Name..." title="Account Name:" class="form-label mb-1"></label>
              </div>
            </div>
            <div class="my-3 pt-3">
              <div class="acc-type-group mb-2">
                <label class="form-label mb-1">Account type:</label>
                <div class="flex flex-col sm:flex-row -mx-3">
                  <div class="form-check mx-3 my-2">
                    <input id="frmEx3"
                           class="form-check-input"
                           type="radio"
                           name="account_type"
                           v-model="frmExternalAcc.accType"
                           value="pop3"
                           :checked="frmExternalAcc.accType === 'pop3'"
                    />
                    <label class="form-check-label" for="frmEx3">POP3</label>
                  </div>
                  <div class="form-check mx-3 my-2">
                    <input id="frmEx3-1"
                           class="form-check-input"
                           type="radio" name="account_type"
                           v-model="frmExternalAcc.accType"
                           value="imap"
                           :checked="frmExternalAcc.accType === 'imap'"
                    />
                    <label class="form-check-label" for="frmEx3-1">IMAP</label>
                  </div>
                </div>
              </div>
              <div class="mb-3 ip-line">
                <input id="frmEx4" type="text" class="form-control" v-model="frmExternalAcc.userAcc"/>
                <label for="frmEx4" class="form-label mb-1" placeholder="Enter Username..." title="Username of Account:"></label>
              </div>
              <div class="mb-3 ip-line">
                <input id="frmEx5" type="text" class="form-control" v-model="frmExternalAcc.emailServer" :class="{'is-txt-len': frmExternalAcc.emailServer}"/>
                <label for="frmEx5" class="form-label mb-1" placeholder="Enter mail server..." title="Email Server:"></label>
              </div>
              <div class="mb-3 ip-line">
                <input id="frmEx6" :type="frmExternalAcc.showPass ? 'text' : 'password'" class="form-control"
                       v-model="frmExternalAcc.passWord" :class="{'is-txt-len': frmExternalAcc.passWord}"/>
                <label for="frmEx6" class="form-label mb-1" placeholder="Enter pass..." title="Password:"></label>
                <div class="absolute right-0 top-[5px]">
                  <button v-if="!frmExternalAcc.showPass" type="button"
                          title="Show Pass"
                          class="btn btn-sm absolute border-0 dark:border-0 right-0"
                          @click="frmExternalAcc.showPass = true;">
                    <EyeIcon class="w-4 h-4"/>
                  </button>
                  <button v-else type="button" title="Hidden Pass"
                          class="btn btn-sm absolute border-0 dark:border-0 right-0"
                          @click="frmExternalAcc.showPass = false;">
                    <EyeOffIcon class="w-4 h-4"/>
                  </button>
                </div>
              </div>
              <div class="mb-3">
                <label class="mb-1">Advanced Settings:</label>
                <div class="form-inline">
                  <div class="flex flex-col sm:flex-row">
                    <div class="form-check mr-2">
                      <input id="frmEx7" class="form-check-input" type="checkbox" value="" />
                      <label class="form-check-label text-slate-300/60 hover:text-slate-400" for="frmEx7">Change Pop port</label>
                    </div>
                    <input type="text" class="form-control form-control-sm" placeholder="110"/>
                  </div>
                </div>
                <div class="form-check mt-2">
                  <input id="frmEx8" class="form-check-input" type="checkbox" value=""/>
                  <label class="form-check-label text-slate-300/60 hover:text-slate-400" for="frmEx8">Use an encrypted connection (SSL) when accessing this server</label>
                </div>
              </div>
              <div class="flex items-center">
                <button type="button" v-if="!frmExternalAcc.advancedSetting.testResult" @click="testSetting" class="btn btn-primary btn-sm">
                  Test Settings
                </button>
                <div v-if="frmExternalAcc.advancedSetting.test" class="grow px-2">
                  <div class="progress h-1">
                      <div class="progress-bar" :class="{'animate-progress-bar': frmExternalAcc.advancedSetting.test}"
                           role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                </div>
              </div>
              <div class="test-setting-result dark:bg-dark mt-3" v-if="frmExternalAcc.advancedSetting.testResult">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Account</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{frmExternalAcc.accName}}</td>
                      <td>
                        <span class="text-danger">Failed</span>
                        <span class="text-success">Success</span>
                      </td>
                    </tr>
                    <tr class="test-error">
                      <td colspan="2">
                        <b class="text-danger">Error: {{frmExternalAcc.email}}</b>
                        <p class="flex text-gray-500 dark:text-white/40">
                          <span>Note:</span>
                          <span class="ml-2">
                            If you continue to save, account will be marked inactive. <br>
                            Press Cancel to return to editing accounts.
                          </span>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="text-right p-2">
                  <button class="btn btn-sm btn-primary min-w-[100px]" @click="frmExternalAcc.advancedSetting.testResult = false;">
                    Test lại
                  </button>
                </div>
              </div>
            </div>
            <div class="my-3 pt-3">
              <label>Download messages to:</label>
              <div class="flex flex-col sm:flex-row mt-2">
                <div class="form-check mr-2">
                  <input id="frmEx9" class="form-check-input" type="radio" name="horizontal_radio_button" value="horizontal-radio-chris-evans" />
                  <label class="form-check-label text-slate-300/60 hover:text-slate-400" for="frmEx9">Inbox</label>
                </div>
                <div class="form-check mr-2 mt-2 sm:mt-0">
                  <input id="frmEx10" class="form-check-input" type="radio" name="horizontal_radio_button" value="horizontal-radio-liam-neeson" checked/>
                  <label class="form-check-label text-slate-300/60 hover:text-slate-400" for="frmEx10">Folder: {{frmExternalAcc.accName}}</label>
                </div>
              </div>
              <div class="form-check mt-2">
                <input id="frmEx11" class="form-check-input" type="checkbox" value="" />
                <label class="form-check-label text-slate-300/60 hover:text-slate-400" for="frmEx11">Delete messages on the server after downloading them</label>
              </div>
            </div>
            <div class="my-3 pt-3">
              <label class="block mb-1">Settings for Sent Messages</label>
              <div class="mb-3">
                <p class="text-xs dark:text-slate-500 mb-2">Choose what appears in the "From" field of email messages</p>
                <div class="ip-line">
                  <input id="frmEx12" type="text" class="form-control" v-model="frmExternalAcc.sentMsg.from" :class="{'is-txt-len': frmExternalAcc.sentMsg.from}"/>
                  <label for="frmEx12" class="form-label mb-1" title="From:" placeholder="Enter from..."></label>
                </div>
              </div>
              <div class="form-check mb-1">
                <input id="frmEx13" class="form-check-input" type="checkbox" @change="frmExternalAcc.sentMsg.replyto = !frmExternalAcc.sentMsg.replyto"/>
                <label class="form-check-label text-slate-300/60 hover:text-slate-400" for="frmEx13">Reply-to</label>
              </div>
              <div class="flex flex-col sm:flex-row items-center -mx-2" v-if="frmExternalAcc.sentMsg.replyto">
                <input type="text" class="form-control m-2" placeholder="e.g. Bob Smith"/>
                <select class="form-select m-2">
                  <option>Chris Evans</option>
                  <option>Liam Neeson</option>
                  <option>Daniel Craig</option>
                </select>
              </div>
              <div class="mt-3">
                <label class="mr-2">Signature:</label>
                <a class="text-blue-500 hover:text-blue-400 transition-colors" href="/mail/setting/signatures">Manage your signatures ...</a>
              </div>
            </div>
            <div class="pt-3"></div>
          </div>
          <div class="-mx-2 text-right">
            <button type="button" @click="addExternalAccModal = false" class="btn min-w-[100px] btn-secondary m-2">
              Cancel
            </button>
            <button type="button" @click="addExternalAccModal = false" class="btn min-w-[100px] bg-blue-500 text-white dark:border-violet-600 dark:bg-violet-600 m-2">
              Save
            </button>
          </div>
        </form>
        <div class="py-2" v-else>
          <Alert class="alert-danger flex items-center mb-5">
            <AlertOctagonIcon class="w-8 h-8 mr-3" />
            <div>
              <span class="text-xl">Quý khách muốn xoá email</span> <b>{{frmExternalAcc.email}}</b>
            </div>
          </Alert>
          <div class="text-right">
            <button type="button" class="btn btn-secondary min-w-[100px] mr-3" @click="addExternalAccModal = false;">
              Huỷ
            </button>
            <button type="button" class="btn btn-danger min-w-[100px]" @click="dataMockLeng -= 1; addExternalAccModal = false;">
              Xoá
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
    <account-add-persona-modal :AccountData="frmExternalAcc" @update:AccountData="frmExternalAcc.modalShowHide = false; frmExternalAcc"></account-add-persona-modal>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref} from "vue";
  import AccountAddPersonaModal from "@/views/settings/accounts/partial/AccountAddPersonaModal.vue";

  export default defineComponent({
    name: "MailSetingAccountList",
    components: { AccountAddPersonaModal },
    data()  {
      return {
        personaMailSelect: 1,
        dataMockLeng: 11,
        ExteralAccDel: false,
        frmExternalAcc: {
          email: "",
          accName: "New External Account",
          accType: 'pop3',
          userAcc: "",
          emailServer: "",
          passWord: "",
          showPass: false,
          advancedSetting: {
            port: 110,
            ssl: false,
            test: false,
            testResult: false
          },
          sentMsg: {
            from: "",
            replyto: false
          },
          persona: {
            name: "New Persona",
            sentMsg: {
              from: "",
              replyto: false
            }
          }
        }
      }
    },
    methods: {
      testSetting() {
        const _self = this;
        _self.frmExternalAcc.advancedSetting.test = true;
        _self.frmExternalAcc.advancedSetting.testResult = false;
        setTimeout(() => {
          _self.frmExternalAcc.advancedSetting.test = false;
          _self.frmExternalAcc.advancedSetting.testResult = true;
        }, 1000);
      },
      frmExternalAccEdit(_item, _idx) {
        this.ExteralAccDel = false;
        this.frmExternalAcc.email = _item.email;
        this.frmExternalAcc.accName = _item.name;
        this.frmExternalAcc['mailType'] = _idx == 0 ? 'true' : undefined;
      },
      frmExternalAccDel(_item) {
        this.ExteralAccDel = true;
        this.frmExternalAcc.email = _item.email;
      }
    },
    setup() {
      const addExternalAccModal = ref<boolean>(false);
      return {
        addExternalAccModal
      }
    }
  })
</script>

<style lang="scss"></style>