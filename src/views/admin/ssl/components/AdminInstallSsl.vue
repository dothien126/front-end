<template>
  <div class="admin-install-ssl">
    <div v-if="$route.path === '/admin/dashboard'">
      <Alert class="alert-danger" v-if="!sslActive">
        {{ locale.sslNotInstalled }}
      </Alert>
      <Alert class="alert-success" v-else>
        {{ locale.sslInstalled }}
      </Alert>
    </div>
    <div v-else class="max-w-3xl">
      <Alert class="alert-danger mb-5" v-if="!domainVl && !sslActive">
        <div class="flex items-center">
          <AlertOctagonIcon class="w-6 h-6 shrink-0 mr-2" />
          <p class="grow">
            {{ locale.noteBeforeInstallSsl }} <b>{{sslSys.domain}}</b> {{ locale.toIpAddress }} <b>{{sslSys.ip}}</b>
          </p>
          <button class="btn btn-success dark:text-white text-white shrink-0" @click="checkRecord('undefined')">
            {{ locale.checkRecord }}
          </button>
        </div>
      </Alert>
      <Alert class="alert-warning mb-5" v-else-if="domainVl === 'undefined' && !sslActive">
        <div class="flex items-center">
          <AlertOctagonIcon class="w-6 h-6 shrink-0"/>
          <div class="grow px-3">
            {{ locale.domain }} <b>{{sslSys.domain}}</b> {{ locale.notPointedIp }} <b>{{sslSys.ip}}</b>
            <p class="mt-3">
              {{ locale.noteAfterPointedIp }} <button type="button" class="btn btn-sm btn-outline-primary" @click="checkRecord(true)">
              {{ locale.checkAgain }}</button>
            </p>
          </div>
          <a href="javascript:;" target="_blank" class="btn btn-success text-white">
            {{ locale.instructPoint }}
          </a>
        </div>
      </Alert>
      <Alert class="alert-success mb-5 text-white" v-else-if="domainVl && !sslActive">
        <div class="flex items-center">
          <CheckCircleIcon class="w-6 h-6 mr-2"/>
          <p class="grow">
            {{ locale.domain }} <b>{{sslSys.domain}}</b> {{ locale.domainPointedToIp }} <b>{{sslSys.ip}}</b>
          </p>
        </div>
      </Alert>
      <div class="flex items-center py-2 px-3 bg-white rounded mb-5" v-if="isloading">
        <div class="w-8 h-8 shrink-0">
          <iNETComponent name="Loading"/>
        </div>
        <p class="grow pl-3">
          {{ locale.systemChecking }} <b>mail.your-domain.com</b>, {{ locale.pleaseWait }}
        </p>
      </div>
      <div class="overflow-x-auto">
        <table class="table">
          <tbody>
            <tr class="bg-white hover:bg-slate-200/60">
              <td>
                <b> {{ locale.domain }}</b>
              </td>
              <td>
                <strong>your-domain.com</strong>
              </td>
            </tr>
            <tr class="bg-white hover:bg-slate-200/60">
              <td>
                <b>{{ locale.currentMailRecord }}</b>
              </td>
              <td>
                <div class="text-danger" v-if="!sslActive">
                  {{ locale.noRecordInstalled }}
                </div>
                <div v-else>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-center">
                    <div class="bg-slate-200 rounded p-2">
                      <p>{{ locale.recordName }}</p>
                      <b>mail</b>
                    </div>
                    <div class="bg-slate-200 rounded p-2">
                      <p>{{ locale.recordType }}</p>
                      <b>A</b>
                    </div>
                    <div class="bg-slate-200 rounded p-2">
                      <p>{{ locale.value }}</p>
                      <b>{{sslSys.ip}}</b>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
            <tr class="bg-white hover:bg-slate-200/60">
              <td>
                <b>{{ locale.statusSsl }}</b>
              </td>
              <td>
                <div class="flex items-center text-danger" v-if="!sslActive">
                  <UnlockIcon class="w-4 h-4 mr-2"/>
                  {{ locale.notInstalled }}
                </div>
                <div class="flex items-center text-success" v-else>
                  <LockIcon class="w-4 h-4 mr-2"/>
                  {{ locale.installed }}
                </div>
              </td>
            </tr>
            <tr class="bg-slate-200">
              <td colspan="2" class="text-right">
                <div class="-mx-2">
                  <div class="inline-flex items-center mr-3" v-if="sslI.isloading">
                    <p class="grow mr-2">{{ locale.systemInstallingSsl }}</p>
                    <div class="w-6 h-6">
                      <iNETComponent name="Loading"/>
                    </div>
                  </div>
                  <button type="button" class="btn btn-secondary m-2" v-if="sslActive" @click="sslActive = false">
                    {{ locale.unAndReinstall }}
                  </button>
                  <button type="button" class="btn btn-primary" v-if="!sslActive" :disabled="!domainVl || domainVl === 'undefined'" @click="installSSL()">
                    {{ locale.sslSetting }}}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {MyStore} from "@/stores/my-store";
  export default defineComponent({
    name: 'AdminInstallSsl',
    data() {
      return {
        sslActive: false,
        isloading: false,
        domainVl: false,
        sslSys: {
          ip: '103.57.220.29',
          domain: 'mail.your-domain.vn'
        },
        sslI: {
          isloading: false,
        }
      }
    },
    methods: {
      checkRecord(_domvl) {
        this.isloading = true;
        const _sefl = this;
        setTimeout(() => {
          _sefl.isloading = false;
          _sefl.domainVl = _domvl; // true, false or undefined
        }, 1500)
      },
      installSSL() {
        this.sslI.isloading = true;
        const _self = this;
        setTimeout(() => {
          this.sslI.isloading = false;
          _self.sslActive = true;
        }, 1500)
      }
    },
    setup() {
      // locale language
      const myStore = MyStore();
      const locale = computed(() => myStore.locale);
      return {
        locale,
      }
    }
  })
</script>