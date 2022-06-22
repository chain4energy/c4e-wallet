<template>
  <div class="container">
    <div class="left">
      <Icon name="TrendingUp"></Icon>
    </div>
    <div class="right">
      <div>Inflation</div>
      <div class="info">
        <span>11,27%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from "../features/IconComponent.vue";


</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-wrap: wrap;

  padding: 15px 10px;
  width: 244px;
  height: 112px;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  .left {

  }
  .right{
    .info {
      font-weight:bold;
    }
  }
}
</style>
