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

const locales = reactive(getSupportedLocales());
const dropdown = ref(false);
const i18n = useI18n();

const setLocale = (locale: Locale) => {
  i18n.locale.value = locale;
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
//@import '../../styles/partials/_variables.scss';
.icon {
  margin-right: 5px;
}

.switch {
  //background: var($--primary-blue);
  //color: var($--brand-green) !important;
  padding: 5px 10px;
  margin: 0 10px;
  border-radius: 5px;
  position: relative;
  display: inline-block;
  cursor: pointer;

  &:hover {
    //background: var($--main-dark-blue);
  }

  .options-container {
    display: block;
    position: absolute;
    right: 0;
    background-color: #f1f1f1;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    span {
      //color: var($--main-dark-blue);
      //padding: 12px 16px;
      padding-bottom: 0.6em;
      padding-left: 12px;
      text-decoration: none;
      display: block;

      &:hover {
        //color: var($--brand-green);
        //background: var($--main-dark-blue);
        background-color: gray;
      }
    }
    .option {
      display: flex;
      align-items: center;

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
