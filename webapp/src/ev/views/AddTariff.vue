<template>
  <h2>Add new tariff</h2>
  <div class="p-fluid">
    <InputText v-model="createTariff.name" placeholder="Tariff Name" />
    <InputNumber v-model="createTariff.accountId" placeholder="Account ID" :useGrouping="false" />
    <InputText v-model="createTariff.currency" placeholder="Currency" />
    <InputText v-model="createTariff.unit" placeholder="Unit" />
    <InputNumber v-model="createTariff.unitCost" placeholder="Unit Cost" :useGrouping="false" />
    <Checkbox v-model="createTariff.active" binary="true">Active</Checkbox>
    <Calendar v-model="createTariff.startDate" placeholder="Start Date" />
    <Calendar v-model="createTariff.endDate" placeholder="End Date" />

    <Button label="Create Tariff" @click="createNewTariff()" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useChargerStore } from '@/store/chargers.store';
import { CreateTariff } from '@/models/ev/createTariff';
import {useRouter} from "vue-router";

const props = defineProps({
  tariffGroupId: Number
});


const chargerStore = useChargerStore();
const createTariff = ref<CreateTariff>({
  name: '',
  accountId: undefined,
  currency: '',
  unit: '',
  unitCost: 0,
  active: false,
  startDate: undefined,
  endDate: undefined
});

const router = useRouter();


const createNewTariff = async () => {
  if (props.tariffGroupId) {
    await chargerStore.createTariff(props.tariffGroupId, createTariff.value, false,() => {
      router.push("/ev/addCharger");
    });
  }
};
</script>

<style scoped lang="scss">
// Your styles here
</style>
