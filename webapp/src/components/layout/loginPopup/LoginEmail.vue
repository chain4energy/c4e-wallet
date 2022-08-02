<template>
  <div class="loginEmail">
    <div class="loginEmail__header">
      <h3>Login with Email</h3>
      <Button icon="pi pi-times" style="width: 5px" @click="$emit('back')" class="p-button-rounded p-button-secondary p-button-text" />
    </div>
    <form @submit.prevent class="loginEmail__body">
      <div class="loginEmail__description">
        
        <span class="p-float-label" style="width: 100%">
          <InputText id="email" type="text" v-model="email"  style="width: 100%" />
          <label for="email">{{$t('LOGIN.ADDRESS_HELP')}}</label>
        </span>
        <!-- <input v-model="email"> -->
        <Button @click="submit">{{ $t('COMMON.CONNECT')}}</Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import LoginChoose from '@/components/layout/loginPopup/LoginChoose.vue'
import dataService from '@/services/data.service';
import { useUserStore } from "@/store/user.store";
const emit = defineEmits(['close']);
const userStore = useUserStore();

import { ref } from "vue";

const email = ref('');

function submit(){
  dataService.onAddressLogIn((email.value), () => {
    emit('close');
  });
}

</script>

<style scoped lang="scss">
.loginEmail{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  button{
    margin-left: 10px;
    border: 1px solid #72BF44;
    border-radius: 24px;
    background-color: #FFFFFF;
    width: 161px;
    padding:11px 24px 13px 24px;
    &:hover{
      background-color: #72BF44;
      color: #FFFFFF;
    }
  }
  &__header{
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  &__body{
    width: 100%;
  }
  &__descriptionIcon{
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    border-radius: 50%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
  }
  &__description{
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
    background: #FFFFFF;
    border-radius: 8px;
    padding: 22px;
    border: 2px solid transparent;
    &:hover{
      border: 2px solid rgba(0, 0, 0, 0.11);
    }

    &-info{
      display: flex;
      flex-direction: column;
      align-items: flex-start;

    }
  }
}
</style>

