<template>
  <div>
    <div>{{accType}}</div>
    <router-view/>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/user.store";
import router from "@/router";
import { mapGetters } from "pinia";
import { onMounted, watch } from "vue";
import { AccountType } from "@/models/store/account";

onMounted(()=> {
  if(!useUserStore().isContinuousVestingAccount){
    router.push({name: 'base'})
  } else {
    router.push({name: 'vesting'})
  }
})
watch(
  () => useUserStore().getAccType,
  (accType) => {
    if(accType !== AccountType.ContinuousVestingAccount){ // TODO check if isContinuousVestingAccount can be used ??
      router.push({name: 'base'})
    } else {
      router.push({name: 'vesting'})
    }
    console.log(accType)
  }
)

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
