<template>
  <div class="claimAirDrop" v-for="campain in airdropClaimRecord.campaign_records" :key="campain.campaign.campaign_id" style="margin-bottom: 10px">
    <div class="claimAirDrop__container">
      <h3>{{campain.campaign.description}}</h3>
      <div class="claimAirDrop__header">
        <h4>My progress</h4>
        <p>90%</p>
      </div>
      <div class="claimAirDrop__percents">
        <PercentageBar :amount="90" :started="campain.campaign.start_time < new Date(Date.now())"/>
      </div>
      <div class="claimAirDrop__content">
        <div class="claimAirDrop__items">
          <span>Claimed</span>
          <span>{{ campain.claimable }}</span>
        </div>
        <div class="claimAirDrop__items">
          <span>Mission Completed</span>
          <span>1324234234c4e</span>
        </div>
        <div class="claimAirDrop__items">
          <span>Time left to claim</span>
          <CountDownTime :end-time="campain.campaign.end_time"/>
        </div>
        <div class="claimAirDrop__items">
          <span>Total distribution</span>
          <span>{{ campain.claimable  }}</span>
        </div>
      </div>
      <Accordion v-if="campain.missions.length > 0" style="width: 100%; margin-top: 10px" :multiple="true">
        <AccordionTab v-for="mission in campain.missions" :key="mission.mission_id">
          <template #header>
            <i class="pi pi-calendar"></i>
            <span>{{campain.campaign.description}} {{ mission.description }} ---- start:{{ campain.campaign.start_time.toLocaleString(currentLang) }} - end:{{ campain.campaign.end_time.toLocaleString(currentLang) }}</span>
          </template>
        </AccordionTab>
      </Accordion>
    </div>
  </div>

<!--  <p>ClaimAirdrop</p>-->
<!--  <p>{{ airdropClaimRecord.address }}</p>-->
<!--  <Accordion :multiple="true">-->

<!--    <AccordionTab v-for="campain in airdropClaimRecord.campaign_records" :key="campain.campaign.campaign_id" style="margin-bottom: 10px">-->

<!--      <template #header>-->
<!--        <i class="pi pi-calendar"></i>-->
<!--        <span>CAMPAIN {{ campain.campaign.description }} &#45;&#45;&#45;&#45; start:{{ campain.campaign.start_time.toLocaleString() }} - end:{{ campain.campaign.end_time.toLocaleString() }} &#45;&#45;&#45;&#45; {{ campain.claimable }}</span>-->

<!--      </template>-->

<!--      <Card v-for="mission in campain.missions" :key="mission.mission_id">-->
<!--        <template #title>-->
<!--          <p>{{ mission.description }} - {{ MissionStatus[mission.status] }}</p>-->
<!--        </template>-->
<!--        <template #content>-->
<!--          <div class="row">-->
<!--            <div class="col-sm">-->
<!--              <div v-if="mission.status === MissionStatus.COMPLETED">-->
<!--                <Icon name="Check"/>-->
<!--              </div>-->
<!--              <div v-if="mission.status === MissionStatus.INITIAL">-->
<!--                <Icon name="Play"/>-->
<!--              </div>-->
<!--              <div v-if="mission.status === MissionStatus.CLAIMED">-->
<!--                <Icon name="Bitcoin"/>-->
<!--              </div>-->
<!--            </div>-->
<!--            <div class="col-sm">-->
<!--              <p>{{ mission.description }} - {{ MissionStatus[mission.status] }}</p>-->
<!--            </div>-->
<!--            <div class="col-sm">-->
<!--              <p>{{ mission.weight }}</p>-->
<!--            </div>-->
<!--            <div class="col-sm">-->
<!--              <Button v-if="mission.status !== MissionStatus.CLAIMED" :disabled="mission.status !== MissionStatus.COMPLETED" :label="'claim'"></Button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </template>-->
<!--      </Card>-->
<!--    </AccordionTab>-->
<!--  </Accordion>-->
</template>

<script setup lang="ts">
import {useAirDropStore} from "@/store/airDrop.store";
import { computed } from "vue";
import {useUserStore} from "@/store/user.store";
import {MissionStatus} from "@/models/airdrop/airdrop";
import Card from 'primevue/card';
import PercentageBar from "@/components/commons/PercentageBar.vue";
import i18n from "@/plugins/i18n";
import CountDownTime from "@/components/commons/CountDownTime.vue";

const currentLang = computed(() => {
  return i18n.global.locale;
})


{
  useAirDropStore().fetchAirdropClaimRecord(useUserStore().getAccount.address, true);
}

const airdropClaimRecord = computed(() => {
  return useAirDropStore().getAirdropClaimRecord;
});


</script>

<style scoped lang="scss">
.claimAirDrop{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(calc(100%/ 8), 1fr));
  width: 100%;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(calc(100%/ 2), 1fr));
  }
  &__container {
    background-color: white;
    padding: 5%;
    box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 5px;
    grid-area: 1 / 2/ 1 / 8;
    @media (max-width: 1024px) {
      grid-area: 1 /1/ 1 / 9;
    }
  }
  &__percents{
    width: 100%;
    height: 30px;
  }
  &__header{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  &__content{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(calc((100%/ 8) - 5px), 1fr));
    grid-column-gap: 5px;
    grid-row-gap: 5px;
    @media (max-width: 1024px) {
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      grid-column-gap:0;
      grid-row-gap: 10px;
    }
  }
  &__items{
    display: flex;
    flex-direction: column;
    font-size: 16px;
    box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
    border-radius: 5px;
    align-items: center;
    justify-content: space-between;
    padding: 15%;

  }
}
</style>
