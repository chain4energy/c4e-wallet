<template>
<div class="tile">
  <TabView class="airDrop__tabview">
    <TabPanel >
      <template #header>
        <div>Check Allocation</div>
      </template>
      <AirDropTotal/>
    </TabPanel>
<!--    <TabPanel style="width: 100%">-->
<!--      <template #header>-->
<!--        <div>Claim Air Drop</div>-->
<!--      </template>-->
<!--      <ClaimAirdrop/>-->
<!--    </TabPanel>-->
  </TabView>
</div>
</template>

<script setup lang="ts">
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import ClaimAirdrop from "@/components/airdrop/ClaimAirdrop.vue";
import AirDropTotal from "@/components/airdrop/AirDropTotal.vue";
</script>

<style scoped lang="scss">
.airDrop{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(calc(100%/ 4), 1fr));
  &__container{
    background-color: white;
    box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    padding: 0.5em;
    border-radius: 5px;
    grid-area: 1 / 2/ 1 / 4;
    @media (max-width: 1024px) {
      grid-area: 1 /1/ 1 / 5;
    }
  }
  &__tabview{
    width: 100%
  }
  hr{
    color: gray;
    font-size: 1.5em;
    width: 80%;
    align-items: center;
    &::after{
      content: attr(data-after);
      color: black;
      opacity: 1;
      position: absolute;
      margin-top: -23px;
      margin-left: -20px;
      background-color: white;
      padding: 5px 20px
    }
  }
  &__sections{
    width: 90%;
  }
  &__form{
    display: flex;
    width: 90%;
  }
  &__input{
    margin-top: 30px
  }
  &__sectionTitle{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  &__result{
    width: 90%;
    background-color: var(--bs-gray-400) ;
    box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0.5em;
    border-radius: 5px;
    &-item{
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

  }
  &__total{
    width: 90%;
    text-align: left;
    font-weight: 700;
    font-size: 31px;
    line-height: 38px;
    &-amount{
      font-weight: 700;
      font-size: 28px;
      line-height: 34px;
    }
    &-image{

    }
  }
  &__login{
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: space-between;
    &-row{
      flex-direction: row;
    }
    &-address{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(calc(100%/ 4), 1fr));
    }
    &-keplr{
      grid-area: 1 / 4/ 1 / 4;
      display: flex;
      align-items: center;
      p{
        margin-bottom: 0;
      }
    }
  }
  &__text{
    margin-top: 1rem;
    font-size: 15px;
  }
  &__field{
    display: flex;
    input{
      border-radius: 5px;
    }
    span{
      padding: 10px;
    }


  }
  &__btn{
    width: 90% !important;
    border-radius: 5px !important;
  }
  &__btn2{
    border-radius: 5px !important;
  }
  &__congrats{
    margin-top: 30px;
    padding: 20px
  }
}

</style>
