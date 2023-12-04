<template>
  <charge-point-connector-c-new :charge-point-connector-url="evStore.getChargePointConnectorUrl as string"/>
  <Button v-if="evStore.getChargePointInfo?.status === ChargePointConnectorStatusType.AVAILABLE || evStore.getChargePointInfo?.status === ChargePointConnectorStatusType.PREPARING "
          @click="next()">
    Next
  </Button>
</template>

<script setup lang="ts">
import ChargePointConnectorCNew from "@/ev/components/ChargePointConnectorC-New.vue";
import {useEvStore} from "@/ev/store/ev.store";
import {onMounted} from "vue";
import {useRouter} from "vue-router";
import {ChargePointConnectorStatusType} from "@/ev/models/chargePointConnector";

const evStore = useEvStore();
const router = useRouter()

const props = defineProps({
  context: {
    type: String,
    required: false
  },
});

onMounted(() => {
  if (evStore.getChargePointConnectorUrl == "") {
    router.push({name: 'ev_ResourceLink', params: {context: props.context}})
  }
})

function next() {
  console.log("next step -> start charging")
  router.push('/ev/startCharging');
}

</script>

<style scoped lang="scss">
</style>
