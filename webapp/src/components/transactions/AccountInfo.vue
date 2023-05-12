<template>
  <div class="accountInfo">
    <div class="accountInfo__head">
      <p class="accountInfo__headMainTxt">Your account</p>
      <p class="accountInfo__headTxt">Type: email</p>
      <p class="accountInfo__headTxt">Email: somebody@test.com</p>
    </div>
    <hr class="accountInfo__line"/>
    <div class="accountInfo__body">
      <div class="accountInfo__head">
        <p class="accountInfo__headMainTxt">KYC level</p>
        <p class="accountInfo__headTxt">None</p>
      </div>
      <div>
        <Button
          class="p-button p-component secondary accountInfo__btn"
          @click="console.log(111)">Start KYC</Button>
      </div>
    </div>
    <hr class="accountInfo__line"/>
    <div class="accountInfo__body">
      <div class="accountInfo__head">
        <p class="accountInfo__headMainTxt">Terms acceptance</p>
        <p class="accountInfo__headTxt">No</p>
      </div>
      <div>
        <Button
          class="p-button p-component secondary accountInfo__btn"
          @click="console.log(111)">Accept</Button>
      </div>
    </div>
    <hr class="accountInfo__line"/>
    <div class="accountInfo__body">
      <div class="accountInfo__head">
        <p class="accountInfo__headMainTxt">Claimer address</p>
        <p v-if="address" class="accountInfo__headTxt">{{ address }}</p>
        <p v-else class="accountInfo__headTxt">No address</p>
      </div>
      <div>
        <Button
          class="p-button p-component secondary accountInfo__btn"
          @click="console.log(111)">Provide address</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed } from "vue";
import { useUserStore } from "@/store/user.store";
import { usePublicSalesStore } from "@/store/publicSales.store";

const address = computed(() =>{
  return useUserStore().getAccount.address
});


</script>

<style scoped lang="scss">
.accountInfo{
  display: flex;
  flex-direction: column;
  align-items: start;
  background: #FFFFFF;
  filter: drop-shadow(0px 4px 20px rgba(0, 0, 0, 0.15));
  font-family: 'Inter',sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  padding: 32px 33px 26px 116px;
  border-radius: 5px;
  &__head{
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  &__headMainTxt{
    font-family: 'Work Sans',sans-serif;
    font-weight: 500;
    font-size: 24px;
    line-height: 28px;
    color: black;
  }
  &__headTxt{
    font-family: 'Work Sans',sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 19px;
    line-height: 22px;
    color: #858585;
  }
  &__body{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
  }
  &__line{
    width: 100%;
    border: 1px solid #CECECE;
  }
  &__btn{
    border-radius: 24px;
    width: 161px;
    min-height: 40px;
    font-family: 'Work Sans',sans-serif;
  }
}
</style>
