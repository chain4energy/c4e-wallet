<template>
  <div>
    <Dialog :visible="visible" @update:visible="emit('close')" modal :baseZIndex="-100" :style="{ width: '800px' }" :header="boost.pool_description">
      <LoginPopUp :showAddressOption="false" v-if="loginPopupStatus" @close="loginPopupStatus =! loginPopupStatus"/>


      <div class="validationPopup__header">
        <div class="validationPopup__headerDescription">
          <span>APY: {{boost.apy}}%</span>
          <span>Lock period: {{boost.lock_period}} days</span>
          <span>Pool usage:</span>
          <div v-if="boost.percentage_pool_usage">
            <div v-if="boost.percentage_pool_usage < 0.05" class="commision">
              <div class="level-1" :style="'flex-basis:' + (boost.percentage_pool_usage * 100).toFixed(2) + '%'"></div>
              <PercentsView class="level-border" :amount="boost.percentage_pool_usage" :precision="2"></PercentsView>
            </div>
            <div v-if="boost.percentage_pool_usage >= 0.05 && boost.percentage_pool_usage < 0.10" class="commision">
              <div class="level-2" :style="'flex-basis:' + (boost.percentage_pool_usage * 100).toFixed(2) + '%'"></div>
              <PercentsView class="level-border" :amount="boost.percentage_pool_usage" :precision="2"></PercentsView>
            </div>
            <div v-if="boost.percentage_pool_usage >= 0.10 && boost.percentage_pool_usage < 0.25" class="commision">
              <div class="level-3" :style="'flex-basis:' + (boost.percentage_pool_usage * 100).toFixed(2) + '%'"></div>
              <PercentsView class="level-border" :amount="boost.percentage_pool_usage" :precision="2"></PercentsView>
            </div>
            <div v-if="boost.percentage_pool_usage >= 0.25" class="commision">
              <div class="level-4" :style="'flex-basis:' + (boost.percentage_pool_usage * 100).toFixed(2) + '%'"></div>
              <PercentsView class="level-border" :amount="boost.percentage_pool_usage" :precision="2"></PercentsView>
            </div>
          </div>
        </div>
      </div>

      <div style="display: flex; justify-content: center">
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
      </div>


      <Form @submit="action" :validation-schema="baseSchema" v-slot="{ errors }" class="validationPopup__body" as="form">

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

<!--          <div class="validationPopup__description">-->
<!--            <StakingActionVue v-model="stakingAction" :disabled="!canModify" :redelegation-direction="redelegationDirection"/>-->
<!--          </div>-->
<!--          <div v-if="stakingAction === StakingAction.REDELEGATE" class="validationPopup__description">-->
<!--            <div class="field-local">-->
<!--              <Field v-model="redelegateValidator" placeholder=" " name="redelegateValidator" v-slot="{ field, handleChange }">-->
<!--                <StakingRedelegate :validator="validator" @update:modelValue="handleChange" :model-value="field.value"-->
<!--                                   :class="{ 'p-invalid': errors.redelegateValidator, 'is-invalid': errors.redelegateValidator }" :disabled="!canModify"-->
<!--                                   :redelegation-direction="redelegationDirection"/>-->
<!--              </Field>-->
<!--              &lt;!&ndash; <span>{{getRedelagatePlaceholder(redelegationDirection)}}</span> &ndash;&gt;-->
<!--              <div class="invalid-feedback">-->
<!--                {{ errors.redelegateValidator ? errors.redelegateValidator : "" }}-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->

          <div class="validationPopup__description">
            <div class="field">
              <Field
                v-model="amount"
                name="amount"
                placeholder=" "
                type="number"
                class="form-control"
                style="width: 100%;" :class="{ 'is-invalid': errors.amount }"
                :disabled="!canModify"></Field>
              <span>{{ $t('COMMON.INPUT.AMOUNT') }}</span>
              <div class="validationPopup__btn">
                <button type="button" disabled @click="() => {console.log('max')}">Max</button>
                <p>C4E</p>
              </div>

              <!--              <p style="text-align: left">-->
              <!--                commission ~ {{commissionForOperation.toFixed(2)}} c4e-->
              <!--              </p>-->
              <div class="invalid-feedback">
                {{ errors.amount ? errors.amount : "" }}
              </div>
              <transition name="slide-fade">
                <div v-if="showReserveCheckbox" class="validationPopup__reservationReq">
                  <input type="checkbox" v-model="reserveCoins"/>
                  <p>Reserve {{ fee + reservedCoins }} C4E for future transactions</p>
                </div>
              </transition>

            </div>

          </div>
        </div>

        <div class="validationPopup__btnHolder" v-if="canModify">
          <div class="validationPopup__btns">
            <div style="flex: 1 1;">
              <span>Amount to claim after time passes: <span style="font-weight: bold;">{{amount * (1+ boost.apy/100)}} C4E</span></span>
            </div>
            <Button class="validationPopup__button" disabled type="submit">
              <StakeManagementIcon icon="delegate"/>
              {{ $t('STAKING_VIEW.STAKING_POPUP.DELEGATE') }}
            </Button>
          </div>
        </div>
        <div v-else class="validationPopup__btns">
          {{ $t('ERRORS.CONNECT_WALLET') }}
          <Button v-if="!useUserStore().isLoggedIn" class="secondary" @click="loginPopupStatus =! loginPopupStatus">{{
              $t('COMMON.CONNECT')
            }}
          </Button>
        </div>
      </Form>

    </Dialog>
  </div>
