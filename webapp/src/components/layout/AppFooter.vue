<template>

  <div class="footer">
    <span>FAQ</span>
    <span>Help</span>
    <router-link to="/terms_conditions"><span>Terms & Conditions</span></router-link>
    <router-link to="/privacy_policy"><span>Privacy Policy</span></router-link>
    <span class="right">c4e</span>
  </div>
</template>

<script setup lang="ts">
import {useConfigurationStore} from "@/store/configuration.store";
import {onBeforeMount} from "vue";
import CurrentBlockchain from "@/components/layout/CurrentBlockchain.vue";

onBeforeMount(() => {
  console.log(useConfigurationStore().config.airdropPoolAddress);
});

</script>

<style scoped lang="scss">
.footer {
  width: 100%;
  min-height: 50px;
  background-color: white;
  position: fixed;
  bottom: 0;

  padding: 20px 0 20px 8%;

  span {
    float:left;
    margin-left:15px;
    font-weight: bold;
    color: rgba(70, 70, 70, 1);
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
  .right {
    float: right;
    padding-right: 20px;
  }
}
</style>
