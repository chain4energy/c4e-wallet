<template>
  <div class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <div>
            <h4 class="modal-title" id="exampleModalLabel">Your vote</h4>
          </div>
          <div> #{{ proposalId }} {{ title }} </div>
          <div class="vote-options">
            <input type="radio" id="yes" value="1" v-model="picked">
            <label for="yes">Yes</label>
            <input type="radio" id="no" value="3" v-model="picked">
            <label for="no">No</label>
            <input type="radio" id="no with veto" value="4" v-model="picked">
            <label for="no with veto">No with veto</label>
            <input type="radio" id="abstain" value="2" v-model="picked">
            <label for="abstain">Abstain</label>
          </div>
          <span v-if="useKeplrStore().getKeplr && useUserStore().isLoggedIn">
            <Button
              @click="onVoteClick" label="Vote" class="p-button-raised p-button-rounded"  data-bs-dismiss="modal" />
          </span>
          <span v-else>
          <p>To make voting you have to be loged in</p>
          <Button
            @click="useKeplrStore().checkKeplr()" label="login" class="p-button-raised p-button-rounded" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {ref} from "vue";
import { useKeplrStore } from "@/store/keplr.store";
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
  console.log(props.proposalId);
  useKeplrStore().vote(picked.value, props.proposalId)

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
