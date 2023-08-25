<template>
  <div class="breadcrumbs">
    <Icon @click="router.push('/')" name="Home" style="height: 1em" />
    <span v-for="(breadcrumbElement, index) of breadcrumbs" :key="breadcrumbElement.name">
      <span>/</span>
      <router-link :class="{disabled: index == breadcrumbs.length - 1}" :to="breadcrumbElement.path">{{getDisplayedName(breadcrumbElement)}}</router-link>
    </span>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import { useRouter } from "vue-router";
import {BreadcrumbData} from '../../models/breadcrumb-data';
import Icon from "../features/IconComponent.vue";
import {Breadcrumb} from "@/components/features/Breadcrumb";
import {useI18n} from "vue-i18n";
import { PermissionsService } from "@/services/permissions/permissions.service";

const router = useRouter();
const i18n = useI18n();
// const permissionsService = new PermissionsService();

const breadcrumbs = computed(() => {
  const breadcrumbsArray:Breadcrumb[] = [];
  console.log('BREADCRUMBS COMPONENT STARTED');
  router.currentRoute.value.matched.forEach(matchedRoute => {
    console.log("matchedRoute" + JSON.stringify(matchedRoute.path) );
    //in case of child with path ='' , we want to skip this part od breadcrumb
    const alreadyAdded = breadcrumbsArray.filter((breadcrumb) => {
       return breadcrumb.path === matchedRoute.path;
    });
    console.log("alreadyAdded" + alreadyAdded );
    console.log("indexOf: " + matchedRoute.path.indexOf('step')  );
    if(matchedRoute.name !== undefined && alreadyAdded.length ===0  && matchedRoute.path.length > 0 && matchedRoute.path.indexOf('step') < 0) {
      let _name = matchedRoute.name.toString();
      let _skipTranslation = false;
      // if(matchedRoute.meta.breadcrumbElement !== undefined){
      //   switch (matchedRoute.meta.breadcrumbElement as BreadcrumbElementType) {
      //     case BreadcrumbElementType.SELECTED_PROVIDE_NAME:
      //       _name = context.selectedProvider.name;
      //       break;
      //     case BreadcrumbElementType.SELECTED_CUSTOMER_NAME:
      //       _name = context.selectedCustomer.firstName + " " + context.selectedCustomer.lastName;
      //       break;
      //     case BreadcrumbElementType.SELECTED_EMPLOYEE_NAME:
      //       _name = context.selectedEmployee.firstName + " " + context.selectedEmployee.lastName;
      //       break;
      //   }
      //   _skipTranslation = true;
      // } else if(context.breadcrumbLastElement?.path === matchedRoute.path ){
      //   _name = context.breadcrumbLastElement.value;
      //   _skipTranslation = true;
      // }
      const breadcrumb: BreadcrumbData = {
        name: _name,
        path: matchedRoute.path,
        skipTranslation: _skipTranslation
      };
        breadcrumbsArray.push(breadcrumb);
    }
  });
  console.log(breadcrumbsArray);
  return breadcrumbsArray;
});

function getDisplayedName(element: BreadcrumbData) {
  if(element.skipTranslation){
    return element.name;
  }else{
    return i18n.t("SECTION_TITLES." + element.name.toUpperCase());
  }
}

</script>

<style scoped lang="scss">
.disabled {
  pointer-events: none;
  font-weight: bold !important;
}

.router-link-active {
  font-weight: 300;
}
.breadcrumbs {
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
  padding: 0.5em 0;
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  & > span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  :hover{
    cursor: pointer;
  }
  svg {
    transform: translateY(-2px)
  }

  span {
    margin-right: 0.5em;
    a {
      text-decoration: none;
      color: white;
    }
  }
}

@media screen and (max-width: 500px) {
  .breadcrumbs {
    font-size: 0.7em;
  }
}
</style>
