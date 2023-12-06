<template>
  <charge-point-c-new :charge-point="evChargePointConnectorStore.chargePoint as ChargePoint"/>
  <Button v-if="showButton_Next"
          @click="next()">
    Next
  </Button>
</template>

<script setup lang="ts">
import {computed, onMounted} from "vue";
import {useRouter} from "vue-router";
import ChargePointCNew from "@/ev/components/ChargePointC-New.vue";
import {ChargePoint, ChargePointStatusType} from "@/ev/models/chargePoint";
import {useEvChargePointConnectorStore} from "@/ev/store/evChargePointConnector.store";

const evChargePointConnectorStore = useEvChargePointConnectorStore();
const router = useRouter()

const props = defineProps({
  context: {
    type: String,
    required: false
  },
});

onMounted(() => {
  if (evChargePointConnectorStore.getChargePointConnectorUrl == "") {
    router.push({name: 'ev_ResourceLink', params: {context: props.context}})
  } else {
    evChargePointConnectorStore.fetchChargePointConnectorAll();
  }
});

const showButton_Next = computed(()=>{
  return evChargePointConnectorStore.chargePoint && (evChargePointConnectorStore.chargePoint.status==ChargePointStatusType.AVAILABLE || evChargePointConnectorStore.chargePoint.status==ChargePointStatusType.PREPARING)
});

function next() {
  console.log("next step -> start charging")
  router.push('/ev/startCharging');
}

</script>

<style scoped lang="scss">
</style>
