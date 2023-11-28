<template>
  <AddTariffC :tariff-group-id="tariffGroupId" :is-edit="true"/>
</template>

<script setup lang="ts">
import AddTariffC from "@/ev/components/AddTariffC.vue";
import {useRoute} from "vue-router";

const route = useRoute();

const props = defineProps({
  tariffGroupId: {
    type: Number,
    required: true
  },
  tariffId: {
    type: Number,
    required: true
  }
});

console.log(props.tariffGroupId);
console.log(props.tariffId);

</script>


<style scoped lang="scss">

</style>
