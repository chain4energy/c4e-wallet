<template>
  <div>
    <div class="tiers_container" >
      <KycTier class="tiers_container__single" v-for="tier in tierInfoList" :key="tier" :header="tier.header" :description="tier.description" :list-of-steps="tier.steps" :tier="tier.tier" @verify="onVerifyButton" />
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
import {computed, onBeforeMount, ref} from "vue";
import {useUserServiceStore} from "@/store/userService.store";
import KycTier from "@/components/kyc/KycTier.vue";
import { KycTierEnum} from "@/models/user/kyc";
import Dialog from "primevue/dialog";
import SynapsVerify from '@synaps-io/vue3-verify';

onBeforeMount(() => {
  useUserServiceStore().getKycStatus().then(() => {
    tierInfoList.value = [
      {
      header: 'Level 1',
      description: 'Lorem ipsum lorem ipsum lorem lorem',
      steps: useUserServiceStore().getKycTierSteps(KycTierEnum.TIER_1),
      tier: 8270
      },
      {
        header: 'Level 2',
        description: 'Lorem ipsum lorem ipsum lorem lorem',
        steps: useUserServiceStore().getKycTierSteps(KycTierEnum.TIER_2),
        tier: 3286
      }];
  });

});
const selectedTierId = ref();
const modalVisible = ref<boolean>(false);
const sessionId = computed(() => {
  return useUserServiceStore().kycSessionId;
});


const tierInfoList = ref();
const onVerifyButton = (tier: number) => {
  selectedTierId.value = tier;
  modalVisible.value = true;
};
</script>


<style scoped lang="scss">

.tiers_container {
  display: flex;
  justify-content: center;
  &__single {
    //flex-grow: 1;
    flex: 1 0 30%;
    margin:0 30px 60px 30px;
  }
}
@media only screen and (max-width: 1500px) {
  .tiers_container {
    flex-wrap: wrap;
    &__single {
      margin:0 20px 60px 20px;
    }
  }
}
</style>
