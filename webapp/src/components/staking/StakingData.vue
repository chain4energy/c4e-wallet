<template>
  <div>
    <h4 v-if="isLoggedIn && useUserStore().hasDelegations" class="m-0">{{ $t("STAKING_VIEW.USER_DELEGATIONS") }}</h4>
    <ValidatorsDataTable v-if="isLoggedIn && useUserStore().hasDelegations" :validators="useValidatorsStore().getUserDelgationsValidators" :type="ValidatorsDataTableType.DELEGATIONS"/>
    <h4 v-if="isLoggedIn && useUserStore().hasUndelegations" class="m-0">{{ $t("STAKING_VIEW.USER_UNDELEGATIONS") }}</h4>
    <ValidatorsDataTable v-if="isLoggedIn && useUserStore().hasUndelegations" :validators="useValidatorsStore().getUserUndelgationsValidators" :type="ValidatorsDataTableType.UNDELEGATIONS"/>
    <h4 class="m-0">{{ $t("STAKING_VIEW.VALIDATORS") }}</h4>
    <TabView lazy>
      <TabPanel>
        <template #header>
          <ValidatorsStatusLabel status="all"/>
        </template>
        <ValidatorsDataTable :validators="useValidatorsStore().getValidators" :type="ValidatorsDataTableType.VALIDATORS"/>
      </TabPanel>
      <!-- <TabPanel v-if="isLoggedIn">
        <template #header>
          <ValidatorsStatusLabel status="staked"/>
        </template>
        <ValidatorsDataTable :validators="useValidatorsStore().getUserValidators" :type="ValidatorsDataTableType.VALIDATORS"/>
      </TabPanel> -->
      <TabPanel>
        <template #header>
          <ValidatorsStatusLabel status="active"/>
        </template>
        <ValidatorsDataTable :validators="useValidatorsStore().getActiveValidators" :type="ValidatorsDataTableType.VALIDATORS"/>
      </TabPanel>
      <TabPanel>
        <template #header>
          <ValidatorsStatusLabel status="inactive"/>
        </template>
        <ValidatorsDataTable :validators="useValidatorsStore().getInactiveValidators" :type="ValidatorsDataTableType.VALIDATORS"/>
      </TabPanel>
    </TabView>

  </div>
</template>

<script setup lang="ts">
import {useValidatorsStore} from "@/store/validators.store";
import {computed } from "vue";
import {useUserStore} from "@/store/user.store";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import ValidatorsDataTable from "@/components/staking/ValidatorsDataTable.vue";
import ValidatorsStatusLabel from "../commons/ValidatorsStatusLabel.vue";
import DelegationsTable from "./DelegationsTable.vue";
import { ValidatorsDataTableType } from "@/components/staking/ValidatorsDataTable.ts";

const validatorsStore = useValidatorsStore();
const userStore = useUserStore();

const isLoggedIn = computed(() => userStore.isLoggedIn);

</script>

<style scoped lang="scss">
h4 {
  font-weight: bold;
  margin-top: 2em !important;
}
</style>
