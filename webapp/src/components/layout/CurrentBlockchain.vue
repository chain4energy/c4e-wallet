<template>
  <div @mouseover="selectionView = true" @mouseleave="selectionView =false" class="currentBlockchain">
    <div class="currentBlockchain__icon" >
      <svg width="49" height="44" viewBox="0 0 49 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle opacity="0.2" cx="25" cy="22" r="12" fill="#81CF1F">
          <animate attributeName="r" values="12;19;12" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="25" cy="22" r="5" fill="#81CF1F">
          <animate attributeName="r" values="2;8;2" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
        <p>{{ latestBlock.height}}</p>

    </div>
    <transition name="slide-fade">
      <select @click="selectionView2 = true" @focusout="selectionView2=false" v-if="selectionView || selectionView2" class="currentBlockchain__selector" @change="onChange($event)">
        <option v-for="[key, items] in configMap" :key="key" :value="key" :selected= "curentNetwork === items.networkName">{{ items.networkName }}</option>
      </select>
    </transition>
  </div>
</template>

<script setup lang="ts">

import {useConfigurationStore} from "@/store/configuration.store";
import {computed, ref} from "vue";
import {useBlockStore} from "@/store/block.store";
import { changeTitle } from "@/utils/title-changer";

const selectionView = ref(false);
const selectionView2 = ref(false);
const configMap = computed(() => {return useConfigurationStore().getConfigList;});
const curentNetwork = computed(() => {
  return useConfigurationStore().getConfigName;
});

const onChange = (event: any) => {
  useConfigurationStore().setNetwork(event.target.value);
  changeTitle();
};
const latestBlock = computed(() => useBlockStore().getLatestBlock);
</script>

<style scoped lang="scss">

.currentBlockchain{
  max-width: 230px;
  background-color: #F1F1F1;
  border-radius: 10px;
  padding: 4px;
  display: flex;
  flex-direction: row;
  position: fixed;
  bottom: 0;
  margin: 10px;
  &__icon{
    display: flex;
    flex-direction: column;
    p{
      margin: 0;
      font-size: 12px;
      opacity: .8;
    }
  }
  &__selector{
    border: none;
    margin-left: 4px;
    &:focus-visible{
      border: none;
    }
    &:focus{
      border: none;
    }
    &:focus-within{
      border: none;
    }
    &:active{
      border: none;
    }
  }
}
.slide-fade-enter-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  animation: appear .3s;
}
.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  animation: appear .3s reverse;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
@keyframes appear {
  0% {
    max-width: 0;
    transform: translateX(-30px);
    opacity: 0;
  }
  100% {
    max-width:230px;
    transform: translateX(0px);
    opacity: 1;
  }
}
</style>
