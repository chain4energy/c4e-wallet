<template>
  <div class="warning">
    <div v-if="props.action === StakingAction.DELEGATE">
      <h3>Stacking will lock your funds for {{timeToComplete}}  days</h3>
      <span>You will need to undelegate in order for your stacked assets to be liquid again.
        This proccess will take {{timeToComplete}} day to complete.
      </span>
    </div>
    <div v-if="props.action === StakingAction.UNDELEGATE">
      <h3>Once the unbonding period begins you will:</h3>
      <ul>
        <li>not recieve staking rewards</li>
        <li>not be able to cancel the unbonding</li>
        <li>need to wait {{timeToComplete}} day for the amount to be liquid</li>
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
