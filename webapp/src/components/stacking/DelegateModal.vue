<template>
  <div class="validationPopup__description">
    <transition name="slide-fade" mode="out-in">
      <div v-if="operation === 1" class="validationPopup__description">
        <input style="width: 100%; border: 1px solid #DFDFDF;border-radius: 6px; " v-model="amount">
      </div>
    </transition>
    <transition name="slide-fade" mode="out-in">
      <div v-if="operation === 2" class="validationPopup__description">
        <input style="width: 100%; border: 1px solid #DFDFDF;border-radius: 6px; " v-model="amount">
      </div>
    </transition>
    <transition name="slide-fade" mode="out-in">
      <div v-if="operation === 3" class="validationPopup__description">
        <div class="validationPopup__description">
          <input style="width: 100%; border: 1px solid #DFDFDF;border-radius: 6px; " v-model="amount">
        </div>
        <div class="validationPopup__description">
          <input style="width: 100%; border: 1px solid #DFDFDF;border-radius: 6px; " v-model="amount">
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  operation:{
    type: null
  }
});
</script>

<style scoped lang="scss">
.validationPopup__description{
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.11);
  background: #FFFFFF;
  border-radius: 8px;
  padding: 22px;
  &-info{
   display: flex;
   flex-direction: column;
   align-items: flex-start;
 }
}
.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
