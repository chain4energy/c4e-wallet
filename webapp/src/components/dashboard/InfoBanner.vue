<template>
  <div class="tile" style="background-color:#FFD700">
    <div class="text info-box">
      <div class="flex">
        Join Now for 90% APR
      </div>
      <Button @click="onClick" class="secondary">
        <div class="blink_me" style="font-weight: bolder; margin-right: 4px">Boost your C4E here!!!
          <Icon name="Rocket" style="width: 16px ; height: 16px; font-weight: bolder; margin-right: 4px"/>
          <Icon name="Rocket" style="width: 20px ; height: 20px; font-weight: bolder; margin-right: 4px"/>
          <Icon name="Rocket" style="width: 24px ; height: 24px; font-weight: bolder; margin-right: 4px"/>
        </div>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "@/components/features/IconComponent.vue";
import {useRouter} from "vue-router";
const router = useRouter();

function onClick(){
  router.push('boost');
}


</script>

<style scoped lang="scss">

.info-box{
  justify-content: center;
  display:flex;
  flex-direction: row;
  text-align:center;
  width: 100%;
  align-items: center;
}

.left-element {
  padding-right: 20px;
  width: 50%;
  box-sizing: border-box;
}

.right-element {
  padding-left: 20px;
  border-left: 1px solid;
}

.blink_me {
  animation: blinker 1.5s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 30%;
  }
}

.bounce_me {
  animation: bounce 1.5s linear infinite;
}

@keyframes bounce {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
