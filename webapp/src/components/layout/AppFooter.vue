<template>

  <div class="footer">
    <span>FAQ</span>
    <a href="https://docs.c4e.io/usersGuide/walletBasics.html" target="_blank">
      <span>{{$t('FOOTER.HELP')}}</span>
    </a>
    <router-link to="/terms_conditions"><span>{{$t('FOOTER.TERMS')}}</span></router-link>
    <router-link to="/privacy_policy"><span>{{$t('FOOTER.PRIVACY')}}</span></router-link>
    <span ref="versionSpan" class="right">c4e</span>
    <div ref="versionDiv" v-bind:class="{show: showVersion}" class="hide">{{ app_version + "/" + compilation_timestamp}}</div>
  </div>
</template>

<script setup lang="ts">
import {useConfigurationStore} from "@/store/configuration.store";
import {onBeforeMount, onMounted, ref} from "vue";
import {loadFonts} from "@/plugins/webfontloader";

const app_version = process.env.VUE_APP_VERSION;
// const blockchain_version = process.env.VUE_APP_BLOCKCHAIN_VERSION;
const compilation_timestamp = process.env.VUE_APP_COMPILATION_TIMESTAMP;
const showVersion = ref<boolean>(false);
const versionDiv = ref<HTMLDivElement>();
const versionSpan = ref<HTMLDivElement>();

onBeforeMount(() => {
  console.log(useConfigurationStore().config.airdropPoolAddress);


});
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (!versionDiv.value || !versionSpan.value) return;
    if (!versionDiv.value!.contains(event.target as Node) && !versionSpan.value!.contains(event.target as Node)) {
      if(showVersion.value==true)
        showVersion.value = false;
    } else if(versionSpan.value!.contains(event.target as Node)) {
      showVersion.value = !showVersion.value;
    }
  };
  document.addEventListener('click', handleClickOutside);
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
  .hide {
    display: none;
  }
  .right {
    float: right;
    padding-right: 20px;

    //&:hover {
    //  & + .hide {
    //    width: 400px;
    //    height: 40px;
    //    position:absolute;
    //    bottom:40px;
    //    right:10px;
    //    display:block;
    //    background-color: white;
    //  }
    //}
  }
  .show {
    width: 400px;
    height: 40px;
    position:absolute;
    bottom:40px;
    right:10px;
    display:block;
    background-color: white;
  }
}
</style>


