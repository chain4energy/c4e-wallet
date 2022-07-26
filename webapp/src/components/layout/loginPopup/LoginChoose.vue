<template>
  <div class="loginChoose__holder">
    <h2>Welcome</h2>
    <p>The world’s first blockchain network based on green energy production</p>
    <div class="loginChoose__body">
      <button @click="$emit('typeChange', LoginEmail)" class="loginChoose__description">
        <div style="display: flex; align-items: center; justify-content: space-evenly;">
          <div class="loginChoose__descriptionIcon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="20" fill="white"/>
              <path d="M9.99984 18.3333C14.6022 18.3333 18.3332 14.6023 18.3332 9.99996C18.3332 5.39759 14.6022 1.66663 9.99984 1.66663C5.39746 1.66663 1.6665 5.39759 1.6665 9.99996C1.6665 14.6023 5.39746 18.3333 9.99984 18.3333Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1.6665 10H18.3332" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9.99984 1.66663C12.0842 3.94859 13.2688 6.90999 13.3332 9.99996C13.2688 13.0899 12.0842 16.0513 9.99984 18.3333C7.91544 16.0513 6.73088 13.0899 6.6665 9.99996C6.73088 6.90999 7.91544 3.94859 9.99984 1.66663V1.66663Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <p>{{ $t('LOGIN.LOGIN_ADDRESS') }}</p>
        </div>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_i_1790_25838)">
            <circle cx="20" cy="20" r="20" fill="#72BF44"/>
          </g>
          <path d="M20 28.3333C24.6023 28.3333 28.3333 24.6024 28.3333 20C28.3333 15.3976 24.6023 11.6667 20 11.6667C15.3976 11.6667 11.6666 15.3976 11.6666 20C11.6666 24.6024 15.3976 28.3333 20 28.3333Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 23.3333L23.3333 20L20 16.6667" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16.6666 20H23.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
            <filter id="filter0_i_1790_25838" x="0" y="0" width="40" height="44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="4"/>
              <feGaussianBlur stdDeviation="2"/>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1790_25838"/>
            </filter>
          </defs>
        </svg>
      </button>
      <button @click="$emit('keplr')" class="loginChoose__description">
        <div style="display: flex; align-items: center; justify-content: space-evenly;">
          <div class="loginChoose__descriptionIcon">
            <img src="/keplrIcon.jpg" alt="KeplrIco">
          </div>

          <p>{{ $t('LOGIN.LOGIN_KEPLR') }}</p>
        </div>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_i_1790_25838)">
            <circle cx="20" cy="20" r="20" fill="#72BF44"/>
          </g>
          <path d="M20 28.3333C24.6023 28.3333 28.3333 24.6024 28.3333 20C28.3333 15.3976 24.6023 11.6667 20 11.6667C15.3976 11.6667 11.6666 15.3976 11.6666 20C11.6666 24.6024 15.3976 28.3333 20 28.3333Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 23.3333L23.3333 20L20 16.6667" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M16.6666 20H23.3333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
            <filter id="filter0_i_1790_25838" x="0" y="0" width="40" height="44" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feOffset dy="4"/>
              <feGaussianBlur stdDeviation="2"/>
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
              <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1790_25838"/>
            </filter>
          </defs>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginEmail from '@/components/layout/loginPopup/LoginEmail.vue';
import LoginKeplr from '@/components/layout/loginPopup/LogoutConfirm.vue';
import { useUserStore } from "@/store/user.store";

</script>

<style scoped lang="scss">
.loginChoose{
  position: fixed;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  width: 100%;
  height: 100vh;
  p{
    margin-bottom: 0;
  }
  &__background{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: #0F3153;
    opacity: 0.85;
    z-index: -1;
  }
  &__holder{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-evenly;
    width: 100%;
  }
  &__header{
    width: 100%;
    display: flex;
    justify-content: space-between;
    div{
      display: flex;
      align-items: baseline;
      justify-items: center;
      text-align: center;
      :nth-child(1){
        margin-right: 15px;
      }
    }
  }
  &__form{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 300px;
  }
  &__body{
    width: 100%;
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
  &__btnHolder{
    width: 100%;
  }
  &__btns{
    margin-top: 10px;
    display: flex;
    width: 100%;
    justify-content: flex-end;

  }
}

.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-leave-active {
  transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
}
</style>