</template>

<script setup lang="ts">

import Dialog from "primevue/dialog";
import {StakingAction} from "@/components/staking/StakingAction";
import {useConfigurationStore} from "@/store/configuration.store";
import {useUserStore} from "@/store/user.store";
import PercentsView from "@/components/commons/PercentsView.vue";
import WarningMessage from "@/components/commons/WarningMessage.vue";
import AmountView from "@/components/commons/AmountView.vue";
import LoginPopUp from "@/components/layout/loginPopup/LoginPopUp.vue";
import ValidatorLogo from "@/components/commons/ValidatorLogo.vue";
import {Field, Form} from "vee-validate";
import StakingRedelegate from "@/components/staking/StakingRedelegate.vue";
import StakingActionVue from "@/components/staking/StakingAction.vue";
import C4EIcon from "@/components/commons/C4EIcon.vue";
import StakeManagementIcon from "@/components/commons/StakeManagementIcon.vue";
import {computed, onUnmounted, ref, watch} from "vue";
import {Validator} from "@/models/store/validator";
import {object, setLocale, string} from "yup";
import i18n from "@/plugins/i18n";
import {YupSequentialStringSchema} from "@/utils/yup-utils";
import {RedelegationDirection} from "@/components/staking/StakingRedelegate";
import {BigDecimal} from "@/models/store/big.decimal";
import {formatBigNumberLocalized} from "@/utils/locale-number-formatter";
import {useValidatorsStore} from "@/store/validators.store";
import {Boost} from "@/models/store/boost";


const props = defineProps<{
  visible: boolean,
  boost: Boost,
}>();
const emit = defineEmits(['close', 'success']);


const loginPopupStatus = ref(false);
document.body.style.overflow = "hidden";
onUnmounted(() => {
  document.body.style.overflow = "auto";
});

const fee = ref(0);
const reserveCoins = ref(true);
const redelegateValidator = ref<Validator>();
const stakingAction = ref<StakingAction>(StakingAction.DELEGATE);

const canModify = computed<boolean>(() => {
  return useUserStore().isLoggedIn && useUserStore().connectionInfo.modifiable;
});

const amount = ref(0);
const usedGas = ref (0);
const showReserveCheckbox = ref(false);
const reservedCoins = useConfigurationStore().config.getConvertedAmount(useConfigurationStore().config.getReservedCoinsAmount());
const freeMultiplier = 1.2;

// const commissionForOperation = computed(() => {
//   return (Number(amount.value)/100) * Number(getPercents(props.validator.commission.rate)) || 0;
// });


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
    string().test('not-empty', i18n.global.t('STAKING_VIEW.STAKING_POPUP.AMOUNT.REQUIRED'), (value: string | undefined) => {
      return value ? value.length > 0 : false;
    }),
    string().matches(/^\d*(\.\d{0,6})?$/gm, i18n.global.t('STAKING_VIEW.STAKING_POPUP.AMOUNT.NUMBER', {decimal: useConfigurationStore().config.getViewDenomDecimals()})),
    string().test('delgation-moreThan', i18n.global.t('STAKING_VIEW.STAKING_POPUP.AMOUNT.MIN'), moreThan),
    string().test('delgation-lessThan', () => i18n.global.t('STAKING_VIEW.STAKING_POPUP.AMOUNT.MAX', {max: maxAmountMessageData()}), lessThanOrEqualTo)
  ])
});


