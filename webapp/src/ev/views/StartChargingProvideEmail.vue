<template>
  <Form @submit="next" :validation-schema="schema" v-slot="{errors}" >
    <div style="padding: 10px 30px 0;">
      <div >
        <div class="field col-12">
          <Field style="width:100%" v-model="evStore.email" :placeholder="$t('START_CHARGING.EMAIL')" name="email" type="text" class="form-control"
             :class="{'is-invalid': errors.email}"></Field>
          <div class="invalid-feedback">{{ errors.email ? $t(errors.email) : '' }}</div>
        </div>
      </div>
    </div>
    <div class="flex justify-content-center">
      <Button class="p-button p-component secondary" style="width: 40%" type="submit">{{ $t('START_CHARGING.BUTTON') }}</Button>
    </div>
  </Form>
</template>
<script setup lang="ts">
import {ref} from "vue";
import {object} from "yup";
import * as Yup from "yup";
import {Field, Form} from "vee-validate";
import {useEvStore} from "@/store/ev.store";
import {useRouter} from "vue-router";
// const email = ref<string>();
const router = useRouter()
const evStore = useEvStore();

const schema = object().shape({
  email:  Yup.string().email()
    .required( "This field is required"),
});

function next(){
  if(evStore.email) {
    console.log("send request to backend -> start charging")
    //ii response ok, go to next page
    router.push('/ev/startChargingCheckEmail');
  }
}

</script>

<style scoped lang="scss">

</style>
