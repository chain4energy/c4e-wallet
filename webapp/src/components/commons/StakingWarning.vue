<template>
  <div class="warning">
    <div v-if="props.action === StakingAction.DELEGATE">
      <h3>{{$t('STAKING_VIEW.STAKING_POPUP.WARNINGS.DELEGATIONS.HEADER')}} {{timeToComplete}} {{ $t('STAKING_VIEW.STAKING_POPUP.WARNINGS.COMMONS.DAYS') }}</h3>
      <span>
        {{$t('STAKING_VIEW.STAKING_POPUP.WARNINGS.DELEGATIONS.CONDITION1')}}
        {{$t('STAKING_VIEW.STAKING_POPUP.WARNINGS.DELEGATIONS.CONDITION2')}} {{timeToComplete}} {{$t('STAKING_VIEW.STAKING_POPUP.WARNINGS.DELEGATIONS.COMPLETE')}}
      </span>
    </div>
    <div v-if="props.action === StakingAction.UNDELEGATE">
      <h3>{{$t('STAKING_VIEW.STAKING_POPUP.WARNINGS.UNDELEGATIONS.HEADER')}} </h3>
      <ul>
        <li>{{$t('STAKING_VIEW.STAKING_POPUP.WARNINGS.UNDELEGATIONS.CONDITION1')}} </li>
        <li>{{$t('STAKING_VIEW.STAKING_POPUP.WARNINGS.UNDELEGATIONS.CONDITION2')}}</li>
        <li>{{$t('STAKING_VIEW.STAKING_POPUP.WARNINGS.UNDELEGATIONS.CONDITION3')}} {{timeToComplete}} {{$t('STAKING_VIEW.STAKING_POPUP.WARNINGS.UNDELEGATIONS.CONDITIONS_HELPER')}}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useValidatorsStore } from "@/store/validators.store";
import { StakingAction } from "@/components/staking/StakingAction.ts";
import { computed } from "vue";

const validatorsStore = useValidatorsStore();

const props = defineProps<{
  action: StakingAction
}>();

validatorsStore.fetchStackingParams();

const timeToComplete = computed(() => {
  return validatorsStore.getParamsUnbondingTime;
})
</script>

<style scoped lang="scss">
.warning{
  display: flex;
  align-content: center;
  align-items: center;
  max-width: 407px;
  background-color: #fef6f6;
  color: #fc4b53;
  padding: 5px;
  border-radius: 8px;

  h3{
    font-size: 18px;
    font-weight: 600;
  }
}

</style>
