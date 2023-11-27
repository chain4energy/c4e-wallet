<template>
  <h2>Add new tariff group</h2>
  <div class="p-fluid">
    <InputText v-model="createTariffGroup.name" placeholder="Tariff Group Name" />
    <Checkbox v-model="createTariffGroup.active" binary="true">Active</Checkbox>
    <Calendar v-model="createTariffGroup.startDate" placeholder="Start Date" />
    <Calendar v-model="createTariffGroup.endDate" placeholder="End Date" />

    <Button label="Create Tariff Group" @click="createNewTariffGroup()" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { CreateTariffGroup } from "@/models/ev/createTariffGroup";
import {useChargerStore} from "@/store/chargers.store";
import {useRouter} from "vue-router";

const chargerStore = useChargerStore();
const createTariffGroup = ref<CreateTariffGroup>({
  name: '',
  accountId: undefined,
  active: false,
  startDate: undefined,
  endDate: undefined
});

const router = useRouter();

const createNewTariffGroup = async () => {
  await chargerStore.createTariffGroup(createTariffGroup.value, true, (tariffGroupId) => {
    router.push(`/ev/addTariff/${tariffGroupId}`);
  });
};
</script>

<style scoped lang="scss">
// Your styles here
</style>
