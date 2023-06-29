<template>
  <div class="box-shadow" style="max-width: 400px">
    <h4 style="font-weight: 700;">Account type</h4>
    <div style="margin-left: 20px">
      <div v-for="category in categories" :key="category.name" class="flex align-items-center mb-1">
        <RadioButton v-model="selectedType" :inputId="category.name" name="pizza" :value="category.name" />
        <label :for="category.name" class="mx-2">{{ category.name }}</label>
        <div style="margin-right: 40px; margin-left:auto">
          <TooltipComponent />
        </div>

      </div>
    </div>
    <Button @click="onNext" class="p-button p-component secondary">{{isRegister ? 'Sign up' : 'Sign in'}}</Button>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import RadioButton from 'primevue/radiobutton';
import {useRouter} from "vue-router";
import TooltipComponent from "@/components/TooltipComponent.vue";

const props = defineProps<{
  isRegister: {
    type: boolean,
    default: true,
    required: false
  },
}>();
enum AccountType {
  EMAIL='EMAIL',
  KEPLR='KEPLR',
  METAMASK='METAMASK'
}
const selectedType = ref<AccountType>(AccountType.EMAIL);

const categories = ref([
  { name: AccountType.EMAIL},
  { name: AccountType.KEPLR},
  { name: AccountType.METAMASK }
]);
const router = useRouter();


const onNext = () => {
  switch (selectedType.value) {
    case AccountType.EMAIL: {
      if(props.isRegister)
        router.push({name: 'emailRegistration'});
      else
        router.push({name: 'emailLogin'});
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
