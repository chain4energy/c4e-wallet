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
import {DataTableService} from "@/services/dataTableService";
import {DataHolder} from "@/models/data-holder";
import {PagingModel} from "@/services/model/paging.model";
import {LocalSpinner} from "@/services/model/localSpinner";
import {useValidatorsStore} from "@/store/validators.store";
import {Validator} from "@/models/validator";

const validatorsStore = useValidatorsStore();

const validatorsService:DataTableService<Validator> = {
  fetchListData(pagination: PagingModel | null, lockScreen: boolean, localSpinner: LocalSpinner | null): void {
    validatorsStore.fetchValidators(pagination, lockScreen, localSpinner);
  },
  getListDataHolder(): DataHolder<Validator> {
    return validatorsStore.getValidators;
  }
}

function getStateColor(status: string) {
  if(status === 'accepted') return '#ccffcc';
  return '#ff9999';
}

</script>

<style scoped>

</style>
