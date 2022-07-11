<template>
  <div class="loginChoose__holder">
    <h2>Wallet</h2>
    <button @click="$emit('back')"> close </button>
    <div class="loginChoose__body">
      <button @click="login" class="loginChoose__description">
        <div style="display: flex; align-items: center; justify-content: space-evenly;">
          <div class="loginChoose__descriptionIcon">
            <img src="/keplrIcon.jpg">
          </div>

          <p>Keplr browser extention</p>
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
import LoginChoose from '@/components/layout/loginPopup/LoginChoose.vue'

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
    height: 100%;
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

</style>
