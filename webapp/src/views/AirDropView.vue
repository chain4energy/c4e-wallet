<template>
<div>
  <TabView lazy>
    <TabPanel v-if="userLoggedIn">
      <template #header>
        <div>Cosmos Air Drop</div>
      </template>
      <div>Cosmos Air Drop</div>
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
        <div>connect</div>
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
import {computed} from "vue";
import dataService from "@/services/data.service";
import KeplrLogo from "@/components/commons/KeplrLogo.vue";
import axios from "axios";

const userStore = useUserStore();

const userLoggedIn = computed(() =>{
  return userStore.getAccount.address != '';
});

window.onload = async () =>{
  console.log(window.keplr)
};

axios.get('https://airdrop.c4e.io/c4e100000aeu2lh0jrrnmn2npc88typ25u7twahdlj.json').then((res) => {
  console.log(res)
})

</script>

<style scoped>

</style>
