<template>
  <Dialog v-model:visible="show" closeIcon="true" modal header="Payment" :style="{ width: '95vw', 'max-width': '600px' }">
    <div class="step_1" v-if="step == 1">
      <div class="pay_modal_container">
        <div class="box">ARI10</div>
        <div class="box">Tx-hash</div>
      </div>
      <div class="buttons">
        <Button class="p-button p-component secondary" @click="close">Close</Button>
      </div>
    </div>


  </Dialog>
</template>

<script setup lang="ts">

import Dialog from "primevue/dialog";
import {computed, ref} from "vue";

const props = defineProps<{
  display: boolean
}>();
const emit = defineEmits(['close']);
const step = ref(1);
const show = computed(() => {
  return props.display;
});

const close = () => {
  emit('close');
};
</script>

<style scoped lang="scss">

.pay_modal_container {
  display: flex;

  .box {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #72bf44;
    border-radius: 10px;
    margin: 20px;
    width: 50%;
    height: 100px;
    &:hover {
      cursor: pointer;
    }
  }
}
.buttons {
  display: flex;
  justify-content: center;
}
</style>
