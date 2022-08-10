<template>
  <div>
    <h5 class="m-0">{{ $t("STAKING_VIEW.USER_DELEGATIONS") }}</h5>
    <ValidatorsDataTable v-if="isLoggedIn" :validators="useValidatorsStore().getUserDelgationsValidators" :type="ValidatorsDataTableType.DELEGATIONS"/>
    <h5 class="m-0">{{ $t("STAKING_VIEW.USER_UNDELEGATIONS") }}</h5>
    <ValidatorsDataTable v-if="isLoggedIn" :validators="useValidatorsStore().getUserUndelgationsValidators" :type="ValidatorsDataTableType.UNDELEGATIONS"/>
    <h5 class="m-0">{{ $t("STAKING_VIEW.VALIDATORS") }}</h5>
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
import {computed, ComputedRef, onBeforeMount, onUnmounted, reactive, ref, UnwrapNestedRefs, watch} from "vue";
import {useUserStore} from "@/store/user.store";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import ValidatorsDataTable from "@/components/staking/ValidatorsDataTable.vue";
import ValidatorsStatusLabel from "../commons/ValidatorsStatusLabel.vue";
import DelegationsTable from "./DelegationsTable.vue";
import { ValidatorsDataTableType } from "./ValidatorsDataTable";

const validatorsStore = useValidatorsStore();
const userStore = useUserStore();

const isLoggedIn = computed(() => userStore.isLoggedIn);

</script>

<style scoped lang="scss">

</style>
