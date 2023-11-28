<template>
  <h2>Add new tariff</h2>
  <div class="p-fluid">
    <InputText v-model="createTariff.name" placeholder="Tariff Name"/>
    <Dropdown v-model="createTariff.currency" placeholder="Select currency" :options="['PLN', 'EUR']"/>
    <Dropdown v-model="createTariff.unit" placeholder="Select unit" :options="['Wh', 'kWh']"/>
    <InputNumber v-model="createTariff.unitCost" placeholder="Unit Cost" :useGrouping="false"/>
    <Checkbox inputId="checkboxActive" v-model="createTariff.active" :binary="true"/>
    <label for="checkboxActive" class="ml-2"> Active </label>
    <Calendar v-model="createTariff.startDate" placeholder="Start Date"/>
    <Calendar v-model="createTariff.endDate" placeholder="End Date"/>

    <Button label="Create Tariff" @click="onSubmit()"/>
  </div>
</template>

<script setup lang="ts">
import Calendar from 'primevue/calendar';
import InputNumber from 'primevue/inputnumber';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';

import {ref} from 'vue';
import {useChargerStore} from '@/ev/store/owner.store';
import {CreateTariff} from '@/ev/models/createTariff';
import {Tariff} from "@/ev/models/tariff";
import {goTo_AddChargerView} from "@/ev/router/goToRoute";

const props = defineProps({
  tariffGroupId: {
    type: Number,
    required: true
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  tariff: {
    type: Object as () => Tariff,
  }
});

const chargerStore = useChargerStore();

const createTariff = ref<CreateTariff>({
  name: props.tariff?.name || "",
  currency: props.tariff?.currency || "",
  unit: props.tariff?.currency || "",
  unitCost: props.tariff?.unitCost || 0,
  active: props.tariff?.active || false,
  startDate: props.tariff?.startDate,
  endDate: props.tariff?.endDate,
});

const onSubmit = async () => {
  if (props.isEdit) {
    await updateTariff();
  } else {
    await createNewTariff();
  }
}

const createNewTariff = async () => {
  if (props.tariffGroupId) {
    await chargerStore.createTariff(props.tariffGroupId, createTariff.value, true, goTo_AddChargerView);
  }
};

const updateTariff = async () => {
  if (props.tariffGroupId && props.tariff) {
    await chargerStore.updateTariff(props.tariffGroupId, props.tariff.id, createTariff.value, true, goTo_AddChargerView);
  }
};

</script>

<style scoped lang="scss">
// Your styles here
</style>
