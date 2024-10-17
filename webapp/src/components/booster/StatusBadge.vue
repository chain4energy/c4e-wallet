<template>
  <span v-if="props.status" class="badge active">{{ $t('BOOST.STATUS.ACTIVE') }}</span>
  <span v-else class="badge jailed">{{ $t('BOOST.STATUS.CLOSED') }}</span>
</template>

<script setup lang="ts">
const props = defineProps<{
  status: boolean
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

.jailed {
  background: #ff5151;
  box-shadow: none;
}
</style>
