<template>
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
import {useOwnerStore} from '@/ev/store/owner.store';
import {CreateTariff} from '@/ev/models/createTariff';

const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
});

const emit = defineEmits(['onSuccess'])

const chargerStore = useOwnerStore();

const createTariff = ref<CreateTariff>({
  name: chargerStore.selectedTariff?.name || "",
  currency: chargerStore.selectedTariff?.currency || "",
  unit: chargerStore.selectedTariff?.currency || "",
  unitCost: chargerStore.selectedTariff?.unitCost || 0,
  active: chargerStore.selectedTariff?.active || false,
  startDate: chargerStore.selectedTariff?.startDate,
  endDate: chargerStore.selectedTariff?.endDate,
});

const onSubmit = async () => {
  console.log(props.isEdit)
  if (props.isEdit) {
    await updateTariff();
  } else {
    await createNewTariff();
  }
}

const createNewTariff = async () => {
  if (chargerStore.selectedTariffGroup) {
    await chargerStore.createTariff(chargerStore.selectedTariffGroup.id, createTariff.value, true, () => {
      emit ('onSuccess')
    });
  }
};

const updateTariff = async () => {
  if (chargerStore.selectedTariff) {
    console.log(chargerStore.selectedTariff)
    console.log(chargerStore.selectedTariff.tariffGroupId)
    console.log(chargerStore.selectedTariff.id)
    await chargerStore.updateTariff(chargerStore.selectedTariff.tariffGroupId, chargerStore.selectedTariff.id, createTariff.value, true, () => {
      emit ('onSuccess')
    });
  }
};

</script>

<style scoped lang="scss">
// Your styles here
</style>
