<template>
    <div class="topMenu" @focusout="closeDropdown" tabindex="0" @click="toggleDropdown()" >
        <div class="c4e">c4e</div>
        <span class="options-container" v-if="dropdown">
      <div style="display: grid; grid-template-columns: repeat(1, 1fr)">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr)">
          <div>
            <span class="text">{{ $t('HEADER.VERSION') }}</span>
          </div>
          <div class="center">
            <span class="text">{{ app_version + "/" + compilation_timestamp}}</span>
          </div>
        </div>
<!--        <div style="display: grid; grid-template-columns: repeat(2, 1fr)"  @click="topup" v-if="!isMainNetwork">-->
<!--          <div>-->
<!--            <span class="text">{{ $t('HEADER.TOP_UP_ACCOUNT') }}</span>-->
<!--          </div>-->
<!--          <div class="center"><img class="" src="@/assets/faucet.svg" alt="Image" style="width: 40px"></div>-->
<!--        </div>-->

      </div>
        </span>
    </div>
</template>

<script setup lang="ts">

import {useToast} from "vue-toastification";
import Icon from "~/components/features/Icon.vue";
import {computed, ref} from "vue";
import {useI18n} from "vue-i18n";
import {useUserStore} from "@/store/user.store";
import {useConfigurationStore} from "@/store/configuration.store";

const dropdown = ref(false);
const toggleDropdown = () => {
  dropdown.value = !dropdown.value;
};

const closeDropdown = () => {
    dropdown.value = false;
};
const i18n = useI18n();
const toast = useToast();
const app_version = process.env.VUE_APP_VERSION;
const compilation_timestamp = process.env.VUE_APP_COMPILATION_TIMESTAMP;
const isMainNetwork = computed(() => {
  return useConfigurationStore().config.isMainNetwork;
});
// function topup() {
//     console.log('topup')
//     useUserStore().topUpAccount(
//         () => {
//             toast.success(i18n.t('TOAST.SUCCESS.TOP_UP'));
//         },
//         () => {
//             toast.error(i18n.t('TOAST.ERROR.TOP_UP'));
//         });
// }


</script>

<style scoped lang="scss">
.topMenu {
  height: 100%;
  //padding: 10px;
  margin: 0 30px;
  border-radius: 5px;
  position: relative;
  display: inline-block;
  cursor: pointer;
  color: white;
  z-index: 1;
  float: right;

  img {
    height: 100%;
  }

  .options-container {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: -510px;
    top:-120px;
    padding: 10px;
    background-color: #81cf1f;
    min-width: 130px;
    border-radius: 10px 10px 0 10px;
    overflow: hidden;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    z-index: 99999;
    //width:150px;

    span {
      color: var(--main-color);
      padding: 12px 0 12px 16px;
      text-decoration: none;
      display: block;

      &:hover {
        color: var(--secondary-color);
        //background: var($--main-dark-blue);
        background-color: var(--main-color);
      }
    }

    .option {
      display: flex;
      align-items: center;

      &:hover span {
        color: var(--secondary-color);
      }

      .text {
        padding-top: 18px;
      }
    }
  }
}
.c4e {
  float: left;
  margin-left: 15px;
  font-weight: bold;
  color: rgba(70, 70, 70, 1);
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
