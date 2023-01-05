<template>
  <div v-if="proposalContent" class="info">
    <span>{{$t('GOVERNANCE_VIEW.RECIPIENT')}}</span>
    <span>{{proposalContent.recipient}}</span>
    <div v-for="amount in proposalContent.amount" :key="amount">
      {{amount.amount}} {{amount.denom}}
    </div>
  </div>


</template>
<script setup lang="ts">

import {ProposalContent} from "@/models/store/proposal";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
const props = defineProps<{
  proposalContent?: ProposalContent
}>();

</script>

<style scoped lang="scss">

.info {
  display: grid;
  grid-template-rows: 40px;
  grid-template-columns: 1fr 2fr;
  line-height: 1.8rem;
  box-sizing: border-box;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;


  span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  span:nth-child(odd) {
    color: grey;
  }

}


</style>
