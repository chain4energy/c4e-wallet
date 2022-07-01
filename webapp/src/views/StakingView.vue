<template>
  <div>
    <router-view/>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUpdated, ref, shallowRef } from "vue";
import { useUserStore } from "@/store/user.store";
import NewBaseAcc from "@/components/stacking/NewBaseAcc.vue"
import VestingAcc from "@/components/stacking/VestingAcc.vue"

const userStore= useUserStore()
const component = shallowRef()
onMounted(()=>{
  checkAccType()
})

onUpdated(() => {
  checkAccType()
})

function checkAccType() {
  if (userStore.getAccount) {
    if (userStore.getAccType == "/cosmos.vesting.v1beta1.ContinuousVestingAccount") {
      component.value = VestingAcc
    }
    component.value = NewBaseAcc
  }
  component.value = NewBaseAcc
}
</script>

<style scoped lang="scss">
.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
</style>
