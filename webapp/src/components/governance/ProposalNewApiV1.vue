<template>
  <div v-if="proposal && proposal.messages">
<!--    NewApiV1-->
    <div v-for="key in Object.keys(proposal.messages)" :key="key"  class="box">
      <div style="margin-top: 20px;" class="info">
        <span>{{$t('GOVERNANCE_VIEW.MODULE')}}:</span>
          <span>
            <div style="display: inline-block; width: auto;"  v-tooltip.top="{ value: getElementFromMessageType(proposal.messages[key].type, getKeyPositionFromConfig(proposal.messages[key])), escape: true }">
              {{getElementFromMessageType(proposal.messages[key].type, getKeyPositionFromConfig(proposal.messages[key]))}}
            </div>
          </span>
        <span>{{$t('GOVERNANCE_VIEW.MESSAGE')}}:</span>
          <span >
            <div style="display: inline-block; width: auto;" v-tooltip.top="{ value: getElementFromMessageType(proposal.messages[key].type, getSubspaceositionFromConfig(proposal.messages[key])), escape: true }">
              {{getElementFromMessageType(proposal.messages[key].type, getSubspaceositionFromConfig(proposal.messages[key]))}}
            </div>
          </span>
      </div>
      <div class="json">
        <span style="color: gray">Value:</span>
        <vue-json-pretty :data="prepareObjectToShow(proposal.messages[key])" />
      </div>
    </div>

  </div>


</template>
<script setup lang="ts">

import {Proposal, ProposalMessage} from "@/models/store/proposal";
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import {getElementFromMessageType} from "../../utils/message-type-utils";
import {useConfigurationStore} from "@/store/configuration.store";
const props = defineProps<{
  proposal?: Proposal
}>();

function prepareObjectToShow(message:ProposalMessage){
  const proposalMessageMapping = useConfigurationStore().getConfig.proposalMappings.find(e=>e.proposalType==message.type);
  const filteredItem: Record<string, any> = {};
  proposalMessageMapping?.proposalMessagePropertiesToShow
    .forEach((prop) => {
    if (prop in message) {
      filteredItem[prop] = (message as Record<string, any>)[prop];
    }
  });
  return filteredItem;
}

function getKeyPositionFromConfig(message:ProposalMessage){
  const proposalMessageMapping = useConfigurationStore().getConfig.proposalMappings.find(e=>e.proposalType==message.type);
  return proposalMessageMapping?.proposalMassageTypeKeyPosition;
}

function getSubspaceositionFromConfig(message:ProposalMessage){
  const proposalMessageMapping = useConfigurationStore().getConfig.proposalMappings.find(e=>e.proposalType==message.type);
  return proposalMessageMapping?.proposalMassageTypeSubspacePosition;
}


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

    }
    div {
      color: black;
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
