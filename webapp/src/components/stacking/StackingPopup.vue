<template>
  <div class="validationPopup">
    <div class="validationPopup__background"></div>
    <div class="validationPopup__holder">
      <div class="validationPopup__header">
        <div>
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" transform="translate(1 1)" fill="white"/>
            <mask id="path-1-outside-1_2260_30076" maskUnits="userSpaceOnUse" x="0" y="0" width="26" height="26" fill="black">
              <rect fill="white" width="26" height="26"/>
              <path d="M24.2 14.2737V9.40015C24.2 9.06141 24.0537 8.73955 23.8 8.51519V5.40034C23.8 4.73788 23.2625 4.2004 22.6 4.2004H19.8888C18.4125 2.29237 15.8106 1.66365 13.6263 2.68735C12.4288 1.37867 10.6456 0.771822 8.89813 1.07806C7.15063 1.38492 5.68062 2.56236 5 4.2004H3.4C2.07625 4.2054 1.00438 5.27722 1 6.60091V22.6001C1.00125 23.9251 2.075 24.9988 3.4 25H23C23.6625 25 24.2 24.4625 24.2 23.8001V18.9265C24.6775 18.7578 24.9981 18.3066 25 17.8004V15.4005C24.9975 14.8942 24.6775 14.443 24.2 14.2743V14.2737ZM23 5.40034V8.20021H20.9319C20.975 7.93584 20.9981 7.66836 21 7.40025C21.0012 6.56466 20.8 5.74095 20.4131 5.00036H22.6C22.8206 5.00036 23 5.17973 23 5.40034ZM19.375 4.83475C20.0819 5.80345 20.3519 7.02401 20.12 8.20083H11.48C11.1012 6.17531 12.1812 4.1579 14.0769 3.34982C15.9725 2.54173 18.1756 3.1592 19.375 4.83475ZM9.8 1.80115C10.9644 1.79927 12.0813 2.2605 12.9056 3.08296C11.215 4.1979 10.3387 6.2028 10.6687 8.20083H5.8875C5.18563 6.8384 5.24437 5.20848 6.04375 3.90104C6.84312 2.59361 8.26687 1.7974 9.79937 1.80115H9.8ZM1.8 6.60091C1.80313 5.71845 2.5175 5.00411 3.4 5.00099H4.745C4.48625 6.06719 4.575 7.18838 4.9975 8.20083H3.48375C2.63563 8.21645 1.91125 7.59024 1.80375 6.7484C1.79937 6.7009 1.79813 6.65278 1.8 6.60466V6.60091ZM23 24.1994H3.4C2.51625 24.1994 1.8 23.4832 1.8 22.5995V19.3997H4.43625C4.67438 19.3997 4.9 19.5053 5.05312 19.6878L5.70375 20.4696C5.22062 21.1314 5.305 22.0489 5.90188 22.6107C6.49813 23.1726 7.42 23.202 8.05125 22.6801C8.6825 22.1576 8.82688 21.2471 8.38688 20.5558C7.94688 19.8646 7.06125 19.6084 6.32062 19.959L5.66875 19.1759C5.36437 18.8097 4.9125 18.5984 4.43625 18.5991H1.8V16.9991H8.65688C8.85813 17.7791 9.60875 18.2878 10.4075 18.1866C11.2069 18.0853 11.8056 17.4054 11.8056 16.5998C11.8056 15.7942 11.2063 15.1142 10.4075 15.0124C9.60813 14.9111 8.85813 15.4198 8.65688 16.1998H1.8V14.5999H4.43625C4.91188 14.5999 5.36312 14.3886 5.6675 14.0237L6.32 13.24C6.53188 13.3431 6.76438 13.3981 7 13.3999C7.745 13.4049 8.39625 12.8981 8.57438 12.175C8.75313 11.4519 8.41187 10.7007 7.75 10.3582C7.08813 10.0164 6.27813 10.1732 5.79125 10.737C5.30438 11.3007 5.26813 12.125 5.70312 12.73L5.05375 13.5106C4.90062 13.6937 4.67438 13.7993 4.43563 13.7999H1.8V8.36082C2.26437 8.77268 2.86313 9.00079 3.48375 9.00079H23C23.2206 9.00079 23.4 9.18016 23.4 9.40077V14.2005H21.4C20.0744 14.2005 19 15.2749 19 16.6004C19 17.926 20.0744 19.0003 21.4 19.0003H23.4V23.8001C23.4 24.0213 23.2213 24.2 23 24.2V24.1994ZM7 20.5996C7.32375 20.5996 7.615 20.7946 7.73875 21.0933C7.86312 21.3927 7.79438 21.7364 7.56563 21.9651C7.33687 22.1939 6.9925 22.2626 6.69375 22.1389C6.395 22.0151 6.2 21.7233 6.2 21.3996C6.2 20.9577 6.55813 20.5996 7 20.5996ZM9.4 16.5998C9.4 16.2761 9.595 15.9842 9.89375 15.8605C10.1931 15.7367 10.5369 15.8048 10.7656 16.0342C10.9944 16.2629 11.0631 16.6067 10.9394 16.906C10.8156 17.2048 10.5237 17.3998 10.2 17.3998C9.75812 17.3998 9.4 17.0416 9.4 16.5998ZM6.2 11.8C6.2 11.4763 6.395 11.1851 6.69375 11.0607C6.9925 10.9369 7.33687 11.0057 7.56563 11.2344C7.79438 11.4632 7.86312 11.8069 7.73875 12.1063C7.615 12.405 7.32312 12.6 7 12.6C6.55813 12.6 6.2 12.2419 6.2 11.8ZM24.2 17.7997C24.2 18.021 24.0212 18.1997 23.8 18.1997H21.4C20.5162 18.1997 19.8 17.4835 19.8 16.5998C19.8 15.7161 20.5162 14.9999 21.4 14.9999H23.8C24.0212 14.9999 24.2 15.1792 24.2 15.3998V17.7997Z"/>
            </mask>
            <path d="M24.2 14.2737V9.40015C24.2 9.06141 24.0537 8.73955 23.8 8.51519V5.40034C23.8 4.73788 23.2625 4.2004 22.6 4.2004H19.8888C18.4125 2.29237 15.8106 1.66365 13.6263 2.68735C12.4288 1.37867 10.6456 0.771822 8.89813 1.07806C7.15063 1.38492 5.68062 2.56236 5 4.2004H3.4C2.07625 4.2054 1.00438 5.27722 1 6.60091V22.6001C1.00125 23.9251 2.075 24.9988 3.4 25H23C23.6625 25 24.2 24.4625 24.2 23.8001V18.9265C24.6775 18.7578 24.9981 18.3066 25 17.8004V15.4005C24.9975 14.8942 24.6775 14.443 24.2 14.2743V14.2737ZM23 5.40034V8.20021H20.9319C20.975 7.93584 20.9981 7.66836 21 7.40025C21.0012 6.56466 20.8 5.74095 20.4131 5.00036H22.6C22.8206 5.00036 23 5.17973 23 5.40034ZM19.375 4.83475C20.0819 5.80345 20.3519 7.02401 20.12 8.20083H11.48C11.1012 6.17531 12.1812 4.1579 14.0769 3.34982C15.9725 2.54173 18.1756 3.1592 19.375 4.83475ZM9.8 1.80115C10.9644 1.79927 12.0813 2.2605 12.9056 3.08296C11.215 4.1979 10.3387 6.2028 10.6687 8.20083H5.8875C5.18563 6.8384 5.24437 5.20848 6.04375 3.90104C6.84312 2.59361 8.26687 1.7974 9.79937 1.80115H9.8ZM1.8 6.60091C1.80313 5.71845 2.5175 5.00411 3.4 5.00099H4.745C4.48625 6.06719 4.575 7.18838 4.9975 8.20083H3.48375C2.63563 8.21645 1.91125 7.59024 1.80375 6.7484C1.79937 6.7009 1.79813 6.65278 1.8 6.60466V6.60091ZM23 24.1994H3.4C2.51625 24.1994 1.8 23.4832 1.8 22.5995V19.3997H4.43625C4.67438 19.3997 4.9 19.5053 5.05312 19.6878L5.70375 20.4696C5.22062 21.1314 5.305 22.0489 5.90188 22.6107C6.49813 23.1726 7.42 23.202 8.05125 22.6801C8.6825 22.1576 8.82688 21.2471 8.38688 20.5558C7.94688 19.8646 7.06125 19.6084 6.32062 19.959L5.66875 19.1759C5.36437 18.8097 4.9125 18.5984 4.43625 18.5991H1.8V16.9991H8.65688C8.85813 17.7791 9.60875 18.2878 10.4075 18.1866C11.2069 18.0853 11.8056 17.4054 11.8056 16.5998C11.8056 15.7942 11.2063 15.1142 10.4075 15.0124C9.60813 14.9111 8.85813 15.4198 8.65688 16.1998H1.8V14.5999H4.43625C4.91188 14.5999 5.36312 14.3886 5.6675 14.0237L6.32 13.24C6.53188 13.3431 6.76438 13.3981 7 13.3999C7.745 13.4049 8.39625 12.8981 8.57438 12.175C8.75313 11.4519 8.41187 10.7007 7.75 10.3582C7.08813 10.0164 6.27813 10.1732 5.79125 10.737C5.30438 11.3007 5.26813 12.125 5.70312 12.73L5.05375 13.5106C4.90062 13.6937 4.67438 13.7993 4.43563 13.7999H1.8V8.36082C2.26437 8.77268 2.86313 9.00079 3.48375 9.00079H23C23.2206 9.00079 23.4 9.18016 23.4 9.40077V14.2005H21.4C20.0744 14.2005 19 15.2749 19 16.6004C19 17.926 20.0744 19.0003 21.4 19.0003H23.4V23.8001C23.4 24.0213 23.2213 24.2 23 24.2V24.1994ZM7 20.5996C7.32375 20.5996 7.615 20.7946 7.73875 21.0933C7.86312 21.3927 7.79438 21.7364 7.56563 21.9651C7.33687 22.1939 6.9925 22.2626 6.69375 22.1389C6.395 22.0151 6.2 21.7233 6.2 21.3996C6.2 20.9577 6.55813 20.5996 7 20.5996ZM9.4 16.5998C9.4 16.2761 9.595 15.9842 9.89375 15.8605C10.1931 15.7367 10.5369 15.8048 10.7656 16.0342C10.9944 16.2629 11.0631 16.6067 10.9394 16.906C10.8156 17.2048 10.5237 17.3998 10.2 17.3998C9.75812 17.3998 9.4 17.0416 9.4 16.5998ZM6.2 11.8C6.2 11.4763 6.395 11.1851 6.69375 11.0607C6.9925 10.9369 7.33687 11.0057 7.56563 11.2344C7.79438 11.4632 7.86312 11.8069 7.73875 12.1063C7.615 12.405 7.32312 12.6 7 12.6C6.55813 12.6 6.2 12.2419 6.2 11.8ZM24.2 17.7997C24.2 18.021 24.0212 18.1997 23.8 18.1997H21.4C20.5162 18.1997 19.8 17.4835 19.8 16.5998C19.8 15.7161 20.5162 14.9999 21.4 14.9999H23.8C24.0212 14.9999 24.2 15.1792 24.2 15.3998V17.7997Z" fill="black"/>
            <path d="M24.2 14.2737V9.40015C24.2 9.06141 24.0537 8.73955 23.8 8.51519V5.40034C23.8 4.73788 23.2625 4.2004 22.6 4.2004H19.8888C18.4125 2.29237 15.8106 1.66365 13.6263 2.68735C12.4288 1.37867 10.6456 0.771822 8.89813 1.07806C7.15063 1.38492 5.68062 2.56236 5 4.2004H3.4C2.07625 4.2054 1.00438 5.27722 1 6.60091V22.6001C1.00125 23.9251 2.075 24.9988 3.4 25H23C23.6625 25 24.2 24.4625 24.2 23.8001V18.9265C24.6775 18.7578 24.9981 18.3066 25 17.8004V15.4005C24.9975 14.8942 24.6775 14.443 24.2 14.2743V14.2737ZM23 5.40034V8.20021H20.9319C20.975 7.93584 20.9981 7.66836 21 7.40025C21.0012 6.56466 20.8 5.74095 20.4131 5.00036H22.6C22.8206 5.00036 23 5.17973 23 5.40034ZM19.375 4.83475C20.0819 5.80345 20.3519 7.02401 20.12 8.20083H11.48C11.1012 6.17531 12.1812 4.1579 14.0769 3.34982C15.9725 2.54173 18.1756 3.1592 19.375 4.83475ZM9.8 1.80115C10.9644 1.79927 12.0813 2.2605 12.9056 3.08296C11.215 4.1979 10.3387 6.2028 10.6687 8.20083H5.8875C5.18563 6.8384 5.24437 5.20848 6.04375 3.90104C6.84312 2.59361 8.26687 1.7974 9.79937 1.80115H9.8ZM1.8 6.60091C1.80313 5.71845 2.5175 5.00411 3.4 5.00099H4.745C4.48625 6.06719 4.575 7.18838 4.9975 8.20083H3.48375C2.63563 8.21645 1.91125 7.59024 1.80375 6.7484C1.79937 6.7009 1.79813 6.65278 1.8 6.60466V6.60091ZM23 24.1994H3.4C2.51625 24.1994 1.8 23.4832 1.8 22.5995V19.3997H4.43625C4.67438 19.3997 4.9 19.5053 5.05312 19.6878L5.70375 20.4696C5.22062 21.1314 5.305 22.0489 5.90188 22.6107C6.49813 23.1726 7.42 23.202 8.05125 22.6801C8.6825 22.1576 8.82688 21.2471 8.38688 20.5558C7.94688 19.8646 7.06125 19.6084 6.32062 19.959L5.66875 19.1759C5.36437 18.8097 4.9125 18.5984 4.43625 18.5991H1.8V16.9991H8.65688C8.85813 17.7791 9.60875 18.2878 10.4075 18.1866C11.2069 18.0853 11.8056 17.4054 11.8056 16.5998C11.8056 15.7942 11.2063 15.1142 10.4075 15.0124C9.60813 14.9111 8.85813 15.4198 8.65688 16.1998H1.8V14.5999H4.43625C4.91188 14.5999 5.36312 14.3886 5.6675 14.0237L6.32 13.24C6.53188 13.3431 6.76438 13.3981 7 13.3999C7.745 13.4049 8.39625 12.8981 8.57438 12.175C8.75313 11.4519 8.41187 10.7007 7.75 10.3582C7.08813 10.0164 6.27813 10.1732 5.79125 10.737C5.30438 11.3007 5.26813 12.125 5.70312 12.73L5.05375 13.5106C4.90062 13.6937 4.67438 13.7993 4.43563 13.7999H1.8V8.36082C2.26437 8.77268 2.86313 9.00079 3.48375 9.00079H23C23.2206 9.00079 23.4 9.18016 23.4 9.40077V14.2005H21.4C20.0744 14.2005 19 15.2749 19 16.6004C19 17.926 20.0744 19.0003 21.4 19.0003H23.4V23.8001C23.4 24.0213 23.2213 24.2 23 24.2V24.1994ZM7 20.5996C7.32375 20.5996 7.615 20.7946 7.73875 21.0933C7.86312 21.3927 7.79438 21.7364 7.56563 21.9651C7.33687 22.1939 6.9925 22.2626 6.69375 22.1389C6.395 22.0151 6.2 21.7233 6.2 21.3996C6.2 20.9577 6.55813 20.5996 7 20.5996ZM9.4 16.5998C9.4 16.2761 9.595 15.9842 9.89375 15.8605C10.1931 15.7367 10.5369 15.8048 10.7656 16.0342C10.9944 16.2629 11.0631 16.6067 10.9394 16.906C10.8156 17.2048 10.5237 17.3998 10.2 17.3998C9.75812 17.3998 9.4 17.0416 9.4 16.5998ZM6.2 11.8C6.2 11.4763 6.395 11.1851 6.69375 11.0607C6.9925 10.9369 7.33687 11.0057 7.56563 11.2344C7.79438 11.4632 7.86312 11.8069 7.73875 12.1063C7.615 12.405 7.32312 12.6 7 12.6C6.55813 12.6 6.2 12.2419 6.2 11.8ZM24.2 17.7997C24.2 18.021 24.0212 18.1997 23.8 18.1997H21.4C20.5162 18.1997 19.8 17.4835 19.8 16.5998C19.8 15.7161 20.5162 14.9999 21.4 14.9999H23.8C24.0212 14.9999 24.2 15.1792 24.2 15.3998V17.7997Z" stroke="black" mask="url(#path-1-outside-1_2260_30076)"/>
          </svg>
          <h2>Disperze</h2>
        </div>
        <button @click="$emit('close', '')">close</button>
      </div>
      <div class="validationPopup__body">
        <h3>My delegation</h3>
        <div class="validationPopup__description">
          <div class="validationPopup__descriptionIcon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="20" fill="white"/>
              <path d="M9.99984 18.3333C14.6022 18.3333 18.3332 14.6023 18.3332 9.99996C18.3332 5.39759 14.6022 1.66663 9.99984 1.66663C5.39746 1.66663 1.6665 5.39759 1.6665 9.99996C1.6665 14.6023 5.39746 18.3333 9.99984 18.3333Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M1.6665 10H18.3332" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9.99984 1.66663C12.0842 3.94859 13.2688 6.90999 13.3332 9.99996C13.2688 13.0899 12.0842 16.0513 9.99984 18.3333C7.91544 16.0513 6.73088 13.0899 6.6665 9.99996C6.73088 6.90999 7.91544 3.94859 9.99984 1.66663V1.66663Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="validationPopup__description-info">
            <p>Description</p>
            <p>The {{validator.description.moniker}} Validator for SmartContract chains</p>
            <a :href="validator.description.website">{{validator.description.website}}</a>
          </div>
        </div>
