<template>
  <div class="description">
    <h2>Description</h2>
    <div>Author: </div>
    <div>Jan Kowalski</div>
    <div>Parameter being changed with this proposal</div>
    <div>
      {{ proposal.content.description }}
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  proposal: {
    type: Object,
    required: true
  }
});

</script>

<style scoped lang="scss">
.description {
  text-align: left;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  max-width: 700px;
  border-radius: 10px;
}
</style>
