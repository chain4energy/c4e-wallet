<template>
  <div class="container">
    <select @change="onChange($event)">
      <option v-for="[key] in configMap" :key="key" :value="key" :selected= "key === useConfigurationStore().getConfigName">{{ key }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">

import { getConfigurationProfiles } from "@/config/configuration.profiles";
import {useConfigurationStore} from "@/store/configuration.store";

const configMap = getConfigurationProfiles();

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
