<template>
  <p>{{evCommonStore.appTypeLink}}</p>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {AppTypeLink, useEvStore} from "@/ev/store/ev.store";
import {useRouter} from "vue-router";
import {createLinkFromPathParams} from "@/ev/services/utils";
import {useEvCommonStore} from "@/ev/store/evCommon.store";

const evCommonStore = useEvCommonStore();
const router = useRouter()

const props = defineProps({
  context: {
    type: String ,
    required: false
  },
});

onMounted(()=>{
  console.log("context:" + props.context);
  evCommonStore.decodeLink( createLinkFromPathParams(props.context as unknown as string[]), true, onSuccess);
});

function onSuccess(){
  console.log("Application link type:" + evCommonStore.appTypeLink);
  if(evCommonStore.appTypeLink == AppTypeLink.CHARGE_POINT_CONNECTOR_LINK){
    router.push({name:'ev_ChargePointConnector',params:{context:props.context}})
  } else if(evCommonStore.appTypeLink == AppTypeLink.CHARGING_SESSION_LINK){
    router.push({name:'ev_SessionLink',params:{context:props.context}})
  } else {
    //GO TO ERROR lINK PAGE
  }
}


</script>

<style scoped lang="scss">

</style>
