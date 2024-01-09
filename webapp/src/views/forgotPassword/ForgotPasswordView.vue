<script setup lang="ts">
import Steps from 'primevue/steps';
import {computed, ref} from "vue";
import {useToast} from "vue-toastification";
import i18n from "@/plugins/i18n";
import routerEv from "@/router";
import {goTo_SignInView} from "@/router/goToRoute";

const currentPath = routerEv.currentRoute.value.path;
console.log("currentPath:" + currentPath);
const items = computed(()=> [
  {
    label: i18n.global.t('SIGN_IN_VIEW.EMAIL'),
    to: currentPath + ""
  },
  {
    label: i18n.global.t('SECTION_TITLES.PROVIDEVERIFICATIONCODE'),
    to: currentPath + "/step2"
  },
  {
    label: i18n.global.t('SIGN_IN_VIEW.PASSWORD'),
    to: currentPath + "/step3",
  },
]);

const nextPage = (event: {pageIndex: number}) => {
  routerEv.push(items.value[event.pageIndex + 1].to);
};
const prevPage = (event: {pageIndex: number}) => {
  if (event.pageIndex === 0) routerEv.back();
  else routerEv.push(items.value[event.pageIndex - 1].to);
};
const complete = () => {
  console.log(newPassword);
  useToast().success('Password has been reset');
  goTo_SignInView();
};

const newPassword = ref({
  email: '',
  password: ''
});
</script>

<template>

  <div class="card">
    <Steps :model="items" aria-label="Form Steps" />
  </div>

  <router-view v-slot="{ Component }" v-model:newPassword="newPassword" @prev-page="prevPage($event)" @next-page="nextPage($event)" @complete="complete">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>

</template>

<style scoped lang="scss">

</style>
