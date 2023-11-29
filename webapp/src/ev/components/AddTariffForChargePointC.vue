<template>
  <div class="p-fluid">
    <InputText v-model="tariffDetails.name" placeholder="Tariff Name"/>
    <Dropdown v-model="tariffDetails.currency" placeholder="Select currency" :options="['PLN', 'EUR']"/>
    <Dropdown v-model="tariffDetails.unit" placeholder="Select unit" :options="['Wh', 'kWh']"/>
    <InputText v-model="tariffDetails.unitCost" placeholder="Unit Cost"/>
    <Calendar v-model="tariffDetails.startDate" placeholder="Start Date"/>
    <Calendar v-model="tariffDetails.endDate" placeholder="End Date"/>
    <Button label="Create Tariff" @click="onSubmit"/>
  </div>
</template>

<script setup lang="ts">
import {ref, watch} from 'vue';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import {useOwnerStore} from "@/ev/store/owner.store";
import {CreateTariffForChargePoint} from "@/ev/models/createTariffForChargePoint";

const tariffDetails = ref<CreateTariffForChargePoint>({
  accountId: undefined,
  currency: "",
  name: "",
  unit: "",
  unitCost: "",
});

const emit = defineEmits(['onSuccess'])

const ownerStore = useOwnerStore();

watch(() => tariffDetails.value.unitCost, (newVal) => {
  if (!/^\d+(\.\d+)?$/.test(newVal)) {
    tariffDetails.value.unitCost = newVal.replace(/[^\d.]/g, '');
  }
});

const onSubmit = async () => {
  await ownerStore.createTariffForChargePoint(tariffDetails.value, true,() => {
    emit ('onSuccess')
  });
};
</script>

<style scoped>

</style>
