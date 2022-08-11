<template>
  <div class="validationPopup">
    <div class="validationPopup__background"></div>
    <div class="validationPopup__holder">
      <div class="validationPopup__header">
        <div>
          <ValidatorLogo :validator="validator" class="validator-image-big"></ValidatorLogo>
          <h2>{{ validator.description.moniker }}</h2>
        </div>
        <StakingWarning v-if="stakingAction !== StakingAction.REDELEGATE" :action="stakingAction"/>
          <Button icon="pi pi-times" style="width: 5px; margin-bottom: 0.5rem" @click="$emit('close')" class="p-button-rounded p-button-secondary p-button-text" />
      </div>

      <Form @submit="action" :validation-schema="baseSchema" v-slot="{ errors }" class="validationPopup__body">

        <div class="validationPopup__body">
          <h3>{{ $t('STAKING_VIEW.STAKING_POPUP.HEADER') }}</h3>
          <!--<div class="validationPopup__description">
            <div class="validationPopup__descriptionIcon">
              <Icon name="Globe"></Icon>
            </div>
            <div class="validationPopup__description-info">
              <p>{{ $t('COMMON.DESCRIPTION') }}</p>
              <p>{{ $t('COMMON.THE') }} {{validator.description.moniker}} {{ $t('STAKING_VIEW.STAKING_POPUP.VALIDATOR_DESCRIPTION') }}</p>
              <a :href="validator.description.website">{{validator.description.website}}</a>
            </div>
          </div>-->
          <CoinAmount
            :coins="amountToPass"
            :show-denom="true"
            :precision="4"
            :orig-denom="useConfigurationStore().config.getViewDenom()"
            :reduce-big-number="false">
            <template v-slot:logo>
              <div class="userdata__icon">
                <svg width="29" height="30" viewBox="0 0 29 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.268 27.8207C11.4745 27.8139 8.74571 26.9973 6.42638 25.4741C4.10705 23.9509 2.30123 21.7894 1.23702 19.2627C0.172818 16.7359 -0.102009 13.9573 0.447245 11.2779C0.996499 8.59846 2.34519 6.13838 4.32296 4.20841C6.30073 2.27844 8.81884 0.965187 11.5592 0.434548C14.2995 -0.0960907 17.1392 0.179693 19.7194 1.22705C22.2996 2.27441 24.5046 4.04637 26.0559 6.31907C27.6071 8.59177 28.4351 11.2632 28.4351 13.996C28.4258 17.6657 26.929 21.182 24.2732 23.7736C21.6174 26.3653 18.0192 27.8207 14.268 27.8207ZM14.268 1.22863C11.6881 1.23469 9.16786 1.98862 7.02574 3.3952C4.88362 4.80178 3.21571 6.79789 2.23271 9.13136C1.2497 11.4648 0.99571 14.031 1.50282 16.5056C2.00993 18.9802 3.25539 21.2522 5.08186 23.0347C6.90833 24.8172 9.23387 26.0302 11.7647 26.5203C14.2955 27.0105 16.918 26.7559 19.301 25.7886C21.6839 24.8214 23.7204 23.185 25.1531 21.086C26.5858 18.9871 27.3504 16.5199 27.3504 13.996C27.3421 10.6071 25.9602 7.35972 23.5076 4.96624C21.0551 2.57277 17.7323 1.22862 14.268 1.22863Z" fill="#0F3153"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M6.84768 4.82898C6.84768 5.29619 6.71115 5.75293 6.45536 6.14141C6.19956 6.52988 5.83601 6.83266 5.41064 7.01146C4.98527 7.19025 4.51721 7.23704 4.06564 7.1459C3.61408 7.05474 3.19928 6.82975 2.87372 6.49938C2.54815 6.169 2.32645 5.74809 2.23663 5.28985C2.1468 4.8316 2.1929 4.35662 2.36909 3.92497C2.54529 3.49332 2.84365 3.12437 3.22647 2.8648C3.60929 2.60523 4.05937 2.46667 4.51979 2.46667C5.13719 2.46667 5.7293 2.71556 6.16586 3.15857C6.60243 3.60159 6.84768 4.20245 6.84768 4.82898Z" fill="#0F3153"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6658 27.1787C14.6658 27.6459 14.5293 28.1026 14.2735 28.4911C14.0177 28.8796 13.6541 29.1824 13.2288 29.3612C12.8034 29.54 12.3353 29.5868 11.8838 29.4956C11.4322 29.4045 11.0174 29.1795 10.6918 28.8491C10.3663 28.5187 10.1446 28.0978 10.0547 27.6396C9.96492 27.1813 10.011 26.7063 10.1872 26.2747C10.3634 25.843 10.6618 25.4741 11.0446 25.2145C11.4274 24.9549 11.8775 24.8164 12.3379 24.8164C12.9553 24.8164 13.5474 25.0653 13.984 25.5083C14.4205 25.9513 14.6658 26.5522 14.6658 27.1787Z" fill="#0F3153"/>
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M28.971 9.56161C28.971 10.0288 28.8345 10.4855 28.5787 10.874C28.3229 11.2625 27.9593 11.5653 27.5339 11.7441C27.1086 11.9229 26.6405 11.9697 26.1889 11.8785C25.7374 11.7874 25.3226 11.5624 24.997 11.232C24.6714 10.9016 24.4497 10.4807 24.3599 10.0225C24.2701 9.56423 24.3162 9.08925 24.4924 8.65759C24.6686 8.22594 24.967 7.857 25.3498 7.59742C25.7326 7.33785 26.1827 7.19931 26.6431 7.19931C27.2605 7.19931 27.8526 7.44819 28.2892 7.89121C28.7257 8.33423 28.971 8.93509 28.971 9.56161Z" fill="#0F3153"/>
                  <path d="M17.9726 22.255C18.9363 21.7668 19.801 21.099 20.5216 20.2865V8.6482C19.802 7.83464 18.9371 7.16668 17.9726 6.67961V13.8886H10.2401V6.73867C9.2812 7.2409 8.42326 7.92057 7.71045 8.74268V15.1918C7.71074 15.3632 7.74367 15.533 7.80744 15.6918C7.87076 15.8452 7.96153 15.9854 8.07515 16.1052C8.18719 16.2189 8.31866 16.3109 8.46314 16.3769C8.62318 16.4486 8.79645 16.4848 8.97139 16.4832H17.9571L17.9726 22.255Z" fill="#0F3153"/>
                </svg>
              </div>
            </template>

          </CoinAmount>
          <div class="validationPopup__description">
            <StakingActionVue v-model="stakingAction" :disabled="!canModify"/>
          </div>
          <div v-if="stakingAction === StakingAction.REDELEGATE" class="validationPopup__description">
            <div class="field-local">
              <Field v-model="redelegateTo" placeholder=" " name="redelegateTo" v-slot="{ field, handleChange }"  >
                <StakingRedelegate :validator="validator" @update:modelValue="handleChange" :model-value="field.value" :class="{ 'p-invalid': errors.redelegateTo, 'is-invalid': errors.redelegateTo }" :disabled="!canModify"/>
              </Field>
              <span>{{$t('STAKING_VIEW.STAKING_POPUP.INPUT.REDELEGATE_VALIDATOR')}}</span>
              <div class="invalid-feedback">
                {{ errors.redelegateTo ? errors.redelegateTo : "" }}
              </div>
            </div>
          </div>

          <div class="validationPopup__description">
            <div class="field">
              <Field v-model="amount" name="amount" placeholder=" " type="text" class="form-control" style="width: 100%;" :class="{ 'is-invalid': errors.amount }" :disabled="!canModify"></Field>
              <span>{{$t('COMMON.INPUT.AMOUNT')}}</span>
              <div class="invalid-feedback">
                {{ errors.amount ? errors.amount : "" }}
              </div>
            </div>
          </div>
        </div>
        <div class="validationPopup__btnHolder" v-if="canModify" >
          <div class="validationPopup__btns" >
            <Button v-if="stakingAction === StakingAction.DELEGATE" type="submit">
              <StakeManagementIcon icon="delegate"/>
              {{$t('STAKING_VIEW.STAKING_POPUP.DELEGATE')}}
            </Button>
            <Button v-if="stakingAction === StakingAction.UNDELEGATE" type="submit">
              <StakeManagementIcon icon="undelegate"/>
              {{$t('STAKING_VIEW.STAKING_POPUP.UNDELEGATE')}}
            </Button>
            <Button v-if="stakingAction === StakingAction.REDELEGATE" type="submit">
              <StakeManagementIcon icon="redelegate"/>
              {{$t('STAKING_VIEW.STAKING_POPUP.REDELEGATE')}}
            </Button>
          </div>
        </div>
        <div v-else class="validationPopup__btns">
          {{ $t('ERRORS.CONNECT_WALLET')}}
          <Button @click="dataService.onKeplrLogIn()">
          <KeplrLogo/> {{ $t('CONNECT.CONNECT' )}}
          </Button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import {useUserStore} from "@/store/user.store";
