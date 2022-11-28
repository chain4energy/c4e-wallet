<template>
  <div class="frame" :style="`height: ${size}px; width: ${size}px;`" >
    <div style="position: relative;">
      <div style="position: absolute;">
        <div class="anim-logo" :style="`height: ${size}px; width: ${size}px;`">
          <div>
            <svg :width="size" :height="size" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- <path d="M14.9676 28C12.3978 27.9936 9.88758 27.2257 7.75401 25.7934C5.62045 24.361 3.95926 22.3285 2.98028 19.9525C2.00132 17.5764 1.7485 14.9636 2.25376 12.444C2.75903 9.92437 3.9997 7.61103 5.81906 5.79619C7.63843 3.98134 9.95486 2.74642 12.4757 2.24744C14.9966 1.74845 17.6088 2.00778 19.9824 2.99266C22.3559 3.97755 24.3843 5.64381 25.8114 7.78094C27.2383 9.91808 28 12.4302 28 14.9999C27.9914 18.4507 26.6145 21.7573 24.1714 24.1943C21.7283 26.6314 18.4183 28 14.9676 28ZM14.9676 2.99415C12.5943 2.99985 10.2759 3.70881 8.30537 5.03148C6.33482 6.35416 4.8005 8.2312 3.89623 10.4255C2.99195 12.6197 2.7583 15.0329 3.2248 17.3598C3.69129 19.6868 4.837 21.8233 6.51718 23.4995C8.19736 25.1757 10.3366 26.3163 12.6648 26.7772C14.9929 27.2381 17.4053 26.9987 19.5975 26.0891C21.7895 25.1796 23.6629 23.6408 24.9809 21.667C26.2988 19.6933 27.0022 17.3733 27.0022 14.9999C26.9945 11.8132 25.7233 8.75952 23.4672 6.50881C21.2111 4.25811 18.1544 2.99414 14.9676 2.99415Z" fill="black"/> -->
              <path d="M18.6124 22C19.5151 21.5612 20.325 20.9609 21 20.2306V9.76948C20.326 9.0382 19.5158 8.4378 18.6124 8V14.4798H11.3695V8.05309C10.4713 8.50452 9.66768 9.11544 9 9.8544V15.6512C9.00027 15.8053 9.03112 15.9579 9.09085 16.1006C9.15016 16.2385 9.23518 16.3645 9.34161 16.4722C9.44655 16.5744 9.5697 16.6571 9.70503 16.7164C9.85494 16.7809 10.0172 16.8134 10.1811 16.812H18.5979L18.6124 22Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
      <div style="position: absolute;">
        <div class="anim-dots" :style="`height: ${size}px; width: ${size}px;`" >
          <div :style="`transform-origin: ${Number(size)/2}px ${Number(size)/2}px;`">
            <svg :width="size" :height="size" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M27.2932 22C27.2932 22.3955 27.1759 22.7822 26.9562 23.1111C26.7364 23.44 26.424 23.6964 26.0586 23.8478C25.6931 23.9991 25.291 24.0388 24.9031 23.9615C24.5151 23.8844 24.1587 23.6939 23.879 23.4142C23.5993 23.1345 23.4088 22.7781 23.3316 22.3902C23.2545 22.0022 23.2941 21.6 23.4454 21.2346C23.5968 20.8691 23.8532 20.5568 24.1821 20.337C24.5109 20.1173 24.8976 20 25.2932 20C25.8236 20 26.3323 20.2107 26.7074 20.5858C27.0824 20.9608 27.2932 21.4696 27.2932 22Z" fill="currentColor"/>
            </svg>
          </div>
          <div :style="`transform-origin: ${Number(size)/2}px ${Number(size)/2}px;`">
            <svg :width="size" :height="size" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M23.8632 25.3389C23.8632 25.7344 23.7459 26.1211 23.5261 26.45C23.3064 26.7789 22.994 27.0352 22.6286 27.1866C22.2631 27.338 21.861 27.3776 21.4731 27.3004C21.0851 27.2233 20.7287 27.0328 20.449 26.7531C20.1693 26.4733 19.9788 26.117 19.9016 25.7291C19.8245 25.3411 19.8641 24.9389 20.0154 24.5735C20.1668 24.208 20.4232 23.8957 20.7521 23.6759C21.0809 23.4561 21.4676 23.3389 21.8632 23.3389C22.3936 23.3389 22.9023 23.5496 23.2774 23.9246C23.6524 24.2997 23.8632 24.8084 23.8632 25.3389Z" fill="currentColor"/>
            </svg>
          </div>
          <div :style="`transform-origin: ${Number(size)/2}px ${Number(size)/2}px;`">
            <svg :width="size" :height="size" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M19.4142 27.1095C19.4142 27.505 19.297 27.8917 19.0772 28.2206C18.8574 28.5495 18.545 28.8059 18.1796 28.9573C17.8142 29.1086 17.412 29.1483 17.0241 29.071C16.6361 28.9939 16.2797 28.8034 16 28.5237C15.7203 28.244 15.5299 27.8876 15.4526 27.4997C15.3755 27.1117 15.4151 26.7095 15.5665 26.3441C15.7179 25.9786 15.9742 25.6663 16.3031 25.4465C16.632 25.2268 17.0187 25.1095 17.4142 25.1095C17.9447 25.1095 18.4534 25.3202 18.8285 25.6953C19.2035 26.0703 19.4142 26.5791 19.4142 27.1095Z" fill="currentColor"/>
            </svg>
          </div>
          <div :style="`transform-origin: ${Number(size)/2}px ${Number(size)/2}px;`">
            <svg :width="size" :height="size" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M14.663 27.1496C14.663 27.5451 14.5457 27.9318 14.3259 28.2607C14.1061 28.5896 13.7938 28.8459 13.4284 28.9973C13.0629 29.1487 12.6607 29.1883 12.2728 29.1111C11.8848 29.034 11.5285 28.8435 11.2487 28.5638C10.9691 28.284 10.7786 27.9277 10.7014 27.5398C10.6242 27.1518 10.6638 26.7496 10.8152 26.3842C10.9666 26.0187 11.223 25.7064 11.5518 25.4866C11.8807 25.2668 12.2674 25.1496 12.663 25.1496C13.1934 25.1496 13.7021 25.3603 14.0772 25.7353C14.4522 26.1104 14.663 26.6191 14.663 27.1496Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

</script>
<style scoped>
.anim-logo {
  display: inline-block;
  transform: translateZ(1px);
}
.anim-logo > div {
  display: inline-block;
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
    transform: rotateY(180deg);
    animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
  }
  100% {
    transform: rotateY(360deg);
  }
}

.anim-dots {
  display: inline-block;
  position: relative;
}
.anim-dots div {
  animation: anim-dots 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  position: absolute;
}
.anim-dots div:after {
  content: " ";
  display: block;
  position: absolute;

  border-radius: 50%;
  margin: -4px 0 0 -4px;
}
.anim-dots div:nth-child(1) {
  animation-delay: -0.050s;
}

.anim-dots div:nth-child(2) {
  animation-delay: -0.100s;
}

.anim-dots div:nth-child(3) {
  animation-delay: -0.150s;
}

.anim-dots div:nth-child(4) {
  animation-delay: -0.200s;
}

@keyframes anim-dots {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
