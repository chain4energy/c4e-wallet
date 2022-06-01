<template>
  <div>

    <div class="card">
      <Steps :model="items" :readonly="true" />
    </div>

    <router-view v-slot="{Component}" v-model:newTariffGroup="newTariffGroup" @prevPage="prevPage($event)" @nextPage="nextPage($event)" @complete="complete">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>

</template>

<script setup lang="ts">

import Steps from 'primevue/steps';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {TariffGroup} from "@/components/forms/tariff-group/TariffGroup";

const router = useRouter();
const currentPath = router.currentRoute.value.path;

const items = ref([
  {
    label: 'Informacje ogólne',
    to: currentPath + ""
  },
  {
    label: 'Opłaty',
    to: currentPath + "/fees_2",
  }
]);
const newTariffGroup = ref<TariffGroup>({dso:'', name:'', tariff:'', startDate: new Date(), endDate: new Date(), fees:[]});

const nextPage = (event: any) => {

  router.push(items.value[event.pageIndex + 1].to);
};
const prevPage = (event: any) => {
  router.push(items.value[event.pageIndex - 1].to);
};

const complete = () => {
  console.log(newTariffGroup.value);
};


</script>

<style scoped lang="scss">

</style>