import { Validator } from "@/models/store/validator";
import { object, setLocale, string, ValidationError } from "yup";
import dataService from '@/services/data.service';
import { BigDecimal } from "@/models/store/big.decimal";
import { useConfigurationStore } from "@/store/configuration.store";
import i18n from "@/plugins/i18n";
import ValidatorLogo from "../commons/ValidatorLogo.vue";
import {Field, Form} from "vee-validate";
import { YupSequentialStringSchema } from "@/utils/yup-utils";
import StakeManagementIcon from "../commons/StakeManagementIcon.vue";
import KeplrLogo from "../commons/KeplrLogo.vue";
import StakingActionVue from "./StakingAction.vue";
import { StakingAction } from "./StakingAction";
import StakingRedelegate from "./StakingRedelegate.vue";
import StakingWarning from "@/components/commons/StakingWarning.vue";
import CoinAmount from "@/components/commons/CoinAmount.vue";

const emit = defineEmits(['close', 'success']);

const props = defineProps<{
  validator: Validator
}>();

document.body.style.overflow = "hidden";
onUnmounted(() => {
  document.body.style.overflow = "auto";
});


const redelegateTo = ref<Validator>();
const stakingAction = ref<StakingAction>(StakingAction.DELEGATE);

const canModify = computed<boolean>(() => {
  return useUserStore().isLoggedIn && useUserStore().connectionInfo.modifiable;
  });

