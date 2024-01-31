<script setup lang="ts">
import {ref} from "vue";
import {changeTitle} from "@/utils/title-changer";
import {getSupportedLocales} from "@/utils/supported-locales";
import {useI18n} from "vue-i18n";
import CountryFlag from 'vue-country-flag-next'; // https://www.npmjs.com/package/vue-country-flag-next

const i18n=useI18n();

const selectedLocale = ref(i18n.locale);
const locales = ref(getSupportedLocales());

const setLocale = () => {
  if (selectedLocale.value.file) {
    i18n.locale.value = selectedLocale.value.file;
  }
  changeTitle();
};


</script>

<template>
  <Dropdown v-model="selectedLocale" :options="locales" optionLabel="name" placeholder="Select language" class="w-full border-b-2 my-4" @change="setLocale" :pt="{item: ({ props, state, context }) => ({
                          class: context.selected ? 'bg-lime-600/50 text-inherit' : context.focused ? 'bg-lime-600/30' : undefined})}">
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex justify-between">
              <span class="flex flex-inline">
<!--                <IconComponent name="Globe" class="text-lime-600 mr-2"/> -->
                {{$t('COMMON.LANGUAGE')}}
              </span>
        <span>{{locales.find(el => el.file === slotProps.value).name}}</span>
      </div>
      <span v-else>
            {{ slotProps.placeholder }}
            </span>
    </template>
    <template #option="slotProps">
      <div class="flex items-center text-right justify-end">
        <div>{{ slotProps.option.name }}</div>
        <div class="ml-2">
          <country-flag :country='slotProps.option.flagCode'/>
        </div>
      </div>
    </template>
  </Dropdown>

</template>

<style scoped lang="scss">

</style>
