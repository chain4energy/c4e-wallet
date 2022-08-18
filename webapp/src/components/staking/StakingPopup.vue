<template>
  <div class="validationPopup">
    <div class="validationPopup__background"></div>
    <div class="validationPopup__holder">
      <div class="validationPopup__header">
        <div class="validationPopup__headerDescription">
          <ValidatorLogo :validator="validator" class="validator-image-big"></ValidatorLogo>
          <div style="display: flex; flex-direction: column">
            <h2>{{ validator.description.moniker }}</h2>
            <div style="display: flex;">
              <p>commission</p>
              <percents-view :amount="validator.commission.rate"></percents-view>
            </div>
          </div>

          <div class="validationPopup__headerDescription">
            <Icon name="Globe"></Icon>
            <a :href="validator.description.website" target="_blank">{{ $t('STAKING_VIEW.STAKING_POPUP.WEBSITE') }}</a>
          </div>
        </div>
        <Button icon="pi pi-times" style="width: 5px; margin-bottom: 0.5rem" @click="$emit('close')" class="p-button-rounded p-button-secondary p-button-text" />
      </div>
        <WarningMessage v-if="stakingAction === StakingAction.DELEGATE"
              header="STAKING_VIEW.STAKING_POPUP.WARNINGS.DELEGATIONS.HEADER"
              :header-variables="{timeToComplete: timeToComplete}"
              texts="STAKING_VIEW.STAKING_POPUP.WARNINGS.DELEGATIONS.TEXT"
              :texts-variables="{timeToComplete: timeToComplete}"/>
        <WarningMessage v-else-if="stakingAction === StakingAction.UNDELEGATE"
              header="STAKING_VIEW.STAKING_POPUP.WARNINGS.UNDELEGATIONS.HEADER"
              :header-variables="{timeToComplete: timeToComplete}"
              texts="STAKING_VIEW.STAKING_POPUP.WARNINGS.UNDELEGATIONS.TEXTS"
              :texts-variables="{timeToComplete: timeToComplete}"/>

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
          <AmountView
            class="validationPopup__amount"
            :coins="amountToPass"
            :show-denom="true"
            :precision="4"
            :orig-denom="useConfigurationStore().config.getConvertedDenom()"
            :reduce-big-number="false">
            <template v-slot:logo-front>
              <C4EIcon icon="c4e-circle" size="30"/>
            </template>

          </AmountView>
          <div class="validationPopup__description">
            <StakingActionVue v-model="stakingAction" :disabled="!canModify" :redelegation-direction="redelegationDirection"/>
          </div>
          <div v-if="stakingAction === StakingAction.REDELEGATE" class="validationPopup__description">
            <div class="field-local">
              <Field v-model="redelegateValidator" placeholder=" " name="redelegateValidator" v-slot="{ field, handleChange }"  >
                <StakingRedelegate :validator="validator" @update:modelValue="handleChange" :model-value="field.value"
                          :class="{ 'p-invalid': errors.redelegateValidator, 'is-invalid': errors.redelegateValidator }" :disabled="!canModify"
                          :redelegation-direction="redelegationDirection"/>
              </Field>
              <!-- <span>{{getRedelagatePlaceholder(redelegationDirection)}}</span> -->
              <div class="invalid-feedback">
                {{ errors.redelegateValidator ? errors.redelegateValidator : "" }}
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
import { RedelegationDirection, getRedelagatePlaceholder } from "./StakingRedelegate";
import WarningMessage from "@/components/commons/WarningMessage.vue";
import AmountView from "@/components/commons/AmountView.vue";
import C4EIcon from "../commons/C4EIcon.vue";
import { useValidatorsStore } from "@/store/validators.store";
import { formatBigNumberLocalized } from "@/utils/locale-number-formatter";
import PercentsView from "@/components/commons/PercentsView.vue";

const emit = defineEmits(['close', 'success']);

const props = defineProps<{
  validator: Validator,
  redelegationDirection: RedelegationDirection
}>();

document.body.style.overflow = "hidden";
onUnmounted(() => {
  document.body.style.overflow = "auto";
});


const redelegateValidator = ref<Validator>();
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
  redelegateValidator: object().nullable().test('validator', i18n.global.t('STAKING_VIEW.STAKING_POPUP.VALIDATOR.REQUIRED'), (value: any) => {
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
  const amount = stakingAction.value === StakingAction.DELEGATE ?
    useConfigurationStore().config.getConvertedAmount(useUserStore().getBalance) :
    useConfigurationStore().config.getConvertedAmount(props.validator.delegatedAmount);
  return formatBigNumberLocalized(amount.toFixed(useConfigurationStore().config.getViewDenomDecimals()));
}

function action() {
  switch(stakingAction.value) {
    case StakingAction.DELEGATE: {
      delegate()
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

function getValidatorDst(isRedelegate = false) {

  if (!isRedelegate || props.redelegationDirection === RedelegationDirection.FROM) {
    return props.validator.operatorAddress;
  }
  return redelegateValidator.value?.operatorAddress;
}

function getValidatorSrc(isRedelegate = false) {
  if (isRedelegate && props.redelegationDirection === RedelegationDirection.FROM) {
    return redelegateValidator.value?.operatorAddress;
  }
  return props.validator.operatorAddress;
}

async function delegate() {
  const dst = getValidatorDst();
  if (dst) {
  await useUserStore().delegate(dst, amount.value)
    .then((resp) => {
      console.log(resp)
      emit('success');
    });
  } // TODO else
}

async function undelegate() {
  const dst = getValidatorDst();
  if (dst) {
    await useUserStore().undelegate(dst, amount.value).then((resp) => {
      emit('success')
    });
  } // TODO else
}

async function redelegate() {
  const dst = getValidatorDst(true);
  const src = getValidatorSrc(true);
  if (dst && src) {
    useUserStore().redelegate(src, dst, String(amount.value)).then((resp) => {
      emit('success')
    });
  }
}
const amountToPass = computed(() => {
  let coins = [];
  switch(stakingAction.value) {
    case StakingAction.DELEGATE: {
      coins = [];
      coins.push(
        {amount: props.validator.delegatedAmount, header: i18n.global.t('STAKING_VIEW.STAKING_POPUP.DELEGATED')},
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

const timeToComplete = computed(() => {
  return useValidatorsStore().getParamsUnbondingTime;
})

function getWarningParams() {
  return {timeToComplete: useValidatorsStore().getParamsUnbondingTime}
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
  &__amount{
    padding:5%;
    box-shadow: 0 4px 20px rgb(0 0 0 / 11%);
    background: #FFFFFF;
    border-radius: 8px;
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
  }
  &__headerDescription{
    display: flex;

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
