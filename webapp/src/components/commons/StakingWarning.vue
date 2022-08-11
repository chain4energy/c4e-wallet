<template>
  <div class="warning">
    <div>
      <h3><Icon name="AlertTriangle"/>{{$t(header, headerVariables)}}</h3>
      <span v-if="textTypeData.type === TextType.STRING">
        {{$t(texts, textsVariables)}}
      </span>
      <ul v-else-if="textTypeData.type === TextType.ARRAY">
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

const textTypeData = computed(() => getTextsLength(props.texts))

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
      }
    }
  })
  if (typeof result === 'string') {
    return {
      type: TextType.STRING,
      amount: 1
    }
  } else if ( result instanceof Array) {
    return {
      type: TextType.ARRAY,
      amount: result.length
    }
  }
  return {
    type: undefined,
    amount: 0
  }
}
</script>

<style scoped lang="scss">
.warning{
  display: flex;
  align-content: left;
  align-items: left;
  max-width: 407px;
  background-color: #fef6f6;
  color: #fc4b53;
  padding: 5px;
  border-radius: 8px;

  h3{
    font-size: 18px;
    font-weight: 600;
  }
}

</style>
