<template>
  <div class="claimInfo">
    <p v-if="percentageVale">
      <span> {{ props.header }} (</span>
      <PercentsView :amount="percentageVale" :precision="2"/>
      <span>)</span>
    </p>
    <p v-else>{{ props.header }}</p>
    <slot class="claimInfo__slot"/>
  </div>
</template>

<script lang="ts" setup>
import {BigDecimal} from "@/models/store/big.decimal";
import PercentsView from "@/components/commons/PercentsView.vue";

const props = defineProps<{
  header: string,
  percentageVale?: BigDecimal
}>();
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.claimInfo {
  background-color: #013C6C;
  padding: 3.5px 13px;
  box-shadow: 0px 0px 2px 2px #02447A;
  border-radius: 2px;
  width: 150px;

  &__slot {
    margin: 0;
  }

  p {
    font-weight: 400;
    font-size: 12px;
    line-height: 15px
  }
}

</style>
