<template>
  <div class="container">
    <div class="left">
      <Icon name="Circle"></Icon>
    </div>
    <div class="right">
      <div>{{ $t('DASHBOARD_VIEW.CIRCULATING_SUPPLY') }}</div>
      <div class="info">
        <span>1231231231 c4e</span>
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
  width: 227px;
  height: 90px;
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
