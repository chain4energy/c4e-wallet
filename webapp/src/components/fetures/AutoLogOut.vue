<template>
  <div class="d-flex justify-content-center" v-if="useUserStore().isLoggedIn">
<!--  <span class="mx-1">Zostanie automatycznie wylogowany za </span>-->
    <v-idle  @idle="onIdle"
          @remind="onRemind"
          :reminders="[30]"
          :wait="1"
          :duration="6000"/>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user.store';

const route = useRouter();
const userStore = useUserStore();

function onIdle () {
  alert('You have been logged out');
  userStore.loggedOut();
  route.push('Home');
}
function onRemind () {
  alert('You will be logged out!!!');
}

</script>
