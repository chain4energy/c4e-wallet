<template>
  <div class="t-container">
    <div v-if="isSuccess()" class="t-header">{{i18n.global.t("TOAST.SUCCESS.TX_DELIVERY.TITLE")}}</div>
    <div v-else class="t-header">{{i18n.global.t("TOAST.ERROR.TX_DELIVERY.TITLE")}}</div>
    <div v-if="!isSuccess() && errorTitleMessage">{{errorTitleMessage}}</div>
    <div class="t-body">
      <div v-if="tx !== undefined && !isSuccess() && tx.rawLog">{{tx.rawLog}}</div>
      <div v-if="errorMessage !== undefined && !isSuccess()">{{errorMessage}}</div>
      <table v-if="tx !== undefined" class="t-table">
        <tr v-if="!isSuccess()">
          <td>{{i18n.global.t("TOAST.ERROR.TX_DELIVERY.CODE")}}</td>
          <td class="t-value">{{tx.code}}</td>
        </tr>
        <tr>
          <td>{{i18n.global.t("TOAST.SUCCESS.TX_DELIVERY.HASH")}}</td>
          <td class="t-value">
            <a class="t-tx-hash" :href="useConfigurationStore().config.explorerTx + tx.transactionHash">
              {{ tx.transactionHash.slice(0, 6)}}...{{tx.transactionHash.slice(-6) }}
            </a>
          </td>
        </tr>
        <tr>
          <td>{{i18n.global.t("TOAST.SUCCESS.TX_DELIVERY.GAS_USED")}}</td>
          <td class="t-value">{{ tx.gasUsed }}</td>
        </tr>
         <tr>
          <td>{{i18n.global.t("TOAST.SUCCESS.TX_DELIVERY.HEIGHT")}}</td>
          <td class="t-value">{{ tx.height }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TxData } from "@/api/tx.broadcast.base.api";
import i18n from "@/plugins/i18n";
import { useConfigurationStore } from "@/store/configuration.store";

const props = defineProps<{
  tx?: TxData,
  errorTitleMessage?: string,
  errorMessage?: string
}>();

function isSuccess(): boolean {
  return props.tx !== undefined && props.tx.code === 0;
}

</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';
.t-container {
  width: 100%;
  align-items: center;
  word-break: break-word;
}
.t-header {
  font-size: 2em;

}
.t-body {
  background-color: rgb(243, 237, 237);
  margin: 5px;
  color: $main-color;
  border-radius: 8px;
  padding: 5px;
  -moz-box-shadow:    inset 0 0 10px #000000;
  -webkit-box-shadow: inset 0 0 10px #000000;
  box-shadow:         inset 0 0 10px #000000;
}

.t-table {
  color: $main-color;
  margin-left: 15px;
  padding-left: 15px;
  width: 100%;
}

.t-value {
  // background-color: lightgray;
  margin-left: 15px;
  padding-left: 15px;
  // color: $main-color;
}
</style>
