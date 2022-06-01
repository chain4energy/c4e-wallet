<template>
  <!--  <div class="navbar navbar-expand-lg background bg-primary">-->
  <!--    <div class="container-fluid">-->
  <!--      <Image class="navbar-brand" :src="require('../../assets/c4elogo-new.svg')"/>-->
  <!--      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"-->
  <!--              aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">-->
  <!--        <span class="navbar-toggler-icon"></span>-->
  <!--      </button>-->
  <!--      &lt;!&ndash;      <AutoLogOut/>&ndash;&gt;-->
  <!--      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">-->
  <!--        <div class="navbar-nav">-->
  <!--          <span>AppHeader</span>-->
  <!--          <LangSwitch/>-->
  <!--          <Button></Button>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
  <nav class="navbar navbar-expand-lg navbar-dark background">
    <div class="container-fluid">
      <Image class="navbar-brand" :src="require('../../assets/c4elogo-new.svg')" alt="Image" height="36" />
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
              aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav left">
          <i class="pi pi-user me-3" style="font-size: 1.5rem;" />
          <span>Hello <span style="font-weight:bold">Jan Kowalski</span> </span>
          <i class="pi pi-sun ms-4" style="font-size: 1.5rem;" />
          <span class="fw-bold mx-2">Monday</span>
          <span>11.05.2022</span>
        </div>
        <div class="navbar-nav right">
<!--          <div class="nav-link">-->
          <span class="p-input-icon-left p-input-icon-right mx-5 " >
            <i class="pi pi-times-circle" @click="globalFilter.clearFilter()"/>
            <InputText type="text" v-model="globalFilter.filter" placeholder="Search" />
            <i class="pi" :class="{'pi-search': !globalFilter.isLoading, 'pi-spin pi-spinner': globalFilter.isLoading}"/>
          </span>
<!--          </div>-->

          <LangSwitch class="nav-link mx-1"/>
          <span class="">
            <Button icon="pi pi-bell" class="nav-link p-button-rounded p-button-text p-button-lg mx-1" ></Button>
            <div class="badge">2</div>
          </span>

          <Button icon=" pi pi-power-off" class="nav-link p-button-rounded p-button-text p-button-lg mx-1"  @click="logOut()"></Button>
        </div>
      </div>

    </div>
    <div class="bottom-container">
       <span class="breadcrumb">Home / Jan Kowalski</span>
       <AutoLogOut class="right" style="top: 7vh;" />
    </div>
  </nav>

</template>

<script setup lang="ts">
import LangSwitch from '@/components/lang/LangSwitch.vue';
import AutoLogOut from "@/components/fetures/AutoLogOut.vue";

import { useRouter } from 'vue-router';
import {useGlobalFilterStore} from "@/store/global-filter.store";

const router = useRouter();
const globalFilter = useGlobalFilterStore();

function logOut(){
  // authService.logout();
  router.push("/");
}
</script>

<style scoped lang="scss">
.background {
  background-image: url('@/assets/header/background.svg');
  //background-position: right 20px bottom -250px;
  background-size:     cover;                      /* <------ */
  background-repeat:   no-repeat;
  background-position: center center;
  position:sticky;
  color: white;
  top: 0px;
  z-index: 999;

.badge {
  position: relative;
  top: -40px;
  right: -10px;
  border-radius: 50%;
  background-color: aqua;
  color: black;
}
.right {
  position: absolute;
  right: 20px;
  top:10px;
}
.left {
  margin-left: 40px;
}
.bottom-container {
  padding: 3vh 10vw;
  display:flex;
}
}

.p-inputtext {
  border-radius: 20px;
}
.p-input-icon-right>i {
  margin-top: -1rem;
}
@media (min-width: 992px) {
  .navbar-expand-lg{
    flex-wrap: wrap;
  }
}
</style>
