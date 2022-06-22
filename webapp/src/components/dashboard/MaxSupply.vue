<template>
  <div class="container">
    <div class="left">
      <Icon name="FlagTriangleRight"></Icon>
    </div>
    <div class="right">
      <div>{{ $t("DASHBOARD_VIEW.MAX_SUPPLY") }}</div>
      <div class="info">
        123123123 c4e
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">


</script>

<style scoped lang="scss">
.container {
  display: flex;
  padding: 15px 10px;
  box-shadow: -1px 1px 3px 3px rgba(0,0,0,0.1);
  width: 227px;
  height: 90px;
  margin: auto auto 30px;
  .info {
    font-weight:bold;
  }
}
</style>
