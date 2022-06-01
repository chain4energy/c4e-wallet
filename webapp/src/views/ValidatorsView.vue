<template>
  <DataTableWrapper :service="validatorsService" >

    <template v-slot:empty>No customers found.</template>
    <template v-slot:columns>
      <Column field="operator_address" :header="'operator_address'" ></Column>
      <Column field="tokens" :header="'tokens'" ></Column>
      <Column field="status" :header="'status'" >
        <template #body="{data}">
          <span class="status" :style="{'background-color': getStateColor(data.status)}">{{data.status}}</span>
        </template>
      </Column>
    </template>

    <template v-slot:paginatorstart ></template>

  </DataTableWrapper>
</template>

<script setup lang="ts">
import DataTableWrapper from '@/components/utils/DataTableWrapper.vue';
import ValidatorsService from "@/services/validators.service";

const validatorsService = new ValidatorsService();

function getStateColor(status: string) {
  if(status === 'accepted') return '#ccffcc';
  return '#ff9999';
}

</script>

<style scoped>

</style>