// function getPercents(amount: bigint | number | BigDecimal) {
//
//   if (typeof amount === 'number') {
//     if (isNaN(amount)) {
//       return Number.NaN;
//     }
//     return amount * 100;
//   } else if (typeof amount === 'bigint') {
//     return amount * 100n;
//   } else {
//     return amount.multiply(100);
//   }
// }

function checkValue(value: string | undefined, check: (value: string) => boolean): boolean {
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
  return checkValue(value, (value: string) => (new BigDecimal(value)).isBiggerThan(0));
}

function lessThanOrEqualTo(value: string | undefined): boolean {
  return checkValue(value, (value: string) => {
    const factor = useConfigurationStore().config.getViewDenomConversionFactor();
    let lessThan;
    switch (stakingAction.value) {
      case StakingAction.DELEGATE:
        lessThan = useUserStore().getBalance;
        break;
      case StakingAction.UNDELEGATE:
        lessThan = props.validator.delegatedAmount;
        break;
      case StakingAction.REDELEGATE:
        props.redelegationDirection === RedelegationDirection.FROM ?
          lessThan = redelegateValidator.value?.delegatedAmount : lessThan = props.validator.delegatedAmount;
        break;
    }
    return (new BigDecimal(lessThan)).isBiggerThanOrEqualTo(new BigDecimal(value).multiply(factor));
  });

}

function maxAmountMessageData(): string {
  const amount = stakingAction.value === StakingAction.DELEGATE ?
    useConfigurationStore().config.getConvertedAmount(useUserStore().getBalance) :
    useConfigurationStore().config.getConvertedAmount(props.validator.delegatedAmount);
  return formatBigNumberLocalized(amount.toFixed(useConfigurationStore().config.getViewDenomDecimals()));
}

