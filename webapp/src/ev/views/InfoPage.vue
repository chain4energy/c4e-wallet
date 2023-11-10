<template>
  <div class="about">
    <h1>The world's first blockchain</h1>
    <h1>network based on green</h1>
    <h1>energy production</h1>
  </div>
  <div>
    <p> ResourceID: </p>
    <InputText v-model="resourceId" type="text"/>
  </div>
  <div>
    <Button
      @click="onClick"
      class="airDropTotal-btn">
      {{ $t('INFO_PAGE.BUTTON') }}
    </Button>
  </div>
  <chargerInfoC :charger-info="chargerInfo">

  </chargerInfoC>
  <priceC :price-info="priceInfo">

  </priceC>
  <Button>
    Next
  </Button>
</template>

<script setup lang="ts">
import {ref} from "vue";
import { useRouter} from "vue-router";
import ChargerInfoC from "@/ev/components/ChargerInfoC.vue";
import {ChargerInfo, ChargerStatus, ConnectorType, PriceInfo} from "@/models/ev/chargerInfo";
import PriceC from "@/ev/components/PriceC.vue";

const resourceId = ref('');
const router = useRouter()
function onClick(){
  console.log("onClick");
  router.push('/ev/resourceLink/' + resourceId.value + '?tot=pooopo');
}

const chargerInfo : ChargerInfo= {
  location:'',
  name:'',
  connectorType:ConnectorType.TYPE2,
  availability:"asdasd",
  status:  ChargerStatus.AVAILABLE
}

const priceInfo : PriceInfo= {
  pricePerKwh : '123'
}

</script>
<style lang="scss" scoped>


</style>
<style>

</style>
