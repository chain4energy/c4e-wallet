<template>
  <div>
    <span>${{useTokensStore().getTokenPrice.price}}</span>
  </div>
</template>

<script setup lang="ts">
import {useTokensStore} from "@/store/tokens.store";
import TooltipComponent from "@/components/TooltipComponent.vue";
import {useI18n} from "vue-i18n";

const tokensStore = useTokensStore();
const i18n = useI18n();

function prepareTooltipMessage(){
  return useTokensStore().getTokenPrice.timestamp.toLocaleString() + " - " + useTokensStore().getTokenPrice.price + " USD";
}

</script>

<style scoped lang="scss">

</style>
