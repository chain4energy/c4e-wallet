<template>
  <div class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <div>
            <h4 class="modal-title" id="exampleModalLabel">{{ $t("GOVERNANCE_VIEW.YOUR_VOTE") }}</h4>
          </div>
          <div> #{{ proposalId }} {{ title }} </div>
          <div class="vote-options">
            <input type="radio" id="yes" :value="VoteOption.Yes" v-model="picked">
            <label for="yes">{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.YES") }}</label>
            <input type="radio" id="no" :value="VoteOption.No" v-model="picked">
            <label for="no">{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO") }}</label>
            <input type="radio" id="no with veto" :value="VoteOption.NoWithVeto" v-model="picked">
            <label for="no with veto">{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO") }}</label>
            <input type="radio" id="abstain" :value="VoteOption.Abstain" v-model="picked">
            <label for="abstain">{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN") }}</label>
          </div>
          <span v-if="useUserStore().isLoggedIn">
            <Button
              @click="onVoteClick" :label="$t('GOVERNANCE_VIEW.VOTE')" class="p-button-raised p-button-rounded"  data-bs-dismiss="modal" />
          </span>
          <span v-else>
          <p>{{ $t("GOVERNANCE_VIEW.VOTE_CONDITION") }}</p>
          <Button
            @click="dataService.onKeplrLogIn()" :label="$t('GOVERNANCE_VIEW.LOGIN')" class="p-button-raised p-button-rounded" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {useUserStore} from "@/store/user.store";
import dataService from '@/services/data.service';
import { VoteOption } from "@/models/store/proposal";

// const props = defineProps({
//   title: {
//     type: String,
//     required: true
//   },
//   proposalId: {
//     type: Number,
//     required: true
//   }
// });

const props = defineProps<{
  title: string
  proposalId: number
}>()

const picked = ref<VoteOption>();

const onVoteClick = () => {
  if (picked.value !== undefined){
    useUserStore().vote(picked.value, props.proposalId)
  } else {
    // TODO
  }
};
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

button {
  width:170px;
  height: 40px;
  background-color: $primary-green-color;
  border: none;
}

.vote-options {
  input[type="radio"] {
    display: none;
  }
  label {
    box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
    height: 73px;
    width: 100%;
    margin-bottom: 20px;
    border-radius: 10px;
    cursor: pointer;
    &:hover {
      opacity: 0.5;
    }

  }
  input[type="radio"]:checked+label{
    background-color: #bbb !important;
  }
}

</style>
