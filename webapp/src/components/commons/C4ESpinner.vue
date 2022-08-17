<template>
  <div class="frame" >
    <div style="position: relative;">
      <div style="position: absolute;">
        <div class="anim-logo"><C4EIcon icon="c4e-4-only" size="160"/></div>
      </div>
      <div style="position: absolute;">
        <div class="anim-dots"><div class="c4e-dots"></div><div class="c4e-dots"></div><div class="c4e-dots"></div><div class="c4e-dots"></div></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import C4EIcon from './C4EIcon.vue';

</script>
<style scoped>
.anim-logo {
  display: inline-block;
  transform: translateZ(1px);
}
.anim-logo > div {
  display: inline-block;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  animation: anim-logo 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
@keyframes anim-logo {
  0%, 100% {
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(1800deg);
    animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
  }
  100% {
    transform: rotateY(3600deg);
  }
}


.frame {
  width: 160px;
  height: 160px;
}

.anim-dots {
  display: inline-block;
  position: relative;
  width: 160px;
  height: 160px;
}
.anim-dots div {
  animation: anim-dots 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  transform-origin: 80px 80px;
}
.anim-dots div:after {
  content: " ";
  display: block;
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 50%;

  margin: -4px 0 0 -4px;
}
.anim-dots div:nth-child(1) {
  animation-delay: -0.036s;
}
.anim-dots div:nth-child(1):after {
  top: 126px;
  left: 126px;
}
.anim-dots div:nth-child(2) {
  animation-delay: -0.072s;
}
.anim-dots div:nth-child(2):after {
  /* top: 136px;
  left: 112px; */
  top: 144px;
  left: 96px;
}
.anim-dots div:nth-child(3) {
  animation-delay: -0.108s;
}
.anim-dots div:nth-child(3):after {
  top: 146px;
  left: 60px;
}
.anim-dots div:nth-child(4) {
  animation-delay: -0.144s;
}
.anim-dots div:nth-child(4):after {
  top: 134px;
  left: 28px;
}

@keyframes anim-dots {
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
