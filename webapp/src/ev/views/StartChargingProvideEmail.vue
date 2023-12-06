<template>
  <Form @submit="next" :validation-schema="schema" v-slot="{errors}" >
    <div style="padding: 10px 30px 0;">
      <div >
        <div class="field col-12">
          <Field style="width:100%" v-model="userEmail" :placeholder="$t('START_CHARGING.EMAIL')" name="email" type="text" class="form-control"
             :class="{'is-invalid': errors.email}"></Field>
          <div class="invalid-feedback">{{ errors.email ? $t(errors.email) : '' }}</div>
        </div>
      </div>
    </div>
    <div class="flex justify-content-center">
      <Button class="p-button p-component secondary" style="width: 40%" type="submit">{{ $t('START_CHARGING.BUTTON') }}</Button>
    </div>
  </Form>
  <div style="color: red">
    {{errorStr}}
  </div>
</template>
<script setup lang="ts">
import * as Yup from "yup";
import {object} from "yup";
import {Field, Form} from "vee-validate";
import {useEvStore} from "@/ev/store/ev.store";
import {useRouter} from "vue-router";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/ev/models/evServiceCommons";
import {ref} from "vue";
import {useEvChargePointConnectorStore} from "@/ev/store/evChargePointConnector.store";
// const email = ref<string>();
const router = useRouter()
const evChargePointConnectorStore= useEvChargePointConnectorStore();

const errorStr = ref("");
const userEmail = ref("");

const schema = object().shape({
  email:  Yup.string().email()
    .required( "This field is required"),
});

function next(){
  if(userEmail.value) {
    evChargePointConnectorStore.prepareSession(userEmail.value,true, onSucces, onError );
    console.log("send request to backend -> start charging");
  }
}

function onSucces(){
  router.push('/ev/startChargingCheckEmail');
}

function onError(error: ErrorData<EvServiceApplicationError> | undefined){
  console.log("Error" + error?.message)
  if(error) {
    errorStr.value = JSON.stringify(error.data);
  }
}

</script>

<style scoped lang="scss">

</style>
