<template>
  <div>
    <div>
      Chcesz kupić 1000 C4E
    </div>
    <div>
      Sign up
      <InputSwitch v-model="checked" />
      Sign in
    </div>
    <div style="width: 35%">
      <AccountTypeSelect></AccountTypeSelect>
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


</style>
