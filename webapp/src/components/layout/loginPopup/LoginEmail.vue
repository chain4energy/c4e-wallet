<template>
  <div class="loginEmail">
    <div class="loginEmail__header">
      <h3>Login with Email</h3>
      <button @click="$emit('back')">{{ $t('COMMON.BACK') }}</button>
    </div>
    <form @submit.prevent class="loginEmail__body">
      <div class="loginEmail__description">
        <div style="display: flex; align-items: center; justify-content: space-evenly;">
          <div class="loginEmail__descriptionIcon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="20" fill="white"/>
              <path d="M9.99984 18.3333C14.6022 18.3333 18.3332 14.6023 18.3332 9.99996C18.3332 5.39759 14.6022 1.66663 9.99984 1.66663C5.39746 1.66663 1.6665 5.39759 1.6665 9.99996C1.6665 14.6023 5.39746 18.3333 9.99984 18.3333Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1.6665 10H18.3332" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9.99984 1.66663C12.0842 3.94859 13.2688 6.90999 13.3332 9.99996C13.2688 13.0899 12.0842 16.0513 9.99984 18.3333C7.91544 16.0513 6.73088 13.0899 6.6665 9.99996C6.73088 6.90999 7.91544 3.94859 9.99984 1.66663V1.66663Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p>{{ $t('LOGIN.ADDRESS_HELP') }}</p>
        </div>
        <input v-model="email">
        <button @click="submit">{{ $t('COMMON.CONNECT')}}</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import LoginChoose from '@/components/layout/loginPopup/LoginChoose.vue'
import dataService from '@/services/data.service';
import { useUserStore } from "@/store/user.store";

const userStore = useUserStore()

import { ref } from "vue";

const email = ref('')

function submit(){
  dataService.onAddressLogIn(email.value);
  // userStore.connectAsAddress(email.value)
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