<!--        <span v-if="keplrResult">{{keplrResult}}</span>-->
        <div v-if="actionRedelegate" class="validationPopup__description">
          <label style="width: 100%" for="validators">
            <select v-model="redelegateTo" style="width: 100%"  id="validators" name="cars">
              <option :value="items" v-for="items in validators" :key="items">{{items.description.moniker}}</option>
            </select>
          </label>
<!--          <input type="" style="width: 100%; border: 1px solid #DFDFDF;border-radius: 6px; " v-model="amount">-->
        </div>
        <div class="validationPopup__description">
          <label style="width: 100%;" for="amount">
            <span v-for="item in keplrResult" :key="item">{{item}}</span>
            <input placeholder="import amount" autocomplete="off" style="width: 100%;" name="amount"  v-model="amount">
          </label>
        </div>
      </div>
      <div class="validationPopup__btnHolder" v-if="useUserStore().isLoggedIn" >
        <div class="validationPopup__btns" v-if="!actionRedelegate">
          <button @click="delegate({type : validator}, 'undelegate')">Undelegate</button>
          <button @click="delegate({type : validator}, 'delegate')">Delegate</button>
          <button @click="redelegateState(true)">Redelegate</button>
        </div>
        <div class="validationPopup__btns" v-if="actionRedelegate">
          <button @click="redelegateState(false)">Return</button>
          <button @click="redelegate">Redelegate</button>
        </div>
      </div>

      <div v-else class="validationPopup__btns">
        <p> Sorry Log in into Keplr </p>
        <button @click="useUserStore().fetchAccount()">Login</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onUnmounted, PropType } from "vue";