function action() {
  switch (stakingAction.value) {
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
  if (dst && usedGas.value !== 0 ) {
    await useUserStore().delegate(dst, amount.value, Math.ceil(usedGas.value))
      .then((resp) => {
        console.log(resp);
        emit('success');
      });
  } else if(dst && usedGas.value === 0){
    await useUserStore().delegate(dst, amount.value)
      .then((resp) => {
        console.log(resp);
        emit('success');
      });
  }
}


watch(reserveCoins, (next, prev) => {
  if (next) {
    amount.value -= Number(reservedCoins);
  } else {
    amount.value += Number(reservedCoins);
  }
});

watch(stakingAction, (next, prev) => {
  amount.value = 0;
  showReserveCheckbox.value = false;
});

// function reserveCoinsForFee(reserved: number, increase: boolean) {
//   const reserve = Number(Number(Number(amount.value) - reserved).toFixed(6));
//   amount.value = reserve;
// }

async function undelegate() {
  const dst = getValidatorDst();
  if (dst) {
    await useUserStore().undelegate(dst, amount.value).then(() => {
      emit('success');
    });
  } // TODO else
}

async function redelegate() {
  const dst = getValidatorDst(true);
  const src = getValidatorSrc(true);
  if (dst && src) {
    useUserStore().redelegate(src, dst, amount.value).then(() => {
      emit('success');
    });
  }
}

const amountToPass = computed(() => {
  let coins = [];
  coins.push(
    {amount: props.boost.lock_period, header: i18n.global.t('STAKING_VIEW.STAKING_POPUP.DELEGATED')},
    {amount: useUserStore().getBalance || 0, header: i18n.global.t('STAKING_VIEW.STAKING_POPUP.AVAILABLE_TO_DELEGATE')});
  return coins;
  /*
  switch (stakingAction.value) {
    case StakingAction.DELEGATE: {
      coins = [];
      coins.push(
        {amount: props.validator.delegatedAmount, header: i18n.global.t('STAKING_VIEW.STAKING_POPUP.DELEGATED')},
        {amount: useUserStore().getBalance || 0, header: i18n.global.t('STAKING_VIEW.STAKING_POPUP.AVAILABLE_TO_DELEGATE')});
      break;
    }
    case StakingAction.UNDELEGATE: {
      coins = [];
      coins.push({amount: props.validator.undelegatingAmount, header: i18n.global.t('STAKING_VIEW.STAKING_POPUP.UNDELEGATED')}, {
        amount: props.validator.delegatedAmount,
        header: i18n.global.t('STAKING_VIEW.STAKING_POPUP.DELEGATED')
      });
      break;
    }
    case StakingAction.REDELEGATE: {
      coins = [];
      coins.push({amount: props.validator.delegatedAmount, header: i18n.global.t('STAKING_VIEW.STAKING_POPUP.DELEGATED')});
      break;
    }
    default:
      coins = [];
      coins.push(0);
      break;
  }

   */
});

const timeToComplete = computed(() => {
  return useValidatorsStore().getParamsUnbondingTime;
});

// function getWarningParams() {
//   return {timeToComplete: useValidatorsStore().getParamsUnbondingTime};
// }
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.validationPopup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  width: 100vw;
  height: 100vh;

  .button {
    margin-left: 10px;
    border: 1px solid #72BF44;
    border-radius: 24px;
    background-color: #FFFFFF;
    width: 161px;
    padding: 11px 24px 13px 24px;

    &:hover {
      background-color: #72BF44;
      color: #FFFFFF;
    }
  }

  &__amount {
    padding: 5%;
    box-shadow: 0 4px 20px rgb(0 0 0 / 11%);
    background: #FFFFFF;
    border-radius: 8px;
  }

  &__background {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background: #0F3153;
    opacity: 0.85;
    z-index: -1;
  }

  &__holder {
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

  &__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  &__headerDescription {
    display: flex;
    flex-direction: column;
    margin: 0.5em;

    a {
      margin-left: 0.2em;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    height: 300px;
  }

  &__body {
    width: 100%;
  }

  &__description {
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

    &-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;

    }
  }

  &__btn {
    position: absolute;
    display: flex;
    justify-content: space-between;
    padding: 3px 0;
    max-height: 100%;
    align-items: baseline;
    text-align: center;
    top: 0;
    bottom: 0;
    right: 5%;

    button {
      background-color: #72BF44;
      color: white;
      border: 0;
      width: 58px;
      -webkit-appearance: none;
      margin-right: 10px;
      border-radius: 10px;
      padding: 5px;

      &:hover {
        background-color: #72BF44;
        color: #FFFFFF;
      }
    }
  }

  &__reservationReq {
    display: flex;
    flex-direction: row;
    align-items: center;

    p {
      margin: 0 5px;
    }
  }

  &__descriptionIcon {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    border-radius: 50%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
  }

  &__btnHolder {
    width: 100%;
  }

  &__btns {
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


.field-local { // TODO somehow take  global class: field
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
    padding: 15px;
    max-width: 700px;
    pointer-events: none;
    position: absolute;
    float: left;
    text-align: left;
    left: 0;
    top: 0;
    transition: 0.2s;
    transition-timing-function: ease;
    transition-timing-function: cubic-bezier(0.25, 0.1, 0.25, 1);
    opacity: 0.5;
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
    opacity: 1;
    transform: scale(0.75) translateY(-100%) translateX(-20%);
  }

  /* Internet Explorer i Edge*/
  input:focus + span, input:not(:-ms-input-placeholder) + span {
    opacity: 1;
    transform: scale(0.75) translateY(-100%) translateX(-20%);
  }

  select:focus + span, select:valid + span {
    opacity: 1;
    transform: scale(0.75) translateY(-100%) translateX(-20%);
  }

  select:disabled + span, select:valid + span {
    opacity: 1;
    transform: scale(0.75) translateY(-100%) translateX(-20%);
  }

  /* Internet Explorer i Edge*/
  select:focus + span, select:not(:-ms-input-placeholder) + span {
    opacity: 1;
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
  background-image: url('@/assets/err.png');
  background-repeat: no-repeat;
}

.slide-fade-enter-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  animation: appear .3s;
}

.slide-fade-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  animation: appear .3s reverse;
}

.commision {
  width: 100%;
  box-sizing: border-box;
  height: 28px;
  border: 1px solid grey;
  border-radius: 15px;
  display: flex;
  overflow: hidden;
  position: relative;

  span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
  }
}

.level-border {
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  color: white;
  font-weight: bold;
}

.level-1 {
  background: $consumption-red;
  color: white;
}

.level-2 {
  background: $accents-light-warning;
  color: black;

}

.level-3 {
  background: $main-lighter-color;
  color: white;
}

.level-4 {
  background: $secondary-color;
  color: white;
}
</style>
