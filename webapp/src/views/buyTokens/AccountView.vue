<template>
  <div class="select_container">
    <div>
      Chcesz kupić 1000 C4E
    </div>
    <div>
      Sign up
      <InputSwitch v-model="checked" />
      Sign in
    </div>
    <div class="select_container__type">
      <AccountTypeSelect :is-register="!checked"></AccountTypeSelect>
    </div>

  </div>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import InputSwitch from 'primevue/inputswitch';
import {ref} from "vue";
import AccountTypeSelect from "@/components/buyTokens/AccountTypeSelect.vue";

const checked = ref<boolean>(false);
const router = useRouter();
</script>

<style scoped lang="scss">


.select_container {
  height: 100%;

   &__type {
     width: 35%;
     margin: 30px auto;
     padding-bottom: 30px;
   }
}
</style>
