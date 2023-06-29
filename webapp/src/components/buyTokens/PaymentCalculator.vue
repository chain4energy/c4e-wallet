<template>
  <div class="card flex justify-content-center">
    <div class="container pt-100">
      <div class="currency-form">
        <form @submit.prevent>
          <div class="form-group">
            <label>I buy</label>
            <div class="p-relative">
              <input
                class="form-control"
                type="number"
                name="input-one"
                id="input-one"
                disabled
                v-model="amountOne"
              />
              <select class="dropdown-toggle" name="first-currency" id="first-currency" v-model="currency_one">
                <option
                  :value="item"
                  v-for="item in [Currency.C4E]"
                  :key="item"
                >
                  {{item}}
                </option>
              </select>
            </div>
          </div>
          <div class="swap-btn d-flex align-items-center">
            <button type="button">
              <img src="https://cdn-icons-png.flaticon.com/512/226/226139.png" alt="swap">
            </button>
            <h4>1 {{currency_one}} = {{rate}} {{currency_two}}</h4>
          </div>
          <div class="form-group">
            <label>For</label>
            <div class="p-relative">
              <input
                class="form-control mb-5"
                id="amount-two"
                placeholder="0"
                disabled
                v-model="amountTwo"
              />
              <select class="dropdown-toggle" name="second-currency" id="second-currency" v-model="currency_two" @change="calculate">
                <option
                  :value="item"
                  v-for="item in currencyList"
                  :key="item"
                >
                  {{item}}
                </option>
              </select>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import {Currency} from "@/models/currency";
import {computed, onBeforeMount, ref, watch} from "vue";
import {TokenReservation, usePublicSalesStore} from "@/store/publicSales.store";

const props = defineProps<{
  reservation: TokenReservation,
  currencyList: Currency[],
  defaultCurrency: Currency,
  isFiat: boolean
}>();

onBeforeMount(() => {
  currency_two.value = props.defaultCurrency;
  calculate();

});
const emit = defineEmits(['update:currencyTwo', 'update:amountTwo']);

const currency_one = ref(Currency.C4E);
const currency_two = ref();

const rate = ref(1);

const amountOne = computed(() => {
  return props.reservation.amount.amount;
});

const amountTwo = computed(() => {
  return Number(amountOne.value) * rate.value;
});

watch(() => currency_two.value, () => {
  emit('update:currencyTwo', currency_two.value);
});

watch(() => amountTwo.value, () => {
  emit('update:amountTwo', amountTwo.value);
});

const calculate = () => {
  if(props.isFiat) {
    const requestedAmount = 100;
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", "Ari10-Widget-Id": "41875703-9ee2-4729-9d51-e574c61467c3" },
      body: JSON.stringify({"offeredCurrencyCode": currency_two.value, "offeredAmount": requestedAmount })
    };
    fetch("https://xqkzzpmim7.eu-west-1.awsapprunner.com/currencies/USDT/calculate", requestOptions)
      .then(response => response.json())
      .then(data => {
        const c4eTOUSDT = usePublicSalesStore().roundInfo?.c4eToUsd;
        if(c4eTOUSDT != undefined) {
          rate.value = c4eTOUSDT * requestedAmount / data.amount;
        }
      });
  } else {
    rate.value = 0.18;
  }

};
</script>


<style scoped lang="scss">
.currency-form {
  //box-shadow: 0px 10px 55px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  border-radius: 20px;
  max-width: 800px;
  margin: auto;
  padding: 65px;

  h1 {
    color: #000000;
  }

  form {
    .form-group {
      margin-bottom: 30px;

      label {
        display: block;
        margin-bottom: 10px;
        color: #000000;
        font: {
          weight: 500;
          size: 17px;
        };
      }

      .form-control {
        border: 0;
        height: 55px;
        box-shadow: unset;
        padding-left: 22px;
        border-radius: 5px;
        color: var(--blackColor);
        background-color: #ffffff !important;
        color: #000000 !important;
        border: 1px solid #eeeeee;
        font: {
          weight: 600;
          size: 17px;
        };

        &::placeholder {
          color: #000000 !important;
        }
      }

      .dropdown-toggle {
        background-color: #f5f5f5;
        color: #000000;
        padding-left: 10px;
        border-radius: 5px;
        position: relative;
        text-align: start;
        display: block;
        height: 55px;
        width: 100%;
        border: 0;
        font: {
          weight: 500;
          size: 17px;
        };

        img {
          top: 50%;
          left: 22px;
          width: 30px;
          position: absolute;
          transform: translateY(-50%);
        }

        strong {
          font-weight: 600;
          color: #000000;
        }

        &::after {
          display: none;
        }

        &::before {
          top: 50%;
          right: 22px;
          content: "\f114";
          position: absolute;
          transform: translateY(-50%);
          font: {
            size: 18px;
            weight: 600;
            family: flaticon;
          };
        }
      }

      .dropdown-menu {
        box-shadow: 0px 10px 55px rgba(0, 0, 0, 0.1);
        background-color: #ffffff;
        transform: translateY(0) !important;
        transition: var(--transition);
        top: 55px !important;
        visibility: hidden;
        display: block;
        height: 192px;
        width: 100%;
        padding: 0;
        opacity: 0;
        border: 0;
        overflow: {
          y: scroll;
          x: hidden;
        };

        li {
          border-bottom: 1px solid #eeeeee;

          .dropdown-item {
            background-color: transparent !important;
            transition: 0.5s;
            color: #000000;
            padding: 12px 0 12px 65px;
            position: relative;
            font: {
              weight: 500;
              size: 17px;
            };

            strong {
              font-weight: 600;
              color: #000000;
            }

            img {
              top: 50%;
              left: 22px;
              width: 30px;
              position: absolute;
              transform: translateY(-50%);
            }

            &:hover {
              background-color: #f8f8f8 !important;
            }
          }

          &:last-child {
            border-bottom: none;
          }
        }

        &.toggler {
          opacity: 1;
          visibility: visible;
        }
      }

      .p-relative {
        position: relative;

        .form-control {
          padding-left: 120px;
        }

        .dropdown-toggle {
          padding: 0 30px 0 10px;
          width: auto;
          position: absolute;
          top: 0;
          left: 0;
          border-right: 1px solid #eeeeee;
        }
      }
    }

    .swap-btn {
      text-align: center;
      margin-top: -15px;
      justify-content: center;

      button {
        transition: 0.5s;
        background-color: #f5f5f5;
        border-radius: 50%;
        position: relative;
        height: 50px;
        width: 50px;
        border: 0;
        margin-right: 5px;

        img {
          left: 0;
          right: 0;
          top: 50%;
          width: 25px;
          position: absolute;
          transform: translateY(-50%);
          margin: {
            left: auto;
            right: auto;
          };
        }

        &:hover {
          background-color: #f5f5ff;
        }
      }

      h4 {
        margin: 0;
        font-size: 18px;
        color: #000000;
        font-weight: 700;
      }
    }

    .default-btn {
      display: block;
      width: 100%;

      i {
        right: auto;
        margin-left: 5px;
        opacity: 1 !important;
        visibility: visible !important;
      }

      &:hover {
        padding: {
          left: 40px;
          right: 57px;
        };
      }
    }
  }
}
</style>
