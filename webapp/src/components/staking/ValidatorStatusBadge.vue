<template>
    <span v-if="validator.status === ValidatorStatus.Bonded" class="badge active">{{ $t('STAKING_VIEW.VALIDATOR_STATUS.ACTIVE') }}</span>
    <span v-else-if="!validator.jailed" class="badge deactivated">{{ $t('STAKING_VIEW.VALIDATOR_STATUS.INACTIVE') }}</span>
    <span v-else class="badge jailed">{{ $t('STAKING_VIEW.VALIDATOR_STATUS.JAILED') }}</span>
</template>

<script setup lang="ts">
import { Validator, ValidatorStatus } from "@/models/store/validator";

const props = defineProps<{
  validator: Validator
}>();

</script>

<style scoped lang="scss">
@import '../../styles/variables.scss';

.badge {
  padding: 5px;
  border-radius: 5px;
  color: white;
}

.active {
  background: $primary-green-color;
  box-shadow: none;
}

.deactivated {
  background: gray;
  box-shadow: none;
}

.jailed {
  background: red;
  box-shadow: none;
}
</style>
