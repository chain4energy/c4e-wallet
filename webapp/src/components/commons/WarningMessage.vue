<template>
  <div class="warning">
      <Icon name="AlertTriangle"/>
    <div class="warning-container">
      <h3>{{$t(header, headerVariables)}}</h3>
      <span v-if="textTypeData.type === TextType.STRING" class="warning-text">
        {{$t(texts, textsVariables)}}
      </span>
      <ul class="warning-text" style="margin-bottom: 0 !important" v-else-if="textTypeData.type === TextType.ARRAY">
        <li v-for="index in textTypeData.amount" :key="index">
          {{$t(`${texts}[${index - 1}]`, textsVariables)}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import i18n from "@/plugins/i18n";

const props = defineProps<{
  header: string,
  headerVariables: any,
  texts: string,
  textsVariables:  any,
}>();

const textTypeData = computed(() => getTextsLength(props.texts));

enum TextType {
  STRING,
  ARRAY
}

function getTextsLength(key: string): {type: TextType | undefined, amount: number } {
  const split = key.split('.');
  // console.log("locale:" + JSON.stringify(i18n.global.locale.value));
  let result: any = i18n.global.getLocaleMessage(i18n.global.locale.value);
  split.forEach((s) => {
    result = result[s];
    if (!result) {
      return {
        type: undefined,
        amount: 0
      };
    }
  });
  if (typeof result === 'string') {
    return {
      type: TextType.STRING,
      amount: 1
    };
  } else if ( result instanceof Array) {
    return {
      type: TextType.ARRAY,
      amount: result.length
    };
  }
  return {
    type: undefined,
    amount: 0
  };
}
</script>

<style scoped lang="scss">


.warning-container {
  display: flex;
  flex-direction: column;
  text-align: left;
}
.warning-text{
  color: black;
}
.warning{
  display: grid;
  grid-template-columns: 1fr 7fr;
  align-self: center;
  width: 80%;
  background-color: #fef6f6;
  color: #fc4b53;
  padding: 5px;
  border-radius: 8px;
  align-items: center;
  justify-items: center;
  margin: 10px 0;
  border: rgba(185, 185, 185, 0.91);
  border-style: solid;
  border-width: thin;

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
