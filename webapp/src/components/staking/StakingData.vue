<template>
  <div>
    <TabView lazy>
      <TabPanel>
        <template #header>
          <ValidatorsStatusLabel status="all"/>
        </template>
        <ValidatorsDataTable :validators="useValidatorsStore().getValidators"/>
      </TabPanel>
      <TabPanel v-if="isLoggedIn">
        <template #header>
          <ValidatorsStatusLabel status="staked"/>
        </template>
        <ValidatorsDataTable :validators="useValidatorsStore().getUserValidators"/>
      </TabPanel>
      <TabPanel>
        <template #header>
          <ValidatorsStatusLabel status="active"/>
        </template>
        <ValidatorsDataTable :validators="useValidatorsStore().getActiveValidators"/>
      </TabPanel>
      <TabPanel>
        <template #header>
          <ValidatorsStatusLabel status="inactive"/>
        </template>
        <ValidatorsDataTable :validators="useValidatorsStore().getInactiveValidators"/>
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

const validatorsStore = useValidatorsStore();
const userStore = useUserStore();

const isLoggedIn = computed(() => userStore.isLoggedIn);

</script>

<style scoped lang="scss">

</style>
