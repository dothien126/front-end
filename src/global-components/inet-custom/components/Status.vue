<template>
  <div v-if="!sOptions.type" class="progress" :class="sClass">
    <div class="progress-bar px-2 whitespace-nowrap" style="font-size: 11px;" :style="iStatus.style()" role="progressbar">
      {{ iStatus.title() }}
    </div>
  </div>
  <template v-else-if="sOptions.type === 'dot'">
    <div class="inline-flex items-center">
      <span class="w-3 h-3 rounded-full shrink-0" :style="iStatus.style()"></span>
      <span v-if="sOptions.text" class="text-xs ml-1 text-slate-600/80 dark:text-white/40">{{ iStatus.title() }}</span>
    </div>
  </template>
  <template v-else-if="sOptions.type === 'tippy'">
    <Tippy tag="span" :content="iStatus.title()" class="w-3 h-3 rounded-full" :style="iStatus.style()"></Tippy>
  </template>
</template>

<script lang="ts">
import {MyStore} from "@/stores/my-store";
import {computed, defineComponent} from "vue";

export default defineComponent({
  name: 'inetStatus',
  props: {
    sValue: {
      type: [Object, String],
      required: true
    },
    sClass: {
      type: String,
      default: () => 'h-5'
    },
    sOptions: {
      type: Object,
      default: {
        text: false,
        type: '',
        style: true
      }
    }
  },
  setup(props) {
    const myStore = MyStore()
    const sVal = computed(() => props.sValue);
    const localeAdmin = computed(() => myStore.locale);

    class iNETStatus {
      status: any;

      constructor(value: any) {
        if (!value) {
          console.log(value + ' is not found!');
          return;
        }
        if(typeof value == "string") {
          this.sValueTypeString(value);
        }
        else if(typeof value == "object") {
          this.sValueZimbraStatus(value);
        }
      }
      // Sử dụng cho Gateway
      sValueZimbraStatus(value: any) {
        if(Array.isArray(value)) {
          return console.warn(value + ' is not object {}');
        }
        const dS = value.dstatus ?  value.dstatus : "";
        const rS = value.rstatus ? value.rstatus : "";
        this.sValueTypeString(dS + rS);
      }

      sValueTypeString(value: string) {
        const baseK = this.getKeyByVlArr(this.baseStatus(), value);
        if (baseK) {
          this.status = baseK;
        } else {
          const newK = this.getKeyByVlArr(this.newSatatus(), value);
          this.status = newK;
        }
      }

      style() {
        if (this.status) {
          return {
            backgroundColor: this.status.color,
            color: this.status.txtC ? this.status.txtC : 'white'
          }
        }
        return {backgroundColor: this.baseStatus().none.color}
      }

      title() {
        if (this.status) {
          return this.status.title.value;
        }
        return this.baseStatus().none.title.value;
      }

      getKeyByVlArr(_obj: object, _vl: string) {
        if (_obj[_vl]) {
          return _obj[_vl]
        }
        for (const k in _obj) {
          if (_obj[k].sample && _obj[k].sample.includes(_vl)) {
            return _obj[k];
          }
        }
        return false;
      }

      baseStatus() {
        return {
          none: {
            title: computed(() => localeAdmin.value.unknown),
            color: '#cbd5e1'
          },
          info: {
            title: computed(() => localeAdmin.value.info),
            color: '#3b82f6',
            sample: ['primary']
          },
          success: {
            color: '#34d399',
            title: computed(() => localeAdmin.value.success)
          },
          warning: {
            title: computed(() => localeAdmin.value.expirationSoon),
            color: '#facc15'
          },
          pending: {
            title: computed(() => localeAdmin.value.locked),
            color: '#fdba74',
            txtC: '#9a3412'
          },
          deleted: {
            title: computed(() => localeAdmin.value.deleted),
            color: '#f87171',
          },
        }
      }

      // Những dạng status mới cần thiết sẽ định nghĩa ở đây
      newSatatus() {
        return {
          active: {
            title: computed(() => localeAdmin.value.active),
            color: this.baseStatus().success.color,
            sample: ['active']
          },
          closed: {
            title: computed(() => localeAdmin.value.waitingToDelete),
            color: this.baseStatus().warning.color,
            sample: ['closed']
          },
          enabled: {
            title: computed(() => localeAdmin.value.active),
            color: this.baseStatus().success.color,
            sample: ['enabled']
          },
          disabled: {
            title: computed(() => localeAdmin.value.locked),
            color: this.baseStatus().deleted.color,
            sample: ['disabled']
          },
          deleting: {
            title: computed(() => localeAdmin.value.waitingToDelete),
            color: this.baseStatus().warning.color
          },
          deleted: {
            title: computed(() => localeAdmin.value.deleted),
            color: this.baseStatus().deleted.color
          },
          login: {
            title: computed(() => localeAdmin.value.login),
            color: this.baseStatus().success.color
          },
          update: {
            title: computed(() => localeAdmin.value.update),
            color: this.baseStatus().warning.color
          },
          create: {
            title: computed(() => localeAdmin.value.create),
            color: this.baseStatus().success.color
          },
          //  Begin HungHv: Thêm status tracking mail
          locked: {
            title: computed(() => localeAdmin.value.locked),
            color: this.baseStatus().pending.color,
            sample: ['locked']
          },
          rejected: {
            title: computed(() => localeAdmin.value.rejected),
            color: this.baseStatus().deleted.color,
            sample: ['N']
          },
          greylisted: {
            title: computed(() => localeAdmin.value.greylisted),
            color: this.baseStatus().none.color,
            sample: ['G']
          },
          queuedDeferred: {
            title: computed(() => localeAdmin.value.queuedDeferred),
            color: this.baseStatus().pending.color,
            sample: ['4']
          },
          queuedBounced: {
            title: computed(() => localeAdmin.value.queuedBounced),
            color: this.baseStatus().pending.color,
            sample: ['5']
          },
          queuedDelivered: {
            title: computed(() => localeAdmin.value.queuedDelivered),
            color: this.baseStatus().pending.color,
            sample: ['2']
          },
          quarantine: {
            title: computed(() => localeAdmin.value.quarantine),
            color: this.baseStatus().warning.color,
            sample: ['Q']
          },
          blocked: {
            title: computed(() => localeAdmin.value.blocked),
            color: this.baseStatus().deleted.color,
            sample: ['B']
          },
          acceptedDeferred: {
            title: computed(() => localeAdmin.value.acceptedDeferred),
            color: this.baseStatus().success.color,
            sample: ['A4']
          },
          acceptedBounced: {
            title: computed(() => localeAdmin.value.acceptedBounced),
            color: this.baseStatus().success.color,
            sample: ['A5'],
          },
          acceptedDelivered: {
            title: computed(() => localeAdmin.value.acceptedDelivered),
            color: this.baseStatus().success.color,
            sample: ['A2']
          },
          //  End HungHv: Thêm status tracking mail
        }
      }
    }
    const iStatus = new iNETStatus(sVal.value);
    return {
      iStatus
    }
  }
})
</script>
