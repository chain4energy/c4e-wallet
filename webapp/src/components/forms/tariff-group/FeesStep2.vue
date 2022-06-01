<template>
  <div class="stepsdemo-content">
    <Card>
      <!--      <template v-slot:title>
              ASD
            </template>-->
      <template v-slot:subtitle>
        Informacje ogólne
      </template>
      <template v-slot:content>
        <div class="p-fluid formgrid grid ">

          <div v-for="(fee, index) of feeList" :key="fee.id" class="field col-12 md:col-6 mb-4">
            <InputText v-model="definedFees[index]" :placeholder="fee.name"/>
          </div>

        </div>

      </template>
      <template v-slot:footer>
        <div class="grid grid-nogutter justify-content-between">
          <Button label="Back" @click="prevPage()" icon="pi pi-angle-left"></Button>
          <Button label="Complete" @click="complete()" icon="pi pi-angle-right"></Button>
        </div>
      </template>

    </Card>
  </div>
</template>

<script setup lang="ts">
import {ref, defineEmits, PropType, onMounted} from 'vue';
import Card from "primevue/card";
import {TariffGroup} from "@/components/forms/tariff-group/TariffGroup";
import TariffGroupService from "@/services/tariff-group.service"

const emit = defineEmits(['complete', 'prevPage','update:newTariffGroup']);
const props = defineProps({

  newTariffGroup: {
    type: Object as PropType<TariffGroup>,
    required: true
  }
})
const tariffGroupService = new TariffGroupService();

onMounted(async () => {
  feeList.value = await tariffGroupService.getFees();
  console.log(feeList.value);

})
const name = ref();
const feeList = ref<[{id:number, name:string}]>([{id:-1, name:''}]);

const definedFees = ref([]);

const prevPage = () => {
  emit('prevPage', {pageIndex: 1});
}

const complete = () => {

  let fees:{feeId:number, price: number}[] = [];
  feeList.value.forEach((fee, index) => {
    fees.push({feeId: fee.id, price: definedFees.value[index]})
  })
  let updatedNewTariffGroup: TariffGroup = props.newTariffGroup;

  updatedNewTariffGroup.fees = fees;
  emit('complete');
  emit('update:newTariffGroup', updatedNewTariffGroup);
}
</script>

<style scoped>

</style>
