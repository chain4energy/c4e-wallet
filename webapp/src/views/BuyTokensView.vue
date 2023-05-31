<template>
  <div class="box-shadow buy-tokens-container">
    <div class="back_container" >
      <span @click="onBackClick">
        <Icon name="ArrowLeft"></Icon> Back
      </span>
    </div>
    <router-view v-slot="{ Component }">
      <keep-alive >
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<script lang="ts" setup>

import {useRoute, useRouter} from "vue-router";

const router = useRouter();
const route = useRoute();

const onBackClick = () => {
    switch (route.name){
      case 'accountType': {
        router.push({name:'publicSaleInfo'});
        break;
      }
      case 'emailRegistration': {
        router.push({name:'accountType'});
        break;
      }
      case 'keplrRegistration': {
        router.push({name:'accountType'});
        break;
      }
      case 'metamaskRegistration': {
        router.push({name:'accountType'});
        break;
      }
      case 'emailLogin': {
        router.push({name:'accountType'});
        break;
      }
    }
};

</script>

<style scoped lang="scss">
.buy-tokens-container{
  .back_container {
    text-align: left;
    padding: 20px 20px;
    span:hover {
      cursor: pointer;
    }
  }
}
</style>
