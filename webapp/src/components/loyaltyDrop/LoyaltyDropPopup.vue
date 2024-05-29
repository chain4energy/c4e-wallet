<template>
  <div>
    <Dialog :visible="visible" @update:visible="emit('close')" modal :style="{ width: '800px', 'z-index': '100' }" :header="boost.poolDescription">
      <LoginPopUp :showAddressOption="false" v-if="loginPopupStatus" @close="loginPopupStatus =! loginPopupStatus"/>

      <div class="boostDetails__header">
          <div class="boostDetails__header__tile" >
            <h3>{{$t('BOOST.COMMON.LOCKUP_PERIOD')}}:</h3>
            <h4>{{ msToDays(boost.lockupPeriod) }} {{$t('BOOST.COMMON.DAYS')}}</h4>
          </div>
          <div class="boostDetails__header__tile" >
            <h3>{{$t('BOOST.COMMON.APR')}}:</h3>
            <h4>{{(calculateApr(boost)).toFixed(2)}}%</h4>
          </div>
          <div class="boostDetails__header__tile" >
            <h3>{{$t('BOOST.COMMON.POOL_USAGE')}}:</h3>
            <CoinAmount :amount="poolUsage" :show-tooltip="true" tooltip-only style="width:90%; margin-bottom: 10px;">
              <div v-if="percentagePoolUsage">
                <div v-if="percentagePoolUsage.isBiggerThanOrEqualTo(0.90)" class="commision">
                  <div class="level-1" :style="'flex-basis:' + (percentagePoolUsage).multiply(100).toFixed(2) + '%'"></div>
                  <PercentsView class="level-border" :amount="percentagePoolUsage" :precision="2"></PercentsView>
                </div>
                <div v-if="percentagePoolUsage.isBiggerThanOrEqualTo(0.80) && !percentagePoolUsage.isBiggerThanOrEqualTo(0.90)" class="commision">
                  <div class="level-2" :style="'flex-basis:' + (percentagePoolUsage).multiply(100).toFixed(2) + '%'"></div>
                  <PercentsView class="level-border" :amount="percentagePoolUsage" :precision="2"></PercentsView>
                </div>
                <div v-if="percentagePoolUsage.isBiggerThanOrEqualTo(0.70) && !percentagePoolUsage.isBiggerThanOrEqualTo(0.80)" class="commision">
                  <div class="level-3" :style="'flex-basis:' + (percentagePoolUsage).multiply(100).toFixed(2) + '%'"></div>
                  <PercentsView class="level-border" :amount="percentagePoolUsage" :precision="2"></PercentsView>
                </div>
                <div v-if="!percentagePoolUsage.isBiggerThanOrEqualTo(0.70)" class="commision">
                  <div class="level-4" :style="'flex-basis:' + (percentagePoolUsage).multiply(100).toFixed(2) + '%'"></div>
                  <PercentsView class="level-border" :amount="percentagePoolUsage" :precision="2"></PercentsView>
                </div>
              </div>
              <span v-else>updating</span>
            </CoinAmount>          </div>
        </div>

      <div style="display: flex; justify-content: center; margin: 10px auto">
        <InfoMessage
                        header="BOOST.POPUP.INFO_HEADER"
                        :header-variables="{timeToComplete: msToDays(boost.lockupPeriod)}"
                        :texts="['BOOST.POPUP.INFO_TEXT_1',
                        'BOOST.POPUP.INFO_TEXT_2',
                        'BOOST.POPUP.INFO_TEXT_3']"

        />
        <!--        'BOOST.POPUP.INFO_TEXT'+-->
      </div>
<!--      <div style="display: flex; justify-content: center; margin: 10px auto">-->
<!--        <div style="display: flex; justify-content: center; flex-direction: column;">-->
<!--          <span>1.	Opting for a longer staking period will earn a better APR.</span>-->
<!--          <span>2.	All rewards are paid in C4E in weekly cycles and automatically sent to wallets.</span>-->
<!--          <span>3.	Users are not allowed to unstake their staked tokens until the redemption period is over.</span>-->
<!--        </div>-->
<!--      </div>-->
      <Form @submit="action"  :validation-schema="baseSchema" v-slot="{ errors }" class="validationPopup__body" as="form">
        <div class="validationPopup__body">
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
                <button type="button" @click="amount = getMax()">Max</button>
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
                  <p>{{$t('BOOST.COMMON.RESERVE', {amount: fee+reservedCoins})}}</p>
                </div>
              </transition>

            </div>

          </div>
        </div>
        <div class="validationPopup__btnHolder" v-if="canModify">
          <div class="validationPopup__btns">
            <div style="flex: 1 1;">
              <span>{{$t('BOOST.POPUP.AMOUNT')}}:
