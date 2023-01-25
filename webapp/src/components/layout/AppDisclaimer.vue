<template>
<div class="appDisclaimer">
  <div class="appDisclaimer__background" @click="$emit('close')"></div>
  <div class="appDisclaimer__holder">
    <transition v-bind="loginType" name="slide-fade" mode="out-in">
      <div>
        <h2>Disclaimer</h2>
        <div class="appDisclaimer__text">
          <p v-html="$t('DISCLAIMER')"></p></div>
      </div>
    </transition>
      <Form class="appDisclaimer__form" @submit="submitDisclaimer" :validation-schema="agreamentSchema" v-slot="{ errors }" >
<!--        <div class="appDisclaimer__acception">-->
<!--          <Field type="checkbox" name="accept" :value="true"/>-->
<!--          <p>I have read and understood.</p>-->
<!--        </div>-->
<!--        <span>{{errors.accept}}</span>-->

        <div class="field-checkbox">
          <Field name="understood" type="checkbox" id="understood" :value="true" inputId="binary" v-model="understood" :binary="true" />
          <label class="appDisclaimer__label" for="understood">I have read and understood</label>
          <div style="color: red">{{ errors.understood ? errors.understood : "" }}</div>
        </div>
        <Button type="submit" label="Submit"></Button>
      </Form>
  </div>
</div>
</template>

<script setup lang="ts">
import {Form, Field} from "vee-validate";
import * as Yup from 'yup';
import {onUnmounted, ref} from "vue";
import {object} from "yup";

document.body.style.overflow = "hidden";
onUnmounted(() => {
  document.body.style.overflow = "auto";
});

const emit =defineEmits(['close']);


const agreamentSchema = object().shape({
  understood:  Yup.bool()
    .required( "The terms and conditions must be accepted.")
});

function submitDisclaimer(){
  localStorage.setItem('disclaimer', "true");
  emit('close')
}

const understood = ref(false);
</script>

<style scoped lang="scss">
.appDisclaimer{
  color: #001b31;
  position: fixed;
  top:0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 12;

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
    justify-content: space-evenly;
    align-items: center;
    width: 650px;
    min-height: 292px;
    padding: 30px 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
    background: #FFFFFF;
    border-radius: 8px;
    max-height: 100vh;
  }
  &__text{
    text-align: -webkit-left;
    text-align: left;
    padding: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.11);
    background: #FFFFFF;
    height: 60%;
  }
  &__acception{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-items: center;
    justify-content: space-around;
  }
  &__label{
    margin-left: 5px;
    font-size: 18px;
  }
  &__form{
    margin-top: 5px;
    p{
      margin: 0;
    }
  }
}

.slide-fade-enter-active {
  transition: all .2s ease;
}
.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
