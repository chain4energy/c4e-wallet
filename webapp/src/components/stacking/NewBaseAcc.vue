<template>
<div>
  <TabView>
    <TabPanel header="All">
      <button @click="useValidatorsStore().sortValidators()">sort validators</button>
      <DataTableWraper :expanded="true" :validators="validators.fullList"/>
    </TabPanel>
    <TabPanel v-if="rewardsFetched && validators.stacked !== []" header="Staked">
      <DataTableWraper :validators="validators.stacked" :expanded="true"/>
    </TabPanel>
    <TabPanel header="Active">
      <DataTableWraper :validators="validators.activeList" :expanded="true"/>
    </TabPanel>
    <TabPanel header="Inactive">
      <DataTableWraper :validators="validators.notActive" :expanded="true"/>
    </TabPanel>
  </TabView>
</div>
</template>

<script setup lang="ts">
import { useValidatorsStore } from "@/store/validators.store";
import { computed, ComputedRef, onBeforeMount, onUnmounted, reactive, ref, UnwrapNestedRefs, watch } from "vue";
import { useUserStore } from "@/store/user.store";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import DataTableWraper from "@/components/stacking/DataTableWraper.vue";
import { BasicQuantity, Validator, validatorsComponent } from "@/models/validator";

const validatorsStore = useValidatorsStore();
const userStore = useUserStore();

const rewardsFetched = computed(()=> validatorsStore.getRewardsFetchetStatus)
const isLoggedIn = computed(() => userStore.isLoggedIn);

onBeforeMount(()=>{
    validatorsStore.fetchValidators();
})



onUnmounted(() => validatorsStore.logoutValidatorModule())

const validators : validatorsComponent = reactive({
  fullList: computed(() => validatorsStore.getValidators.validators),
  activeList: computed(() => {
    if (!validators.fullList) {
      return [];
    } else {
      return validators.fullList.filter((el: Validator) => el.status === "Active");
    }
  }),
  notActive: computed(() => {
    if (!validators.fullList) {
      return [];
    } else {
      return validators.fullList.filter((el: Validator) => el.status !== "Active");
    }
  }),
  stacked: computed(() => {
    if (validators.fullList && rewardsFetched.value) {
      return validators.fullList.filter((el: Validator) => el.rewards.amount !== "0");
    } else {
      return []
    }
  }),
});


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
