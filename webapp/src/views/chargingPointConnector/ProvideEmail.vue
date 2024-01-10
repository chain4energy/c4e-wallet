<template>
  <Form @submit="next" :validation-schema="schema" v-slot="{errors}" >
    <div style="padding: 10px 30px 0;">
      <div >
        <div class="field col-12">
          <Field style="width:100%" v-model="email" :placeholder="$t('START_CHARGING.EMAIL')" name="email" type="text" class="form-control"
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
import {useRouter} from "vue-router";
import {ref} from "vue";
const email = ref<string>();
const router = useRouter();

const errorStr = ref("");

const emit = defineEmits(['onEmilProvided']);

const schema = object().shape({
  email:  Yup.string().email()
    .required( "This field is required"),
});

function next(){
 emit('onEmilProvided', email.value);
}

function onSucces(){
  router.push('/ev/startChargingCheckEmail');
}


</script>

<style scoped lang="scss">

</style>