<!--                <span style="font-weight: bold;">{{calculateReward(boost,amount).toFixed(4)}} C4EE</span>-->
                <CoinAmount :amount="calculateReward(boost,amount)" :show-denom="true" :show-tooltip="true" :reduce-big-number="true" :precision="2"/>
              </span>
            </div>
            <Button class="validationPopup__button" type="submit">
              <StakeManagementIcon icon="delegate"/>
              {{ $t('BOOST.POPUP.LOCK_C4E') }}
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
import AmountView from "@/components/commons/AmountView.vue";
import LoginPopUp from "@/components/layout/loginPopup/LoginPopUp.vue";
import {Field, Form} from "vee-validate";import C4EIcon from "@/components/commons/C4EIcon.vue";
import StakeManagementIcon from "@/components/commons/StakeManagementIcon.vue";
import {computed, onUnmounted, ref, watch} from "vue";
import {object, setLocale, string} from "yup";
import i18n from "@/plugins/i18n";
import {YupSequentialStringSchema} from "@/utils/yup-utils";
import {BigDecimal, divideBigInts} from "@/models/store/big.decimal";
import {LoyaltyDropPoolConfig} from "@/models/store/loyaltyDrop";
import InfoMessage from "@/components/commons/InfoMessage.vue";
import CoinAmount from "@/components/commons/CoinAmount.vue";
import {Coin} from "@/models/store/common";


const props = defineProps<{
  visible: boolean,
  boost: LoyaltyDropPoolConfig,
}>();
const emit = defineEmits(['close', 'success']);


const loginPopupStatus = ref(false);
document.body.style.overflow = "hidden";
onUnmounted(() => {
  document.body.style.overflow = "auto";
});

const fee = ref(0);
const reserveCoins = ref(true);
const stakingAction = ref<StakingAction>(StakingAction.DELEGATE);

const canModify = computed<boolean>(() => {
  return useUserStore().isLoggedIn && useUserStore().connectionInfo.modifiable;
});

const poolUsage = computed(()=>{
  return calculatePoolUsageTokens(props.boost);
});

const percentagePoolUsage = computed(()=>{
  return calculatePercentagePoolUsage(props.boost);
});

const amount = ref<number>(0);
const showReserveCheckbox = ref(false);
const reservedCoins = useConfigurationStore().config.getConvertedAmount(useConfigurationStore().config.getReservedCoinsAmount());
import dataService from "@/services/data.service";
import {formatBigNumberLocalized} from "@/utils/locale-number-formatter";
import {RedelegationDirection} from "@/components/staking/StakingRedelegate";
import {calculateApr, calculateReward} from "@/components/loyaltyDrop/LoialtyDropUtil";

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
    return stakingAction.value === StakingAction.REDELEGATE ? !!value : true;
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

async function action() {
  await dataService.onCreateVestingPoolLoyaltyDrop("ld-" + Math.floor(Math.random() * 100000), amount.value,
    props.boost.epochPeriod * props.boost.epochNumber / 1000, props.boost.vestingType, () => {
      emit('close');
    });
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

function getMax() {

  const spendables = useUserStore().getSpendableBalance;
  let retValue = Number(useConfigurationStore().config.getConvertedAmount(spendables ? spendables : 0)) - Number(reservedCoins);
  if (retValue < 0) {
    retValue = 0;
  }
  const remainingTokens = Number(useConfigurationStore().config.getConvertedAmount(props.boost.baseTokens.amount - props.boost.usedTokens.amount - props.boost.reservedTokens.amount));
  if (remainingTokens < retValue) {
    retValue = remainingTokens;
  }
  console.log('GetMax: remainingTokens=' + remainingTokens + ' retValue=' + retValue);
  return retValue;
}


const amountToPass = computed(() => {
  let coins = [];
  coins.push(
    {amount: useUserStore().getSpendableBalance || 0, header: i18n.global.t('BOOST.POPUP.SPENDABLE')});
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

function calculatePoolUsageTokens(data: LoyaltyDropPoolConfig){
  return new Coin(data.reservedTokens.amount, data.reservedTokens.denom).add(data.usedTokens);
}

function calculatePercentagePoolUsage(data: LoyaltyDropPoolConfig): BigDecimal {
  return divideBigInts(data.reservedTokens.amount + data.usedTokens.amount, data.baseTokens.amount);
}

function msToDays(milliseconds:  number) {
  return milliseconds / (1000 * 60 * 60 * 24);
}

function maxAmountMessageData(): string {
  const maxAmount = getMax();
  return formatBigNumberLocalized(maxAmount.toFixed(useConfigurationStore().config.getViewDenomDecimals()));
}

function lessThanOrEqualTo(value: string | undefined): boolean {
  return checkValue(value, (value: string) => {
    const factor = useConfigurationStore().config.getViewDenomConversionFactor();
    const maxAmount = getMax();
    return (new BigDecimal(maxAmount)).multiply(factor).isBiggerThanOrEqualTo(new BigDecimal(value).multiply(factor));
  });
}

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
    padding: 0px 20px;
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

.boostDetails__header {
  width: 100%;
  display: inline-flex;
  flex-wrap: wrap;
  // grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  //gap: 24px;
  box-shadow: 0 0 4px 4px rgb(0 0 0 / 10%);
  font-family: 'Inter',sans-serif;
  align-items: center;
  font-weight: 700;
  line-height: 24px;
  padding: 20px 33px;
  border-radius: 5px;
  margin: 10px auto;
  justify-content: space-around;
  gap: 20px;

  h3 {
    padding: 10px 10px;
    font-size: 1.5rem;
  }
  h4 {
    padding: 10px;
    font-weight: 800;
    font-size: 1.5rem;
  }

  &__tile {
    flex: 1 1 20%;
    min-width: 150px;
    padding: 10px 5px;
    display:flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-family: 'Inter',sans-serif;
    color: #02447A;
    border: 2px solid #02447A;
    box-shadow: 0 0 2px 2px #02447A;
    border-radius: 2px;
    height: 150px;
  }
}

</style>
