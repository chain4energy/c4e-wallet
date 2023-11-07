<template>
  <div class="about">
    <h1>The world's first blockchain</h1>
    <h1>network based on green</h1>
    <h1>energy production</h1>
  </div>
  <div>
    <p> ResourceID: </p>
    <InputText v-model="resourceId" type="text"/>
  </div>
  <div>
    <Button
      @click="onClick"
      class="airDropTotal-btn">
      {{ $t('INFO_PAGE.BUTTON') }}
    </Button>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import { useRouter} from "vue-router";

const resourceId = ref('');
const router = useRouter()
function onClick(){
  console.log("onClick");
  router.push('/ev/resourceLink/' + resourceId.value + '?tot=pooopo');
}

</script>
<style lang="scss" scoped>


</style>
<style>

</style>
