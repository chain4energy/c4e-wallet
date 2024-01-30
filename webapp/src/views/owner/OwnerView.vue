<template>
  <div class="w-full h-full flex items-center justify-center relative">
    <button @click="hide=!hide" class="border-1 bg-gray-200 z-20 absolute top-0 left-0">DEV - Details</button>
    <div class="mx-auto min-w-[330px] w-full max-w-[600px] md:max-w-[900px] h-full max-h-full p-2 sm:p-5 flex flex-col">
      <div class="w-full">
        <BackCloseBar hamburger/>
        <h3 class="font-[Audiowide] text-black text-4xl w-full text-center -mt-5 mb-5">{{$t('HEADERS.YOUR_CHARGERS')}}</h3>
      </div>
      <ScrollerWrapper >
        <div v-if="chargerStore.getChargePoints?.length === 0">
          <h1>You have no chargers</h1>
        </div>
        <div v-else v-for="charger in chargerStore.getChargePoints" :key="charger.id" class="my-4 w-[85%] mx-auto">
          <ChargePointC :charge-point="charger" :hide="hide"/>
        </div>
      </ScrollerWrapper>
      <div class="mt-4">
        <NextButton text="Add new" icon="Plus" @clicked="goTo_AddChargerView()"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useOwnerStore} from "@/store/owner.store";
import {onMounted, ref} from "vue";
import ChargePointC from "@/components/ChargePointC.vue";
import {goTo_AddChargerView} from "@/router/goToRoute";
import ScrollerWrapper from "@/components/ScrollerWrapper.vue";
import NextButton from "@/components/NextButton.vue";
import BackCloseBar from "@/components/BackCloseBar.vue";
import OwnerService from "@/services/ownerEv.service";

const chargerStore = useOwnerStore();

onMounted(async () => {
  OwnerService.ownerViewEntered();
});

const hide = ref<boolean>(false);

</script>

<style lang="scss" scoped>

</style>
