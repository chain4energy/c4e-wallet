<template>
  <div v-if="proposalChanges">
    <div  v-for="change in proposalChanges" :key="change" class="box">
      <div style="margin-top: 20px;" class="info">
        <span>{{$t('GOVERNANCE_VIEW.KEY')}}:</span>
        <span>{{change.key}}</span>
        <span>{{$t('GOVERNANCE_VIEW.SUBSPACE')}}:</span>
        <span>{{change.subspace}}</span>
      </div>
      <div class="json">
        <span style="color: gray">Value:</span>
        <vue-json-pretty :data="JSON.parse(change.value)" />
      </div>
    </div>
  </div>


</template>
<script setup lang="ts">

import {ProposalsChanges} from "@/models/store/proposal";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
const props = defineProps<{
  proposalChanges?: ProposalsChanges
}>();

</script>

<style scoped lang="scss">
  .box {
    display: grid;
    grid-template-columns: 2fr 3fr;
    .info {
      display: grid;
      grid-template-rows: 40px;
      grid-template-columns: 1fr 1fr;
      line-height: 1.8rem;
      box-sizing: border-box;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      border-right: 1px solid #cbcbcb;

      span {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      span:nth-child(odd) {
        color: grey;
      }

    }
    .json {
      margin-top: 20px;
      margin-left: 50px;
    }
  }

@media screen and (max-width: 900px) {
  .box {
    grid-template-columns: 1fr;
    .info {
      margin-bottom: 15px;
      border-right: none;
    }
    .json {
      margin-left: 0px;
      margin-top: 0px;
    }
  }
}

</style>
