<template>
  <div class="frame" >
    <div style="position: relative;">
      <C4EIcon icon="c4e-4-only" size="160" style="position: absolute;"/>
      <div style="position: absolute;">
        <div class="lds-roller"><div class="c4e-dots"></div><div class="c4e-dots"></div><div class="c4e-dots"></div><div class="c4e-dots"></div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import C4EIcon from './C4EIcon.vue';

</script>
<style scoped>

.frame {
    width: 160px;
  height: 160px;
}

.lds-roller {
  display: inline-block;
  position: relative;
  width: 160px;
  height: 160px;
}
.lds-roller div {
  animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 80px 80px;
}
.lds-roller div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 50%;

  margin: -4px 0 0 -4px;
}
.lds-roller div:nth-child(1) {
  animation-delay: -0.036s;
}
.lds-roller div:nth-child(1):after {
  top: 126px;
  left: 126px;
}
.lds-roller div:nth-child(2) {
  animation-delay: -0.072s;
}
.lds-roller div:nth-child(2):after {
  /* top: 136px;
  left: 112px; */
  top: 144px;
  left: 96px;
}
.lds-roller div:nth-child(3) {
  animation-delay: -0.108s;
}
.lds-roller div:nth-child(3):after {
  top: 146px;
  left: 60px;
}
.lds-roller div:nth-child(4) {
  animation-delay: -0.144s;
}
.lds-roller div:nth-child(4):after {
  top: 134px;
  left: 28px;
}
/* .lds-roller div:nth-child(5) {
  animation-delay: -0.18s;
}
.lds-roller div:nth-child(5):after {
  top: 71px;
  left: 32px;
}
.lds-roller div:nth-child(6) {
  animation-delay: -0.216s;
}
.lds-roller div:nth-child(6):after {
  top: 68px;
  left: 24px;
}
.lds-roller div:nth-child(7) {
  animation-delay: -0.252s;
}
.lds-roller div:nth-child(7):after {
  top: 63px;
  left: 17px;
}
.lds-roller div:nth-child(8) {
  animation-delay: -0.288s;
}
.lds-roller div:nth-child(8):after {
  top: 56px;
  left: 12px;
} */
@keyframes lds-roller {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.c4e-dots::after {
  background: #72BF44;
}

.c4e-icon {
  color: #72BF44;
}

</style>
