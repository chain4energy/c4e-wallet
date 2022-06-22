<template>
  <div class="container">
    <select @change="onChange($event)">
      <option v-for="[key, value] in configMap" :key="key" :value="value">{{ key }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">

import {useConfigurationStore} from "@/store/configuration.store";

const configMap = new Map<string, string>([
  ["config1", "config1.json"],
  ["config2", "config2.json"]
]);

const onChange = (event: any) => {
  useConfigurationStore().fetchConfig(event.target.value);
};
</script>

<style scoped lang="scss">
.container {
  width: 216px;
  height: 40px;
}
</style>
