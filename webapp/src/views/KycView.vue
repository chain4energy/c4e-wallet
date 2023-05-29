<template>
  <div style="display: flex; justify-content: center">
    <div v-for="tier in tierInfoList" :key="tier" style="margin: 10px 30px">
      <KycTier :header="tier.header" :description="tier.description" :list-of-steps="tier.steps" :tier="tier.tier" @verify="onVerifyButton" />
    </div>
    <Dialog v-model:visible="modalVisible" modal header="Verification" :style="{ width: '95vw', 'max-width': '600px' }">
      <div style="display: flex; align-items: center; justify-content:center; flex-direction: column">
          <synaps-verify
            :sessionId="sessionId"
            :color="{ primary: '72bf44', secondary: 'ffffff' }"
            lang="en"
            :tier="selectedTierId"
            service="individual"
            @ready="console.log('ready')"
            @finish="console.log('finish')"
          />
      </div>

    </Dialog>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from "vue";
import {useUserServiceStore} from "@/store/userService.store";
import KycTier from "@/components/kyc/KycTier.vue";
import {KycStepName, KycTierEnum} from "@/models/user/kyc";
import Dialog from "primevue/dialog";
import SynapsVerify from '@synaps-io/vue3-verify';

const selectedTierId = ref();
const modalVisible = ref<boolean>(false);
const sessionId = computed(() => {
  return '3c4a4218-60e5df7f-a9d2eb31-daf53da6';
});
useUserServiceStore().fetchKycStatus('3c4a4218-60e5df7f-a9d2eb31-daf53da6', false);


const tierInfoList = [
  {
    header: 'Tier 1',
    description: 'Lorem ipsum lorem ipsum lorem lorem',
    steps: useUserServiceStore().getKycTierSteps(KycTierEnum.TIER_1),
    tier: 8270
  },
  {
    header: 'Tier 2',
    description: 'Lorem ipsum lorem ipsum lorem lorem',
    steps: useUserServiceStore().getKycTierSteps(KycTierEnum.TIER_2),
    tier: 6406
  },
  {
    header: 'Tier 3',
    description: 'Lorem ipsum lorem ipsum lorem lorem',
    steps: useUserServiceStore().getKycTierSteps(KycTierEnum.TIER_3),
    tier: 8207
  }
];
console.log(tierInfoList)
const onVerifyButton = (tier: number) => {
  selectedTierId.value = tier;
  modalVisible.value = true;
};
</script>


<style scoped lang="scss">

</style>
