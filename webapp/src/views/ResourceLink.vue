<template>
  <p v-if="isIncorrectLink">Podany link jest błędny</p>
</template>

<script setup lang="ts">
import {onMounted, PropType, ref} from "vue";
import {AppTypeLink} from "@/store/ev.store";
import {useRouter} from "vue-router";
import {createLinkFromPathParams} from "@/services/utils";
import {useEvCommonStore} from "@/store/evCommon.store";
import {ErrorData} from "@/api/base.api";
import {EvServiceApplicationError} from "@/models/evServiceErrors";

const evCommonStore = useEvCommonStore();
const router = useRouter();
const isIncorrectLink = ref(false);

const props = defineProps({
  context: {
    type:  Object as PropType<Array<string>>  ,
    required: false
  },
});

onMounted(()=>{
  console.log("context:" + props.context);
  evCommonStore.decodeLink( createLinkFromPathParams(props.context as unknown as string[]), true, onSuccess, onError);
});

function onSuccess(){
  console.log("Application link type:" + evCommonStore.appTypeLink);
  if(evCommonStore.appTypeLink == AppTypeLink.CHARGE_POINT_CONNECTOR_LINK){
    router.push({name:'ev_ChargePointConnector',params:{context:props.context}});
  } else if(evCommonStore.appTypeLink == AppTypeLink.CHARGING_SESSION_LINK){
    router.push({name:'ev_SessionLink',params:{context:props.context}});
  } else {
    //GO TO ERROR lINK PAGE
  }
}

function onError(defaultErrorHandler: () => void, error: ErrorData<EvServiceApplicationError> | undefined){
  defaultErrorHandler();
  isIncorrectLink.value = true;
}
</script>

<style scoped lang="scss">
</style>
