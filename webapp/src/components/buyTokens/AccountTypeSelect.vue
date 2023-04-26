<template>
  <div class="box-shadow">
    <h4 style="font-weight: 700;">Account type</h4>
    <div style="margin-left: 20px">
      <div v-for="category in categories" :key="category.name" class="flex align-items-center">
        <RadioButton v-model="selectedType" :inputId="category.name" name="pizza" :value="category.name" />
        <label :for="category.name" class="mx-2">{{ category.name }}</label>
      </div>
    </div>
    <Button @click="onNext" class="p-button p-component secondary">Sign in</Button>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import RadioButton from 'primevue/radiobutton';
import {useRouter} from "vue-router";

const selectedType = ref<AccountType>();
enum AccountType {
  EMAIL='EMAIL',
  KEPLR='KEPLR',
  METAMASK='METAMASK'
}
const categories = ref([
  { name: AccountType.EMAIL},
  { name: AccountType.KEPLR},
  { name: AccountType.METAMASK }
]);
const router = useRouter();


const onNext = () => {
  switch (selectedType.value) {
    case AccountType.EMAIL: {
      router.push({name: 'emailRegistration'});
      break;
    }
    case AccountType.KEPLR: {
      router.push({name: 'keplrRegistration'});
      break;
    }
    case AccountType.METAMASK: {
      router.push({name: 'metamaskRegistration'});
      break;
    }
  }
  console.log()
};
</script>

<style scoped lang="scss">

</style>