const amount = ref('');


setLocale({
  mixed: {
    defined: i18n.global.t('STAKING_VIEW.STAKING_POPUP.AMOUNT.REQUIRED'),
  }
});

const baseSchema = object().shape({
  redelegateTo: object().nullable().test('validator', i18n.global.t('STAKING_VIEW.STAKING_POPUP.VALIDATOR.REQUIRED'), (value: any) => {
    return stakingAction.value === StakingAction.REDELEGATE ? value ? true : false : true;
  }),
  amount: YupSequentialStringSchema([string().defined(),
      string().test('not-empty', i18n.global.t('STAKING_VIEW.STAKING_POPUP.AMOUNT.REQUIRED'), (value: string | undefined) => {return value ? value.length > 0 : false;}),
      string().matches(/^\d*(\.\d{0,6})?$/gm, i18n.global.t('STAKING_VIEW.STAKING_POPUP.AMOUNT.NUMBER', {decimal: useConfigurationStore().config.getViewDenomDecimals()})),
      string().test('delgation-moreThan', i18n.global.t('STAKING_VIEW.STAKING_POPUP.AMOUNT.MIN'), moreThan),
      string().test('delgation-lessThan', () => i18n.global.t('STAKING_VIEW.STAKING_POPUP.AMOUNT.MAX', {max:maxAmountMessageData()}), lessThanOrEqualTo)
    ])
});

function checkValue(value: string | undefined, check: (value:  string) => boolean): boolean {
  if (!value) {
    return false;
  }
  try {
    return check(value);
  } catch (err) {
    return false;
  }
}

function moreThan(value: string | undefined): boolean {
  return checkValue(value, (value:  string) => (new BigDecimal(value)).isBiggerThan(0));
}

function lessThanOrEqualTo(value: string | undefined): boolean {
  return checkValue(value, (value:  string) => {
    const factor = useConfigurationStore().config.getViewDenomConversionFactor();
    const lessThan = stakingAction.value === StakingAction.DELEGATE ? useUserStore().getBalance : props.validator.delegatedAmount;
    return (new BigDecimal(lessThan)).isBiggerThan(new BigDecimal(value).multiply(factor));
  });
}

function maxAmountMessageData(): string {
  return stakingAction.value === StakingAction.DELEGATE ?
      useUserStore().getBalanceViewAmount(useConfigurationStore().config.getViewDenomDecimals()) :
      props.validator.getDelegatedViewAmount(useConfigurationStore().config.getViewDenomDecimals());
}

function action() {
  switch(stakingAction.value) {
    case StakingAction.DELEGATE: {
      delegate();
      break;
    }
    case StakingAction.UNDELEGATE: {
      undelegate();
      break;
    }
    case StakingAction.REDELEGATE: {
      redelegate();
      break;
    }
  }
}

async function delegate() {
  await useUserStore().delegate(props.validator.operatorAddress, amount.value)
    .then((resp) => {
      console.log(resp);
      emit('success');
    });
}

async function undelegate() {
  await useUserStore().undelegate(props.validator.operatorAddress, amount.value).then((resp) => {
      emit('success');
    });
}

