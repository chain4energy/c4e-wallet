<template>
  <div class="info">
      <Icon name="Info"/>
    <div class="info-container">
      <h3>{{$t(header, headerVariables)}}</h3>
        <span v-for="itext in texts"   v-bind:key="itext" class="info-text">
          {{$t(itext)}}
        </span>
      </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import i18n from "@/plugins/i18n";

const props = defineProps<{
  header: string,
  headerVariables: any,
  texts: string[],
  textsVariables?:  any[],
}>();

</script>

<style scoped lang="scss">


.info-container {
  display: flex;
  flex-direction: column;
  text-align: left;
}
.info-text{
  color: black;
}
.info{
  display: grid;
  grid-template-columns: 1fr 7fr;
  align-self: center;
  width: 80%;
  background-color: #fef6f6;
  color: #5ccbef;
  padding: 5px;
  border-radius: 8px;
  align-items: center;
  justify-items: center;
  margin: 10px 0;
  border: thin solid rgba(185, 185, 185, 0.91);

  svg {
    height: 40px;
    width: 40px;
  }

  h3{
    font-size: 18px;
    font-weight: 600;
  }
}

</style>