import {useUserStore} from "@/store/user.store";
import { Validator } from '@/models/validator';
import { transaction } from "@/models/transaction";
import {ref, defineEmits} from "vue";
import { useValidatorsStore } from "@/store/validators.store";
import { object, string, number, date, InferType, setLocale } from 'yup';
import { useToast } from "vue-toastification";

const props = defineProps({
  validator: {
    type: Object as PropType<Validator>,
    required: true
  },
});
document.body.style.overflow = "hidden";
onUnmounted(() => document.body.style.overflow = "auto");
const toast = useToast()

const redelegateTo = ref()
const validators = computed(() => {
    return useValidatorsStore().getValidators.validators.filter(element => element.operator_address !== props.validator.operator_address)
  // return props.validator.operator_address
  })
const actionRedelegate = ref(false)
const amount = ref('');
const keplrResult = ref('');
const emit = defineEmits(['close']);

let max = useUserStore().getUnstacked + useUserStore().getStacked + useUserStore().getBalances

setLocale({
  number: {
    lessThan: `must be less than ${max}`
  },
  mixed: {
    defined: `this is required field`,
    notType: `must be a number more than 0`,
  }
});

let amountSchema = object({
  value:
    number()
    .defined()
    .lessThan(useUserStore().getUnstacked + useUserStore().getStacked + useUserStore().getBalances)
});

