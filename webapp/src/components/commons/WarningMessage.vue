<template>
  <div class="warning">
      <Icon name="AlertTriangle"/>
    <div class="warning-container">
      <h3>{{$t(header, headerVariables)}}</h3>
      <span v-if="textTypeData.type === TextType.STRING">
        {{$t(texts, textsVariables)}}
      </span>
      <ul style="margin-bottom: 0 !important" v-else-if="textTypeData.type === TextType.ARRAY">
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
  let result: any = i18n.global.getLocaleMessage(i18n.global.locale);
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
