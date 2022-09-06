<template>
  <div class="switch" @focusout="closeDropdown" tabindex="0" @click="toggleDropdown()">
<!--    <font-awesome-icon icon="globe" class="icon"/>-->
    <span v-for="locale in locales" :key="locale.file">
   <span v-if="locale.file == $i18n.locale" class="dropdown-btn">
    <country-flag :country='locale.flagCode'/>
   </span>
  </span>
    <span class="options-container" v-if="dropdown">
      <span class="option" @click="setLocale(locale.file)" v-for="locale in locales" :key="locale.file">
        <country-flag :country='locale.flagCode'/>
        <span class="text"> {{ locale.name }} </span>
      </span>
    </span>
  </div>
</template>

<script setup lang="ts">
import { getSupportedLocales } from '@/utils/supported-locales';
import { Locale, useI18n } from 'vue-i18n';
import CountryFlag from 'vue-country-flag-next'; // https://www.npmjs.com/package/vue-country-flag-next
import { reactive, ref } from 'vue';
import { changeTitle } from '@/utils/title-changer';

const locales = reactive(getSupportedLocales());
const dropdown = ref(false);
const i18n = useI18n();

const setLocale = (locale: Locale) => {
  i18n.locale.value = locale;
  changeTitle();
};

const toggleDropdown = () => {
  dropdown.value = !dropdown.value;
};

const closeDropdown = () => {
  dropdown.value = false;
};

</script>

<!--TODO: style!!!-->
<style scoped lang="scss">
@import '../../styles/variables.scss';

.flag {
  border: 1px solid black !important;
}
.icon {
  margin-right: 5px;
}

.switch {
  padding: 5px 10px;
  margin: 0 10px;
  border-radius: 5px;
  position: relative;
  display: inline-block;
  cursor: pointer;

  .options-container {
    display: block;
    position: absolute;
    right: 0;
    background-color: $header-text-color;
    min-width: 160px;
    border-radius: 10px 0 10px 10px;
    overflow: hidden;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 100;
    span {
      color: $main-color;
      padding: 12px 16px;
      text-decoration: none;
      display: block;

      &:hover {
        color: $secondary-color;
        //background: var($--main-dark-blue);
        background-color: $main-color;
      }
    }
    .option {
      display: flex;
      align-items: center;

      &:hover span {
        color: $secondary-color;
      }
      .text {
        padding-top: 18px;
      }
    }
  }

  .show {
    display: block;
  }
}

</style>