async function delegate(_, type: string) {
  try {
    await amountSchema.validate(amount);
    const transaction: transaction = {
      validatorSrcAddress: props.validator.operator_address,
      amount: amount.value,
      type: type
    };
      await useUserStore().tokensTransaction(transaction).then((res) =>{
        emit('success', "success");
        toast.success('transaction passed')
      })
  } catch (err) {
    keplrResult.value = err.errors;
    toast.error('transaction failed')
  }
}

function redelegate(){
  if(!redelegateTo.value && amount.value === ''){
    keplrResult.value = 'please choose validator and ammount';
  } else {
    const transaction: transaction= {
      delegatorAddress: useUserStore().getAccount.address,
      address: props.validator.operator_address,
      validatorDstAddress: redelegateTo.value.operator_address,
      amount: amount.value,
      type: 'redelegate'
    };
    useUserStore().tokensTransaction(transaction)
  }
}
function redelegateState(state: boolean){
  actionRedelegate.value = state
}
</script>

<style scoped lang="scss">
.validationPopup{
  position: fixed;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  width: 100vw;
  height: 100vh;

  button{
    margin-left: 10px;
    border: 1px solid #72BF44;
    border-radius: 24px;
    background-color: #FFFFFF;
    width: 161px;
    padding:11px 24px 13px 24px;
    &:hover{
      background-color: #72BF44;
      color: #FFFFFF;
    }
  }
  &__background{
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: #0F3153;
    opacity: 0.85;
    z-index: -1;
  }
  &__holder{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    width: 800px;
    background-color: #FFFFFF;
    padding: 46px 20px 30px 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
    border-radius: 8px;
    opacity: 120%;
  }
  &__header{
    width: 100%;
    display: flex;
    justify-content: space-between;
    div{
      display: flex;
      align-items: baseline;
      justify-items: center;
      text-align: center;
      :nth-child(1){
        margin-right: 15px;
      }
    }
  }
  &__form{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 300px;
  }
  &__body{
    width: 100%;
  }
  &__description{
    width: 100%;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
    background: #FFFFFF;
    border-radius: 8px;
    padding: 22px;
    &-info{
      display: flex;
      flex-direction: column;
      align-items: flex-start;

    }
  }
  &__descriptionIcon{
    width: 50px;
    height: 50px;
    padding: 15px;
    background-color: #FFFFFF;
    border-radius: 50%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
  }
  &__btnHolder{
    width: 100%;
  }
  &__btns{
    margin-top: 10px;
    display: flex;
    width: 100%;
    justify-content: flex-end;

  }
}
</style>
