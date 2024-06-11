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
  padding: 1rem;
  box-shadow: 0px 0px 2px 2px #02447A;
  border-radius: 2px;
  flex: 2 1;
  margin: 5px;
  min-width: 120px;  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__slot {
    margin: 0;
  }

  p {
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;
  }


}

</style>
