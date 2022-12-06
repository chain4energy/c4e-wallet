<template>
  <p>ClaimAirdrop</p>
  <p>{{ airdropClaimRecord.address }}</p>
  <Accordion :multiple="true">

    <AccordionTab v-for="campain in airdropClaimRecord.campaign_records" :key="campain.campaign.campaign_id" style="margin-bottom: 10px">

      <template #header>
        <i class="pi pi-calendar"></i>
        <span>CAMPAIN {{ campain.campaign.description }} ---- start:{{ campain.campaign.start_time.toLocaleString() }} - end:{{ campain.campaign.end_time.toLocaleString() }} ---- {{ campain.claimable }}</span>

      </template>

      <Card v-for="mission in campain.missions" :key="mission.mission_id">
        <template #title>
          <p>{{ mission.description }} - {{ MissionStatus[mission.status] }}</p>
        </template>
        <template #content>
          <div class="row">
            <div class="col-sm">
              <div v-if="mission.status === MissionStatus.COMPLETED">
                <Icon name="Check"/>
              </div>
              <div v-if="mission.status === MissionStatus.INITIAL">
                <Icon name="Play"/>
              </div>
              <div v-if="mission.status === MissionStatus.CLAIMED">
                <Icon name="Bitcoin"/>
              </div>
            </div>
            <div class="col-sm">
              <p>{{ mission.description }} - {{ MissionStatus[mission.status] }}</p>
            </div>
            <div class="col-sm">
              <p>{{ mission.weight }}</p>
            </div>
            <div class="col-sm">
              <Button v-if="mission.status !== MissionStatus.CLAIMED" :disabled="mission.status !== MissionStatus.COMPLETED" :label="'claim'"></Button>
            </div>
          </div>
        </template>
      </Card>
    </AccordionTab>
  </Accordion>
</template>

<script setup lang="ts">
import {useAirDropStore} from "@/store/airDrop.store";
import {computed} from "vue";
import {useUserStore} from "@/store/user.store";
import {MissionStatus} from "@/models/airdrop/airdrop";
import CoinAmount from '@/components/commons/CoinAmount.vue';
import Card from 'primevue/card';

{
  useAirDropStore().fetchAirdropClaimRecord(useUserStore().getAccount.address, true);
}

const airdropClaimRecord = computed(() => {
  return useAirDropStore().getAirdropClaimRecord;
});

</script>

<style scoped>

</style>
