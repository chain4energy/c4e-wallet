<template>
<div>
  <StackingPopup :validator="currentValidator" v-if="popupOpened" @close="checkBTN"/>
  <DataTableWrapper :service="validatorsService" >
    <template v-slot:empty>No customers found.</template>
    <template v-slot:columns>
      <Column field="description.moniker" :header="'name'" >
        <template #body="{data}">
          <div style="display: flex; align-items: center">
            <img src="/validator.png" style="vertical-align: middle" />
            <span>{{data.description.moniker}}</span>
          </div>
        </template>
      </Column>
      <Column field="status" :header="'status'" >
        <template #body="{data}">
          <span class="status" :style="{'background-color': getStateColor(data.status)}">{{getStatus(data.status)}}</span>
        </template>
      </Column>
      <Column field="commission.commission_rates.rate" :header="'commission'" >
        <template #body="{data}">
          <span>{{valuesToFixed(data.commission.commission_rates.rate)}}</span>
        </template>
      </Column>
      <Column field="commission.commission_rates.rate" :header="'Voting power'" >
        <template #body="{data}">
          <span>{{valuesToFixed(data.commission.commission_rates.rate)}}</span>
        </template>
      </Column>
      <Column field="operator_address">
        <template #body="{data}">
          <button class="btn__main" @click="checkBTN(data)">Manage</button>
        </template>
      </Column>
    </template>
    <template v-slot:paginatorstart ></template>
  </DataTableWrapper>
</div>
</template>

<script setup lang="ts">
import DataTableWrapper from '@/components/utils/DataTableWrapper.vue';
import {DataTableService} from "@/services/data-table.service";
import {DataHolder} from "@/models/data-holder";
import {PagingModel} from "@/services/model/paging.model";
import {LocalSpinner} from "@/services/model/localSpinner";
import {useValidatorsStore} from "@/store/validators.store";
import {Validator} from "@/models/validator";
import StackingPopup from '@/components/Stacking/StackingPopup.vue';
import {watch, ref} from "vue";
import { useKeplrStore } from "@/store/keplr.store";

const validatorsStore = useValidatorsStore();

const validatorsService:DataTableService<Validator> = {
  fetchListData(pagination: PagingModel | null, lockScreen: boolean, localSpinner: LocalSpinner | null): void {
    validatorsStore.fetchValidators(pagination, lockScreen, localSpinner);
  },
  getListDataHolder(): DataHolder<Validator> {
    return validatorsStore.getValidators;
  }
};

function getStatus (status: string) {
  switch (status) {
    case 'BOND_STATUS_UNSPECIFIED':
      status = 'Invalid';
      return status;
    case 'BOND_STATUS_UNBONDED':
      status = 'NotBounded';
      return status;
    case 'BOND_STATUS_UNBONDING':
      status = 'inProccess';
      return status;
    case 'BOND_STATUS_BONDED':
      status = 'Active';
      return status;
    default:
      return 'Checking';
  }
}

const popupOpened = ref(false);
const currentValidator = ref({})

async function checkBTN(item: Validator){
  await useKeplrStore().checkKeplr();
  if(useKeplrStore().getKeplr) {
    currentValidator.value = item;
    popupOpened.value = !popupOpened.value;
    return popupOpened;
  } else {
    return;
  }
}
function valuesToFixed(value: string) {
  return parseFloat(value).toFixed(2);
}

function getStateColor(status: string) {
  if(status === 'BOND_STATUS_BONDED') return '#0B8541';
  return '#ff9999';
}

</script>

<style scoped lang="scss">
.btn__main{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 24px 13px;
  box-sizing: border-box;

  background: #FFFFFF;
  /* Primary/Secondary-Blue */

  border: 1px solid #27697F;
  border-radius: 24px;


  &:hover {
     background-color: #27697F;
     color: white;
   }

  &:active {
     transform: translateY(2px);
  }
}

</style>
