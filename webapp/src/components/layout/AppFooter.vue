<template>

  <div class="footer">
    <span>
      <CurrentBlockchain></CurrentBlockchain>
    </span>
    <span>FAQ</span>
    <span>Help</span>
    <span>Terms & Conditions</span>
    <span>Privacy Policy</span>
    <span class="right">c4e</span>
  </div>
</template>

<script setup lang="ts">
import {useConfigurationStore} from "@/store/configuration.store";
import {onBeforeMount} from "vue";
import CurrentBlockchain from "@/components/layout/CurrentBlockchain.vue";

onBeforeMount(() => {
  useConfigurationStore().fetchConfig("config1.json");
  console.log(useConfigurationStore().config.airdropPoolAddress);
});

</script>

<style scoped lang="scss">
.footer {
  width: 100%;
  min-height: 50px;
  background-color: white;

  padding: 20px 0 20px 8%;

  span {
    float:left;
    margin-left:15px;
  }
  .right {
    float: right;
    padding-right: 20px;
  }
}
</style>
