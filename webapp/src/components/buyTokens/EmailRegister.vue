<template>
  <div class="box-shadow p-4">
    <div>
      <Form @submit="onCreateAccount" :validation-schema="schema" v-slot="{ errors }" class="loginEmail__body">
        <div class="p-fluid formgrid grid full_width" style="margin-left: auto; margin-right: auto">
          <div class="field col-12 md:col-6 mb-4">
            <Field v-model="email" placeholder=" " name="email" type="text" class="form-control"
                   :class="{'is-invalid': errors.email}"></Field>
            <span>Email</span>
            <div class="invalid-feedback">{{ errors.email ? $t(errors.email) : '' }}</div>
          </div>

          <div class="field col-12 md:col-6 mb-4">
            <Field v-model="password" placeholder=" " name="password" type="text" class="form-control" :class="{'is-invalid': errors.password}">
              <Password v-model="password" name="password" toggleMask :feedback="false"></Password>
            </Field>
            <span>Password</span>
            <div class="invalid">{{errors.password ? $t(errors.password) : ''}}</div>
          </div>

        </div>
        <div class="flex justify-content-center">
          <Button class="p-button p-component secondary">Cancel</Button>
          <Button class="p-button p-component secondary">Create account</Button>
        </div>
      </Form>
    </div>
    <div>

    </div>

  </div>
</template>

<script setup lang="ts">

import {Field, Form} from "vee-validate";
import {object, string} from "yup";
import * as Yup from "yup";
import {ref} from "vue";
import Password from "primevue/password";

const schema = object().shape({
  email:  Yup.string()
    .required( "This field is required"),
  password:  Yup.string()
    .required( "This field is required")
});

const email = ref<string>();
const password = ref<string>();
const onCreateAccount = () => {
  console.log('create account');
};
</script>

<style scoped lang="scss">


</style>
