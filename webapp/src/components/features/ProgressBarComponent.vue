<template>
  <div class="refresh">{{$t("GOVERNANCE_VIEW.AUTOMATIC_REFRESH")}}</div>
  <div class="progress-bar">
    <span :style="{'transition-duration': loadingTime + 'ms'}" v-bind:class="{'fill': fillBar, 'clear': !fillBar}" class="progress-bar-fill" style="width: 0">a</span>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";

const props = defineProps({
  loadingTime: {
    type : Number,
    required: true
  }
});

const fillBar = ref(false);

onMounted(() => {

  startFillingBar();
});
const emit = defineEmits(['refresh']);
const startFillingBar = () => {
  fillBar.value = true;

  setTimeout(() => {
    fillBar.value = false;
    emit('refresh');
  }, props.loadingTime);
};
defineExpose({startFillingBar});
</script>

<style lang="scss">
.refresh {
  font-size: smaller;
  text-align: left;
}
.progress-bar {
  width: 100%;
  height: 5px;
  background: #e0e0e0;
  border-radius: 3px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, .2);

  .progress-bar-fill {
    display: block;
    height: 5px;
    background: rgb(114, 191, 68);
    border-radius: 3px;
    transition: width 5s linear;
  }
  .fill {
    width:100% !important;
  }
  .clear {
    transition: none;
  }
}



</style>
