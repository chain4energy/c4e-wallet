<template>
  <div class="amount">
    <slot name="logo"></slot>
    <div class="amount__amount">
      <div v-for="(items, index) in props.coins" :key="index">
        <p>{{items.name}}</p>
        <p>{{transformToExpView(viewedAmount(items.amount))}}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BigDecimal } from "@/models/store/big.decimal";
import { useConfigurationStore } from "@/store/configuration.store";
import { computed, ref } from "vue";

const props = defineProps<{
  coins:[
    {
      name: string,
      amount: bigint | number | BigDecimal,
    }
  ]
  precision: number,
  reduceBigNumber: boolean,
  showDenom: boolean,
}>()

function viewedAmount(amount: bigint | number | BigDecimal ) {
  return useConfigurationStore().config.getViewAmount(
    amount || 0,
    props.precision || 4,
    props.reduceBigNumber || false)
}

function transformToExpView(amount: bigint | number | BigDecimal) {
  let internationalNumberFormat;
  if(props.reduceBigNumber){
    internationalNumberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: props.precision, notation: "compact",
      compactDisplay: "short"});
  } else {
    internationalNumberFormat = new Intl.NumberFormat("en-US", {minimumFractionDigits: props.precision});
  }

  const thousends =  internationalNumberFormat.format(amount);
  return thousends;
}

</script>

<style scoped lang="scss">
.amount{
  display: flex;
  align-items: center;
  width: 100%;
  padding:5%;
  box-shadow: 0 4px 20px rgb(0 0 0 / 11%);
  background: #FFFFFF;
  border-radius: 8px;
  &__amount{
    width: 100%;
    display: flex;
    align-items: baseline;
    justify-content: space-around;
    flex-wrap: wrap;
  }
}
</style>
