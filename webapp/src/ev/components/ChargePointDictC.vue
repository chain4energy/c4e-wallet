<template>
  <Card>
    <template #title>
      <h3>Name: {{chargePointDict.name}}</h3>
    </template>
    <template #content>
      <h3>Integration type: {{chargePointDict.integrationType}}</h3>
      <h3>Number of connectors: {{chargePointDict.numberOfConnectors}}</h3>
    </template>

  </Card>
</template>

<script setup lang="ts">
import {ChargePointDict} from "@/ev/models/chargePointDict";

defineProps({
    chargePointDict: {
      type: Object as () => ChargePointDict,
      required: true
    }
  }
);

</script>


<style scoped lang="scss">

</style>
