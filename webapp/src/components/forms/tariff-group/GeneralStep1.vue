<template>
<!--  <div class="stepsdemo-content">
    <Card>
&lt;!&ndash;      <template v-slot:title>
        ASD
      </template>&ndash;&gt;
      <template v-slot:subtitle>
        Informacje ogólne
      </template>
      <template v-slot:content>
        <div class="p-fluid formgrid grid ">
          <div class="field col-12 md:col-6 mb-4">
            <Dropdown v-model="selectedDso" :options="dsoList.elements" optionLabel="name"  placeholder="Operator systemu dystrybucji"></Dropdown>
          </div>
          <div class="field col-12 md:col-6 mb-4">
            <Dropdown v-model="selectedTariff" :options="tariffList"  placeholder="Taryfa"></Dropdown>
          </div>
          <div class="field col-12 md:col-6 mb-4">
            <InputText v-model="name" placeholder="Nazwa"/>
          </div>
          <div class="field col-12 md:col-6 mb-4">
            <Calendar id="dateformat" v-model="startDate"  dateFormat="yy-mm-dd" />
          </div>
          <div class="field col-12 md:col-6 mb-4">
            <Calendar id="dateformat" v-model="endDate"  dateFormat="yy-mm-dd" />
          </div>
        </div>

      </template>
      <template v-slot:footer>
        <div class="grid grid-nogutter justify-content-between">
          <Button label="Next" @click="nextPage()" icon="pi pi-angle-right" icon-pos="right"></Button>
        </div>
      </template>

    </Card>
  </div>-->
  <div class="card m-3">
    <h5 class="card-header">Informacje ogólne</h5>
    <div class="card-body">
      <Form @submit="nextPage" :validation-schema="schema" v-slot="{errors}">
        <div class="p-fluid formgrid grid ">
          <div class="field col-12 md:col-6 mb-4">
            <Field v-model="selectedDso" name="dso" as="select" class="form-control" :class="{'is-invalid': errors.dso}">
              <option v-for="dso in dsoList.elements" :key="dso" :value="dso">{{dso.name}}</option>
            </Field>
            <div class="invalid-feedback">{{errors.dso}}</div>
          </div>
          <div class="field col-12 md:col-6 mb-4">
            <Field v-model="selectedTariff" name="tariff" as="select" class="form-control" :class="{'is-invalid': errors.tariff}">
              <option v-for="tariff in tariffList" :key="tariff" :value="tariff">{{tariff}}</option>
            </Field>
            <div class="invalid-feedback">{{errors.tariff}}</div>
          </div>
          <div class="field col-12 md:col-6 mb-4">
            <Field v-model="name" name="name" type="text" class="form-control" :class="{'is-invalid': errors.name}"></Field>
            <div class="invalid-feedback">{{errors.name}}</div>
          </div>
          <div class="field col-12 md:col-6 mb-4">
            <Field v-model="startDate"  name="startDate" type="date" class="form-control" :class="{'is-invalid': errors.startDate}"></Field>
            <div class="invalid-feedback">{{errors.startDate}}</div>
          </div>
          <div class="field col-12 md:col-6 mb-4">
            <Field v-model="endDate"  name="endDate" type="date" class="form-control" :class="{'is-invalid': errors.endDate}"></Field>
            <div class="invalid-feedback">{{errors.endDate}}</div>
          </div>
        </div>
        <div class="grid grid-nogutter justify-content-between">
          <Button label="Next" @click="nextPage()" icon="pi pi-angle-right" icon-pos="right"></Button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, defineEmits, PropType, onMounted} from 'vue';
import Card from "primevue/card";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar"
import {TariffGroup} from "@/components/forms/tariff-group/TariffGroup";
import TariffGroupService from "@/services/tariff-group.service";
import { Form, Field } from 'vee-validate'
import * as Yup from 'yup';

const emit = defineEmits(['nextPage', 'prevPage', 'update:newTariffGroup']);

const props = defineProps({

  newTariffGroup: {
    type: Object as PropType<TariffGroup>,
    required: true
  }
})


const tariffGroupService = new TariffGroupService();

onMounted(async () => {
  dsoList.value = await tariffGroupService.getDistributionNetworkOperator();

})

const selectedDso=ref();
const dsoList = ref([]);
const selectedTariff = ref();
const tariffList = ref(['G11']);
const name = ref();
const startDate = ref(new Date());
const endDate = ref(new Date());

const schema = Yup.object().shape({
  dso: Yup.object().required('Dso is required'),
  tariff: Yup.string().required('Tariff is required'),
  name: Yup.string().required('Name is required'),
  startDate: Yup.string()
    .required('Start date is required')
    .matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'Start date must be a valid date in the format YYYY-MM-DD'),
  endDate: Yup.string()
    .required('End date is required')
    .matches(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, 'End date must be a valid date in the format YYYY-MM-DD')
  ,
});

const nextPage = () => {

  let updatedNewTariffGroup: TariffGroup = props.newTariffGroup;
  updatedNewTariffGroup.dso = selectedDso.value;
  updatedNewTariffGroup.endDate = endDate.value;
  updatedNewTariffGroup.startDate = startDate.value;
  updatedNewTariffGroup.name = name.value;
  updatedNewTariffGroup.tariff = selectedTariff.value;

  emit('nextPage', {pageIndex: 0});
  emit('update:newTariffGroup', updatedNewTariffGroup);
};
const prevPage = () => {
  emit('prevPage', {pageIndex: 0});
}


</script>

<style scoped>

</style>