async function redelegate() {
  if (redelegateTo.value) {
    useUserStore().redelegate(props.validator.operatorAddress, redelegateTo.value.operatorAddress, String(amount.value)).then((resp) => {
      emit('success');
    });
  }
}
const amountToPass = computed(() => {
  let coins = [];
  switch(stakingAction.value) {
    case StakingAction.DELEGATE: {
      coins = [];
      coins.push({
        amount: props.validator.delegatedAmount, header: i18n.global.t('STAKING_VIEW.STAKING_POPUP.DELEGATED')},
        {amount: useUserStore().getBalance|| 0, header:  i18n.global.t('STAKING_VIEW.STAKING_POPUP.AVAILABLE_TO_DELEGATE')});
      break;
    }
    case StakingAction.UNDELEGATE: {
      coins = [];
      coins.push({amount: props.validator.undelegatingAmount, header: i18n.global.t('STAKING_VIEW.STAKING_POPUP.UNDELEGATED')}, {amount: props.validator.delegatedAmount, header: i18n.global.t('STAKING_VIEW.STAKING_POPUP.DELEGATED')});
      break;
    }
    case StakingAction.REDELEGATE: {
      coins = [];
      coins.push({amount: props.validator.delegatedAmount, header: i18n.global.t('STAKING_VIEW.STAKING_POPUP.DELEGATED')});
      break;
    }
    default: coins = []; coins.push(0);
    break;
  }
  return coins;
});
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
    position: relative;
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
    display: flex;
    align-items: center;
    justify-content: center;
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
    align-items: center;
  }
}

.validator-image-small {
  height: 18px;
  width: 18px;
}

.validator-image-big {
  height: 3.5rem;
  width: 3.5rem;
}


.field-local  {  // TODO somehow take  global class: field
  position: relative;
  margin-top: 10px;
  width: 100%;


  input {
    padding: 15px;
    border-radius: 15px;
    height: 40px;
  }

  select {
    padding: 15px;
    border-radius: 15px;
  }

  span {
    padding:15px;
    max-width: 700px;
    pointer-events: none;
    position:absolute;
    float: left;
    text-align: left;
    left:0;
    top:0;
    transition: 0.2s;
    transition-timing-function: ease;
    transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
    opacity:0.5;
  }

  .tooltip-icon {
    top: 0;
    left: -50px;
    position: absolute;
    padding: 16px;
    display: inline-block;
    cursor: pointer;
  }

  input:focus + span, input:not(:placeholder-shown) + span {
    opacity:1;
    transform: scale(0.75) translateY(-100%) translateX(-20%);
  }

  /* Internet Explorer i Edge*/
  input:focus + span, input:not(:-ms-input-placeholder) + span {
    opacity:1;
    transform: scale(0.75) translateY(-100%) translateX(-20%);
  }

  select:focus + span, select:valid + span {
    opacity:1;
    transform: scale(0.75) translateY(-100%) translateX(-20%);
  }

  select:disabled + span, select:valid + span {
    opacity:1;
    transform: scale(0.75) translateY(-100%) translateX(-20%);
  }

  /* Internet Explorer i Edge*/
  select:focus + span, select:not(:-ms-input-placeholder) + span {
    opacity:1;
    transform: scale(0.75) translateY(-100%) translateX(-20%);
  }
}

.p-dropdown {
  width: 200px !important;
}

.p-dropdown .p-dropdown-trigger {
  margin: auto 0 !important;
}

.p-dropdown {
  width: 100% !important;
}

@media (max-width: 550px) {
  .field {
    span {
      width: 280px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    input:focus + span, input:not(:placeholder-shown) + span {
      overflow: visible;

    }

    /* Internet Explorer i Edge*/
    input:focus + span, input:not(:-ms-input-placeholder) + span {
      overflow: visible;
    }

    select:focus + span, select:valid + span {
      overflow: visible;
    }

    /* Internet Explorer i Edge*/
    select:focus + span, select:not(:-ms-input-placeholder) + span {
      overflow: visible;
    }
  }
}

.dropdown-option {
  float: left;
}
.p-invalid {
  background-image: url("data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 12 12\" width=\"12\" height=\"12\" fill=\"none\" stroke=\"#dc3545\"><circle cx=\"6\" cy=\"6\" r=\"4.5\"/><path stroke-linejoin=\"round\" d=\"M5.8 3.6h.4L6 6.5z\"/><circle cx=\"6\" cy=\"8.2\" r=\".6\" fill=\"#dc3545\" stroke=\"none\"/></svg>");
}
</style>
