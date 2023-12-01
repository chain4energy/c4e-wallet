<template>
  <div class="p-fluid">
    <InputText v-model="createTariff.name" placeholder="Tariff Name"/>
    <Dropdown v-model="createTariff.currency"
              placeholder="Select country"
              :options="countryOptions"
              optionLabel="name"
              optionValue="currency" />
    <Dropdown v-model="createTariff.unit" placeholder="Select unit" :options="['Wh', 'kWh']"/>
    <InputText v-model="createTariff.unitCost" placeholder="Unit Cost"/>

    <Button label="Update tariff" @click="onSubmit()"/>
  </div>
</template>

<script setup lang="ts">
import Dropdown from 'primevue/dropdown';
import { ref, computed } from 'vue';
import { useOwnerStore } from '@/ev/store/owner.store';
import { CreateTariff } from '@/ev/models/createTariff';

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
  unit: chargerStore.selectedTariff?.unit || "",
  unitCost: chargerStore.selectedTariff?.unitCost || 0,
  active: chargerStore.selectedTariff?.active || false,
  startDate: chargerStore.selectedTariff?.startDate,
  endDate: chargerStore.selectedTariff?.endDate,
});

const europeanCountries = [
  { name: 'Poland', currency: 'PLN' },
  { name: 'Germany', currency: 'EUR' },
  { name: 'France', currency: 'EUR' },
  { name: 'Spain', currency: 'EUR' },
  { name: 'Italy', currency: 'EUR' },
  { name: 'United Kingdom', currency: 'EUR' },
  { name: 'Switzerland', currency: 'EUR' },
  { name: 'Norway', currency: 'EUR' },
  { name: 'Sweden', currency: 'EUR' },
  { name: 'Denmark', currency: 'EUR' },
  { name: 'Greece', currency: 'EUR' },
  { name: 'Portugal', currency: 'EUR' },
  { name: 'Belgium', currency: 'EUR' },
  { name: 'Netherlands', currency: 'EUR' },
  { name: 'Austria', currency: 'EUR' },
  { name: 'Finland', currency: 'EUR' },
  { name: 'Ireland', currency: 'EUR' },
  { name: 'Czech Republic', currency: 'EUR' },
  { name: 'Hungary', currency: 'EUR' },
  { name: 'Romania', currency: 'EUR' },
];


const countryOptions = computed(() => {
  return europeanCountries.map(country => ({
    name: country.name,
    currency: country.currency
  }));
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
    await chargerStore.updateTariff(chargerStore.selectedTariff.tariffGroupId, chargerStore.selectedTariff.id, createTariff.value, true, () => {
      emit ('onSuccess')
    });
  }
};

</script>

<style scoped lang="scss"></style>
