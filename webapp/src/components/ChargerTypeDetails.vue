<script setup lang="ts">
import {ChargePointDict} from "@/models/chargePointDict";

const props = defineProps<{chargerDetails: ChargePointDict}>();
</script>

<template>
<div class="w-full font-[Audiowide] flex flex-inline flex-wrap items-center justify-evenly" v-if="chargerDetails">
  <h3 class="w-full text-center text-2xl sm:text-4xl mb-4">{{chargerDetails.name}}</h3>
  <div class="flex flex-col min-w-[200px] font-[Audiowide] sm:text-lg mb-2 gap-2">
    <span>{{chargerDetails.description}}</span>
    <span>Connector - {{$t('PLUG_TYPES.' + chargerDetails.plugType)}}</span>
  </div>
  <div class="w-1/4 min-w-[120px] flex justify-center items-center">
    <!-- TODO: Icon from chargePoint data --->
    <img src="@/assets/images/HABU.png" class="w-full" alt="HABU icon"/>
  </div>
</div>
</template>

<style scoped>

</style>
