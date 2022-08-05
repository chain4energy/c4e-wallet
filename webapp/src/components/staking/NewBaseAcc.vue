<template>
  <div>
    <TabView>
      <TabPanel :header="$t(`STAKING_VIEW.TABS.ALL`)">
        <ValidatorsDataTable :validators="useValidatorsStore().getValidators"/>
      </TabPanel>
      <TabPanel v-if="isLoggedIn" :header="$t(`STAKING_VIEW.TABS.STAKED`)">
        <ValidatorsDataTable :validators="useValidatorsStore().getUserValidators"/>
      </TabPanel>
      <TabPanel :header="$t(`STAKING_VIEW.TABS.ACTIVE`)">
        <ValidatorsDataTable :validators="useValidatorsStore().getActiveValidators"/>
      </TabPanel>
      <TabPanel :header="$t(`STAKING_VIEW.TABS.INACTIVE`)">
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

const validatorsStore = useValidatorsStore();
const userStore = useUserStore();

const isLoggedIn = computed(() => userStore.isLoggedIn);

// onBeforeMount(() => {
//   validatorsStore.fetchValidators();
// })

</script>

<style scoped lang="scss">

</style>
