<template>
  <h2>Add new tariff</h2>
  <AddTariffC :tariff-group-id="tariffGroupId"/>
</template>

<script setup lang="ts">
import AddTariffC from "@/ev/components/AddTariffC.vue";


const props = defineProps({
  tariffGroupId: {
    type: Number,
    required: true
  },
});

</script>


<style scoped lang="scss">

</style>
