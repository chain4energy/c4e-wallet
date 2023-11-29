<template>
  <h2>Add new tariff group</h2>
  <div class="p-fluid">
    <InputText v-model="createTariffGroup.name" placeholder="Tariff Group Name"/>
    <Checkbox inputId="checkboxActive" v-model="createTariffGroup.active" :binary="true">Active</Checkbox>
    <label for="checkboxActive" class="ml-2"> Active </label>

    <Calendar v-model="createTariffGroup.startDate" placeholder="Start Date"/>
    <Calendar v-model="createTariffGroup.endDate" placeholder="End Date"/>

    <Button label="Create Tariff Group" @click="createNewTariffGroup()"/>
  </div>
</template>

<script setup lang="ts">
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import {ref} from "vue";

import {CreateTariffGroup} from "@/ev/models/createTariffGroup";
import {useOwnerStore} from "@/ev/store/owner.store";
import {useRouter} from "vue-router";

const chargerStore = useOwnerStore();

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
