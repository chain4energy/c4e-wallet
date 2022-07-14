<template>
  <StackingPopup :validator="currentValidator" v-if="popupOpened" @success="trsansactionSuccess" @close="checkBTN"/>
  <DataTableWrapper :data-key="'operator_address'" :useExternalGlobalFilter="false" :eager-loading-config="createEagerLoadingConfig()" :expanded-rows="expandedRow" >
    <template v-slot:empty> Empty</template>
    <template #header>
      <div style="display: flex; justify-content: space-between">
        <h5 class="m-0">Validators</h5>
              <span class="p-input-icon-left">
                <i class="pi pi-search" />
                <InputText type="text" v-model="filters['global'].value" placeholder="Search" />
                <i class="pi pi-times-circle" @click="filters['global'].value = ''"/>
             </span>
      </div>
    </template>
    <template v-slot:columns>
      <Column field="rank" header="Rank" :sortable="true"></Column>
      <Column field="description.moniker" header="Name" :sortable="true"></Column>
      <Column field="status" header="Status" :sortable="true">
        <template #body="{data}">
          <span>{{ toViewStatus(data.status) }}</span>
        </template>
      </Column>
      <Column field="votingPower" header="voting Power" :sortable="true" sortField="tokens">
        <template #body="{data}">
          <span v-if="data.votingPower">{{ toFixedAm(data.votingPower, 4) }}%</span>
          <span v-else>updating</span>
        </template>
      </Column>
      <Column field="stacked.amount" header="Your stake" :sortable="true" v-if="isLoggedIn" sortField="delegatedAmount">
        <template #body="{data}">
          <span>{{ toFixedAm(data.delegatedAmount, 4) }}</span>
          <!-- <span v-else>updating</span> -->
        </template>
      </Column>
      <Column field="operator_address">
        <template #body="{data}">
          <button class="btn__main" @click="checkBTN(data)">Manage</button>
        </template>
      </Column>

      <Column v-if="isLoggedIn">
        <template #body="{data}">
          <button @click="onRowExpand(data)" v-if="data.delegatedAmount!=='0'" headerStyle="width: 4rem">open
          </button>
        </template>
      </Column>
<!--      <Column v-if="isLoggedIn && delegatedAmount!=='0'" :expander="true" headerStyle="width: 3rem"/>-->

    </template>
    <template v-slot:expanded-columns="{expandedData}">
      <div style="display: flex; flex-direction: row;">
        <div style="display: flex; flex-direction: column; margin-right: 20px">
          <p>Your stacked</p>
          <p>{{toFixedAm(expandedData.data.delegatedAmount, 4)}}</p>
        </div>
        <div style="display: flex; flex-direction: column">
          <p>Reward</p>
          <p>{{toFixedAm(expandedData.data.rewardsAmount, 4)}}</p>
        </div>
      </div>
    </template>
    <template v-slot:paginatorstart></template>
  </DataTableWrapper>
</template>

<script setup lang="ts">

import DataTableWrapper from "@/components/commons/DataTableWrapper.vue";
import {computed, ref} from "vue";
import {Validator, ValidatorStatus} from "@/models/store/validator";
import {useUserStore} from "@/store/user.store";
import StackingPopup from "@/components/stacking/StackingPopup.vue";
import {FilterMatchMode, FilterOperator} from "primevue/api";
import {EagerLoadingConfig} from "@/components/commons/EagerLoadingConfig";

const popupOpened = ref(false);
const currentValidator = ref({})

const props = defineProps({
  validators: {
    type: Array,
    required: true
  }
});
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.isLoggedIn);
const expandedRow = ref([{}]);

async function trsansactionSuccess(arg: string) {
  //close popup
  popupOpened.value = !popupOpened.value;

  useUserStore().reconectAcc()
}

function checkBTN(item: Validator){
  currentValidator.value = item;
  popupOpened.value = !popupOpened.value;
  return popupOpened;
}

function toFixedAm(amount: string, decimal: number) {
  return parseFloat(amount).toFixed(decimal);
}

function toViewStatus(status: ValidatorStatus): string {
  switch (status) {
    case ValidatorStatus.Bonded:
      return 'Active';
    default:
      return 'Inactive';
  }
}

function createEagerLoadingConfig(): EagerLoadingConfig<Validator>{
  const config = new EagerLoadingConfig<Validator>(props.validators as Validator[]);
  config.setFilters(filters.value);
  return config;
}

function onRowExpand(data: Validator) {
  expandedRow.value = (expandedRow.value[0] === data) ? [{}] : [data]
}

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  'description.moniker': {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  'commission.commission_rates.rate': {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  votingPower: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  status: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
  rewards: {
    operator: FilterOperator.AND,
    constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
  },
});

</script>

<style scoped>

</style>
