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
            <input type="radio" id="yes" value="1" v-model="picked">
            <label for="yes">{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.YES") }}</label>
            <input type="radio" id="no" value="3" v-model="picked">
            <label for="no">{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO") }}</label>
            <input type="radio" id="no with veto" value="4" v-model="picked">
            <label for="no with veto">{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO") }}</label>
            <input type="radio" id="abstain" value="2" v-model="picked">
            <label for="abstain">{{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN") }}</label>
          </div>
          <span v-if="useUserStore().isLoggedIn">
            <Button
              @click="onVoteClick" :label="$t('GOVERNANCE_VIEW.VOTE')" class="p-button-raised p-button-rounded"  data-bs-dismiss="modal" />
          </span>
          <span v-else>
          <p>{{ $t("GOVERNANCE_VIEW.VOTE_CONDITION") }}</p>
          <Button
            @click="useUserStore().fetchAccount()" :label="$t('GOVERNANCE_VIEW.LOGIN')" class="p-button-raised p-button-rounded" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {useUserStore} from "@/store/user.store";

const props = defineProps({
  title: {
    type: Object(String),
    required: true
  },
  proposalId: {
    type: Object(Number),
    required: true
  }
});

const picked = ref();

const onVoteClick = () => {
  picked.value = Number(picked.value)
  useUserStore().voting(picked.value, Number(props.proposalId))
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
