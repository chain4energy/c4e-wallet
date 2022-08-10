<template>
  <span v-if="status === 'all'">{{$t(`STAKING_VIEW.TABS.ALL`)}} ({{useValidatorsStore().getNumberOfAllValidators}})</span>
  <span v-else-if="status === 'active'">{{$t(`STAKING_VIEW.TABS.ACTIVE`)}} ({{useValidatorsStore().getNumberOfActiveValidators}})</span>
  <span v-else-if="status === 'inactive'">{{$t(`STAKING_VIEW.TABS.INACTIVE`)}} ({{useValidatorsStore().getNumberOfInactiveValidators}})</span>
  <span v-else-if="status === 'staked'">{{$t(`STAKING_VIEW.TABS.STAKED`)}}</span>
</template>

<script setup lang="ts">
import { useValidatorsStore } from '@/store/validators.store.ts';

export type ValidatorsStatusLabelType = 'all' | 'active' | 'inactive' | 'staked';

const props = defineProps<{
  status: ValidatorsStatusLabelType,
}>();

</script>
