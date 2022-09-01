<template>
  <div class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    {{}}
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <div>
            <h4 class="modal-title" id="exampleModalLabel">{{ $t("GOVERNANCE_VIEW.YOUR_VOTE") }}</h4>
          </div>
          <div> #{{ proposalId }} {{ title }} </div>
          <div class="vote-options">
            <div class="option yes" @click="changeVotingOption(VoteOption.Yes)" :class="picked == VoteOption.Yes ? 'picked' : ''">
              <Icon name="CheckSquare" /> {{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.YES") }}
            </div>
            <div class="option no" @click="changeVotingOption(VoteOption.No)" :class="picked == VoteOption.No ? 'picked' : ''">
              <Icon name="XCircle" /> {{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO") }}
            </div>
            <div class="option no-with-veto" @click="changeVotingOption(VoteOption.NoWithVeto)" :class="picked == VoteOption.NoWithVeto ? 'picked' : ''">
              <Icon name="UserX" /> {{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.NO_WITH_VETO") }}
            </div>
            <div class="option abstain" @click="changeVotingOption(VoteOption.Abstain)" :class="picked == VoteOption.Abstain ? 'picked' : ''">
              <Icon name="Grab" /> {{ $t("GOVERNANCE_VIEW.VOTING_OPTIONS.ABSTAIN") }}
            </div>
          </div>
          <span v-if="useUserStore().isLoggedIn">
            <p v-if="useUserStore().getTotalDelegated === 0n">
              {{$t('GOVERNANCE_VIEW.ERRORS.NO_STAKED')}}
            </p>
            <Button
              :disabled="useUserStore().getTotalDelegated === 0n"
              @click="onVoteClick" :label="$t('GOVERNANCE_VIEW.VOTE')" class="p-button-raised p-button-rounded" data-bs-dismiss="modal" />
          </span>
          <span v-else>
            <p>{{ $t("GOVERNANCE_VIEW.VOTE_CONDITION") }}</p>
            <Button
              @click="dataService.onKeplrLogIn()" class="p-button-raised p-button-rounded">
              <KeplrLogo/> {{ $t('CONNECT.CONNECT' )}}
            </Button>
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
import KeplrLogo from "../commons/KeplrLogo.vue";

const err = ref();

const props = defineProps<{
  title: string
  proposalId: number
}>()
const emit = defineEmits(['close']);

const picked = ref<VoteOption>();

const changeVotingOption = (option: VoteOption) => {
  picked.value = option; 
};

const onVoteClick = () => {
  if (picked.value !== undefined){
    useUserStore().vote(picked.value, props.proposalId);
    emit('close');

  } else {
    err.value='err';
  }
};
</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.picked {
  background-color: #bbb;
}

button {
  width:170px;
  height: 40px;
  background-color: $primary-green-color;
  border: none;
}

.vote-options {

.option {
    box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
    box-sizing: border-box;
    display: flex;
    width: 100%;
    height: 50px;
    margin-bottom: 20px;
    border-radius: 10px;
    overflow: hidden;
    align-items: center;
    cursor: pointer;
    &:hover {
      opacity: 0.5;
    }
}
  .yes {
    width: 100%;
    height: 50px;

    svg {
      margin-right: 10px;
      color: #72bf44;
    }

    &::before {
        width: 20px;
        height: 100%;
        margin-right: 10px;
        content: ' ';
        background: #72bf44;
        display: inline-block
      }
  }

  .no {
    width: 100%;
    height: 50px;

    svg {
      margin-right: 10px;
      color: #e02626;
    }

    &::before {
        width: 20px;
        height: 100%;
        margin-right: 10px;
        content: ' ';
        background: #e02626;
        display: inline-block
      }
  }

  .no-with-veto {
    width: 100%;
    height: 50px;

    svg {
      margin-right: 10px;
      color: #FDDB2A;
    }

    &::before {
        width: 20px;
        height: 100%;
        margin-right: 10px;
        content: ' ';
        background: #FDDB2A;
        display: inline-block
      }
  }

  .abstain {
    width: 100%;
    height: 50px;

    svg {
      margin-right: 10px;
      color: #27697f;
    }

    &::before {
        width: 20px;
        height: 100%;
        margin-right: 10px;
        content: ' ';
        background: #27697f;
        display: inline-block
      }
  }
  input[type="radio"]:checked+label{
    background-color: #bbb !important;
  }
}

</style>
