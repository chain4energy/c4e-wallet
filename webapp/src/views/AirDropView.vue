<template>
<div>
  <TabView lazy>
    <TabPanel v-if="userLoggedIn">
      <template #header>
        <div>Cosmos Air Drop</div>
      </template>
      <div v-if="!airdropExist">

        <div>
          Congratulations your account {{airDrop1.c4e_address}} can receive
          <CoinAmount :amount="airDrop1.total_amount" :precision="2" :show-denom="true" :reduce-big-number="true"/>
        </div>

      </div>
      <div v-else>
        Sorry we don't have an AirDrop for you
      </div>
    </TabPanel>
    <TabPanel v-if="userLoggedIn">
      <template #header>
        <div>Green AirDrop</div>
      </template>
      <div>Here will be some airdrop 2</div>
    </TabPanel>
    <TabPanel v-if="!userLoggedIn">
      <template #header>
        <div>Have to be connected</div>
      </template>
      <div>you have to be connected to account to see AirDrops</div>
      <Button @click="dataService.onKeplrLogIn()">
        <KeplrLogo/> {{ $t('CONNECT.CONNECT' )}}
      </Button>
    </TabPanel>
    <TabPanel>
      <template #header>
        <div>Announcement</div>
      </template>
      <div>Here will be some airdrop announcement</div>
    </TabPanel>
  </TabView>
</div>
</template>

<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import {useUserStore} from "@/store/user.store";
import {computed, watch} from "vue";
import dataService from "@/services/data.service";
import KeplrLogo from "@/components/commons/KeplrLogo.vue";
import axios from "axios";
import factoryApi from "@/api/factory.api";
import {useAirDropStore} from "@/store/airDrop.store";
import {Coin, DecCoin} from "@/models/store/common";
import {useConfigurationStore} from "@/store/configuration.store";
import CoinAmount from '@/components/commons/CoinAmount.vue';

const userStore = useUserStore();

const userLoggedIn = computed(() =>{
  return userStore.getAccount.address != '';
});
const airdropExist = computed(() => {
  return useAirDropStore().getAirDropStatus;
});

const airDrop1= computed(() =>{
  return useAirDropStore().getAirDrop;
});


watch(userLoggedIn, (next, prev)=> {
  if(next){
    useAirDropStore().fetchAirdrop(userStore.getAccount.address, true);
  }
});

</script>

<style scoped>

</style>
