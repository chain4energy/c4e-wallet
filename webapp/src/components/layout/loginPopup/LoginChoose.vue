<template>
  <div class="loginChoose__holder">
    <div class="top-bar">
      <h2 style="font-weight: bold">{{ $t('CONNECT.WELCOME') }}</h2>
      <Button icon="pi pi-times" style="margin-bottom: 0.5rem" @click="$emit('close')" class="p-button-rounded p-button-secondary p-button-text" />
    </div>


    <p>{{ $t('CONNECT.WELCOME_MESSAGE') }}</p>
    <div class="loginChoose__body">
      <div class="box" @click="$emit('typeChange', LoginEmail)">
        <div class="iconContainer">
          <Icon class="icon" name="Globe"></Icon>
        </div>
        <span>{{ $t('CONNECT.CONNECT_ADDRESS') }}</span>
        <div style="margin-left:auto" class="nextStep">
          <div class="iconContainer" style="background-color: #72bf44">
            <Icon style="color:white" class="icon" name="ArrowRightCircle"></Icon>
          </div>
        </div>
      </div>
      <div style="margin-top: 10px" class="box" @click="$emit('keplr')" v-if="!isMobile()">
        <div style="margin-left: 25px; margin-right: 20px; ">
          <img style="height:50px;;padding-top: 6px;" src="@/assets/keplrIcon2.png">
        </div>
        <span>{{ $t('CONNECT.CONNECT_KEPLR') }}</span>
        <div style="margin-left:auto" class="nextStep">
          <div class="iconContainer" style="background-color: #72bf44">
            <Icon style="color:white" class="icon" name="ArrowRightCircle"></Icon>
          </div>
        </div>
      </div>
<!--      <div class="keplr" @click="$emit('keplr')" v-if="!isMobile()">-->
<!--        <KeplrLogo/>-->
<!--        <span>{{ $t('CONNECT.CONNECT_KEPLR') }}</span>-->
<!--      </div>-->
<!--      <Button @click="$emit('typeChange', LoginEmail)">-->
<!--      <Icon style="margin-right: 10px;" name="Globe"></Icon>-->
<!--        {{ $t('CONNECT.CONNECT_ADDRESS') }}-->
<!--      </Button>-->
<!--      <Button @click="$emit('keplr')" v-if="!isMobile()">-->
<!--        <KeplrLogo/>-->
<!--        {{ $t('CONNECT.CONNECT_KEPLR') }}-->

<!--      </Button>-->
    </div>
  </div>
</template>

<script setup lang="ts">
import KeplrLogo from '@/components/commons/KeplrLogo.vue';
import LoginEmail from '@/components/layout/loginPopup/LoginAddress.vue';

function isMobile() {
   if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
     return true;
   } else {
     return false;
   }
 }
</script>
<style scoped lang="scss">
.top-bar {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

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
    padding: 1em 2em;
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
    display: flex;
    flex-direction: column;

    button {
      width: 100%;
      height: 60px;
    }

    .box {
      width: 100%; height: 80px;
      box-shadow: 0px 0px 24px 0px rgba(196, 203, 212, 1);
      border-radius: 10px 10px 10px 10px;
      display: flex;
      align-items: center;
      .iconContainer {
        box-shadow: 0px 0px 24px 0px rgba(196, 203, 212, 1);
        height: 50px;
        width: 50px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        margin-left: 25px;
        margin-right: 20px;
        .icon {
          margin-left: 0;
          margin-right:0;
        }
      }
    }
    .box:hover {
      opacity: 0.6;
      cursor: pointer;
    }
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
