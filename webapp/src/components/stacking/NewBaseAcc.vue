<template>
  <div>
    <TabView>
      <TabPanel :header="$t(`STACKING_VIEW.TABS.ALL`)">
        <ValidatorsDataTable :validators="useValidatorsStore().getValidators"/>
      </TabPanel>
      <TabPanel v-if="isLoggedIn" :header="$t(`STACKING_VIEW.TABS.STACKED`)">
        <ValidatorsDataTable :validators="useValidatorsStore().getValidatorsWithDelegations"/>
      </TabPanel>
      <TabPanel :header="$t(`STACKING_VIEW.TABS.ACTIVE`)">
        <ValidatorsDataTable :validators="useValidatorsStore().getActiveValidators"/>
      </TabPanel>
      <TabPanel :header="$t(`STACKING_VIEW.TABS.INACTIVE`)">
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
import ValidatorsDataTable from "@/components/stacking/ValidatorsDataTable.vue";

const validatorsStore = useValidatorsStore();
const userStore = useUserStore();

const isLoggedIn = computed(() => userStore.isLoggedIn);

// onBeforeMount(() => {
//   validatorsStore.fetchValidators();
// })

</script>

<style scoped lang="scss">
.btn__main {
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
