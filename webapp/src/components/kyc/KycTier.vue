<template>
<div class="tier_container">
  <div class="tier_container__top">
    <img style="width: 300px; height: 100px" src="@/assets/c4elogo-new.svg" alt="c4e logo"/>
  </div>
  <div class="tier_container__middle">
    <h2 style="font-weight: bold">{{header}}</h2>
    <div>
      {{description}}
    </div>
    <div class="list">

      <div v-for="step in listOfSteps" :key="step" style="margin-top: 15px; padding:5px;border-bottom: 1px solid rgba(143,143,143,0.2);">
        <Icon v-if="step.state == KycStatus.VALIDATED" style="color: #72bf44; width: 35px; height: 35px" name="Check" />
        <Icon v-if="step.state == KycStatus.NOT_STARTED" style="color: #ff2500; width: 35px; height: 35px" name="X" />
        <Icon v-if="step.state == KycStatus.PENDING" style="color: #4b4b4b; width: 35px; height: 35px" name="Loader" />
        {{getStepName(step.name)}}
      </div>
    </div>
  </div>
  <div class="tier_container__bottom">
    <Button @click="onVerifyClick" v-if="!isVerified()">Verify with Synaps</Button>
    <span v-else style="font-weight: bold; color: #72bf44; font-size: 1.2rem">
      <Icon style="color: #72bf44; width: 35px; height: 35px" name="Check" />
      Verified
    </span>
  </div>
</div>
</template>

<script setup lang="ts">
import Icon from "@/components/features/IconComponent.vue";
import {KycProgressStatus, KycStepInfo, KycStepName} from "@/models/user/kyc";

const props = defineProps<{
  header: string,
  description: string,
  listOfSteps: KycStepInfo[],
  tier: number

}>();
const emit = defineEmits(['verify']);
const getStepName = (name: KycStepName): string => {
  if(name == KycStepName.IDENTITY)
    return 'Identity document';
  if(name == KycStepName.LIVENESS)
    return 'Personal information';
  if(name == KycStepName.PHONE)
    return 'Phone number';
  return '';
};

const isVerified = (): boolean => {
  let verified = true;
  props.listOfSteps.forEach(step => {
    if(step.state != KycProgressStatus.VALIDATED)
      verified = false;
  });
  return verified;
};

const onVerifyClick = () => {
  emit('verify', props.tier);
};
</script>

<style scoped lang="scss">

.tier_container {
  width: 430px;
  height: 700px;
  position: relative;

  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  &__top {
    height: 30%;
    background: #002C50;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__middle {
    font-size: 1.2rem;
    padding: 15px 30px;
    .list {
      text-align: left;
      margin-top: 50px;
    }
  }
  &__bottom {
    width: 100%;
    position: absolute;
    bottom: 20px;

  }
}


</style>
