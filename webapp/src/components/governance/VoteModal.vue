<template>
  <div class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-body">
          <div>
            <h4 class="modal-title" id="exampleModalLabel">Your vote</h4>
          </div>
          <div> #{{ proposalId }} {{ title }} </div>
          <div class="vote-option">Yes</div>
          <div class="vote-option">No</div>
          <div class="vote-option">No with Veto</div>
          <div class="vote-option">Abstain</div>
          <Button label="Vote" class="p-button-raised p-button-rounded"  data-bs-dismiss="modal" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

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

</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

button {
  width:170px;
  height: 40px;
  background-color: $primary-green-color;
  border: none;
}
.vote-option {
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  height: 73px;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 10px;
}
</style>
